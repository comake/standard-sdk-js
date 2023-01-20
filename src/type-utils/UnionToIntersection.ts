export type UnionToIntersection<T> = (
  T extends never ? never : (arg: T) => never
) extends (arg: infer I) => void
  ? I
  : never;
