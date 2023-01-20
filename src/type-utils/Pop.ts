export type Pop<T extends unknown[]> = T extends
| readonly [...infer TBody, unknown]
| readonly [...infer TBody, unknown?]
  ? TBody
  : T;
