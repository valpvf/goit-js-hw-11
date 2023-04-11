import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { SearchQuery } from './searchQuery.js';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let query = '';

const refs = {
  searchEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('.load-more'),
};

refs.searchEl.addEventListener('submit', onFormSubmit);
refs.loadMoreEl.addEventListener('click', onLoadMoreClick);

function onFormSubmit(evt) {
  evt.preventDefault();
  query = evt.target.elements.searchQuery.value.trim();
  if (query.length === 0) {
    return;
  }
  page = 1;
  evt.currentTarget.reset();
  refs.galleryEl.innerHTML = '';
  SearchQuery.onQuerySearch(query, page).then(data => {
    if (data.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    refs.galleryEl.insertAdjacentHTML('beforeend', onMarkup(data.hits));
    refs.loadMoreEl.classList.remove('is-hidden');
  });
}

function onLoadMoreClick(evt) {
  page += 1;
  SearchQuery.onQuerySearch(query, page).then(data => {
    console.log(data.totalHits);
    refs.loadMoreEl.classList.remove('is-hidden');
    refs.galleryEl.insertAdjacentHTML('beforeend', onMarkup(data.hits));
  });
}

function onMarkup(data) {
  let markup = data
    .map(
      el => `<div class="photo-item">
                <a href="${el.largeImageURL}" class="photo-link">
                  <div class="wrap">
                    <img src="${el.webformatURL}" alt="${el.tags}" class="photo-image" loading="lazy" />
                  </div>
                    <div class="info">
                    <p class="info-item">
                      <b>Likes</b><br> ${el.likes}
                    </p>
                    <p class="info-item">
                      <b>Views</b><br> ${el.views}
                    </p>
                    <p class="info-item">
                      <b>Comments</b><br> ${el.comments}
                    </p>
                    <p class="info-item">
                      <b>Downloads</b><br> ${el.downloads}
                    </p>
                  </div>
                </a>
              </div>`
    )
    .join('');
  return markup;
}

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  scrollZoom: false,
});
// console.dir(simpleLightbox);
// lightbox.on('show.simplelightbox', function () {
//   console.log(123); // do something…
// });
// gallery.on('error.simplelightbox', function (e) {
//   console.log(e); // some usefull information
// });
