import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { SearchQuery } from './searchQuery.js';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchQuery = new SearchQuery();

const refs = {
  searchEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreEl: document.querySelector('.load-more'),
};

refs.searchEl.addEventListener('submit', onFormSubmit);
refs.loadMoreEl.addEventListener('click', onLoadMoreClick);

async function onFormSubmit(evt) {
  evt.preventDefault();
  refs.galleryEl.innerHTML = '';
  refs.loadMoreEl.classList.add('is-hidden');
  query = evt.target.elements.searchQuery.value.trim();
  if (query.length === 0) {
    return;
  }
  searchQuery.page = 1;
  evt.currentTarget.reset();
  
  const data = await searchQuery.onQuerySearch(query);
  try {
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.galleryEl.innerHTML = '';
      return;
    }
    endOfSearch(data, searchQuery);
    refs.galleryEl.insertAdjacentHTML('beforeend', onMarkup(data.hits));
    addLightbox();
  } catch {
    console.error();
  }
}

async function onLoadMoreClick(evt) {
  searchQuery.page += 1;
  refs.loadMoreEl.classList.add('is-hidden');
  
  const data = await searchQuery.onQuerySearch(query);
  try {
    endOfSearch(data, searchQuery);
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    refs.galleryEl.insertAdjacentHTML('beforeend', onMarkup(data.hits));
    addLightbox();
    onScrollPageUp();
  } catch {
    console.error();
  }
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

function endOfSearch(data, searchQuery) {
  if (data.totalHits <= searchQuery.per_page * searchQuery.page) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreEl.classList.add('is-hidden');
  } else {
    refs.loadMoreEl.classList.remove('is-hidden');
  }
}

function onScrollPageUp() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function addLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    scrollZoom: false,
  });
  lightbox.refresh();
}
