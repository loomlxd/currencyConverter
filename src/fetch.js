const BASE_URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api`;

export default class Fetch {
  constructor() {}

  async takeCurrency(cur) {
    const response = await fetch(
      `${BASE_URL}@latest/v1/currencies/${cur}.json`
    );
    const data = await response.json();

    return data;
  }

  async takeAllCurrencies() {
    const responce = await fetch(`${BASE_URL}@latest/v1/currencies.json`);
    const data = await responce.json();

    return data;
  }
}
