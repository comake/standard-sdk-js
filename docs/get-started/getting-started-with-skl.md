# Getting Started With SKL

As mentioned in the [Introduction](../README.md), SKL ([Standard Knowledge Language](https://docs.standardknowledge.com/)) can be used with Standard SDK to make it easier to interact with multiple similar APIs. Instead of writing custom code for the non-standard data formats of each API you want to integrate with, SKL enables you to use abstractions to build over a common model.

If you haven't already, review the [Conceptual Example](https://docs.standardknowledge.com/conceptual-example) of why and how a developer uses SKL.

## Install

To get started with Standard SDK and SKL in Node.js, install the module with npm or yarn:

```shell
npm install @comake/standard-sdk-js
```

or

```shell
yarn add @comake/standard-sdk-js
```

To use Standard SDK in a browser, you'll need to use a bundling tool such as Webpack, Rollup, Parcel, or Browserify. Some bundlers may require a bit of configuration, such as setting `browser: true` in rollup-plugin-resolve.

## Walkthrough

Lets assume we're building an events calendar web-app for the city we live in. On this calendar app, we want to display events listed on major public event ticketing platforms like Ticketmaster, Stubhub, & Seatgeek, etc. SKL is perfect for this task. With just a few Schemas, it dramatically reduces the amount code we would have to write to ingest event data from multiple APIs.

I order to build our system we have to:

1. **Define SKL [Schemas](https://docs.standardknowledge.com/fundamentals#schemas)** to abstract the data and operations we will be accessing from each API into a common data model.
2. **Use a [Standard Knowledge Language Engine (SKL Engine)](https://docs.standardknowledge.com/get-started/engine)** to read and execute our Schemas to perform the operations our app requires.
3. **Write code** to implement the application


## 1. Define SKL Schemas

As stated in the [SKL documentation](https://docs.standardknowledge.com/fundamentals#schemas):

> SKL is a schema validated and configuration driven framework. Standard Knowledge Schemas serve both as schema to ensure data conforms to specific structures, and configuration detailing what capabilities are possible and how those capabilities are performed. Schemas are made up of Nouns, Verbs, and Mappings:
> - Data is translated through Nouns.
> - Capabilities are represented by Verbs.
> - Mappings are used to relate Nouns and Verbs and translate between raw data and capabilities and Nouns and Verbs

In order to use SKL for our application, we need to create Schemas representing:

1. An abstraction of Events which data from each event ticketing platform will be mapped to. This is our primary [Noun](https://docs.standardknowledge.com/fundamentals#nouns). In this example, we use the Event data type from [schema.org](https://schema.org/Event).
2. An abstraction of the operation we want to perform with the API of each event ticketing platform. We want to get a list of events from each platform, filtered by only those in our city. We'll call this `getEvents`, it is a [Verb](https://docs.standardknowledge.com/fundamentals#verbs).
3. Rules defining how our Verb `getEvents` and its standardized parameters get mapped to the correct operation of each API and how the unique response of each API gets mapped into the standardized return value of the Verb. These are [Mappings](https://docs.standardknowledge.com/fundamentals#mappings).

Examples of these Schemas are available as JSON-LD in the [unified-events-api/skl-schemas](https://github.com/comake/skl-examples/tree/main/unified-events-api/skl-schemas) folder of the [SKL Examples](https://github.com/comake/skl-examples) repository. There you'll see the Event Noun in the [nouns.json](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/nouns.json) file, the `getEvents` Verb in the [verbs.json](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/verbs.json) file, the mappings in the [mappings.json](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/mappings.json) file, and entities needed for SKL to work in [entities.json](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/entities.json) 

### API Security Credentials

Most APIs require a sensitive access token or API key to make authenticated requests. SKL automatically reads these from a `Security Credentials` entity in your schemas. You can see an example of one in [entities.json](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/entities.json#L30-L33). You'll notice that the `apiKey` field is stubbed out with `ENV_TICKETMASTER_APIKEY`. This is because we don't want to put a real API key in the public repository on Github. When the example code is run, we swap out any string starting with the prefix `ENV_` with the value of the environment variable named the remainder of the stub, in this case `TICKETMASTER_APIKEY`. If your schemas are private, you can include the environment variables directly in the Schemas.

## 2. Use a SKL Engine

Now that we have schemas, we need to use an [SKL Engine](https://docs.standardknowledge.com/get-started/engine) to read and execute them according to our code. Standard SDK JS includes the [SKL JS Engine](https://github.com/comake/skl-js-engine) inside of it. This way, with only one dependency, you can use Standard SDK normally when creating abstractions is too hard for your circumstance or use case but have the power of SKL's abstractions to solve the majority of your needs.

Build Standard SDK using the `sklEngineOptions` argument. This argument is the same interface as the arguments to build [SKL JS Engine](https://github.com/comake/skl-js-engine).

In Typescript:
```typescript
const standardSdk = StandardSDK.build({
  sklEngineOptions: {
    type: 'memory',
    schemas: <yourSchemasHere>,
  },
});
```
If your schemas are separated across multiple files and/or use a JSON-LD `@context`, you should combine and frame them using a function like [`combineSchemas`](https://github.com/comake/skl-examples/blob/main/unified-events-api/src/Util.ts#L5) in the [SKL Examples](https://github.com/comake/skl-examples/blob/main/unified-events-api/src/Util.ts#L5) repository.

## 3. Write Code

Finally, you're ready to write some code using the Standard SDK instance you just built. Since we provided `sklEngineOptions` you can access the SKL JS Engine through `standardSdk.skl`.

In Typescript:
```typescript
const ticketmasterResponse = await standardSdk.skl.verb.getEvents({
  account: 'https://example.com/data/TicketmasterAccount',
  city: 'New York',
});

const stubhubResponse = await standardSdk.skl.verb.getEvents({
  account: 'https://example.com/data/StubhubAccount',
  city: 'New York',
});

const seatgeekResponse = await standardSdk.skl.verb.getEvents({
  account: 'https://example.com/data/SeatgeekAccount',
  city: 'New York',
});
```

This code will tell the SKL JS Engine to execute the `getEvents` Verb using each `account` represented by URIs (eg. `https://example.com/data/TicketmasterAccount`). In [entities.json](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/entities.json), which you copied or reviewed earlier, there are Schemas which contain the [OpenAPI specifications](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/entities.json#L42) and [security credentials](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/entities.json#L30) for each API. In [mappings.json](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/mappings.json), there are mappings which relate each [Integration](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/mappings.json#L38) with the [getEvents Verb](https://github.com/comake/skl-examples/blob/main/unified-events-api/skl-schemas/mappings.json#L39). Together, these entities and mappings inform the SKL JS Engine how to map the parameters of the `getEvents` Verb to the parameters of each API, send a properly formatted web request to the API, and map the response of the API into our standardized Event Noun.
