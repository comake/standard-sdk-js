# API Reference

## [`StandardSDK.build(options)`](#standardsdkbuildoptions)

Instantiates a Standard SDK with your APIs of choice.

#### Parameters

The `build` method takes one argument which may have either or both of `apiSpecs` and `skqlOptions`.

| Parameter | Type | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| :--- | :--- | :--- |
| `apiSpecs` | `object` | A hash of `ApiSpecOptions` objects. Describes the API specs for StandardSDK to construct namespaced operations from. |
| `skqlOptions` | `object` | An `SkqlOptions` object as defined by [@comake/skql-js-engine](https://www.npmjs.com/package/@comake/skql-js-engine) |

#### ApiSpecOptions

`ApiSpecOptions` are the configurations you pass when building a Standard SDK for the APIs you want to work with. Different types of APIs have their own specific options. Currently we only support OpenAPI specs.

**Common ApiSpecOptions fields**

- `type` - A type of API specification. Possible values are: `openapi`
- `value` - The contents of the API specification. Usually a string or JSON object.

#### Return Value

A `StandardSDK` instance with a namespace for each key in `apiSpecs`, if supplied. May also have an `skql` property if `skqlOptions` was supplied.

#### Example Usage

In Typescript:
```typescript
import ticketmasterOpenApiSpec from './path/to/ticketmaster-openapi-spec.json';

const standardSdk = StandardSDK.build({
  apiSpecs: {
    ticketmaster: {
      type: 'openapi',
      value: ticketmasterOpenApiSpec,
    },
  },
});
```

## [`standardSDKInstance.<namespace>`](#standardsdkinstancenamespace)

A namespace of a `StandardSDK` instance corresponding to a set of supplied Api Spec Options. Has properties for each operation in the supplied API specification.

#### Example Usage
In Typescript:
```typescript
const sdkNamespace = standardSdk.ticketmaster;
```

## [`standardSDKInstance.<namespace>.<operation>(args, configuration, options)`](#standardsdkinstancenamespaceoperationargs-configuration-options)

Executes the API operation called `<operation>` according to the API specification corresponding to the namespace `<namespace>`.

#### Parameters

All parameters are not required.

| Parameter | Type | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| :--- | :--- | :--- |
| `args` | `object` | Arguments for the operation as defined by the API specification. For example, an operation in an OpenAPI spec has either a `requestBody` or a `parameters` field. StandardSDK will read these fields and construct and send a web request with the data from `args` in the correct parts of the request. |
| `configuration` | `object` | An object holding any configuration necessary for the operation. Most often this includes security credentials. For example, for an OpenAPI operation `configuration` may include an `apiKey` or `accessToken` to satisfy the [Security Requirement](https://spec.openapis.org/oas/v3.1.0#securityRequirementObject) of the operation. See note below for more information. |
| `options` | `object` | An object holding any options to supply to the operation execution module to modfy default behaviors the request or message sent for the operation. For OpenAPI operations, this is an `AxiosRequestConfig` object. See the [axios API documentation](https://github.com/axios/axios#request-config) for reference. |

⚠️ StandardSDK uses the [@comake/openapi-operation-executor](https://www.npmjs.com/package/@comake/openapi-operation-executor) package to execute OpenAPI operations. This library currently supports OpenAPI security types `oauth2`, `apiKey`, and `http` with scheme `basic`. See [the OpenAPI Spec](https://spec.openapis.org/oas/v3.1.0#security-scheme-object) for reference and the [@comake/openapi-operation-executor API docs](https://github.com/comake/openapi-operation-executor#api) for more information.

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

## [`standardSDKInstance.skql`](#standardsdkinstanceskql)

A [SKQL JS Engine](https://www.npmjs.com/package/@comake/skql-js-engine) instance which is instantiated when the `skqlOptions` parameter is supplied when Standard SDK is built.

#### Example Usage

In Typescript:

```typescript
const skql = standardSdk.skql;
```

## [`standardSDKInstance.skql.do`](#standardsdkinstanceskqldo)

The [Verb](https://docs.standardknowledge.com/fundamentals#verbs) execution interface of the [SKQL JS Engine](https://www.npmjs.com/package/@comake/skql-js-engine) instance accessed through Standard SDK.

#### Example Usage

In Typescript:

```typescript
const skql = standardSdk.skql.do;
```

## [`standardSDKInstance.skql.do.<verb>(args)`](#standardsdkinstanceskqldoverb)

Executes the verb called `<verb>` according to its Schema and related Mappings in the Schemas provided to the [SKQL JS Engine](https://www.npmjs.com/package/@comake/skql-js-engine) instance via the `skqlOptions` parameter when building Standard SDK.

#### Parameters

| Parameter | Type | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| :--- | :--- | :--- |
| `args` | `object` | The arguments supplied to the Verb which should conform to the Verb's `parameters` field of the Verb's Schema. |

#### Return Value

Verbs executed using [SKQL JS Engine](https://www.npmjs.com/package/@comake/skql-js-engine) return [`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which resolve to an [`AxiosResponse`](https://github.com/axios/axios#response-schema) object.

#### Example Usage

In Typescript:

```typescript
const response = standardSdk.skql.do.getEvents({
  account: 'https://example.com/data/TicketmasterAccount',
  city: 'New York',
});
```