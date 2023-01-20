import type { ApiArgTypes, ApiConfigTypes, ApiOptionTypes, ApiReturnTypes, ApiSpecType } from './ApiTypes';

export type OperationHandler<
  T extends ApiSpecType,
  TSpec extends object = object,
  TOperation extends string = string,
> = (
  args?: ApiArgTypes<TSpec, TOperation>[T],
  configuration?: ApiConfigTypes[T],
  options?: ApiOptionTypes[T]
) => Promise<ApiReturnTypes[T]>;
