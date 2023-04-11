import axios from 'axios';

export class SearchQuery {
  static #URL = 'https://pixabay.com/api/';
  static #API_KEY = '35178730-35412664985809edebeff8fc3';

  static onQuerySearch(query, page) {
    const params = new URLSearchParams({
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page,
    });

    const end_point = `${SearchQuery.#URL}?key=${
      SearchQuery.#API_KEY
    }&${params}`;

    return axios.get(end_point).then(function (response) {
      return response.data;
    });
  }
}
