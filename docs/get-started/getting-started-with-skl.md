# Getting Started With SKL

As mentioned in the [Introduction](../README.md), SKL ([Standard Knowledge Language](https://docs.standardknowledge.com/)) can be used with Standard SDK to make it easier to interact with multiple similar APIs. Instead of writing custom code for the non-standard data formats of each API you want to integrate with, SKL enables you to use abstractions to build over a common model.

If you haven't already, review the [Conceptual Example](https://docs.standardknowledge.com/#conceptual-example) of why and how a developer uses SKL.

## Install

To get started with Standard SDK and SKL in Node.js, install the module with npm or yarn:

```shell
npm install @comake/standard-sdk
```

or

```shell
yarn add @comake/standard-sdk
```

To use Standard SDK in a browser, you'll need to use a bundling tool such as Webpack, Rollup, Parcel, or Browserify. Some bundlers may require a bit of configuration, such as setting `browser: true` in rollup-plugin-resolve.

## Walkthrough

Lets assume we're building an events calendar web-app for the village we live in. On this calendar app, we want to display events listed on major public event ticketing platforms like Ticketmaster, Stubhub, Eventbrite. SKL is perfect for this task. With just a few Schemas, it dramatically reduces the amount code we would have to write to ingest event data from multiple APIs.

I order to build our system we have to:

1. **Define SKL [Schemas](https://docs.standardknowledge.com/fundamentals#schemas)** to abstract the data and operations we will be accessing from each API into a common data model.
2. **Use a [Standard Knowledge Query Language Engine (SKQL Engine)](https://docs.standardknowledge.com/get-started/engine)** to read and execute our Schemas to perform the operations our app requires.
3. **Write code** to implement the application


## 1. Define SKL Schemas

As stated in the [SKL documentation](https://docs.standardknowledge.com/fundamentals#schemas):

> SKL is a schema validated and configuration driven framework. Standard Knowledge Schemas serve both as schema to ensure data conforms to specific structures, and configuration detailing what capabilities are possible and how those capabilities are performed. Schemas are made up of Nouns, Verbs, and Mappings:
> - Data is translated through Nouns.
> - Capabilities are represented by Verbs.
> - Mappings are used to relate Nouns and Verbs and translate between raw data and capabilities and Nouns and Verbs

In order to use SKL for our application, we need to create Schemas representing:

1. An abstraction of Events which data from each event ticketing platform will be mapped to. This is our primary [Noun](https://docs.standardknowledge.com/fundamentals#nouns).
2. An abstraction of the operation we want to perform with the API of each event ticketing platform. We want to get a list of events from each platform, filtered by only those in our town. We'll call this `getEvents`, it is a [Verb](https://docs.standardknowledge.com/fundamentals#verbs).
3. Rules defining how our Verb `getEvents` and its standardized parameters get mapped to the correct operation of each API and how the unique response of each API gets mapped into the standardized return value of the Verb. These are [Mappings](https://docs.standardknowledge.com/fundamentals#mappings).

Implementations of these Schemas are available as JSON-LD in the ___ of the StandardSDK examples repo. There you'll see the Event Noun in the [nouns.json]() file, the `getEvents` Verb in the [verbs.json]() file, and the mappings in the [mappings.json]() file.

## 2. Use a SKQL Engine

TODO

## 3. Write Code

TODO

<!-- standardSDK.skql.do.getEvents(); -->

