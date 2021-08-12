import { AxiosInstance, AxiosError } from 'axios';

interface FilterOptions {
    path: string;
    appId?: string;
}

interface PerimiterXInterceptorConfig {
    filter: (options: FilterOptions) => boolean;
    onintercept: (request: Request) => void;
    onignore: (request: Request) => void;
    onsuccess: (request: Request) => void;
    onfailure: (request: Request, error: AxiosError) => void;
    onerror: (error: AxiosError) => void;
    modalConfig: {
        timeout: number;
    }
}

export declare const attach: (
    axiosInstance: AxiosInstance,
    config: PerimiterXInterceptorConfig
) => void;

export declare const detach: (axiosInstance: AxiosInstance) => void;
