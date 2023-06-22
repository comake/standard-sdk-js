/* eslint-disable no-unused-expressions */
import type { A, O } from 'ts-toolbelt';
import type { OpenApiClientConfigurationTypes } from '../../src/openapi-types/OpenApiConfigurationTypes';
import type { OpenApiSecuritySchemesToTypes } from '../../src/openapi-types/OpenApiOperationNamespace';

const openApi = {
  openapi: '3.1.0',
  info: { title: 'Example', version: '1.0.0' },
  paths: {},
  components: {
    securitySchemes: {
      bearer: {
        type: 'http',
        scheme: 'bearer',
      },
      basic: {
        type: 'http',
        scheme: 'basic',
      },
      apikey: {
        type: 'apiKey',
        name: 'key',
        in: 'query',
      },
      oauth: {
        type: 'oauth2',
        flows: {},
      },
    },
  },
} as const;

const operation = {
  operationId: 'GetOperation',
  responses: {},
} as const;

const openApiWithBearerSecurity = {
  ...openApi,
  paths: {
    '/path/to/operation': {
      get: {
        ...operation,
        security: [{ bearer: []}],
      },
    },
  },
} as const;

const openApiWithBasicSecurity = {
  ...openApi,
  paths: {
    '/path/to/operation': {
      get: {
        ...operation,
        security: [{ basic: []}],
      },
    },
  },
} as const;

const openApiWithApiKeySecurity = {
  ...openApi,
  paths: {
    '/path/to/operation': {
      get: {
        ...operation,
        security: [{ apikey: []}],
      },
    },
  },
} as const;

const openApiWithOauthSecurity = {
  ...openApi,
  paths: {
    '/path/to/operation': {
      get: {
        ...operation,
        security: [{ oauth: []}],
      },
    },
  },
} as const;

const openApiWithMultiSecurity = {
  ...openApi,
  paths: {
    '/path/to/operation': {
      get: {
        ...operation,
        security: [{
          apikey: [],
          bearer: [],
        }],
      },
    },
  },
} as const;

type SecurityTypes = OpenApiSecuritySchemesToTypes<typeof openApi>;

type Config1 = OpenApiClientConfigurationTypes<
  typeof openApiWithBearerSecurity,
  'GetOperation',
  SecurityTypes
>;
type ExpectedConfig1 = {
  bearerToken: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  [key: string]: undefined
  | string
  | Promise<string>
  | ((name: string) => string)
  | ((name: string) => Promise<string>);
  apiKey?: string
  | Promise<string>
  | ((name: string) => string)
  | ((name: string) => Promise<string>);
  username?: string;
  password?: string;
  accessToken?:
  | string
  | Promise<string>
  | ((name?: string, scopes?: readonly string[]) => string)
  | ((name?: string, scopes?: readonly string[]) => Promise<string>);
  basePath?: string;
  baseOptions?: any;
};
const assertConfigFromBearerSecurityRequirement: A.Equals<Config1, ExpectedConfig1> = 1;
assertConfigFromBearerSecurityRequirement;

type Config2 = OpenApiClientConfigurationTypes<
  typeof openApiWithBasicSecurity,
  'GetOperation',
  SecurityTypes
>;
type ExpectedConfig2 = {
  username: string | undefined;
  password: string | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  [key: string]: undefined
  | string
  | Promise<string>
  | ((name: string) => string)
  | ((name: string) => Promise<string>);
  apiKey?: string
  | Promise<string>
  | ((name: string) => string)
  | ((name: string) => Promise<string>);
  accessToken?: string | Promise<string>
  | ((name?: string, scopes?: readonly string[]) => string)
  | ((name?: string, scopes?: readonly string[]) => Promise<string>);
  basePath?: string;
  baseOptions?: any;
};
const assertConfigFromBasicSecurityRequirement: A.Equals<Config2, ExpectedConfig2> = 1;
assertConfigFromBasicSecurityRequirement;

type Config3 = OpenApiClientConfigurationTypes<
  typeof openApiWithApiKeySecurity,
  'GetOperation',
  SecurityTypes
