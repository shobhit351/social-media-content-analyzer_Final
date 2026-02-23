import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/bmp",
  "image/tiff",
]);

const PDF_TYPE = "application/pdf";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileType = file.type;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (fileType === PDF_TYPE) {
      return await extractFromPDF(buffer);
    }

    if (IMAGE_TYPES.has(fileType)) {
      return await extractFromImage(buffer);
    }

    return NextResponse.json(
      { error: `Unsupported file type: ${fileType}. Upload a PDF or image.` },
      { status: 400 },
    );
  } catch (error) {
    console.error("Extraction error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to extract text";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function extractFromPDF(buffer: Buffer): Promise<NextResponse> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    const text = result.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "No text found in the PDF. It may be image-based — try uploading as an image for OCR." },
        { status: 422 },
      );
    }

    return NextResponse.json({
      text,
      source: "pdf",
      pages: result.pages?.length ?? 1,
    });
  } finally {
    await parser.destroy();
  }
}

async function extractFromImage(buffer: Buffer): Promise<NextResponse> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");

  try {
    const {
      data: { text },
    } = await worker.recognize(buffer);

    const cleanedText = text?.trim();
    if (!cleanedText) {
      return NextResponse.json(
        { error: "No text could be recognized in the image." },
        { status: 422 },
      );
    }

    return NextResponse.json({ text: cleanedText, source: "ocr" });
  } finally {
    await worker.terminate();
  }
}
