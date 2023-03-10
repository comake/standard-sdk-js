import { OpenApiOperationExecutor as RealOpenApiOperationExecutor } from '@comake/openapi-operation-executor';
import { OpenApiOperationExecutor } from '../../../src/operation-executor/OpenApiOperationExecutor';
import ticketmasterOpenApiSpec from '../../assets/TicketmasterOpenapi';

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
      const executor = new OpenApiOperationExecutor({
        type: 'openapi',
        value: '',
      });
    }).toThrow('Invalid OpenApi specification.');

    expect((): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const executor = new OpenApiOperationExecutor([ 1, 2, 3 ] as any);
    }).toThrow('Invalid OpenApi specification.');
  });

  it('does not throw an error if a valid Open API spec type is supplied.', async(): Promise<void> => {
    expect((): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const executor = new OpenApiOperationExecutor({
        type: 'openapi',
        value: ticketmasterOpenApiSpec,
      });
    }).not.toThrow();
  });

  it('executes openapi operations.', async(): Promise<void> => {
    const executor = new OpenApiOperationExecutor({
      type: 'openapi',
      value: ticketmasterOpenApiSpec,
    });
    await expect(executor.executeOperation('operationId')).resolves.toBe('response');
    expect(setOpenapiSpec).toHaveBeenCalledTimes(1);
    expect(setOpenapiSpec).toHaveBeenCalledWith(ticketmasterOpenApiSpec);
    expect(executeOperation).toHaveBeenCalledTimes(1);
    expect(executeOperation).toHaveBeenCalledWith('operationId', undefined, undefined, undefined);
  });
});
