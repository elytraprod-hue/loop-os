// src/hooks/useToast.ts
import { toast } from 'sonner';

export const useToast = () => {
  const success = (message: string, options?: any) => {
    toast.success(message, options);
  };

  const error = (message: string, options?: any) => {
    toast.error(message, options);
  };

  const warning = (message: string, options?: any) => {
    toast.warning(message, options);
  };

  const info = (message: string, options?: any) => {
    toast.info(message, options);
  };

  const loading = (message: string, options?: any) => {
    return toast.loading(message, options);
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
    dismissAll,
  };
};
