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

export type ParametersOfOperationByOperationId<
  T extends Operation,
  TSpec extends OpenApi,
> = T['operationId'] extends string
  ? {
    [key in T['operationId']]: T['parameters'] extends readonly (Parameter | Reference)[]
      ? OpenApiParametersToTypes<T['parameters'], TSpec>
      : Record<string, never>
  }
  : Record<string, any>;

export type ParametersOfPathItem<
  T extends PathItem,
  TOperation extends string,
  TSpec extends OpenApi,
> = {
  [key in keyof T & OpenApiOperationType]: T[key] extends { operationId: TOperation }
    ? ParametersOfOperationByOperationId<T[key], TSpec>
    : Record<string, undefined>
}[keyof T & OpenApiOperationType];

type ParametersOfOpenApiOperation<
  T extends OpenApi,
  TOperation extends string,
> = {
  [key in keyof T['paths']]: ParametersOfPathItem<T['paths'][key], TOperation, T>
}[keyof T['paths']][TOperation];

export type OpenApiArgTypes<
  TSpec extends object = object,
  TOperation extends string = string,
> = TSpec extends OpenApi
  ? Exclude<ParametersOfOpenApiOperation<TSpec, TOperation>, undefined>
  : any;
