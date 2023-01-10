import { StandardSDK } from '../../src/StandardSdk';

describe('A StandardSDK', (): void => {
  it('can be instantiated.', (): void => {
    expect((): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ssdk = new StandardSDK({});
    }).not.toThrow();
  });
});
