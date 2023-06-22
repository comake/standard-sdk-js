import type { OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig } from 'axios';
import type { ApiSpecType } from './ApiSpecOptions';

export interface BaseApiSpecOptions {
  /**
  * API specification type. This value is required.
  */
  readonly type: ApiSpecType;
  /**
  * The contents of the API specification. Usually a string or JSON object.
  * Note: we use a Record with unknown values to support the OpenApi
  * type as defined in \@comake/openapi-operation-executor
  */
  readonly value: string | Record<string, unknown>;
  /**
  * Default OpenApi configuration supplied to every operation of this API.
  */
  readonly defaultConfiguration?: OpenApiClientConfiguration;
  /**
  * Default Axios Request Options supplied to every operation of this API.
  */
  readonly defaultOptions?: AxiosRequestConfig;
}
