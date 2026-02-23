# Social Media Content Analyzer

**Shobhit Gautam** | ID: 2022A7PS0136P

**Live Demo**: [https://social-media-content-analyzerfinal-production.up.railway.app](https://social-media-content-analyzerfinal-production.up.railway.app)

A web application that extracts text from uploaded documents — PDFs and images (scanned documents via OCR). Upload files through drag-and-drop or a file picker, and view the extracted text instantly.

## Features

- **Document Upload**: Drag-and-drop or file picker for PDFs and images (PNG, JPG, WEBP, BMP, TIFF)
- **PDF Text Extraction**: Extracts text from PDF documents using pdf-parse v2
- **OCR Processing**: Extracts text from scanned documents and images using Tesseract.js
- **Responsive UI**: Clean, modern design with loading states and error handling

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **PDF Parsing**: pdf-parse v2
- **OCR**: Tesseract.js v7
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── extract/route.ts   # Text extraction API (PDF + OCR)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    └── ContentAnalyzer.tsx    # Upload + extracted text display
```

## Approach

I built a Next.js application that handles document text extraction through two methods: PDF parsing and OCR. The app accepts PDFs and image files (PNG, JPG, WEBP, BMP, TIFF) via a drag-and-drop zone or file picker.

For PDFs, text is extracted server-side using pdf-parse v2, which provides a clean class-based API with proper resource cleanup. For image files (scanned documents), Tesseract.js performs optical character recognition to pull text from the image. The extraction logic lives in a single API route that detects the file type and delegates to the appropriate handler.

The frontend is a single interactive component that manages the upload flow with clear loading states — a spinner during extraction with a note about OCR processing time for images. Extracted text is displayed in a readable format with a copy-to-clipboard button and word/character count. Error handling covers unsupported file types, empty PDFs, and failed OCR gracefully. The UI is built with Tailwind CSS for a responsive, modern look.

## License

MIT
