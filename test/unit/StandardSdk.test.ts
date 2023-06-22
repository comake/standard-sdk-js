import { SKLEngine } from '@comake/skl-js-engine';
import { OpenApiOperationExecutor } from '../../src/operation-executor/OpenApiOperationExecutor';
import { StandardSDK } from '../../src/StandardSdk';
import ticketmasterOpenApiSpec from '../assets/TicketmasterOpenapi';

jest.mock('../../src/operation-executor/OpenApiOperationExecutor');

describe('A StandardSDK', (): void => {
  let executeOperation: any;
  beforeEach(async(): Promise<void> => {
    executeOperation = jest.fn().mockResolvedValue('response');
    (OpenApiOperationExecutor as jest.Mock).mockImplementation((): any => ({
      executeOperation,
    }));
  });

  it('throws an error when accessing skl if sklEngineOptions were not given.', (): void => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: JSON.stringify(ticketmasterOpenApiSpec),
        },
      },
    });
    expect((): any => ssdk.skl)
      .toThrow('Failed to access skl. No `sklEngineOptions` found on initialization of StandardSDK.');
  });

  it('throws an error if an unsupported API spec type is supplied.', async(): Promise<void> => {
    expect((): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ssdk = StandardSDK.build({
        apiSpecs: {
          github: {
            type: 'graphql' as any,
            value: '',
          },
        },
      });
    }).toThrow('API Specification type graphql is not supported.');
  });

  it('can query an open api operation interface from a spec specified as a string.', async(): Promise<void> => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: JSON.stringify(ticketmasterOpenApiSpec),
        },
      },
    });
    await expect(ssdk.ticketmaster.SearchEvents()).resolves.toBe('response');
    expect(executeOperation).toHaveBeenCalledWith(
      'SearchEvents',
      undefined,
      {},
      {},
    );
  });

  it('can query an open api operation interface from a spec specified as a json object.', async(): Promise<void> => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: ticketmasterOpenApiSpec,
        },
      },
    });
    await expect(ssdk.ticketmaster.SearchEvents()).resolves.toBe('response');
    expect(executeOperation).toHaveBeenCalledWith(
      'SearchEvents',
      undefined,
      {},
      {},
    );
  });

  it('can query an open api operation interface with default configs.', async(): Promise<void> => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: ticketmasterOpenApiSpec,
          defaultConfiguration: {
            accessToken: 'ab123',
          },
        },
      },
    });
    await expect(ssdk.ticketmaster.SearchEvents()).resolves.toBe('response');
    expect(executeOperation).toHaveBeenCalledWith(
      'SearchEvents',
      undefined,
      { accessToken: 'ab123' },
      {},
    );
  });

  it('can query an open api operation interface with default options.', async(): Promise<void> => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: ticketmasterOpenApiSpec,
          defaultOptions: {
            headers: {
              'x-header': 'abc123',
            },
          },
        },
      },
    });
    await expect(ssdk.ticketmaster.SearchEvents()).resolves.toBe('response');
    expect(executeOperation).toHaveBeenCalledWith(
      'SearchEvents',
      undefined,
      {},
      {
        headers: {
          'x-header': 'abc123',
        },
      },
    );
  });

  it('can query an open api operation interface after setting default configuration.', async(): Promise<void> => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: ticketmasterOpenApiSpec,
        },
      },
    });
    ssdk.ticketmaster.setDefaultConfiguration({
      accessToken: 'ab123',
    });
    await expect(ssdk.ticketmaster.SearchEvents()).resolves.toBe('response');
    expect(executeOperation).toHaveBeenCalledWith(
      'SearchEvents',
      undefined,
      { accessToken: 'ab123' },
      {},
    );
  });

  it('can query an open api operation interface after setting default options.', async(): Promise<void> => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: ticketmasterOpenApiSpec,
        },
      },
    });
    ssdk.ticketmaster.setDefaultOptions({
      headers: {
        'x-header': 'abc123',
      },
    });
    await expect(ssdk.ticketmaster.SearchEvents()).resolves.toBe('response');
    expect(executeOperation).toHaveBeenCalledWith(
      'SearchEvents',
      undefined,
      {},
      {
        headers: {
          'x-header': 'abc123',
        },
      },
    );
  });

  it('can access skl if sklEngineOptions are supplied.', (): void => {
    const ssdk = StandardSDK.build({
      sklEngineOptions: {
        type: 'memory',
      },
    });
    expect(ssdk.skl).toBeInstanceOf(SKLEngine);
  });
});
