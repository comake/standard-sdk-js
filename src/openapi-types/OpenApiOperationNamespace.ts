import type { OpenApi, OpenApiClientConfiguration, Operation, PathItem } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
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

type OpenApiOperationInterface<T extends OpenApi> = {
  [operation in OperationIdsOfOpenApi<T>]: (
    args?: OpenApiArgTypes<T, operation>,
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>
};

export type OpenApiOperationNamespace<T> = T extends OpenApi
  ? OpenApiOperationInterface<T>
  : Record<string, (
    args?: any,
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>>;
