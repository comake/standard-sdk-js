import type { Pop } from './Pop';

type RecSplit<
  TS extends string,
  TD extends string = '',
  TR extends string[] = [],
> = TS extends `${infer BS}${TD}${infer AS}`
  ? RecSplit<AS, TD, [...TR, BS]>
  : [...TR, TS];

export type Split<
  TS extends string,
  TD extends string = '',
  TR extends string[] = RecSplit<TS, TD>,
> = TD extends '' ? Pop<TR> : TR;
