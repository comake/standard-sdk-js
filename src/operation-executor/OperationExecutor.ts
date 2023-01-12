export interface OperationExecutor<T> {
  executeOperation: (operation: string, args?: any, configuration?: any, options?: any) => Promise<T>;
}
