import type { OpenApi } from '@comake/openapi-operation-executor';
import type { SkqlOptions } from '@comake/skql-js-engine';
import { Skql } from '@comake/skql-js-engine';
import type { AxiosResponse } from 'axios';
import { OpenApiOperationExecutor } from './operation-executor/OpenApiOperationExecutor';
import type { OperationExecutor } from './operation-executor/OperationExecutor';

export type ApiSpecType = 'openapi';

export type ApiSpecValue<T extends ApiSpecType> = T extends 'openapi'
  ? string | OpenApi
  : never;

export interface ApiSpec<T extends ApiSpecType> {
  type: T;
  value: ApiSpecValue<T>;
}

export type ApiSpecs = Record<string, ApiSpec<any>>;

export interface ApiReturnTypes {
  openapi: AxiosResponse;
}

export type ApiReturnType<T extends ApiSpecType> = ApiReturnTypes[T];

export type OperationHandler<T> = (
  args?: any,
  configuration?: any,
  options?: any
) => Promise<T>;

export type ApiOperationInterface<T> = Record<string, OperationHandler<T>>;

export interface StandardSdkArgs {
  apiSpecs?: ApiSpecs;
  skqlOptions?: SkqlOptions;
}

class StandardSDKBase<TU extends StandardSdkArgs> {
  private readonly _skql?: Skql;

  public constructor(args: TU) {
    if (args.apiSpecs) {
      const apiOperationInterfaces = this.createApiOperationHandlers(args.apiSpecs);
      Object.assign(this, apiOperationInterfaces);
    } else if (args.skqlOptions) {
      this._skql = new Skql(args.skqlOptions);
    } else {
      throw new Error('Must supply one of skqlOptions or apiSpecs.');
    }
  }

  public get skql(): Skql {
    if (this._skql) {
      return this._skql;
    }
    throw new Error('Failed to access skql. No `skqlOptions` found on initialization of StandardSDK.');
  }

  private createApiOperationHandlers<T extends ApiSpecs>(apiSpecs: T): Record<keyof T, ApiOperationInterface<any>> {
    return Object.entries(apiSpecs)
      .reduce(<TR extends ApiSpecType>(
        obj: Record<keyof T, ApiOperationInterface<any>>,
        [ apiSpecName, specObject ]: [string, ApiSpec<TR>],
      ): Record<keyof T, ApiOperationInterface<any>> => {
        const executor = this.generateExecutorForApiSpec(specObject);
        const operationHandler = this.buildOperationHandlerForApiSpec(executor);
        return {
          ...obj,
          [apiSpecName]: new Proxy(
            {} as ApiOperationInterface<ApiReturnType<TR>>,
            { get: operationHandler },
          ),
        };
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      }, {} as Record<keyof T, ApiOperationInterface<any>>);
  }

  private generateExecutorForApiSpec<T extends ApiSpecType>(
    apiSpec: ApiSpec<T>,
  ): OperationExecutor<ApiReturnType<T>> {
    if (apiSpec.type === 'openapi') {
      return new OpenApiOperationExecutor(apiSpec.value);
    }
    throw new Error(`API Specification type ${apiSpec.type} is not supported.`);
  }

  private buildOperationHandlerForApiSpec<T>(
    executor: OperationExecutor<T>,
  ): (target: ApiOperationInterface<T>, operation: string) => OperationHandler<T> {
    return (target: ApiOperationInterface<T>, operation: string): OperationHandler<T> =>
      async(
        configuration: any,
        args?: any,
        options?: any,
      ): Promise<T> =>
        await executor.executeOperation(
          operation,
          args,
          configuration,
          options,
        );
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StandardSDK = {
  build<T extends typeof StandardSDKBase, TU extends StandardSdkArgs>(
    args: TU,
  ): InstanceType<T> & Record<keyof TU['apiSpecs'], ApiOperationInterface<any>> {
    return new StandardSDKBase(args) as InstanceType<T> & Record<keyof TU['apiSpecs'], ApiOperationInterface<any>>;
  },
};
