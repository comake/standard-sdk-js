import type { ApiSpecOptions } from './ApiSpecOptions';
import type { OpenApiOperationNamespace } from './openapi-types/OpenApiOperationNamespace';

export type ApiOperationNamespace<
  T extends ApiSpecOptions
> = T['type'] extends 'openapi'
  ? OpenApiOperationNamespace<T['value'], T['defaultConfiguration']>
  : never;
