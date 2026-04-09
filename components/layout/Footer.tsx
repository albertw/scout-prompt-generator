export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Scout Program Planner - Helping leaders create amazing programmes
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Built with Next.js 16</span>
            <span>•</span>
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
