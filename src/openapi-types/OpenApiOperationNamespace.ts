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
import type { OpenApiArgTypes } from './OpenApiArgTypes';
import type { OpenApiClientConfigurationTypes } from './OpenApiConfigurationTypes';
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
  TDefaultConfig extends OpenApiClientConfiguration | undefined,
  TSecurityTypes extends Record<string, OpenApiClientConfiguration> = OpenApiSecuritySchemesToTypes<TSpec>,
  TArgs = OpenApiArgTypes<TSpec, T>,
  TConfig = OpenApiClientConfigurationTypes<TSpec, T, TSecurityTypes, TDefaultConfig>
> = TArgs extends undefined
  ? [TConfig] extends undefined
    // eslint-disable-next-line max-len
    ? (args?: Record<string, any>, configuration?: OpenApiClientConfiguration, options?: AxiosRequestConfig) => Promise<AxiosResponse>
    : [TConfig] extends [undefined]
      // eslint-disable-next-line max-len
      ? (args: Record<string, any>, configuration?: OpenApiClientConfiguration, options?: AxiosRequestConfig) => Promise<AxiosResponse>
      : (args: Record<string, any>, configuration: TConfig, options?: AxiosRequestConfig) => Promise<AxiosResponse>
  : [TConfig] extends undefined
    ? (args: TArgs, configuration?: OpenApiClientConfiguration, options?: AxiosRequestConfig) => Promise<AxiosResponse>
    : [TConfig] extends [undefined]
      // eslint-disable-next-line max-len
      ? (args: TArgs, configuration?: OpenApiClientConfiguration, options?: AxiosRequestConfig) => Promise<AxiosResponse>
      : (args: TArgs, configuration: TConfig, options?: AxiosRequestConfig) => Promise<AxiosResponse>;

type OpenApiOperationInterface<
  T extends OpenApi,
  TDefaultConfig extends OpenApiClientConfiguration | undefined,
  TSecurityTypes extends Record<string, OpenApiClientConfiguration> = OpenApiSecuritySchemesToTypes<T>,
> = {
  [operation in OperationIdsOfOpenApi<T>]: OpenApiOperationInterfaceForOperation<
    operation,
    T,
    TDefaultConfig,
    TSecurityTypes
  >
};

export type OpenApiOperationNamespace<
  T extends string | OpenApi,
  TDefaultConfig extends OpenApiClientConfiguration | undefined,
> = T extends OpenApi
  ? OpenApiOperationInterface<T, TDefaultConfig>
  : Record<string, (
    args?: any,
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>>;
