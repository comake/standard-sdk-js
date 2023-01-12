import type { SkqlOptions } from '@comake/skql-js-engine';
import { Skql } from '@comake/skql-js-engine';
import { OpenApiOperationExecutor } from './operation-executor/OpenApiOperationExecutor';
import type { OperationExecutor } from './operation-executor/OperationExecutor';
import type {
  ApiArgTypes,
  ApiConfigTypes,
  ApiOperationInterface,
  ApiOptionTypes,
  ApiReturnTypes,
  ApiSpec,
  ApiSpecs,
  ApiSpecType,
  OperationHandler,
} from './Types';

export interface StandardSdkArgs<T extends ApiSpecs> {
  apiSpecs?: T;
  skqlOptions?: SkqlOptions;
}

class StandardSDKBase<T extends ApiSpecs> {
  private readonly _skql?: Skql;

  public constructor(args: StandardSdkArgs<T>) {
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

  private createApiOperationHandlers<TS extends ApiSpecs>(
    apiSpecs: TS,
  ): Record<keyof TS, ApiOperationInterface<any, any, any, any>> {
    return Object.entries(apiSpecs)
      .reduce(<TR extends ApiSpecType>(
        obj: Record<keyof TS, ApiOperationInterface<any, any, any, any>>,
        [ apiSpecName, specObject ]: [string, ApiSpec<TR>],
      ): Record<keyof TS, ApiOperationInterface<any, any, any, any>> => {
        const executor = this.generateExecutorForApiSpec(specObject);
        const operationHandler = this.buildOperationHandlerForApiSpec(executor);
        return {
          ...obj,
          [apiSpecName]: new Proxy(
            {} as ApiOperationInterface<ApiReturnTypes[TR], ApiArgTypes[TR], ApiConfigTypes[TR], ApiOptionTypes[TR]>,
            { get: operationHandler },
          ),
        };
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      }, {} as Record<keyof TS, ApiOperationInterface<any, any, any, any>>);
  }

  private generateExecutorForApiSpec<TR extends ApiSpecType>(
    apiSpec: ApiSpec<TR>,
  ): OperationExecutor<ApiReturnTypes[TR], ApiArgTypes[TR], ApiConfigTypes[TR], ApiOptionTypes[TR]> {
    if (apiSpec.type === 'openapi') {
      return new OpenApiOperationExecutor(apiSpec.value);
    }
    throw new Error(`API Specification type ${apiSpec.type} is not supported.`);
  }

  private buildOperationHandlerForApiSpec<
    TReturn,
    TArgs extends Record<string, any>,
    TConfig extends Record<string, any>,
    TOptions extends Record<string, any>
  >(
    executor: OperationExecutor<TReturn, TArgs, TConfig, TOptions>,
  ): (
      target: ApiOperationInterface<TReturn, TArgs, TConfig, TOptions>,
      operation: string,
    ) => OperationHandler<TReturn, TArgs, TConfig, TOptions> {
    return (
      target: ApiOperationInterface<TReturn, TArgs, TConfig, TOptions>,
      operation: string,
    ): OperationHandler<TReturn, TArgs, TConfig, TOptions> =>
      async(
        args?: TArgs,
        configuration?: TConfig,
        options?: TOptions,
      ): Promise<TReturn> =>
        await executor.executeOperation(
          operation,
          args,
          configuration,
          options,
        );
  }
}

type NamespacedApiOperationInterface<T extends ApiSpecs> = {
  [key in keyof T]: ApiOperationInterface<
    ApiReturnTypes[T[key]['type']],
    ApiArgTypes[T[key]['type']],
    ApiConfigTypes[T[key]['type']],
    ApiOptionTypes[T[key]['type']]
  >
};

export type StandardSDK<T extends ApiSpecs> = StandardSDKBase<T> & NamespacedApiOperationInterface<T>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StandardSDK = {
  build<T extends ApiSpecs>(args: StandardSdkArgs<T>): StandardSDK<T> {
    return new StandardSDKBase(args) as StandardSDK<T>;
  },
};
