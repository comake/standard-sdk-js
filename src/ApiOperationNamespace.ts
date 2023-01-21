import type { ApiSpecType } from './ApiSpecOptions';
import type { OpenApiOperationNamespace } from './openapi-types/OpenApiOperationNamespace';

export type ApiOperationNamespace<T extends ApiSpecType, TSpec> = {
  openapi: OpenApiOperationNamespace<TSpec>;
}[T];
