import type {
  OpenApiClientConfiguration,
} from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { OpenApiArgTypes } from './openapi-types/OpenApiArgTypes';
import type { OpenApiOperationNamespaces } from './openapi-types/OpenApiOperationNamespaces';
import type { OpenApiSpecOptions } from './openapi-types/OpenApiSpecOptions';

export type ApiSpecOptions = OpenApiSpecOptions;
export type ApiSpecs = Record<string, ApiSpecOptions>;

export type ApiSpecType = 'openapi';

export interface ApiReturnTypes {
  openapi: AxiosResponse;
}

export interface ApiArgTypes<
  TSpec extends object = object,
  TOperation extends string = string,
> {
  openapi: OpenApiArgTypes<TSpec, TOperation>;
}

export interface ApiConfigTypes {
  openapi: OpenApiClientConfiguration;
}

export interface ApiOptionTypes {
  openapi: AxiosRequestConfig;
}

interface ApiOperationNamespaces<TSpec> {
  openapi: OpenApiOperationNamespaces<TSpec>;
}
export type ApiOperationNamespace<T extends ApiSpecType, TSpec> = ApiOperationNamespaces<TSpec>[T];
