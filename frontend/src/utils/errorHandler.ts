import { AxiosError } from 'axios';
import { toast } from 'sonner';

export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

export function handleError(error: unknown) {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ success: boolean; message: string }>;

    if (axiosError.response) {
      const errorMessage = axiosError.response.data?.message || 'Erro desconhecido';
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  } else {
    console.error('Erro inesperado:', error);
    toast.error('Um erro inesperado ocorreu.');
  }
}
