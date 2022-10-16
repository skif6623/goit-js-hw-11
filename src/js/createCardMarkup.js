export function createCardMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return /*html*/ ` 
        <div class="photo-card">
          <a class="photo-card__link" href="${largeImageURL}">
            <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>;
          <div class="info">
            <p class="info-item">
              <b>Likes ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads ${downloads}</b>
            </p>
          </div>
        </div>;`;
      }
    )
    .join();
}
