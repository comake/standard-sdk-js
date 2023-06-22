import type { AxiosRequestConfig } from 'axios';

export interface OperationExecutor {
  executeOperation: (
    operation: string,
    args?: Record<string, any>,
    configuration?: Record<string, any>,
    options?: AxiosRequestConfig,
  ) => Promise<Record<string, any>>;
}
