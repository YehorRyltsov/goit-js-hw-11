import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './fetchimages';
const simplelightbox = new SimpleLightbox('.gallery a');

const galleryContainer = document.querySelector('.gallery');
const button = document.querySelector('.load-more');
const refs = document.querySelector('#search-form');
let totalInfo = 0;
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
  }

  if (name.length !== 0) {
    API.getImages(name, page)
      .then(photoCard)
      .catch(error => {
        Notify.failure('Oops, there is no images with that name');
        console.log(error);
      });
  }
}
function photoCard(galleryItems) {
  total = galleryItems.totalHits;

  if (total === 0) {
    return Notify.failure('Oops, !!!there is no images with that name');
  } else if (total > 0) {
    if (total <= 40) {
      curentTotal = total;
    } else if (curentTotal === 0) {
      curentTotal = 40;
      page = page + 1;
      button.classList.remove('hide');
    } else if (totalInfo < 40 && totalInfo > 0) {
      curentTotal = total;
      button.classList.add('hide');
    } else {
      curentTotal = page * 40;
      page = page + 1;
      button.classList.remove('hide');
    }
    totalInfo = total - curentTotal;
    let photoCards = renderImages(galleryItems);
    galleryContainer.insertAdjacentHTML('beforeend', photoCards);
    simplelightbox.refresh();

    return Notify.info(`${totalInfo}
                "Hooray! We found ${total} images."`);
  } else {
    button.classList.add('hide');
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function renderImages(galleryItems) {
  return galleryItems.hits
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
}
