import type { SkqlOptions } from '@comake/skql-js-engine';
import { Skql } from '@comake/skql-js-engine';
import { OpenApiOperationExecutor } from './operation-executor/OpenApiOperationExecutor';
import type { OperationExecutor } from './operation-executor/OperationExecutor';
import type {
  ApiArgTypes,
  ApiConfigTypes,
  ApiOperationNamespace,
  ApiOptionTypes,
  ApiReturnTypes,
  ApiSpecOptions,
  ApiSpecs,
  ApiSpecType,
  OperationHandler,
} from './Types';

export interface StandardSdkArgs<T extends ApiSpecs> {
  /**
  * An object to directly supply API specs for StandardSDK to construct namespaced operations from.
  */
  readonly apiSpecs?: T;
  /**
  * Options to pass to build an Skql object which can be accessed through this StandardSDK instance
  */
  readonly skqlOptions?: SkqlOptions;
}

class StandardSDKBase<T extends ApiSpecs> {
  private readonly _skql?: Skql;

  public constructor(args: StandardSdkArgs<T>) {
    if (args.apiSpecs) {
      const apiOperationNamespaces = this.createApiOperationNamespaces(args.apiSpecs);
      Object.assign(this, apiOperationNamespaces);
    }
    if (args.skqlOptions) {
      this._skql = new Skql(args.skqlOptions);
    }
  }

  public get skql(): Skql {
    if (this._skql) {
      return this._skql;
    }
    throw new Error('Failed to access skql. No `skqlOptions` found on initialization of StandardSDK.');
  }

  private createApiOperationNamespaces<TS extends ApiSpecs>(
    apiSpecs: TS,
  ): Record<keyof TS, ApiOperationNamespace<ApiSpecType>> {
    return Object.entries(apiSpecs)
      .reduce(<TR extends ApiSpecOptions>(
        obj: Record<keyof TS, ApiOperationNamespace<ApiSpecType>>,
        [ apiSpecName, specObject ]: [string, TR],
      ): Record<keyof TS, ApiOperationNamespace<ApiSpecType>> => {
        const executor = this.generateExecutorForApiSpecOptions(specObject);
        const operationHandler = this.buildOperationHandlerForApiSpec(executor);
        return {
          ...obj,
          [apiSpecName]: new Proxy(
            {} as ApiOperationNamespace<TR['type']>,
            { get: operationHandler },
          ),
        };
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      }, {} as Record<keyof TS, ApiOperationNamespace<any>>);
  }

  private generateExecutorForApiSpecOptions<TR extends ApiSpecOptions>(
    apiSpec: TR,
  ): OperationExecutor<TR['type']> {
    if (apiSpec.type === 'openapi') {
      return new OpenApiOperationExecutor(apiSpec);
    }
    throw new Error(`API Specification type ${apiSpec.type} is not supported.`);
  }

  private buildOperationHandlerForApiSpec<TR extends ApiSpecType>(
    executor: OperationExecutor<TR>,
  ): (
      target: ApiOperationNamespace<TR>,
      operation: string,
    ) => OperationHandler<TR> {
    return (
      target: ApiOperationNamespace<TR>,
      operation: string,
    ): OperationHandler<TR> =>
      async(
        args?: ApiArgTypes[TR],
        configuration?: ApiConfigTypes[TR],
        options?: ApiOptionTypes[TR],
      ): Promise<ApiReturnTypes[TR]> =>
        await executor.executeOperation(
          operation,
          args,
          configuration,
          options,
        );
  }
}

type NamespacedApiOperationNamespace<T extends ApiSpecs> = {
  [key in keyof T]: ApiOperationNamespace<T[key]['type']>
};

export type StandardSDK<T extends ApiSpecs> = StandardSDKBase<T> & NamespacedApiOperationNamespace<T>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StandardSDK = {
  build<T extends ApiSpecs>(args: StandardSdkArgs<T>): StandardSDK<T> {
    return new StandardSDKBase(args) as StandardSDK<T>;
  },
};
