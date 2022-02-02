import './sass/main.scss';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';
import DataBaseAPI from './js/dataBaseAPI';
import ServiceApi from './js/ServiceApi';
import * as filmsMarcup from './js/film-list';

const dataBaseAPI = new DataBaseAPI();
const serviceApi = new ServiceApi();

const refs = {
  ulItem: document.querySelector('.film__list'),
  serchForm: document.querySelector('.search-form'),
};

refs.serchForm.addEventListener('submit', onFormSerchSubmit);
logIn();

// dataBaseAPI.logOut();

//-----------------Проверяем наичие логина и пароля в localStorage-----------------
function storageCheck() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return;
  }

  const { email, pasword } = user;
  logIn(email, pasword);
}

async function logIn() {
  await dataBaseAPI.logIn({ email: 'lol@gmail.com', pasword: '11' });
  const films = await serviceApi.fetchTrending({ page: 1, period: 'week' });
  console.log(films.films);
  const data = filmsMarcup.createMarkup(films.films);
  refs.ulItem.innerHTML = data;
}

async function onFormSerchSubmit(e) {
  e.preventDefault();
  const query = e.target.query.value;
  const films = await serviceApi.fetchMoviesBySearch({ query, page: 1 });

  const data = filmsMarcup.createMarkup(films.films);
  refs.ulItem.innerHTML = data;
}
