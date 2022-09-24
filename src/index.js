import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './fetchimages';

const galleryContainer = document.querySelector('.gallery');

// axios.get('/users').then(res => {
//   console.log(res.data);
// });
const button = document.querySelector('.load-more');
const refs = document.querySelector('#search-form');

let page = 1;
let total = 0;
let name = '';
let curentTotal = 0;
refs.addEventListener('submit', fetchImages);

button.addEventListener('click', fetchImages);

function fetchImages(e) {
  e.preventDefault();
  if (e.target.id === 'search-form') {
    button.classList.add('hide');
    galleryContainer.innerHTML = '';
    name = e.target.elements['searchQuery'].value;
    name = name.trim();
    page = 1;
  } else {
    page = page + 1;
    curentTotal = 40 * page;
    //   countryList.innerHTML = '';
  }

  if (name.length !== 0) {
    API.ffol(name, page)
      .then(renderImages)
      .then(function ({ photoCard, galleryItems }) {
        galleryContainer.insertAdjacentHTML('beforeend', photoCard);
        new SimpleLightbox('.gallery a');
        total = galleryItems.totalHits;
        let totalInfo = total - curentTotal;
        if (total === 0) {
          return Notify.failure('Oops, there is no images with that name');
        } else if (total - curentTotal > 0) {
          button.classList.remove('hide');
          return Notify.info(`${totalInfo}
                "Hooray! We found totalHits images."`);
        } else {
          button.classList.add('hide');
          return Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no images with that name');
        console.log(error);
      });
  }
}

function renderImages(galleryItems) {
  let photoCard = galleryItems.hits
    .map(hit => {
      return `<div class="photo-card">
  <a href="${hit.largeImageURL}">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="prePhoto" />
        </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b> ${hit.likes}
    </p>
    <p class="info-item">
      <b>Vievs: </b>${hit.views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${hit.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${hit.downloads}
    </p>
  </div>
</div>`;
    })
    .join(' ');
  return { photoCard, galleryItems };
}
