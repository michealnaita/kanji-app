export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export const formatErrorMessage = (s: string) =>
  s.replace('-', ' ').replace(/auth\/|firestore\//, '');
