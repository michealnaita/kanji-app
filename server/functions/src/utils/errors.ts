export class InternalServerError extends Error {
  statusCode: number = 500;
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}
export class BadRequestError extends Error {
  statusCode: number = 400;
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}
