import type { OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig } from 'axios';

interface BaseApiNamespaceArgs {
  defaultConfiguration?: OpenApiClientConfiguration;
  defaultOptions?: AxiosRequestConfig;
}

export class BaseApiNamespace {
  public defaultConfiguration: Record<string, any> = {};
  public defaultOptions: AxiosRequestConfig = {};

  public constructor(args: BaseApiNamespaceArgs) {
    this.defaultConfiguration = args.defaultConfiguration ?? {};
    this.defaultOptions = args.defaultOptions ?? {};
  }

  public setDefaultConfiguration(configuration: Record<string, any>): void {
    this.defaultConfiguration = configuration;
  }

  public setDefaultOptions(options: AxiosRequestConfig): void {
    this.defaultOptions = options;
  }
}
