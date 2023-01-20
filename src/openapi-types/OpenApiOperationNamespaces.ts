import type { OpenApi } from '@comake/openapi-operation-executor';
import type { OperationHandler } from '../OperationHandler';
import type { OpenApiOperationInterface } from './OpenApiOperationInterface';

export type OpenApiOperationNamespaces<T> = T extends OpenApi
  ? OpenApiOperationInterface<T>
  : Record<string, OperationHandler<'openapi'>>;
