import type { OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import { BaseApiNamespace } from '../BaseApiNamespace';

export class OpenApiNamespace extends BaseApiNamespace {
  public setDefaultConfiguration(configuration: OpenApiClientConfiguration): void {
    this.defaultConfiguration = configuration;
  }
}
