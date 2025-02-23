import clsx from 'clsx';

interface SpinnerProps {
  color: 'primary' | 'foreground';
  size: 'small' | 'default';
}

export function Spinner({ color, size }: SpinnerProps) {
  return (
    <div
      className={clsx(
        'animate-spin inline-block  border-t-transparent rounded-full',
        {
          'border-primary text-primary': color === 'primary',
          'border-foreground text-foreground': color === 'foreground',
        },
        {
          'size-4 border-[2px]': size === 'small',
          'size-6 border-[3px]': size === 'default',
        }
      )}
      role="status"
      aria-label="carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
