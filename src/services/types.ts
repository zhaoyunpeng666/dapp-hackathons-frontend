export interface IResponse<T> {
    code: number;
    message: string;
    data: T;
  }
export interface AuthorityResponse<T> {
    code: number;
    message: string;
    data: {
      result: T;
    };
  }
  
  export interface ResultError {
    message: string;
    code?: number;
  }
  
  export type DataResult<T> = {
    response?: T;
    error?: ResultError;
  };
  
  export type HttpHeaders = {
    [key: string]: string;
  };
  
  export type RequestConfig = {
    headers?: HttpHeaders;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any;
  };
  
  export interface BasePage {
    size: number;
    index: number;
    total: string;
  }
  
  export interface SocialPlatform {
    github: string;
    twitter: string;
    discord: string;
    website: string;
    telegram: string;
  }
  
  export type SocialPlatformKey = keyof SocialPlatform;
  