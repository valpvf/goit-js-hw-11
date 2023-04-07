import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { SearchQuery } from './searchQuery.js';

const refs = {
  searchEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
};

refs.searchEl.addEventListener('submit', onFormSubmit);

let lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

function onFormSubmit(evt) {
  evt.preventDefault();
  const query = evt.target.elements.searchQuery.value;
  SearchQuery.onQuerySearch(query).then(res => {
    const markup = res
      .map(
        el => `<a href="${el.largeImageURL}" class="photo-card">
  <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${el.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${el.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${el.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${el.downloads}</b>
    </p>
  </div>
</a>`
      )
      .join('');
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  });
}
