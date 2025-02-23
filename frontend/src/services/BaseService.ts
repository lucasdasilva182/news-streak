import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios';

export default class BaseService {
  public url: string;
  public requester: AxiosInstance;

  constructor() {
    this.url = import.meta.env.VITE_API_URL;
    this.requester = axios.create();

    this.initializeInterceptors();
  }

  private initializeInterceptors(): void {
    this.requester.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers = config.headers || new AxiosHeaders();
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.requester.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  public setHeader(key: string, value: string): void {
    this.requester.defaults.headers.common[key] = value;
  }

  public removeHeader(key: string): void {
    delete this.requester.defaults.headers.common[key];
  }

  public getHeader(key: string): string | undefined {
    return this.requester.defaults.headers.common[key] as string | undefined;
  }
}
