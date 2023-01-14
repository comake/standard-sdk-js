import type { OpenApi, OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type JSONPrimitive =
  | string
  | number
  | boolean
  | null;
export type JSONObject = Record<string, JSONValue>;
export interface JSONArray extends Array<JSONValue> {}

export type JSONValue =
  | JSONPrimitive
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  | {[x: string]: JSONValue }
  | JSONValue[];

export type ApiSpecType = 'openapi';

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
}

export interface OpenApiSpecOptions extends BaseApiSpecOptions {
  /**
  * API specification type.
  */
  readonly type: 'openapi';
  /**
  * Contents of the OpenAPI specification.
  * Either an OpenApi conformant JSON object, or a stringified representation of one.
  */
  readonly value: string | OpenApi;
}

export type ApiSpecOptions = OpenApiSpecOptions;

export type ApiSpecs = Record<string, ApiSpecOptions>;

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

export type OperationHandler<T extends ApiSpecType> = (
  args?: ApiArgTypes[T],
  configuration?: ApiConfigTypes[T],
  options?: ApiOptionTypes[T]
) => Promise<ApiReturnTypes[T]>;

export type ApiOperationNamespace<T extends ApiSpecType> = Record<string, OperationHandler<T>>;
