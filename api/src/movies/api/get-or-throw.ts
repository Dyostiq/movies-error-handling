import { Either, getOrElseW } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

export function getOrThrow<E, A>(res: Either<E, A>): never | A {
  return pipe(
    res,
    getOrElseW((e) => {
      throw e;
    }),
  );
}
