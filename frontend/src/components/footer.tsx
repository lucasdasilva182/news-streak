export function Footer() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold flex items-center">
                <a href="https://cv.lsilva.dev" target="_blank" className="underline font-bold">
                  <img src="/logo-lsilva.webp" alt="Logo LSilva Dev" className="w-14 rounded-lg" />
                </a>
              </div>
            </div>
          </div>
          <div className=" border-gray-200 dark:border-gray-700 mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">© 2025 LSilva Dev.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
