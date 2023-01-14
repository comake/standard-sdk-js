# Introduction

Standard SDK is an open source software package that provides you with a single [SDK](https://en.wikipedia.org/wiki/Software\_development\_kit) to integrate and interact with any API. It vastly simplifies developer experience when building applications, especially ones which require interaction with multiple external APIs.

Developers commonly spent lots of time installing SDKs, reading documentation, and figuring out how to use each SDK to build integrations using APIs and to add features to their application (eg. the [Google API Node Client](https://www.npmjs.com/package/googleapis), the [Node Slack SDK](https://slack.dev/node-slack-sdk/), etc.). Instead of going through this time consuming process installing and learning many different SDKs, a developer can just install Standard SDK to build any integration their application requires. In addition to saving time, removing dependencies on all those SDKs in favor of just one can reduce your application's build size, and make it easier to onboard developers to your codebase.

### How it works

Standard SDK is powered by open source standardized API specifications like [OpenAPI](https://www.openapis.org/). Once you provide specifications for the APIs you want your application to integrate with, you can use Standard SDK to send properly formatted web requests, RPC messages, SQL queries, etc. to those APIs. The API specifications which Standard SDK works with or is planning to add support for include:

* [OpenAPI](https://www.openapis.org/) Specifications for REST APIs
* (Coming soon) [GraphQL Schemas](https://graphql.org/learn/schema/) for GraphQL APIs [Upvote the issue](https://github.com/comake/standard-sdk-js/issues/5)
* (Coming soon) [OpenRPC](https://open-rpc.org/) for RPC APIs [Upvote the Issue](https://github.com/comake/standard-sdk-js/issues/6)
* (Coming soon) [AsyncAPI](https://www.asyncapi.com/) for Asynchronous/Event Driven APIs [Upvote the Issue](https://github.com/comake/standard-sdk-js/issues/7)
* (Longer term roadmap) SQL Interfaces

There are multiple ways to provide API specifications to Standard SDK:

1. As a file path (either a single file or a folder holding multiple API specifications)
2. As a variable (string or json object)
3. From a [Standard Knowledge Language](https://docs.standardknowledge.com/) (SKL) schema source

To start building integrations using Standard SDK now, see [Quick Start](get-started/quick-start.md). Alternatively, read on to learn about how Standard SDK and Standard Knowledge Language can be used in combination to integrate with capabilities and data types across many APIs.

### Standard Knowledge Language

Although Standard SDK makes it easier to send properly formatted web requests to APIs, developers still have to be familiar with the unique data formats and capabilities of each API they use and how to transform those into the data formats and features of their application. This is not a trivial task, especially as the number of integrations they need increases.

Standard Knowledge Language (SKL) defines a protocol for interacting with non-standard data formats and APIs through standard abstractions of data and capabilities. If you haven't already, you may want to read the [Standard Knowledge Language Overview](https://docs.standardknowledge.com/) before moving ahead.

SKL enables developers to use abstractions such as an ontology or common models to facilitate interactions with multiple similar APIs. Rather than having to write custom code for each API, a developer using a Standard SDK can build over a common model that can then interact with multiple APIs. See [Getting Started With SKL](get-started/getting-started-with-skl.md) to learn more.
