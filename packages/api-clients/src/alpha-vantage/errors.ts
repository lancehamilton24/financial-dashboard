export class AlphaVantageResponseError extends Error {
  constructor(notice: string) {
    const message = /rate|limit|frequency|request per second/i.test(notice)
      ? "Alpha Vantage's request limit has been reached. Please try again later."
      : /premium/i.test(notice)
        ? "Alpha Vantage requires premium access for this data with the configured API key."
        : "Alpha Vantage could not provide this data. Please check the provider configuration and try again.";
    super(message);
    this.name = "AlphaVantageResponseError";
  }
}
