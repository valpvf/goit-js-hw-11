import axios, { Axios } from 'axios';

export class SearchQuery {
  static #URL = 'https://pixabay.com/api/';
  static #API_KEY = '35178730-35412664985809edebeff8fc3';

  static onQuerySearch(query) {
    const params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });

    const end_point = `${SearchQuery.#URL}?key=${
      SearchQuery.#API_KEY
    }&q=${query}`;

    return axios
      .get(end_point, params)
      .then(function (response) {
        return response.data.hits;
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }
}
