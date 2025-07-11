const BASE_URL = process.env.API_KEY;

export default class HttpClient {
  async getCurrency(cur) {
    try {
      const response = await fetch(
        `${BASE_URL}@latest/v1/currencies/${cur}.json`
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllCurrencies() {
    try {
      const response = await fetch(`${BASE_URL}@latest/v1/currencies.json`);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
