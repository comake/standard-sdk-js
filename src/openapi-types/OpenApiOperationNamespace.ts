import type {
  OpenApi,
  OpenApiClientConfiguration,
  Operation,
  PathItem,
} from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequiredKeys } from '../type-utils/RequiredKeys';
import type { OpenApiArgTypes } from './OpenApiArgTypes';
import type { OpenApiOperationType } from './OpenApiOperationType';

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
> = [TArgs] extends [never]
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
