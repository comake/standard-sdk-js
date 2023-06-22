import type { OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig } from 'axios';

export type OperationHandler = (
  args?: Record<string, any>,
  configuration?: OpenApiClientConfiguration,
  options?: AxiosRequestConfig,
) => Promise<any>;
