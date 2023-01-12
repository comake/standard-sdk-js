import type { OpenApi } from '@comake/openapi-operation-executor';
import { OpenApiOperationExecutor as RealOpenApiOperationExecutor } from '@comake/openapi-operation-executor';
import { OpenApiOperationExecutor } from '../../../src/operation-executor/OpenApiOperationExecutor';
import googleDriveOpenApiSpec from '../../assets/google-drive-openapi.json';

jest.mock('@comake/openapi-operation-executor');

describe('An OpenApiOperationExecutor', (): void => {
  let setOpenapiSpec: any;
  let executeOperation: any;
  beforeEach(async(): Promise<void> => {
    setOpenapiSpec = jest.fn().mockImplementation(async(): Promise<void> =>
      new Promise((resolve): void => {
        setTimeout(resolve, 30);
      }));
    executeOperation = jest.fn().mockResolvedValue('response');
    (RealOpenApiOperationExecutor as jest.Mock).mockImplementation((): any => ({
      setOpenapiSpec,
      executeOperation,
    }));
  });

  it('throws an error if an invalid Open API spec type is supplied.', async(): Promise<void> => {
    expect((): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const executor = new OpenApiOperationExecutor('');
    }).toThrow('Invalid OpenApi specification.');

    expect((): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const executor = new OpenApiOperationExecutor([ 1, 2, 3 ] as any);
    }).toThrow('Invalid OpenApi specification.');
  });

  it('does not throw an error if a valid Open API spec type is supplied.', async(): Promise<void> => {
    expect((): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const executor = new OpenApiOperationExecutor(googleDriveOpenApiSpec as OpenApi);
    }).not.toThrow();
  });

  it('executes openapi operations.', async(): Promise<void> => {
    const executor = new OpenApiOperationExecutor(googleDriveOpenApiSpec as OpenApi);
    await expect(executor.executeOperation('operationId')).resolves.toBe('response');
    expect(setOpenapiSpec).toHaveBeenCalledTimes(1);
    expect(setOpenapiSpec).toHaveBeenCalledWith(googleDriveOpenApiSpec);
    expect(executeOperation).toHaveBeenCalledTimes(1);
    expect(executeOperation).toHaveBeenCalledWith('operationId', undefined, undefined, undefined);
  });
});
