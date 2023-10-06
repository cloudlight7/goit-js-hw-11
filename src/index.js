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

let PAGE = 1;
let serchData;
refs.form.addEventListener('submit', onSearch);
refs.btnMore.addEventListener('click', onMoreSearch);
//refs.btnMore.classList.toggle("hidden");


function onSearch(event) {

    event.preventDefault();
    const elemSearch = event.target.elements.searchQuery.value;
    console.dir(elemSearch);
    console.log(PAGE);
    console.log(serchData);
        if (elemSearch.trim().length === 0) {
            console.log("ppyyysstt");
            refs.btnMore.style.display = "none";
       // console.log(elemSearch);
        resPage();
        return;
    } else if (elemSearch === serchData) {
        PAGE += 1;
      //  console.log(PAGE);
        } else if (PAGE > 1 && elemSearch !== serchData) {
          //  console.log(PAGE);
            PAGE = 1;
            resPage();
        } else {
            console.log("else");
        serchData = elemSearch;
    }
    getPictures(elemSearch, PAGE)
        .then(data => {
            console.dir(data.totalHits );
            refs.gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));
            lightbox.refresh();
        })
  .catch(error => console.log(error));
  //  console.dir(event.target.elements.searchQuery.value);
};
function resPage() {
        refs.gallery.innerHTML = '';
        PAGE = 1;
}
function onMoreSearch() {
    PAGE += 1;
       getPictures(serchData, PAGE)
        .then(data => {
            console.dir(data);
            refs.gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));
            lightbox.refresh();
        })
  .catch(error => console.log(error));
}

function createMarkup(arr) {
    console.log(arr);
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


 /*
function openData(event) {
    event.preventDefault();
    getPictures(serchData)
  .then(users => console.log(users))
  .catch(error => console.log(error));
   // event.preventDefault();
   // console.dir(serchData);
}
function serviceFotaCart(page) {

}*/