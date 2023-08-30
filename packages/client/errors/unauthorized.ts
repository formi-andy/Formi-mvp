export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super();

    this.name = "Unauthorized";
    this.statusCode = 401;
    this.message = message || "Unauthorized";
  }
}
