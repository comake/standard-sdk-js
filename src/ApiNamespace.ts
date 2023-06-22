import type { ApiSpecOptions } from './ApiSpecOptions';
import type { OpenApiNamespace } from './openapi-types/OpenApiNamespace';
import type { OpenApiOperationNamespace } from './openapi-types/OpenApiOperationNamespace';

export type ApiNamespace<
  T extends ApiSpecOptions
> = T['type'] extends 'openapi'
  ? OpenApiOperationNamespace<T['value']> & OpenApiNamespace
  : never;
