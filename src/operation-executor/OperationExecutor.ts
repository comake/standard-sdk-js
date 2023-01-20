import type { ApiArgTypes, ApiConfigTypes, ApiOptionTypes, ApiReturnTypes, ApiSpecType } from '../ApiTypes';

export interface OperationExecutor<T extends ApiSpecType> {
  executeOperation: (
    operation: string,
    args?: ApiArgTypes[T],
    configuration?: ApiConfigTypes[T],
    options?: ApiOptionTypes[T]
  ) => Promise<ApiReturnTypes[T]>;
}
