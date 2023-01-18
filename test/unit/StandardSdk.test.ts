import { Skql } from '@comake/skql-js-engine';
import { OpenApiOperationExecutor } from '../../src/operation-executor/OpenApiOperationExecutor';
import { StandardSDK } from '../../src/StandardSdk';
import ticketmasterOpenApiSpec from '../assets/TicketmasterOpenapi';

jest.mock('../../src/operation-executor/OpenApiOperationExecutor');

describe('A StandardSDK', (): void => {
  beforeEach(async(): Promise<void> => {
    (OpenApiOperationExecutor as jest.Mock).mockImplementation((): any => ({
      executeOperation: jest.fn().mockResolvedValue('response'),
    }));
  });

  it('throws an error when accessing skql if skqlOptions were not given.', (): void => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: JSON.stringify(ticketmasterOpenApiSpec),
        },
      },
    });
    expect((): any => ssdk.skql)
      .toThrow('Failed to access skql. No `skqlOptions` found on initialization of StandardSDK.');
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
  });

  it('can access skql if skqlOptions are supplied.', (): void => {
    const ssdk = StandardSDK.build({
      skqlOptions: {
        type: 'memory',
      },
    });
    expect(ssdk.skql).toBeInstanceOf(Skql);
  });
});
