import { BASE_API_URL } from '@constants/globals';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeoutErrorMessage: 'Request timeout!',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const onAxiosRequest = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  return config;
};

const onAxiosRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onAxiosResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onAxiosResponseError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onAxiosRequest, onAxiosRequestError);
  axiosInstance.interceptors.response.use(
    onAxiosResponse,
    onAxiosResponseError
  );
  return axiosInstance;
}

export const axiosClient = setupInterceptorsTo(axiosInstance);
