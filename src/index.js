import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import { PixabayAPI } from './js/pixabay-api';
import { refs } from './js/refs';
import { createCardMarkup } from './js/createCardMarkup';
const pixabay = new PixabayAPI();

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function handleSubmit(e) {
  e.preventDefault();

  const { searchQuery } = e.currentTarget.elements;
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    clearQuerry();

    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  pixabay.query = query;

  clearQuerry();

  pixabay
    .getPhotos()
    .then(({ hits, total }) => {
      if (hits.length === 0) {
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.
`);
        return;
      }

      const markup = createCardMarkup(hits);
      refs.gallery.insertAdjacentHTML('beforeend', markup);

      Notify.success(`Hooray! We found ${total} images.`);

      pixabay.calculateTotalPages(total);

      if (pixabay.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      Notify.failure(error.message, 'Щось пішло не так!');
      clearQuerry();
    });
}

function onLoadMoreBtnClick() {
  pixabay.incrementPage();

  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  pixabay
    .getPhotos()
    .then(({ hits, total }) => {
      const markup = createCardMarkup(hits);
      refs.gallery.insertAdjacentHTML('beforeend', markup);

      pixabay.calculateTotalPages(total);
    })
    .catch(error => {
      Notify.failure(error.message, 'Щось пішло не так!');
      clearPage();
    });
}

function clearQuerry() {
  pixabay.resetPage();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
