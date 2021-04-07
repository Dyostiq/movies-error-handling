export class ApplicationError<T extends string> extends Error {
  constructor(public readonly message: T) {
    super(message);
  }
}
