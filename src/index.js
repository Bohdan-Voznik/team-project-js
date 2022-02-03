import './sass/main.scss';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';
import DataBaseAPI from './js/dataBaseAPI';
import ServiceApi from './js/ServiceApi';
import * as filmsMarcup from './js/film-list';
import Darkmode from 'darkmode-js';


const dataBaseAPI = new DataBaseAPI();
const serviceApi = new ServiceApi();
new Darkmode().showWidget();

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


const options = {
  bottom: '64px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '32px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: false, // default: true,
  label: '🌖', // default: ''
  autoMatchOsTheme: true // default: true
  
}
const switchCheckbox = document.querySelector('.switch__checkbox');
const switchToggle = document.querySelector('.darkmode-toggle');
console.log(switchToggle);

switchToggle.addEventListener('click', onChangeBg);
function onChangeBg() {
 if (switchCheckbox.checked) switchCheckbox.checked = false
else switchCheckbox.checked = true;
 };