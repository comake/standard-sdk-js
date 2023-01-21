export interface OperationExecutor {
  executeOperation: (
    operation: string,
    args?: Record<string, any>,
    configuration?: Record<string, any>,
    options?: Record<string, any>
  ) => Promise<Record<string, any>>;
}
