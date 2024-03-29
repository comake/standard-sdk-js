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
  * Default configuration supplied to every operation of this API.
  */
  readonly defaultConfiguration?: Record<string, any>;
  /**
  * Default Axios Request Options supplied to every operation of this API.
  */
  readonly defaultOptions?: AxiosRequestConfig;
}
