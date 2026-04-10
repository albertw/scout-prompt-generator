export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-4xl text-blue-600">⚜️</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Scout Program Planner</h1>
              <p className="text-sm text-gray-500">AI-powered programme planning</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://scouts.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
