export class APIError extends Error {
  public data?: any;

  constructor(message?: string, data?: any) {
    super(message);
    this.name = 'API_ERROR';
    this.data = data;
  }
}
