# API Reference

## [`StandardSDK.build(options)`](#standardsdkbuildoptions)

Instantiates a Standard SDK with your APIs of choice.

#### Parameters

The `build` method takes one argument which may have either or both of `apiSpecs` and `sklEngineOptions`.

| Parameter | Type | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| :--- | :--- | :--- |
| `apiSpecs` | `object` | A hash of `ApiSpecOptions` objects. Describes the API specs for StandardSDK to construct namespaced operations from. |
| `sklEngineOptions` | `object` | An `SKLEngineOptions` object as defined by [@comake/skl-js-engine](https://www.npmjs.com/package/@comake/skl-js-engine) |

#### ApiSpecOptions

`ApiSpecOptions` are the configurations you pass when building a Standard SDK for the APIs you want to work with. Different types of APIs have their own specific options. Currently we only support OpenAPI specs.

| Parameter | Required | Description |
| --- | --- | ------------ |
| `type` | Required | A type of API specification. Possible values are: `openapi` |
| `value` | Required | The contents of the API specification. Usually a string or JSON object. When using Typescript, use `as const` on your API spec to get extended type support. |
| `defaultConfiguration` | | Optional configuration that will be added to every operation of this API. For OpenAPI specs, this field will be an `OpenApiClientConfiguration` object as defined in [@comake/openapi-operation-executor](https://github.com/comake/openapi-operation-executor). |
| `defaultOptions` | | Optional options that will be applied to every operation of this API. For OpenAPI operations, this is an `AxiosRequestConfig` object. See the [axios API documentation](https://github.com/axios/axios#request-config) for reference. |

#### Return Value

A `StandardSDK` instance with a namespace for each key in `apiSpecs`. It may also have an `skl` property if `sklEngineOptions` was supplied.

#### Example Usage

In Typescript:
```typescript
import ticketmasterOpenApiSpec from './path/to/ticketmaster-openapi-spec.json';

const standardSdk = StandardSDK.build({
  apiSpecs: {
    ticketmaster: {
      type: 'openapi',
      value: ticketmasterOpenApiSpec,
      defaultConfiguration: {
        apiKey: 'abc123'
      },
      defaultOptions: {
        headers: {
          'X-Powered-By': 'Comake'
        }
      }
    },
  },
});
```

## [`standardSDKInstance.<namespace>`](#standardsdkinstance-namespace)

A namespace of a `StandardSDK` instance corresponding to a set of supplied Api Spec Options. A namespace has a property for each operation in the supplied API specification. Each namespace also includes methods `setDefaultConfiguration` and `setDefaultOptions` to update the default configuration and options to all operations if the API.

#### Example Usage
In Typescript:
```typescript
const sdkNamespace = standardSdk.ticketmaster;
```

## [`standardSDKInstance.<namespace>.setDefaultConfiguration(configuration)`](#standardsdkinstance-namespace-setDefaultConfiguration)

Sets the default configuration for all operations of in an API namespace. When using an API described via an OpenAPI spec, the `configuration` parameter should be a `OpenApiClientConfiguration` object as defined in [@comake/openapi-operation-executor](https://github.com/comake/openapi-operation-executor).

#### Example Usage
In Typescript:
```typescript
standardSdk.ticketmaster.setDefaultConfiguration({
  apiKey: 'acb123'
});
```

## [`standardSDKInstance.<namespace>.setDefaultOptions(options)`](#standardsdkinstance-namespace-setDefaultConfiguration)

Sets the default options for all operations of in an API namespace. When using an API described via an OpenAPI spec, the `options` parameter should be an `AxiosRequestConfig` object as defined in the [axios API documentation](https://github.com/axios/axios#request-config).

#### Example Usage
In Typescript:
```typescript
standardSdk.ticketmaster.setDefaultOptions({
  headers: {
    'X-Powered-By': 'Comake'
  }
});
```


## [`standardSDKInstance.<namespace>.<operation>(args, configuration, options)`](#standardsdkinstance-namespace-operation)

Executes the API operation called `<operation>` according to the API specification corresponding to the namespace `<namespace>`.

#### Parameters

All parameters are optional, however, when using Typescript and executing an OpenAPI operation with required parameters or request body, the `args` parameter will be required.

| Parameter | Type | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| :--- | :--- | :--- |
| `args` | `object` | Arguments for the operation as defined by the API specification. For example, an operation in an OpenAPI spec has either a `requestBody` or a `parameters` field. StandardSDK will read these fields and construct and send a web request with the data from `args` in the correct parts of the request. |
| `configuration` | `object` | An object holding any configuration necessary for the operation. Most often this includes security credentials. For example, for an OpenAPI operation `configuration` may include an `apiKey` or `accessToken` to satisfy the [Security Requirement](https://spec.openapis.org/oas/v3.1.0#securityRequirementObject) of the operation. See note below for more information. |
| `options` | `object` | An object holding any options to supply to the operation execution module to modfy default behaviors the request or message sent for the operation. For OpenAPI operations, this is an `AxiosRequestConfig` object. See the [axios API documentation](https://github.com/axios/axios#request-config) for reference. |

⚠️ StandardSDK uses the [@comake/openapi-operation-executor](https://www.npmjs.com/package/@comake/openapi-operation-executor) package to execute OpenAPI operations. This library currently supports OpenAPI security types `oauth2`, `apiKey`, and `http` with schemes `basic` or `bearer`. See [the OpenAPI Spec](https://spec.openapis.org/oas/v3.1.0#security-scheme-object) for reference and the [@comake/openapi-operation-executor API docs](https://github.com/comake/openapi-operation-executor#api) for more information.

#### Return Value

Operations return [`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which resolve to different values depending on the type of API. OpenAPI operations will resolve to an [`AxiosResponse`](https://github.com/axios/axios#response-schema) object.

#### Example Usage

In Typescript:
```typescript
const axiosResponse = await standardSdk.ticketmaster.SearchEvents(
  { city: 'Atlanta' }, // args
  { apiKey: '<your ticketmaster api key>' }, // configuration
  { headers: { 'X-Origin-SDK': 'StandardSDK' } } // options
);
```

## [`standardSDKInstance.skl`](#standardsdkinstance-skl)

A [SKL JS Engine](https://www.npmjs.com/package/@comake/skl-js-engine) instance which is instantiated when the `sklEngineOptions` parameter is supplied when Standard SDK is built.

#### Example Usage

In Typescript:

```typescript
const skl = standardSdk.skl;
```

## [`standardSDKInstance.skl.verb`](#standardsdkinstance-skl-verb)

The [Verb](https://docs.standardknowledge.com/fundamentals#verbs) execution interface of the [SKL JS Engine](https://www.npmjs.com/package/@comake/skl-js-engine) instance accessed through Standard SDK.

#### Example Usage

In Typescript:

```typescript
const skl = standardSdk.skl.verb;
```

## [`standardSDKInstance.skl.verb.<verb>(args)`](#standardsdkinstance-skl-verb-verb)

Executes the verb called `<verb>` according to its Schema and related Mappings in the Schemas provided to the [SKL JS Engine](https://www.npmjs.com/package/@comake/skl-js-engine) instance via the `sklEngineOptions` parameter when building Standard SDK.

#### Parameters

| Parameter | Type | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| :--- | :--- | :--- |
| `args` | `object` | The arguments supplied to the Verb which should conform to the Verb's `parameters` field of the Verb's Schema. |

#### Return Value

Verbs executed using [SKL JS Engine](https://www.npmjs.com/package/@comake/skl-js-engine) return [`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which resolve to an [`AxiosResponse`](https://github.com/axios/axios#response-schema) object.

#### Example Usage

In Typescript:

```typescript
const response = standardSdk.skl.verb.getEvents({
  account: 'https://example.com/data/TicketmasterAccount',
  city: 'New York',
});
```