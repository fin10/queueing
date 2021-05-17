import axios from 'axios';

export function handleError(error: Error): never {
  const message = axios.isAxiosError(error) ? error.response?.data : error.message;
  throw { ...error, message };
}
