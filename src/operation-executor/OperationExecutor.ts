export interface OperationExecutor<
  TReturn,
  TArgs extends Record<string, any>,
  TConfig extends Record<string, any>,
  TOptions extends Record<string, any>
> {
  executeOperation: (operation: string, args?: TArgs, configuration?: TConfig, options?: TOptions) => Promise<TReturn>;
}
