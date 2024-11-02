export class Api
{
  static url(): string
  {
    return process.env["REACT_APP_API_URL"]!;
  }
}