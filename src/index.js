import './sass/main.scss';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';
import DataBaseAPI from './js/dataBaseAPI';
import ServiceApi from './js/ServiceApi';
import * as filmsMarcup from './js/film-list';
import Darkmode from 'darkmode-js';
import ModalFilm from './js/modal-film-info';
import Language from './js/switch-language';

const dataBaseAPI = new DataBaseAPI();
const serviceApi = new ServiceApi();
const modalFilm = new ModalFilm();
new Darkmode().showWidget();
const language = new Language();

const refs = {
  ulItem: document.querySelector('.film__list'),
  serchForm: document.querySelector('.search-form'),
  filmList: document.querySelector('.film__list'),
  modalInfo: document.querySelector('.background'),
  modalInfoCloseBtn: document.querySelector('.modal__close-btn'),
  modalContent: document.querySelector('.modal__content'),
  select: document.querySelector('.change-lang'),
};

let filmId = null;
let btnWatched = null;
let btnQueue = null;

refs.serchForm.addEventListener('submit', onFormSerchSubmit);
refs.filmList.addEventListener('click', openInfoModal);
refs.modalInfoCloseBtn.addEventListener('click', closeInfoModal);
refs.select.addEventListener('change', changeLanguage);
//====LOGIN
logIn();
// --------------------Меняем язык ввода-----------
function changeLanguage() {
  language.select = refs.select;
  language.changeDataSet();
  language.changeLanguage(murcup);
}
function murcup(key, lang) {
  document.querySelector(`.lng-${key}`).innerHTML = language.tranclater[key][lang];
}
// --------------------Меняем язык ввода-----------
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

const switchCheckbox = document.querySelector('.switch__checkbox');
const switchToggle = document.querySelector('.darkmode-toggle');
console.log(switchToggle);

switchToggle.addEventListener('click', onChangeBg);
function onChangeBg() {
  if (switchCheckbox.checked) switchCheckbox.checked = false;
  else switchCheckbox.checked = true;
}

//============Pavel modal-film
function checkButtonData() {
  if (modalFilm.objFilm.watched) btnWatched.classList.add('selected');
  else btnWatched.classList.remove('selected');

  if (modalFilm.objFilm.queue) btnQueue.classList.add('selected');
  else btnQueue.classList.remove('selected');
}

function openInfoModal(e) {
  e.preventDefault();

  document.body.style.overflow = 'hidden'; //Запрещаем прокрутку body, пока открыта модалка

  const filmCard = e.target.closest('.film__item');
  filmId = filmCard.dataset.id;

  const serviceData = serviceApi.getFilmById(filmId);
  const databaseData = dataBaseAPI.getLiberuStatus(filmId);

  modalFilm.setFilm = Object.assign(serviceData, databaseData);

  //dataBaseAPI.getFilmByid({ category: dataBaseAPI.user.watched, id: filmId });

  refs.modalContent.innerHTML = modalFilm.createMarkup(language.select);

  //Находим кнопки по data-att:
  btnWatched = document.querySelector('button[data-watched]');
  btnQueue = document.querySelector('button[data-queue]');
  checkButtonData();

  //Вешаем события по кликам на кнопки:
  btnWatched.addEventListener('click', addToWatched);
  btnQueue.addEventListener('click', addToQueue);

  if (filmCard) refs.modalInfo.classList.toggle('is-hidden'); //открываем модалку, убирая класс
}

function addToWatched() {
  if (modalFilm.objFilm.watched) {
    btnWatched.classList.remove('selected');
    modalFilm.objFilmWatched = false;
    btnWatched.setAttribute('data-watched', modalFilm.objFilm.watched);
  } else {
    btnWatched.classList.add('selected');
    modalFilm.objFilmWatched = true;
    btnWatched.setAttribute('data-watched', modalFilm.objFilm.watched);
  }
}

function addToQueue() {
  if (modalFilm.objFilm.queue) {
    btnQueue.classList.remove('selected');
    modalFilm.objFilmQueue = false;
    btnQueue.setAttribute('data-queue', modalFilm.objFilm.queue);
  } else {
    btnQueue.classList.add('selected');
    modalFilm.objFilmQueue = true;
    btnQueue.setAttribute('data-queue', modalFilm.objFilm.queue);
  }
}

function closeInfoModal() {
  document.body.style.overflow = 'auto'; //Разрешаем прокрутку body, пока модалка закрыта
  refs.modalInfo.classList.toggle('is-hidden'); //скрываем модалку, вешая класс
}

//==================