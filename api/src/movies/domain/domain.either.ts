import { Either } from 'fp-ts/Either';
import { DomainError } from './domain.error';

export type DomainEither<L extends string, R> = Either<DomainError<L>, R>;
