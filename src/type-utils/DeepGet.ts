export type DeepGet<TO, TP extends string[], TD = undefined> = TP extends [
  infer H,
  ...infer T,
]
  // eslint-disable-next-line unicorn/expiring-todo-comments
  // TODO increase TS version and use "extends" in Array https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#improved-inference-for-infer-types-in-template-string-types
  ? H extends string
    ? T extends string[]
      ? H extends keyof TO
        ? DeepGet<TO[H], T, TD>
        : TD
      : never
    : never
  : TO;
