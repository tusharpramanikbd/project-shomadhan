import { toast } from 'react-toastify';

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-right',
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    position: 'top-right',
  });
};

export const toastInfo = (message: string) => {
  toast.info(message, {
    position: 'top-right',
  });
};
