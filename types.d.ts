import { AxiosInstance, AxiosError } from 'axios';

interface FilterOptions {
    path?: string;
    appId?: string;
    [key: string]: any;
}

export interface PerimeterXInterceptorConfig {
    filter?: (options: FilterOptions) => boolean;
    onintercept?: (request: Request) => void;
    onignore?: (request: Request) => void;
    onsuccess?: (request: Request) => void;
    onfailure?: (request: Request, error: AxiosError) => void;
    onerror?: (error: AxiosError) => void;
    simulate?: boolean;
    modalConfig?: {
        className?: string;
        title?: string;
        subtitle?: string;
        quickfixes?: string[];
        suffix?: string;
        timeout?: number;
        allowClose?: boolean;
    }
}

export declare const attach: (
    axiosInstance: AxiosInstance,
    config: PerimeterXInterceptorConfig
) => void;

export declare const detach: (axiosInstance: AxiosInstance) => void;