>;
type ExpectedConfig3 = {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  // eslint-disable-next-line max-len
  apiKey: (string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined) & (string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>));
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
} | {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
  key: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);
};
const assertConfigFromApiKeySecurityRequirement: keyof O.Diff<Config3, ExpectedConfig3> extends never ? 1 : 0 = 1;
assertConfigFromApiKeySecurityRequirement;

type Config4 = OpenApiClientConfigurationTypes<
  typeof openApiWithOauthSecurity,
  'GetOperation',
  SecurityTypes
>;
type ExpectedConfig4 = {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
};
const assertConfigFromOauthSecurityRequirement: A.Equals<Config4, ExpectedConfig4> = 1;
assertConfigFromOauthSecurityRequirement;

type Config5 = OpenApiClientConfigurationTypes<
  typeof openApiWithMultiSecurity,
  'GetOperation',
  SecurityTypes
>;
type ExpectedConfig5 = {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  // eslint-disable-next-line max-len
  apiKey: (string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined) & (string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>));
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
} | {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
  key: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);
};
const assertConfigFromMultiSecurityRequirement: keyof O.Diff<Config5, ExpectedConfig5> extends never ? 1 : 0 = 1;
assertConfigFromMultiSecurityRequirement;

type Config6 = OpenApiClientConfigurationTypes<
  typeof openApiWithBearerSecurity,
  'GetOperation',
  SecurityTypes,
  { bearerToken: string }
>;
type ExpectedConfig6 = {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
};
const assertConfigFromBearerSecurityRequirementWithDefault: A.Equals<Config6, ExpectedConfig6> = 1;
assertConfigFromBearerSecurityRequirementWithDefault;

type Config7 = OpenApiClientConfigurationTypes<
  typeof openApiWithBasicSecurity,
  'GetOperation',
  SecurityTypes,
  { username: string }
>;
type ExpectedConfig7 = {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  username?: string | undefined;
  password: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
};
const assertConfigFromBasicSecurityRequirementWithDefault: A.Equals<Config7, ExpectedConfig7> = 1;
assertConfigFromBasicSecurityRequirementWithDefault;

type Config8 = OpenApiClientConfigurationTypes<
  typeof openApiWithApiKeySecurity,
  'GetOperation',
  SecurityTypes,
  { key: 'abc123' }
>;
type ExpectedConfig8 = {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  // eslint-disable-next-line max-len
  apiKey: (string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined) & ((string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined) & (string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>)));
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
} | {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  // eslint-disable-next-line max-len
  apiKey?: (string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined) & ((string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined) & (string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>)));
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
  key: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);
};
// eslint-disable-next-line max-len
const assertConfigFromApiKeySecurityRequirementWithDefault: keyof O.Diff<Config8, ExpectedConfig8> extends never ? 1 : 0 = 1;
assertConfigFromApiKeySecurityRequirementWithDefault;

type Config9 = OpenApiClientConfigurationTypes<
  typeof openApiWithOauthSecurity,
  'GetOperation',
  SecurityTypes,
  { accessToken: string }
>;
type ExpectedConfig9 = {
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
};
const assertConfigFromOauthSecurityRequirementWithDefault: A.Equals<Config9, ExpectedConfig9> = 1;
assertConfigFromOauthSecurityRequirementWithDefault;

type Config10 = OpenApiClientConfigurationTypes<
  typeof openApiWithMultiSecurity,
  'GetOperation',
  SecurityTypes,
  { bearerToken: string }
>;
type ExpectedConfig10 = {
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  apiKey: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
} | {
  bearerToken?: string | Promise<string> | (() => string) | (() => Promise<string>) | undefined;
  apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  key: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>);
  [x: string]: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
  username?: string | undefined;
  password?: string | undefined;
  // eslint-disable-next-line max-len
  accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: readonly string[] | undefined) => string) | ((name?: string | undefined, scopes?: readonly string[] | undefined) => Promise<string>) | undefined;
  basePath?: string | undefined;
  baseOptions?: any;
};
// eslint-disable-next-line max-len
const assertConfigFromMultiSecurityRequirementWithDefault: keyof O.Diff<Config10, ExpectedConfig10> extends never ? 1 : 0 = 1;
assertConfigFromMultiSecurityRequirementWithDefault;
