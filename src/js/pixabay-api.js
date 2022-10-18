import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export class PixabayAPI {
  #PIXABAY_KEY = '26725186-0eb3948d92fc479f1d029e31a';
  #query = '';
  #page = 1;
  #perPage = 40;
  #totalPages = 0;

  async getPhotos() {
    const url = `?key=${this.#PIXABAY_KEY}&q=${this.#query}&page=${
      this.#page
    }&per_page=${
      this.#perPage
    }&image_type=photo&orientation=horizontal&safesearch=true`;

    const { data } = await axios.get(url);
    return data;
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  incrementPage() {
    this.#page += 1;
  }

  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }

  resetPage() {
    this.#page = 1;
  }
}
