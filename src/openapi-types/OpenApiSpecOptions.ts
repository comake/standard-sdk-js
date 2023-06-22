import type { OpenApi, OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import type { BaseApiSpecOptions } from '../BaseApiSpecOptions';

export interface OpenApiSpecOptions extends BaseApiSpecOptions {
  /**
  * API specification type.
  */
  readonly type: 'openapi';
  /**
  * Contents of the OpenAPI specification.
  * Either an OpenApi conformant JSON object, or a stringified representation of one.
  */
  readonly value: string | OpenApi;
  /**
  * Default configuration supplied to every operation of this API.
  */
  readonly defaultConfiguration?: OpenApiClientConfiguration;
}
