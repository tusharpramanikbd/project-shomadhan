import { AxiosError } from 'axios';

export const formatAxiosError = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    throw { data: error.response.data, status: error.response.status };
  } else if (error?.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return error?.request;
  } else {
    // Something happened in setting up the request that triggered an Error
    return error?.message;
  }
};
