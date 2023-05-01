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
export const formatErrorMessage = (s: string) => {
  const message = s.replaceAll('-', ' ').replaceAll(/auth\/|firestore\//, '');
  return message.slice(0, 1).toUpperCase() + message.slice(1);
};
