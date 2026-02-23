"use client";

import { useState, useCallback, useRef } from "react";
import {
  FileText,
  ImageIcon,
  Loader2,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  X,
} from "lucide-react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/bmp",
  "image/tiff",
];

export default function ContentAnalyzer() {
  const [text, setText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractionSource, setExtractionSource] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file type. Please upload a PDF or image file.");
      return;
    }

    setError(null);
    setExtracting(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract text");
      }

      setText(data.text);
      setExtractionSource(data.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed");
      setFileName(null);
    } finally {
      setExtracting(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleReset = useCallback(() => {
    setText("");
    setError(null);
    setFileName(null);
    setExtractionSource(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const hasText = text.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* File Upload Zone */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            Upload Document
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload a PDF or image file to extract text content
          </p>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
                : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"
            } ${extracting ? "pointer-events-none opacity-60" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp,.tiff"
              onChange={handleFileInput}
              className="hidden"
            />

            {extracting ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-sm font-medium text-indigo-600">
                  Extracting text from {fileName}...
                </p>
                <p className="text-xs text-gray-400">
                  This may take a moment for images (OCR processing)
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-violet-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-indigo-600">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, PNG, JPG, WEBP, BMP, TIFF
                  </p>
                </div>
                {fileName && extractionSource && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-700">
                      Extracted from {fileName} ({extractionSource.toUpperCase()}
                      )
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reset Bar */}
        {(hasText || fileName) && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Extracted Text Display */}
      {hasText && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Extracted Text</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed max-h-96 overflow-y-auto">
              {text}
            </pre>
            <p className="mt-4 text-xs text-gray-400">
              {text.length} characters &middot; {text.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
