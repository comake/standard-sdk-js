import type {
  OpenApi,
  Operation,
  Parameter,
  PathItem,
  Reference,
  JSONSchema,
  RequestBody,
} from '@comake/openapi-operation-executor';
import type { FromSchema, JSONSchema7 } from 'json-schema-to-ts';
import type { DeepGet } from '../type-utils/DeepGet';
import type { Merged } from '../type-utils/Merged';
import type { Split } from '../type-utils/Split';
import type { Tail } from '../type-utils/Tail';
import type { UnionToIntersection } from '../type-utils/UnionToIntersection';
import type { OpenApiOperationType } from './OpenApiOperationType';

type JsonSchemaToType<T extends JSONSchema7, TC extends OpenApi> = FromSchema<T & TC>;

type SchemaToType<T extends JSONSchema | undefined, TC extends OpenApi> = T extends JSONSchema7
  ? JsonSchemaToType<T, TC>
  : never;

type ParseReference<
  TRef extends string,
  TSc extends JSONSchema7,
  TR extends string[] = Split<TRef, '#'>,
> = DeepGet<TSc, Tail<Split<TR[1], '/'>>, false>;

type OpenApiParameterToType<T extends Parameter, TC extends OpenApi> = T['required'] extends true
  ? {[K2 in T['name']]: SchemaToType<T['schema'], TC> }
  : {[K2 in T['name']]?: SchemaToType<T['schema'], TC> };

type OpenApiParameterOrRefToType<T, TC extends OpenApi> = T extends Parameter
  ? OpenApiParameterToType<T, TC>
  : T extends Reference
    ? OpenApiParameterOrRefToType<ParseReference<T['$ref'], TC>, TC>
    : never;

type OpenApiParametersToTypes<T extends readonly (Parameter | Reference)[], TC extends OpenApi> = Merged<
  UnionToIntersection<
    {[K in keyof T]: OpenApiParameterOrRefToType<T[K], TC> }[number]
  >
>;

type OpenApiRequestBodyToType<
  T extends RequestBody,
  TC extends OpenApi,
> = T['content'] extends { 'application/json': any }
  ? SchemaToType<T['content']['application/json']['schema'], TC>
  : Record<string, never>;

type OpenApiRequestBodyOrRefToTypes<T, TC extends OpenApi> =
  T extends RequestBody
    ? OpenApiRequestBodyToType<T, TC>
    : T extends Reference
      ? OpenApiRequestBodyOrRefToTypes<ParseReference<T['$ref'], TC>, TC>
      : never;

type ArgsFromOperationOrPathItemParameters<
  T extends Operation | PathItem,
  TSpec extends OpenApi,
> = T['parameters'] extends readonly (Parameter | Reference)[]
  ? OpenApiParametersToTypes<T['parameters'], TSpec>
  : Record<string, never>;

type ArgsFromOperationRequestBody<
  T extends Operation,
  TSpec extends OpenApi,
> = T['operationId'] extends string
  ? T['requestBody'] extends RequestBody | Reference
    ? OpenApiRequestBodyOrRefToTypes<T['requestBody'], TSpec>
    : Record<string, never>
  : Record<string, any>;

type ArgsOfOperation<
  T extends Operation,
  TSpec extends OpenApi,
  TRequestBodyArgs = ArgsFromOperationRequestBody<T, TSpec>,
  TParameterArgs = ArgsFromOperationOrPathItemParameters<T, TSpec>,
> = TRequestBodyArgs extends Record<string, never>
  ? TParameterArgs
  : TParameterArgs extends Record<string, never>
    ? TRequestBodyArgs
    : Merged<TParameterArgs & TRequestBodyArgs>;

type ArgsOfOperationInPathItem<
  T extends PathItem,
  TOperation extends Operation,
  TSpec extends OpenApi,
  TPathItemArgs = ArgsFromOperationOrPathItemParameters<T, TSpec>,
  TOperationArgs = ArgsOfOperation<TOperation, TSpec>
> = TPathItemArgs extends Record<string, never>
  ? TOperationArgs extends Record<string, never>
    ? never
    : TOperationArgs
  : TOperationArgs extends Record<string, never>
    ? TPathItemArgs
    : Merged<TPathItemArgs & TOperationArgs>;

type ArgsOfOperationInPathItemIfDefined<
  T extends PathItem,
  TOperation extends string,
  TSpec extends OpenApi,
  TOperationObject = Extract<T[keyof T & OpenApiOperationType], { operationId: TOperation }>,
> = [TOperationObject] extends [never]
  ? never
  : TOperationObject extends Operation
    ? ArgsOfOperationInPathItem<T, TOperationObject, TSpec>
    : never;

type ArgsOfOpenApiOperation<
  T extends OpenApi,
  TOperation extends string,
> = {
  [key in keyof T['paths']]: ArgsOfOperationInPathItemIfDefined<T['paths'][key], TOperation, T>
}[keyof T['paths']];

export type OpenApiArgTypes<
  TSpec extends OpenApi,
  TOperation extends string = string,
  TParams = ArgsOfOpenApiOperation<TSpec, TOperation>
> = [TParams] extends [never] ? undefined : TParams;
