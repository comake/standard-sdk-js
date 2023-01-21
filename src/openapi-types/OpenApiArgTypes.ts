import type {
  OpenApi,
  Operation,
  Parameter,
  PathItem,
  Reference,
  JSONSchema,
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

type OpenApiRefToType<T extends Reference, TC extends OpenApi> = OpenApiParameterOrRefToType<
  ParseReference<T['$ref'], TC>,
  TC
>;

type OpenApiParameterToType<T extends Parameter, TC extends OpenApi> = T['required'] extends true
  ? {[K2 in T['name']]: SchemaToType<T['schema'], TC> }
  : {[K2 in T['name']]?: SchemaToType<T['schema'], TC> };

type OpenApiParameterOrRefToType<T, TC extends OpenApi> = T extends Parameter
  ? OpenApiParameterToType<T, TC>
  : T extends Reference
    ? OpenApiRefToType<T, TC>
    : never;

type OpenApiParametersToTypes<T extends readonly (Parameter | Reference)[], TC extends OpenApi> = Merged<
  UnionToIntersection<
    {[K in keyof T]: OpenApiParameterOrRefToType<T[K], TC> }[number]
  >
>;

type ParametersOfOperationByOperationId<
  T extends Operation,
  TSpec extends OpenApi,
> = T['operationId'] extends string
  ? T['parameters'] extends readonly (Parameter | Reference)[]
    ? OpenApiParametersToTypes<T['parameters'], TSpec>
    : Record<string, never>
  : Record<string, any>;

type ParametersOfPathItem<
  T extends PathItem,
  TOperation extends string,
  TSpec extends OpenApi,
  TStuff = Extract<T[keyof T & OpenApiOperationType], { operationId: TOperation }>
> = [TStuff] extends [never]
  ? never
  : TStuff extends Operation
    ? ParametersOfOperationByOperationId<TStuff, TSpec>
    : never;

export type ParametersOfOpenApiOperation<
  T extends OpenApi,
  TOperation extends string,
> = {
  [key in keyof T['paths']]: ParametersOfPathItem<T['paths'][key], TOperation, T>
}[keyof T['paths']];

export type OpenApiArgTypes<
  TSpec extends OpenApi,
  TOperation extends string = string,
  TParams = ParametersOfOpenApiOperation<TSpec, TOperation>
> = [TParams] extends [never] ? any : TParams;
