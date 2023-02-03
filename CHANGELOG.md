# Changelog

All notable changes to this project will be documented in this file.

## 2.0.0 (2-3-2023)

## Changed

- Refactor: Replace skql-js-engine with skl-js-engine ([794dd9b](https://github.com/comake/standard-sdk-js/commit/794dd9bbf417a629e3b3a8ae9e48579cd72b3527))
- Refactor: Rename skql to skl ([794dd9b](https://github.com/comake/standard-sdk-js/commit/794dd9bbf417a629e3b3a8ae9e48579cd72b3527))

## 1.3.0 (1-24-2023)

### Features

- Adds properties from `requestBody` fields that are media type `application/json` to the typing of the `args` parameter of operation functions ([6016c52](https://github.com/comake/standard-sdk-js/pull/16/commits/6016c527a59532548e07e7ad4b4baae385261646))

## 1.2.0 (1-19-2023)

### Features

- Added Typescript typing to the `args` argument of operations in an API namespace when OpenAPI specs are provided as Javascript objects ([b3f0053](https://github.com/comake/standard-sdk-js/pull/14/commits/b3f00539269c83936b7be8472663e357911e5438))

## 1.1.0 (1-18-2023)

### Features

- Added typescript autocompletion of possible operations in an API namespace when OpenAPI specs are provided as Javascript objects ([23b5892](https://github.com/comake/standard-sdk-js/pull/12/commits/23b5892d8f9a069a1e96702e89aaa017a372bde5))

## 1.0.0 (01-12-2023)

### Features

- Ability to supply `apiSpecs` to use a namespaced api operation interface
- Ability to supply `skqlOptions` to use skql through Standard SDK

### Documentation
 
- Added a changelog
- Added release notes