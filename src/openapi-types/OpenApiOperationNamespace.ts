import type {
  OpenApi,
  OpenApiClientConfiguration,
  Operation,
  PathItem,
  Components,
  SecurityScheme,
  APIKeySecurityScheme,
  HTTPSecurityScheme,
  OAuth2SecurityScheme,
} from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequiredKeys } from '../type-utils/RequiredKeys';
import type { OpenApiArgTypes } from './OpenApiArgTypes';
import type { OpenApiOperationType } from './OpenApiOperationType';

type OpenApiSecuritySchemeToType<T extends SecurityScheme> =
  T extends APIKeySecurityScheme
    ? {[K in T['name']]?: OpenApiClientConfiguration['apiKey'] } |
    { apiKey?: OpenApiClientConfiguration['apiKey'] }
    : T extends OAuth2SecurityScheme
      ? { accessToken: OpenApiClientConfiguration['accessToken'] }
      : T extends HTTPSecurityScheme
        ? T['scheme'] extends 'basic'
          ? {
            username: OpenApiClientConfiguration['username'];
            password: OpenApiClientConfiguration['password'];
          }
          : T['scheme'] extends 'bearer'
            ? { bearerToken: OpenApiClientConfiguration['bearerToken'] }
            : never
        : never;

export type OpenApiSecuritySchemesToTypes<
  TSpec extends OpenApi
> = TSpec['components'] extends Components
  ? TSpec['components']['securitySchemes'] extends Record<string, SecurityScheme>
    ? {
      [K in keyof TSpec['components']['securitySchemes']]:
      OpenApiSecuritySchemeToType<TSpec['components']['securitySchemes'][K]>;
    }
    : Record<string, never>
  : Record<string, never>;

type OperationsOfPathItem<T extends PathItem> = {
  [operationType in keyof T & OpenApiOperationType]: T[operationType] extends Operation
    ? T[operationType]['operationId']
    : string
}[keyof T & OpenApiOperationType];

type OperationIdsOfOpenApi<T extends OpenApi> = {
  [path in keyof T['paths']]: Exclude<OperationsOfPathItem<T['paths'][path]>, undefined>
}[keyof T['paths']];

type OpenApiOperationInterfaceForOperation<
  T extends string,
  TSpec extends OpenApi,
  TArgs extends object = OpenApiArgTypes<TSpec, T>,
> = TArgs extends never
  ? (
    args?: Record<string, any>,
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>
  : RequiredKeys<TArgs> extends never
    ? (
      args?: TArgs,
      configuration?: OpenApiClientConfiguration,
      options?: AxiosRequestConfig
    ) => Promise<AxiosResponse>
    : (
      args: TArgs,
      configuration?: OpenApiClientConfiguration,
      options?: AxiosRequestConfig
    ) => Promise<AxiosResponse>;

type OpenApiOperationInterface<T extends OpenApi> = {
  [operation in OperationIdsOfOpenApi<T>]: OpenApiOperationInterfaceForOperation<operation, T>
};

export type OpenApiOperationNamespace<T extends string | OpenApi> = T extends OpenApi
  ? OpenApiOperationInterface<T>
  : Record<string, (
    args?: Record<string, any>,
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>>;
