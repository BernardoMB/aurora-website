export type Freezed<T> = T extends (infer R)[]
  ? FreezedArr<R>
  : T extends Function
  ? T
  : T extends object
  ? FreezedObj<T>
  : T;

export interface FreezedArr<T> extends ReadonlyArray<Freezed<T>> {}

export type FreezedObj<T> = {
  readonly [P in keyof T]: Freezed<T[P]>;
};
