import type { OpenApi, Operation, PathItem } from '@comake/openapi-operation-executor';
import type { OperationHandler } from '../OperationHandler';
import type { OpenApiOperationType } from './OpenApiOperationType';

type OperationsOfPathItem<T extends PathItem> = {
  [key in keyof T & OpenApiOperationType]: T[key] extends Operation
    ? T[key]['operationId']
    : string
}[keyof T & OpenApiOperationType];

export type OperationIdsOfOpenApi<T extends OpenApi> = {
  [key in keyof T['paths']]: Exclude<OperationsOfPathItem<T['paths'][key]>, undefined>
}[keyof T['paths']];

export type OpenApiOperationInterface<T extends OpenApi> = {
  [key in OperationIdsOfOpenApi<T>]: OperationHandler<'openapi', T, key>
};
