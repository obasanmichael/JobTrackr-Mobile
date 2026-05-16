import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Omit Bearer token — use for `/auth/login` and `/auth/register`. */
    skipAuth?: boolean;
  }
}
