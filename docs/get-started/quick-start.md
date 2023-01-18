# Quick Start

Currently, Standard SDK is implemented as a JavaScript module. However, its functionality can be implemented in other popular languages. If you would like to contribute to creating a Standard SDK in another language, please start a [discussion](https://github.com/comake/standard-sdk-js/discussions) about it.

To get started with Standard SDK in Node.js, install the module with npm or yarn:

```shell
npm install @comake/standard-sdk-js
```

or

```shell
yarn add @comake/standard-sdk-js
```

To use Standard SDK in a browser, you'll need to use a bundling tool such as Webpack, Rollup, Parcel, or Browserify. Some bundlers may require a bit of configuration, such as setting `browser: true` in rollup-plugin-resolve.

## Usage

### Building 
To use Standard SDK, it first needs to be built using the [StandardSDK.build](../reference/api-reference.md#standardsdkbuildoptions) method. StandardSDK is dynamically built based on the API specs you supply.

In Typescript:
```typescript
import type { OpenApi } from '@comake/standard-sdk-js';
import { StandardSDK } from '@comake/standard-sdk-js';
// Import your API specs. 
import ticketmasterOpenApiSpec from './path/to/ticketmaster-openapi-spec.json';
import dropboxOpenApiSpec from './path/to/dropbox-openapi-spec.json';
// Build the Standard SDK with your API specs of choice
const standardSdk = StandardSDK.build({
  apiSpecs: {
    ticketmaster: {
      type: 'openapi',
      value: ticketmasterOpenApiSpec as OpenAPI,
    },
    dropbox: {
      type: 'openapi',
      value: dropboxOpenApiSpec as OpenAPI,
    },
  },
});
```
Here we use OpenAPI specs imported as a JSON modules (requires the `resolveJsonModule` flag in your `tsconfig.json` file in Typescript). Alternatively, you could read a YAML file uing [fs](https://nodejs.org/api/fs.html#file-system) and use the [yaml](https://www.npmjs.com/package/yaml) npm module to convert to JSON.

To get full Typescript autocompletion support in Standard SDK, turn your JSON OpenAPI specs into typescript objects by doing the following:
1. Change the file extension from `.json` to `.ts`
2. Add this typescript code around the OpenAPI spec JSON.
    ```typescript
    export default {
      // Your OpenAPI spec here
    } as const;
    ```
Now you won't have to cast your imported OpenAPI specs to the `OpenApi` type
```typescript
import { StandardSDK } from '@comake/standard-sdk-js';
// Import your API specs as Typescript objects. 
import ticketmasterOpenApiSpec from './path/to/ticketmaster-openapi-spec.ts';

// Build the Standard SDK with your API specs of choice
const standardSdk = StandardSDK.build({
  apiSpecs: {
    ticketmaster: {
      type: 'openapi',
      value: ticketmasterOpenApiSpec,
    }
  },
});
```


### Operations
Once you have built a `StandardSDK` object, you can perform API operations with it according to the descriptions of operations in the API specs you supplied. For example, every operation in an OpenAPI spec has a unique field used to identify it, called an `operationId`. Every `operationId` in an OpenAPI spec can be used as the name of a function which can be called to execute the corresponding API request described by the API spec. The operations available to perform are namespaced with the same keys you use in the `apiSpecs` parameter when you build StandardSDK (eg. `ticketmaster` and `dropbox` in the example above).

In Typescript:
```typescript
const ticketmasterResponse = await standardSdk.ticketmaster.SearchEvents(
  { city: 'Atlanta' },
  { apiKey: '<your ticketmaster api key>' },
);

const dropboxResponse = await standardSdk.dropbox.FilesGetMetadata(
  { path: 'id:a4ayc_80_OEAAAAAAAAAYa' },
  { accessToken: '<your dropbox access token>' },
);
```
The Ticketmaster OpenAPI spec we supplied to Standard SDK describes an operation with `operationId` equal to `SearchEvents`. The operation in the spec describes the Event Search endpoint documented in [Ticketmaster's Discovery API documentation](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2). Similarly, the Dropbox OpenAPI spec we provided describes an operation with `operationId` equal to `FilesGetMetadata`. It is documented in [Dropbox's API documentation](https://www.dropbox.com/developers/documentation/http/documentation#files-get_metadata).

Each operation was supplied relevant arguments as the first parameter and configuration as the second. See the [standardSDKInstance.\<namespace\>.\<operation\>](../reference/api-reference.md#standardsdkinstancenamespaceoperationargs-configuration-options) api reference for more information on these parameters.

### OpenAPI Directory
For your convenience, we have compiled a [directory of OpenAPI specs](https://github.com/comake/openapi-directory) of many popular APIs that you can use in your projects. We'd like to acknowledge [APIs.guru](https://apis.guru/), who supplied most of the API specs in the directory. Please submit any missing OpenAPI specs or ones you create as PRs to the directory. That way other developers can re-use them!