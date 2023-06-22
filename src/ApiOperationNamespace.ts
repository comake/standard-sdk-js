import type { OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig } from 'axios';
import type { ApiSpecOptions } from './ApiSpecOptions';
import type { OpenApiOperationNamespace } from './openapi-types/OpenApiOperationNamespace';

interface BaseApiOperationNamespaceArgs {
  defaultConfiguration?: OpenApiClientConfiguration;
  defaultOptions?: AxiosRequestConfig;
}

export type ApiOperationNamespace<
  T extends ApiSpecOptions
> = T['type'] extends 'openapi'
  ? OpenApiOperationNamespace<T['value']> & BaseApiOperationNamespace
  : never;

export class BaseApiOperationNamespace {
  public defaultConfiguration: OpenApiClientConfiguration = {};
  public defaultOptions: AxiosRequestConfig = {};

  public constructor(args: BaseApiOperationNamespaceArgs) {
    this.defaultConfiguration = args.defaultConfiguration ?? {};
    this.defaultOptions = args.defaultOptions ?? {};
  }

  public setDefaultConfiguration(configuration: OpenApiClientConfiguration): void {
    this.defaultConfiguration = configuration;
  }

  public setDefaultOptions(options: AxiosRequestConfig): void {
    this.defaultOptions = options;
  }
}
