/* eslint-disable no-unused-expressions */
import type { A } from 'ts-toolbelt';
import type { OpenApiArgTypes } from '../../src/openapi-types/OpenApiArgTypes';

const openApiWithOperationParameters = {
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

type Args1 = OpenApiArgTypes<typeof openApiWithOperationParameters, 'GetOperation'>;
type ExpectedArgs1 = {
  query: string;
  fields?: string[] | undefined;
};
const assertArgsFromOperationParameters: A.Equals<Args1, ExpectedArgs1> = 1;
assertArgsFromOperationParameters;

const openApiWithPathItemParameters = {
  openapi: '3.1.0',
  info: { title: 'Example', version: '1.0.0' },
  paths: {
    '/path/to/operation': {
      get: {
        operationId: 'GetOperation',
        responses: {},
      },
      parameters: [
        {
          name: 'query',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
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
    },
  },
} as const;

type Args2 = OpenApiArgTypes<typeof openApiWithPathItemParameters, 'GetOperation'>;
type ExpectedArgs2 = {
  query: string;
  fields?: string[] | undefined;
};
const assertArgsFromPathItemParameters: A.Equals<Args2, ExpectedArgs2> = 1;
assertArgsFromPathItemParameters;

const openApiWithOperationRequestBody = {
  openapi: '3.1.0',
  info: { title: 'Example', version: '1.0.0' },
  paths: {
    '/path/to/operation': {
      get: {
        operationId: 'GetOperation',
        responses: {},
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                  },
                  fields: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                },
                required: [ 'query' ],
              },
            },
          },
        },
      },
    },
  },
} as const;

type Args3 = OpenApiArgTypes<typeof openApiWithOperationRequestBody, 'GetOperation'>;
type ExpectedArgs3 = {
  [x: string]: unknown;
  query: string;
  fields?: string[] | undefined;
};
const assertArgsFromRequestBody: A.Equals<Args3, ExpectedArgs3> = 1;
assertArgsFromRequestBody;
