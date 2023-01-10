# Contributing

Thank you for taking the time to contribute! 🎉👍

The following is a set of guidelines for contributing to Standard SDK JS, which is hosted in the Comake Organization on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

Please read our [Code of Conduct](https://github.com/comake/standard-sdk-js/blob/main/CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

To get an overview of the project, read the [README](./README.md). 

The repository is available at [https://github.com/comake/standard-sdk-js](https://github.com/comake/standard-sdk-js)

## Pull Requests

All changes should be done through [Pull Requests](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

We recommend first searching for existing [Issues](https://github.com/comake/standard-sdk-js/issues) related to your problem. If one does not exist, create a new [Issue](https://github.com/comake/standard-sdk-js/issues) to discuss a possible solution to reduce the amount of changes that will be requested.

After coming to consensus with maintainers, create a [Fork](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork) of the repo and implement your code changes and test.  

In case any of your changes are breaking, make sure you target the next major branch (`versions/x.0.0`) instead of the `main` branch. Breaking changes include: changing interface/class signatures, potentially breaking external custom configurations, and breaking how internal data is stored. In case of doubt you probably want to target the next major branch.

## Writing Code

Standard SDK JS is fully written in [Typescript](https://www.typescriptlang.org/docs/home.html). 

We make use of [Conventional Commits](https://www.conventionalcommits.org/) .

We use [Husky](https://typicode.github.io/husky/#/) to enforce strict requirements from the [linter](https://eslint.org/) and the [test coverage](https://jestjs.io/docs/configuration#coveragethreshold-object) before a PR is valid. These are configured to run automatically when trying to commit to git.

If a list of entries is alphabetically sorted, such as [index.ts](https://github.com/comake/standard-sdk-js/blob/main/src/index.ts), make sure it stays that way.

## Testing

As mentioned above, tests run automatically when trying to commit to git. You should add or update [unit tests](https://github.com/comake/standard-sdk-js/tree/main/test/unit) for any code that you add or change. If you are building a feature, please also add relevant [integration tests](https://github.com/comake/standard-sdk-js/tree/main/test/integration)

To run tests manually, use:

```
npm run test
```

or to only run tests in a specific file, use:

```
npm run test ./test/unit/path/to/test.ts
```
