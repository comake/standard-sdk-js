export type Tail<TL extends unknown[]> = TL extends readonly []
  ? TL
  : TL extends readonly [unknown?, ...infer T]
    ? T
    : TL;
