import axios from 'axios';

export class SearchQuery {
  static #URL = 'https://pixabay.com/api/';
  static #API_KEY = '35178730-35412664985809edebeff8fc3';

  constructor() {
    this.page = 1;
    this.per_page = 40;
  }

  async onQuerySearch(query) {
    const params = new URLSearchParams({
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.per_page,
      page: this.page,
    });

    const end_point = `${SearchQuery.#URL}?key=${
      SearchQuery.#API_KEY
    }&${params}`;

    let response = await axios.get(end_point);
      return response.data;
  }
}
