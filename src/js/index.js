import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { SearchQuery } from './searchQuery.js';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchQuery = new SearchQuery();

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
  refs.galleryEl.innerHTML = '';
  refs.loadMoreEl.classList.add('is-hidden');
  query = evt.target.elements.searchQuery.value.trim();
  if (query.length === 0) {
    return;
  }
  searchQuery.page = 1;
  evt.currentTarget.reset();
  searchQuery.onQuerySearch(query).then(data => {
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.galleryEl.innerHTML = '';
      return;
    }
    console.log(data.hits.length, searchQuery.per_page);
    if (
      searchQuery.page === data.totalHits / searchQuery.per_page ||
      data.hits.length < searchQuery.per_page
    ) {
      refs.loadMoreEl.classList.add('is-hidden');
    } else {
      refs.loadMoreEl.classList.remove('is-hidden');
    }
    refs.galleryEl.insertAdjacentHTML('beforeend', onMarkup(data.hits));
    
  });
}

function onLoadMoreClick(evt) {
  searchQuery.page += 1;
  searchQuery.onQuerySearch(query).then(data => {    
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
