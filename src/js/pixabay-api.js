export class PixabayAPI {
  #PIXABAY_KEY = '26725186-0eb3948d92fc479f1d029e31a';
  #BASE_URL = 'https://pixabay.com/api/';
  #query = '';
  #page = 1;
  #perPage = 40;
  #totalPages = 0;

  getPhotos() {
    const url = `${this.#BASE_URL}?key=${this.#PIXABAY_KEY}&q=${
      this.#query
    }&page=${this.#page}&per_page=${
      this.#perPage
    }&image_type=photo&orientation=horizotal&safesearch=true`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
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
