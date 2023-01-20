// eslint-disable-next-line @typescript-eslint/ban-types
export type Merged<T> = {} & {[P in keyof T]: T[P] };
