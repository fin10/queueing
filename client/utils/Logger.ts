import { AxiosError } from 'axios';

export class Logger {
  static info(message: string): void {
    console.info(message);
  }

  static debug(message: string): void {
    console.debug(message);
  }

  static warn(message: string): void {
    console.warn(message);
  }

  static error(error: AxiosError): void {
    if (error.isAxiosError) {
      console.error(error.response?.data);
    } else {
      console.error(error);
    }
  }
}
