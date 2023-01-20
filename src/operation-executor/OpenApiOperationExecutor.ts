import type { OpenApi, OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import { OpenApiOperationExecutor as RealOpenApiOperationExecutor } from '@comake/openapi-operation-executor';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import type { OpenApiSpecOptions } from '../openapi-types/OpenApiSpecOptions';
import type { OperationExecutor } from './OperationExecutor';

export class OpenApiOperationExecutor implements OperationExecutor<'openapi'> {
  private initialized = false;
  private readonly executor: RealOpenApiOperationExecutor;

  public constructor(openApiSpecOptions: OpenApiSpecOptions) {
    this.executor = new RealOpenApiOperationExecutor();
    const openApiSpecObject = this.processOpenApiSpec(openApiSpecOptions.value);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.setOpenApiSpec(openApiSpecObject);
  }

  private processOpenApiSpec(apiSpec: string | OpenApi): OpenApi {
    if (typeof apiSpec === 'string') {
      try {
        return JSON.parse(apiSpec);
      } catch {
        // Do nothing
      }
    } else if (typeof apiSpec === 'object' && 'openapi' in apiSpec) {
      return apiSpec;
    }
    throw new Error('Invalid OpenApi specification.');
  }

  private async setOpenApiSpec(openApiSpec: OpenApi): Promise<void> {
    await this.executor.setOpenapiSpec(openApiSpec);
    this.initialized = true;
  }

  public async executeOperation(
    operation: string,
    args?: any,
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    await this.ensureInitialization();
    return await this.executor.executeOperation(
      operation,
      configuration,
      args,
      options,
    );
  }

  private async ensureInitialization(): Promise<void> {
    if (!this.initialized) {
      return new Promise((resolve): void => {
        setTimeout(async(): Promise<void> => {
          await this.ensureInitialization();
          resolve();
        }, 10);
      });
    }
  }
}
