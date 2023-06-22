import type {
  OpenApi,
  Operation,
  PathItem,
  SecurityRequirement,
  OpenApiClientConfiguration,
} from '@comake/openapi-operation-executor';
import type { Merged } from '../type-utils/Merged';
import type { UnionToIntersection } from '../type-utils/UnionToIntersection';
import type { OpenApiOperationType } from './OpenApiOperationType';

type DistributiveOptional<T, TK extends string> = T extends any
  ? OpenApiClientConfiguration & Omit<T, TK>
  : never;

type AnyFunction = (...args: any[]) => any;

type ExpandRecursively<T> = T extends object
  ? T extends Promise<any>
    ? T
    : T extends AnyFunction
      ? T
      : T extends infer O ? {[K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

type UnionOfRequired<T, TH = Merged<UnionToIntersection<T>>> =
  T extends any
    ? keyof T extends 'bearerToken' | 'username' | 'password' | 'accessToken'
      ? never
      : TH & Required<T>
    : never;

type OpenApiSecurityRequirementToType<
  T extends SecurityRequirement,
  TSecurityTypes extends Record<string, OpenApiClientConfiguration>,
  TInter = {[K in keyof T & string]: TSecurityTypes[K] }[keyof T & string],
> = keyof TInter extends 'apiKey'
  ? UnionOfRequired<TInter>
  : TInter;

type OpenApiSecurityRequirementToTypeWithDefaults<
  T extends SecurityRequirement,
  TSecurityTypes extends Record<string, OpenApiClientConfiguration>,
  TDefaultConfig extends string | undefined,
  TConfig = OpenApiSecurityRequirementToType<T, TSecurityTypes>,
> = TDefaultConfig extends string
  ? DistributiveOptional<TConfig, TDefaultConfig>
  : OpenApiClientConfiguration & TConfig;

type OpenApiSecurityRequirementToTypes<
  T extends readonly SecurityRequirement[],
  TSecurityTypes extends Record<string, OpenApiClientConfiguration>,
  TDefaultConfig extends string | undefined,
> = {[K in keyof T]: OpenApiSecurityRequirementToTypeWithDefaults<T[K], TSecurityTypes, TDefaultConfig> }[number];

type ConfigurationOfOperationInPathItemIfDefined<
  T extends PathItem,
  TOperation extends string,
  TSpec extends OpenApi,
  TDefaultConfig extends string | undefined,
  TSecurityTypes extends Record<string, OpenApiClientConfiguration>,
  TOperationObject = Extract<T[keyof T & OpenApiOperationType], { operationId: TOperation }>
> = [TOperationObject] extends [never]
  ? never
  : TOperationObject extends Operation
    ? TOperationObject['security'] extends readonly SecurityRequirement[]
      ? OpenApiSecurityRequirementToTypes<TOperationObject['security'], TSecurityTypes, TDefaultConfig>
      : TSpec['security'] extends readonly SecurityRequirement[]
        ? OpenApiSecurityRequirementToTypes<TSpec['security'], TSecurityTypes, TDefaultConfig>
        : never
    : never;

type ConfigurationOfOpenApiOperation<
  T extends OpenApi,
  TOperation extends string,
  TDefaultConfig extends string | undefined,
  TSecurityTypes extends Record<string, OpenApiClientConfiguration>
> = {
  [key in keyof T['paths']]: ConfigurationOfOperationInPathItemIfDefined<
    T['paths'][key],
    TOperation,
    T,
    TDefaultConfig,
    TSecurityTypes
  >
}[keyof T['paths']];

type UndefinedOrStringKeyOf<T extends Record<string, any> | undefined | unknown> =
  T extends object
    ? keyof T & string
    : undefined;

export type OpenApiClientConfigurationTypes<
  TSpec extends OpenApi,
  TOperation extends string,
  TSecurityTypes extends Record<string, OpenApiClientConfiguration>,
  TDefaultConfig extends OpenApiClientConfiguration | undefined = undefined,
  TDefaultConfigKeys extends string | undefined = UndefinedOrStringKeyOf<TDefaultConfig>,
  TConfig = ExpandRecursively<
    ConfigurationOfOpenApiOperation<TSpec, TOperation, TDefaultConfigKeys, TSecurityTypes>
  >
> = [TConfig] extends [never] ? undefined : TConfig;
