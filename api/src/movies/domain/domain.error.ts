export class DomainError<T extends string> extends Error {
  constructor(public readonly message: T) {
    super(message);
  }
}
