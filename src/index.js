import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import { PixabayAPI } from './js/pixabay-api';
import { refs } from './js/refs';
import { createCardMarkup } from './js/createCardMarkup';
import axios from 'axios';

const options = {
  captionDelay: 250,
  captionsData: 'alt',
};
const pixabay = new PixabayAPI();
const lightbox = new SimpleLightbox('.gallery a', options);

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function handleSubmit(e) {
  e.preventDefault();

  const { searchQuery } = e.currentTarget.elements;
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    // clearQuerry();

    Notify.failure('Enter a search query!');
    return;
  }
  pixabay.query = query;

  clearQuerry();

  try {
    const { hits, total } = await pixabay.getPhotos();
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
    lightbox.refresh();
  } catch ({ message }) {
    Notify.failure(message);
    clearQuerry();
  }

  //   pixabay
  //     .getPhotos()
  //     .then(({ hits, total }) => {
  //       if (hits.length === 0) {
  //         Notify.failure(`Sorry, there are no images matching your search query. Please try again.
  // `);
  //         return;
  //       }

  //       const markup = createCardMarkup(hits);
  //       refs.gallery.insertAdjacentHTML('beforeend', markup);

  //       Notify.success(`Hooray! We found ${total} images.`);

  //       pixabay.calculateTotalPages(total);

  //       if (pixabay.isShowLoadMore) {
  //         refs.loadMoreBtn.classList.remove('is-hidden');
  //       }
  //       lightbox.refresh();
  //     })
  // .catch(error => {
  //   Notify.failure(error.message, 'Щось пішло не так!');
  //   clearQuerry();
  // });
}

async function onLoadMoreBtnClick() {
  pixabay.incrementPage();

  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  try {
    const { hits } = await pixabay.getPhotos();
    const markup = createCardMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    lightbox.refresh();
  } catch ({ message }) {
    Notify.failure(message);
    clearQuerry();
  }

  // pixabay
  //   .getPhotos()
  //   .then(({ hits }) => {
  //     const markup = createCardMarkup(hits);
  //     refs.gallery.insertAdjacentHTML('beforeend', markup);

  //     const { height: cardHeight } = document
  //       .querySelector('.gallery')
  //       .firstElementChild.getBoundingClientRect();

  //     window.scrollBy({
  //       top: cardHeight * 2,
  //       behavior: 'smooth',
  //     });

  //     lightbox.refresh();
  //   })
  // .catch(error => {
  //   Notify.failure(error.message, 'Щось пішло не так!');
  //   clearPage();
  // });
}

function clearQuerry() {
  pixabay.resetPage();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}
