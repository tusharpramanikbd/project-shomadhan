import { ApiError } from '@/types/apiError.types';
import { AxiosError } from 'axios';

export const formatAxiosError = (error: AxiosError): ApiError => {
  // Backend responded with a status code (4xx or 5xx)
  if (error.response) {
    const data = error.response.data as ApiError;
    return {
      status: error.response.status,
      code: data.code ?? null,
      message: data.message ?? 'Something went wrong',
      data,
    };
  }

  // Request was sent but no response received (network error)
  if (error.request) {
    return {
      status: null,
      code: null,
      message:
        'No response from server. Please check your internet connection.',
      data: null,
    };
  }

  // Something else happened setting up the request
  return {
    status: null,
    code: null,
    message: error.message || 'Unexpected error occurred',
    data: null,
  };
};
