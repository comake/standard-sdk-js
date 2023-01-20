import { StandardSDK } from '../../src/StandardSdk';
import ticketmasterOpenApiSpec from '../assets/TicketmasterOpenapi';
import { describeIf } from '../util/Util';

describeIf('docker', 'Operation execution', (): void => {
  it('sends a web request and gets the response.', async(): Promise<void> => {
    const ssdk = StandardSDK.build({
      apiSpecs: {
        ticketmaster: {
          type: 'openapi',
          value: ticketmasterOpenApiSpec,
        },
      },
    });
    const response = await ssdk.ticketmaster.SearchEvents(
      { dmaId: '220' },
      { apiKey: process.env.TICKETMASTER_APIKEY },
    );
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data._embedded.events).toBeInstanceOf(Array);
  });
});
