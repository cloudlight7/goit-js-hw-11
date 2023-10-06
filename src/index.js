import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPictures, } from "./js/api";

const refs ={
    form: document.querySelector(".search-form"),
    btnSearch: document.querySelector(".search__button"),
    gallery: document.querySelector(".gallery"),
    btnMore: document.querySelector(".load-more"),
};
let lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250,  captionsData: 'alt' });
let arrOpenNow = 0;
let PAGE = 1;
let serchData = "";
refs.form.addEventListener('submit', onSearch);
refs.btnMore.addEventListener('click', onMoreSearch);


function onSearch(event) {
  event.preventDefault();
  const elemSearch = event.target.elements.searchQuery.value;
  if (elemSearch.trim().length === 0) {
    Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    refs.btnMore.style.display = "none";
    resPage();
    return;
  } else if (elemSearch === serchData && arrOpenNow > 0) {
    PAGE += 1;
  } else if (elemSearch !== serchData) {
    arrOpenNow = 0;
    PAGE = 1;
    resPage();
  }
  serchData = elemSearch;
  getPictures(elemSearch, PAGE)
    .then(data => {
      if (data.totalHits >= 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (arrOpenNow === data.totalHits) {
          refs.btnMore.style.display = "none";
          Notify.failure(`Sorry, but these are all the images we found for your request,`);
          } else {
            refs.gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));
            arrOpenNow += data.hits.length;
          }
          lightbox.refresh();
          scroll();
      } else {
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
      }
        })
  .catch(error => console.log(error));
};
function resPage() {
  refs.gallery.innerHTML = '';
  PAGE = 1;
}
function onMoreSearch() {
  PAGE += 1;
  getPictures(serchData, PAGE)
    .then(data => {
      if (arrOpenNow === data.totalHits) {
        refs.btnMore.style.display = "none";
        Notify.failure(`Sorry, but these are all the images we found for your request,`);
      } else {
        refs.gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));
        arrOpenNow += data.hits.length;
      }
      lightbox.refresh();
      scroll();
    })
    .catch(error => console.log(error));
}

function createMarkup(arr) {
  refs.btnMore.style.display = "block";
  return arr
    .map(
      ({
        webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads
        }) => ` <div class="photo-card">
      <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" />
  <div class="info">
<p class="info-item">
         Likes:</br><span> ${likes} </span>
         </p>
        <p class="info-item">
        Views:</br><span> ${views} </span>
        </p>
        <p class="info-item">
         Comments:</br> <span> ${comments}</span>
        </p>
        <p class="info-item">
         Downloads:</br><span>${downloads}</span>
        </p>
  </div>
  </a>
</div>
      `
    )
    .join("");
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}