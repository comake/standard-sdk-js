import type { OpenApi, OpenApiClientConfiguration, Operation, PathItem } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { OpenApiArgTypes } from './OpenApiArgTypes';
import type { OpenApiOperationType } from './OpenApiOperationType';

export type OpenApiOperationConfig = OpenApiClientConfiguration;
export type OpenApiOperationOptions = AxiosRequestConfig;
export type OpenApiOperationReturnType = AxiosResponse;

type OperationsOfPathItem<T extends PathItem> = {
  [operationType in keyof T & OpenApiOperationType]: T[operationType] extends Operation
    ? T[operationType]['operationId']
    : string
}[keyof T & OpenApiOperationType];

type OperationIdsOfOpenApi<T extends OpenApi> = {
  [path in keyof T['paths']]: Exclude<OperationsOfPathItem<T['paths'][path]>, undefined>
}[keyof T['paths']];

type OpenApiOperationInterface<T extends OpenApi> = {
  [operation in OperationIdsOfOpenApi<T>]: (
    args?: OpenApiArgTypes<T, operation>,
    configuration?: OpenApiOperationConfig,
    options?: OpenApiOperationOptions
  ) => Promise<OpenApiOperationReturnType>
};

export type OpenApiOperationNamespace<T> = T extends OpenApi
  ? OpenApiOperationInterface<T>
  : Record<string, (
    args?: any,
    configuration?: OpenApiOperationConfig,
    options?: OpenApiOperationOptions
  ) => Promise<OpenApiOperationReturnType>>;
