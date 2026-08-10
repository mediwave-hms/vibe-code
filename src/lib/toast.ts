import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner';

export { SonnerToaster };

export const toastSuccess = (message: string, description?: string) => {
  sonnerToast.success(message, { description });
};

export const toastError = (message: string, description?: string) => {
  sonnerToast.error(message, { description });
};

export const toastWarning = (message: string, description?: string) => {
  sonnerToast.warning(message, { description });
};

export const toastInfo = (message: string, description?: string) => {
  sonnerToast.info(message, { description });
};
