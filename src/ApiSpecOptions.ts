import type { OpenApiSpecOptions } from './openapi-types/OpenApiSpecOptions';

export type ApiSpecType = 'openapi';

export type ApiSpecOptions = OpenApiSpecOptions;

export type ApiSpecs = Record<string, ApiSpecOptions>;
