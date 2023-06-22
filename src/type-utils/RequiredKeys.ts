export type RequiredKeysHidden<T extends object> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T];

export type RequiredKeys<T extends object> =
T extends unknown
  ? RequiredKeysHidden<T>
  : never;
