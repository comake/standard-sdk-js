import type { SKLEngineOptions } from '@comake/skl-js-engine';
import { SKLEngine } from '@comake/skl-js-engine';
import type { ApiOperationNamespace } from './ApiOperationNamespace';
import type { ApiSpecOptions, ApiSpecs, ApiSpecType } from './ApiSpecOptions';
import { OpenApiOperationExecutor } from './operation-executor/OpenApiOperationExecutor';
import type { OperationExecutor } from './operation-executor/OperationExecutor';
import type { OperationHandler } from './OperationHandler';

export interface StandardSdkArgs<T extends ApiSpecs> {
  /**
  * An object to directly supply API specs for StandardSDK to construct namespaced operations from.
  */
  readonly apiSpecs?: T;
  /**
  * Options to pass to build an SKLEngine object which can be accessed through this StandardSDK instance
  */
  readonly sklEngineOptions?: SKLEngineOptions;
}

class StandardSDKBase<T extends ApiSpecs> {
  private readonly _sklEngine?: SKLEngine;

  public constructor(args: StandardSdkArgs<T>) {
    if (args.apiSpecs) {
      const apiOperationNamespaces = this.createApiOperationNamespaces(args.apiSpecs);
      Object.assign(this, apiOperationNamespaces);
    }
    if (args.sklEngineOptions) {
      this._sklEngine = new SKLEngine(args.sklEngineOptions);
    }
  }

  public get skl(): SKLEngine {
    if (this._sklEngine) {
      return this._sklEngine;
    }
    throw new Error('Failed to access skl. No `sklEngineOptions` found on initialization of StandardSDK.');
  }

  private createApiOperationNamespaces<TS extends ApiSpecs>(
    apiSpecs: TS,
  ): Record<keyof TS, ApiOperationNamespace<ApiSpecType, any>> {
    return Object.entries(apiSpecs)
      .reduce(<TR extends ApiSpecOptions>(
        obj: Record<keyof TS, ApiOperationNamespace<ApiSpecType, any>>,
        [ apiSpecName, specObject ]: [string, TR],
      ): Record<keyof TS, ApiOperationNamespace<ApiSpecType, any>> => {
        const executor = this.generateExecutorForApiSpecOptions(specObject);
        const operationHandler = this.buildOperationHandlerForApiSpec(executor);
        return {
          ...obj,
          [apiSpecName]: new Proxy(
            {} as ApiOperationNamespace<ApiSpecType, any>,
            { get: operationHandler },
          ),
        };
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      }, {} as Record<keyof TS, ApiOperationNamespace<any, any>>);
  }

  private generateExecutorForApiSpecOptions<TR extends ApiSpecOptions>(
    apiSpec: TR,
  ): OperationExecutor {
    if (apiSpec.type === 'openapi') {
      return new OpenApiOperationExecutor(apiSpec);
    }
    throw new Error(`API Specification type ${apiSpec.type} is not supported.`);
  }

  private buildOperationHandlerForApiSpec<TR extends ApiSpecType>(
    executor: OperationExecutor,
  ): (
      target: ApiOperationNamespace<TR, any>,
      operation: string,
    ) => OperationHandler {
    return (
      target: ApiOperationNamespace<TR, any>,
      operation: string,
    ): OperationHandler =>
      async(
        args?: Record<string, any>,
        configuration?: Record<string, any>,
        options?: Record<string, any>,
      ): Promise<Record<string, any>> =>
        await executor.executeOperation(
          operation,
          args,
          configuration,
          options,
        );
  }
}

type NamespacedApiOperationNamespace<T extends ApiSpecs> = {
  [key in keyof T]: ApiOperationNamespace<T[key]['type'], T[key]['value']>
};

export type StandardSDK<T extends ApiSpecs> = StandardSDKBase<T> & NamespacedApiOperationNamespace<T>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StandardSDK = {
  build<T extends ApiSpecs>(args: StandardSdkArgs<T>): StandardSDK<T> {
    return new StandardSDKBase(args) as StandardSDK<T>;
  },
};
