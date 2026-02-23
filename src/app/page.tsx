import ContentAnalyzer from "@/components/ContentAnalyzer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Social Media Content Analyzer
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg max-w-2xl mx-auto">
            Upload a PDF or image to extract text content using PDF parsing and
            OCR technology.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="-mt-6">
        <ContentAnalyzer />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400">
        <p>
          Social Media Content Analyzer &mdash; Built with Next.js, Tailwind
          CSS, pdf-parse &amp; Tesseract.js
        </p>
      </footer>
    </div>
  );
}
