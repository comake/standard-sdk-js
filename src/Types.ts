import type { OpenApi, OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiSpecType = 'openapi';

export type ApiSpecValue<T extends ApiSpecType> = T extends 'openapi'
  ? string | OpenApi
  : never;

export interface ApiSpec<T extends ApiSpecType> {
  type: T;
  value: ApiSpecValue<T>;
}

export type ApiSpecs = Record<string, ApiSpec<ApiSpecType>>;

export interface ApiReturnTypes {
  openapi: AxiosResponse;
}

export interface ApiArgTypes {
  openapi: any;
}

export interface ApiConfigTypes {
  openapi: OpenApiClientConfiguration;
}

export interface ApiOptionTypes {
  openapi: AxiosRequestConfig;
}

export type OperationHandler<TReturn, TArgs, TConfig, TOptions> = (
  args?: TArgs,
  configuration?: TConfig,
  options?: TOptions
) => Promise<TReturn>;

export type ApiOperationInterface<TReturn, TArgs, TConfig, TOptions> =
  Record<string, OperationHandler<TReturn, TArgs, TConfig, TOptions>>;
