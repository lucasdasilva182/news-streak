export function PageLoadSpinner() {
  return (
    <div className="min-h-screen fixed w-screen h-screen flex flex-col bg-background border shadow-sm rounded-xl">
      <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
        <div className="flex justify-center">
          <div
            className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-primary rounded-full "
            role="status"
            aria-label="carregando"
          >
            <span className="sr-only">Carregando...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
