export function Footer() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold flex items-center">
                <img src="/logo_waffle.png" alt="Logo Waffle" className="w-20 rounded-lg" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                do not follow,
                <br />
                consume it.
              </p>
            </div>
          </div>
          <div className=" border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Grupo waffle. Versão desenvolvida por{' '}
              <a href="https://cv.lsilva.dev" target="_blank" className="underline font-bold">
                Lucas Silva
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
