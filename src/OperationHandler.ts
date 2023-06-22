import type { AxiosRequestConfig } from 'axios';

export type OperationHandler = (
  args?: Record<string, any>,
  configuration?: Record<string, any>,
  options?: AxiosRequestConfig,
) => Promise<any>;
