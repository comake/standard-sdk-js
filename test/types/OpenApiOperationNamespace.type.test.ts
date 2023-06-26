/* eslint-disable no-unused-expressions */
import type { OpenApiClientConfiguration } from '@comake/openapi-operation-executor';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { A } from 'ts-toolbelt';
import type { OpenApiOperationNamespace } from '../../src/openapi-types/OpenApiOperationNamespace';

const stringifiedOpenApiSpec = '{ openapi: \'3.1.0\' }';

type Args1 = OpenApiOperationNamespace<typeof stringifiedOpenApiSpec>;
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type ExpectedArgs1 = {
  [k: string]: (
    args?: Record<string, any>,
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>;
};
const assertArgsFromStringifiedOpenApi: A.Equals<Args1, ExpectedArgs1> = 1;
assertArgsFromStringifiedOpenApi;

const openApiWithOperationWithoutArgs = {
  openapi: '3.1.0',
  info: { title: 'Example', version: '1.0.0' },
  paths: {
    '/path/to/operation': {
      get: {
        operationId: 'GetOperation',
        responses: {},
      },
    },
  },
} as const;

type Args2 = OpenApiOperationNamespace<typeof openApiWithOperationWithoutArgs>;
type ExpectedArgs2 = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GetOperation: (
    args?: Record<string, any>,
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>;
};
const assertArgsFromOpenApiWithOperationWithNoParameters: A.Equals<Args2, ExpectedArgs2> = 1;
assertArgsFromOpenApiWithOperationWithNoParameters;

const openApiWithOperationWithOptionalArgs = {
  openapi: '3.1.0',
  info: { title: 'Example', version: '1.0.0' },
  paths: {
    '/path/to/operation': {
      get: {
        operationId: 'GetOperation',
        parameters: [
          {
            name: 'fields',
            in: 'query',
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        ],
        responses: {},
      },
    },
  },
} as const;

type Args3 = OpenApiOperationNamespace<typeof openApiWithOperationWithOptionalArgs>;
type ExpectedArgs3 = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GetOperation: (
    args?: {
      fields?: string[] | undefined;
    },
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>;
};
const assertArgsFromOpenApiWithOperationWithOptionalParameters: A.Equals<Args3, ExpectedArgs3> = 1;
assertArgsFromOpenApiWithOperationWithOptionalParameters;

const openApiWithOperationWithRequiredArgs = {
  openapi: '3.1.0',
  info: { title: 'Example', version: '1.0.0' },
  paths: {
    '/path/to/operation': {
      get: {
        operationId: 'GetOperation',
        parameters: [
          {
            name: 'query',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {},
      },
    },
  },
} as const;

type Args4 = OpenApiOperationNamespace<typeof openApiWithOperationWithRequiredArgs>;
type ExpectedArgs4 = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GetOperation: (
    args: {
      query: string;
    },
    configuration?: OpenApiClientConfiguration,
    options?: AxiosRequestConfig
  ) => Promise<AxiosResponse>;
};
const assertArgsFromOpenApiWithOperationWithRequiredParameters: A.Equals<Args4, ExpectedArgs4> = 1;
assertArgsFromOpenApiWithOperationWithRequiredParameters;
