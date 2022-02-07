import './sass/main.scss';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';
import 'tui-pagination/dist/tui-pagination.css';
import { async, contains, errorPrefix } from '@firebase/util';
import Darkmode from 'darkmode-js';
import VanillaTilt from 'vanilla-tilt';

import DataBaseAPI from './js/dataBaseAPI';
import ServiceApi from './js/ServiceApi';
import * as filmsMarcup from './js/film-list';
import ModalFilm from './js/modal-film-info';
import teamModal from './js/team-modal-open';
import Language from './js/switch-language';
import Pagination from 'tui-pagination';

const dataBaseAPI = new DataBaseAPI();
const serviceApi = new ServiceApi();
const modalFilm = new ModalFilm();
new Darkmode().showWidget();
const language = new Language();
const options = {
  totalItems: 0,
  itemsPerPage: 20,
  visiblePages: 5,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" data-page="{{page}}" class="tui-page-btn">{{page}}</a>',
    currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" data-more="{{type}}" class="tui-page-btn tui-{{type}} custom-class-{{type}}">' +
      '<span class="tui-ico-{{type}}"></span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}} custom-class-{{type}}">' +
      '<span class="tui-ico-{{type}}"></span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip custom-class-{{type}}">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};
const pagination = new Pagination('pagination', options);

const refs = {
  ulItem: document.querySelector('.film__list'),
  serchForm: document.querySelector('.search-form'),
  searchNotify: document.querySelector('.warning-notification'),
  filmList: document.querySelector('.film__list'),
  modalInfo: document.querySelector('.background'),
  modalInfoCloseBtn: document.querySelector('.modal__close-btn'),
  modalContent: document.querySelector('.modal__content'),
  select: document.querySelector('.change-lang'),
  pagination: document.getElementById('pagination'),

  sideNav: document.querySelector('.side-nav'),
  homeButton: document.querySelector('.home'),
  libraryButton: document.querySelector('.library'),

  loginButton: document.querySelector('.login'),
  modalAuthorization: document.querySelector('.backdrop'),
  modalAuthorizationClose: document.querySelector('.modal-avtoris .modal__icon-close'),
  modalAuthorizationForm: document.querySelector('.form-authorization'),

  modalRegistrationButton: document.querySelector('.modal-registration'),
  modalRegistration: document.querySelector('.backdrop_registro'),
  modalRegistrationClose: document.querySelector('.backdrop_registro .modal__icon'),
  modalRegistrationForm: document.querySelector('.form-registration'),

  homeBtn: document.querySelector('.home'),
  libraryBtn: document.querySelector('.library'),
  logoLink: document.getElementById('navigation-logo'),
  bgImg: document.getElementById('header'),
  homePage: document.getElementById('home-page'),
  libraryPage: document.getElementById('library-page'),

  // week: document.querySelector('search-perios__link--week'),
};

// VanillaTilt.init(refs.week, {
//   max: 25,
//   speed: 400,
//   scale: 1.2,
// });
// refs.week.addEventListener('tiltChange', callback);

// refs.week.tilt({
//   scale: 12,
// });

let filmId = null;
let btnWatched = null;
let btnQueue = null;
let loginStatus = false;
let searchStatus = false;
let query = ' ';

refs.serchForm.addEventListener('submit', onFormSerchSubmit);
refs.filmList.addEventListener('click', openInfoModal);
refs.modalInfoCloseBtn.addEventListener('click', closeInfoModal);
refs.select.addEventListener('change', changeLanguage);
refs.pagination.addEventListener('click', onPage);

refs.sideNav.addEventListener('click', onSideNavClick);
refs.modalAuthorizationClose.addEventListener('click', onModalAuthorizationCloseClick);
refs.modalAuthorizationForm.addEventListener('submit', onModalAuthorizationFormSubmit);

refs.modalRegistrationButton.addEventListener('click', oModalRegistrationButtonClick);
refs.modalRegistrationClose.addEventListener('click', onModalRegistrationCloseClick);
refs.modalRegistrationForm.addEventListener('submit', onMmodalRegistrationFormSubmit);

refs.libraryBtn.addEventListener('click', activeLibraryPage);
refs.homeBtn.addEventListener('click', activeHomePage);
refs.logoLink.addEventListener('click', activeHomePage);

//====================HEADER===================//

function activeHomePage() {
  refs.libraryBtn.classList.remove('side-nav__link--current');
  refs.homeBtn.classList.add('side-nav__link--current');
  refs.libraryBtn.classList.remove('form-group');
  refs.homeBtn.classList.add('search-form');
  refs.libraryPage.classList.add('is-hidden');
  refs.homePage.style.display = 'block';
  refs.libraryPage.style.display = 'none';
  refs.bgImg.classList.remove('header-bg-lib');
  refs.bgImg.classList.add('header-bg');
}

function activeLibraryPage() {
  refs.libraryBtn.classList.add('side-nav__link--current');
  refs.homeBtn.classList.remove('side-nav__link--current');
  refs.homeBtn.classList.remove('search-form');
  refs.libraryBtn.classList.add('form-group');
  refs.libraryPage.classList.remove('is-hidden');
  refs.libraryPage.style.display = 'block';
  refs.homePage.style.display = 'none';
  refs.bgImg.classList.remove('header-bg');
  refs.bgImg.classList.add('header-bg-lib');
}

//====================PAGINATION===================//

async function onPage(e) {
  if (e.currentTarget === e.target) {
    return;
  }

  const currentPage = pagination.getCurrentPage();
  pagination.movePageTo(currentPage);
  const lol = searchStatus
    ? await serviceApi.fetchMoviesBySearch({ query, page: currentPage })
    : await serviceApi.fetchTrending({ page: currentPage, period: 'week' });

  window.scrollTo(0, 240);
  const data = filmsMarcup.createMarkup(lol.films);
  refs.ulItem.innerHTML = data;
}
//============Registration============

async function onMmodalRegistrationFormSubmit(e) {
  e.preventDefault();
  const login = String(e.target.login.value);
  const pasword = e.target.pasword.value;
  const status = await dataBaseAPI.registration({ login: login, pasword: pasword });
  switch (status) {
    case 'User error':
      console.log('User error');
      const erorLogin = document.querySelector('.form-registration__error--login');
      erorLogin.classList.remove('is-hidden');
      e.target.login.classList.add('modal-form__placeholder--error');
      setTimeout(() => {
        erorLogin.classList.add('is-hidden');
        e.target.login.classList.remove('modal-form__placeholder--error');
      }, 3000);
      break;

    case 'server eror':
      break;

    default:
      console.log('Reg - OK');
      refs.loginButton.dataset.action = 'true';
      loginStatus = true;
      resetLoginStatus();
      onModalRegistrationCloseClick();
      onModalAuthorizationCloseClick();
      console.log(dataBaseAPI.user);
      break;
  }
}

function onModalRegistrationCloseClick() {
  refs.modalRegistration.classList.add('is-hidden');
}

function oModalRegistrationButtonClick(e) {
  refs.modalRegistration.classList.remove('is-hidden');
}
//============LOGIN============
function resetLoginStatus() {
  if (refs.loginButton.dataset.action === 'true') {
    refs.loginButton.innerHTML = 'LOG OUT';
    return;
  }
  refs.loginButton.innerHTML = 'LOG IN';
}

async function onModalAuthorizationFormSubmit(e) {
  e.preventDefault();

  const login = e.target.login.value;
  const pasword = e.target.password.value;
  // показать спинер
  //запретить нажатие на кнопки
  const status = await dataBaseAPI.logIn({ email: login, pasword: pasword });
  // скрыть спинер
  //Разренить нажатие на кнопки
  switch (status) {
    case 'login error':
      const erorLogin = document.querySelector('.form-authorization__error--login');
      erorLogin.classList.remove('is-hidden');
      e.target.login.classList.add('modal-form__placeholder--error');
      setTimeout(() => {
        erorLogin.classList.add('is-hidden');
        e.target.login.classList.remove('modal-form__placeholder--error');
      }, 3000);
      break;

    case 'password error':
      const erorPassword = document.querySelector('.form-authorization__error--password');
      erorPassword.classList.remove('is-hidden');
      e.target.password.classList.add('modal-form__placeholder--error');
      setTimeout(() => {
        erorPassword.classList.add('is-hidden');
        e.target.password.classList.remove('modal-form__placeholder--error');
      }, 3000);
      break;

    case 'server eror':

    default:
      console.log('logIn - OK');
      refs.loginButton.dataset.action = 'true';
      loginStatus = true;
      resetLoginStatus();
      onModalAuthorizationCloseClick();
      break;
  }
}

function onModalAuthorizationCloseClick() {
  refs.loginButton.classList.remove('side-nav__link--current');
  refs.modalAuthorization.classList.add('is-hidden');
}

function onSideNavClick(e) {
  if (e.currentTarget === e.target) {
    return;
  }

  console.log(dataBaseAPI);
  if (e.target.dataset.action === 'true') {
    dataBaseAPI.logOut();
    refs.loginButton.dataset.action = 'false';
    loginStatus = false;
    resetLoginStatus();
    return;
  }

  if (e.target.classList.contains('login')) {
    refs.loginButton.classList.add('side-nav__link--current');
    refs.modalAuthorization.classList.remove('is-hidden');
    console.log('Нажли на login');
  }

  if (e.target.classList.contains('home')) {
    console.log('Нажли на home');
  }
  if (e.target.classList.contains('library')) {
    console.log('Нажли на library');
  }
}

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
  const films = await serviceApi.fetchTrending({ page: 1, period: 'week' });

  pagination.reset(serviceApi.totalPages);

  console.log(films.films);

  const data = filmsMarcup.createMarkup(films.films, 'en');
  refs.ulItem.innerHTML = data;
}

async function onFormSerchSubmit(e) {
  e.preventDefault();
  query = e.target.query.value;
  try {
    const films = await serviceApi.fetchMoviesBySearch({ query, page: 1 });
    if (films === false) {
      refs.searchNotify.classList.remove('is-hidden');
      setTimeout(() => {
        refs.searchNotify.classList.add('is-hidden');
      }, 3000);
      return;
    }

    const data = filmsMarcup.createMarkup(films.films, 'ua');
    refs.ulItem.innerHTML = data;
    searchStatus = true;
    pagination.reset(serviceApi.totalPages);
  } catch (error) {
    console.log(error);
  }
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

function checkUserLog(serviceData) {
  if (loginStatus) {
    const databaseData = dataBaseAPI.getLiberuStatus(filmId);
    modalFilm.setFilm = Object.assign(serviceData, databaseData);
    return;
  }
  if (!loginStatus) {
    const statusDefault = {
      watched: false,
      queue: false,
    };
    modalFilm.setFilm = Object.assign(serviceData, statusDefault);
    return;
  }
}

function openInfoModal(e) {
  e.preventDefault();

  document.body.style.overflow = 'hidden'; //Запрещаем прокрутку body, пока открыта модалка

  const filmCard = e.target.closest('.film__item');

  filmId = filmCard.dataset.id;

  const serviceData = serviceApi.getFilmById(filmId);

  checkUserLog(serviceData);

  //dataBaseAPI.getFilmByid({ category: dataBaseAPI.user.watched, id: filmId });
  modalFilm.joinGenre();

  refs.modalContent.innerHTML = modalFilm.createMarkup(language.language);
  //Находим кнопки по data-att:
  btnWatched = document.querySelector('button[data-watched]');
  btnQueue = document.querySelector('button[data-queue]');

  const infoText = document.querySelector('.modal__info-not-login-user');

  if (loginStatus) {
    checkButtonData();
    btnWatched.disabled = false;
    btnQueue.disabled = false;

    infoText.classList.add('is-hidden');

    //Вешаем события по кликам на кнопки:
    btnWatched.addEventListener('click', addToWatched);
    btnQueue.addEventListener('click', addToQueue);
  } else {
    btnWatched.disabled = true;
    btnQueue.disabled = true;

    infoText.classList.remove('is-hidden');

    btnWatched.style.opacity = '0.5';
    btnWatched.style.backgroundColor = 'rgb(160, 160, 160)';

    btnQueue.style.opacity = '0.5';
    btnQueue.style.backgroundColor = 'rgb(160, 160, 160)';
  }

  if (filmCard) refs.modalInfo.classList.toggle('is-hidden'); //открываем модалку, убирая класс
}

async function addToWatched() {
  if (modalFilm.objFilm.watched) {
    modalFilm.objFilmWatched = false;
    btnWatched.setAttribute('data-watched', modalFilm.objFilm.watched);
    // спинер вкл + выкл кнопку
    await sleep(sendObj);
    // спинер выкл + вкл кнопку
    btnWatched.classList.remove('selected');
  } else {
    modalFilm.objFilmWatched = true;
    btnWatched.setAttribute('data-watched', modalFilm.objFilm.watched);
    // спинер вкл + выкл кнопку
    await sleep(sendObj);
    // спинер выкл + вкл кнопку
    btnWatched.classList.add('selected');
  }
}

async function addToQueue() {
  if (modalFilm.objFilm.queue) {
    modalFilm.objFilmQueue = false;
    btnQueue.setAttribute('data-queue', modalFilm.objFilm.queue);
    // спинер вкл + выкл кнопку
    await sleep(sendObj);
    // спинер выкл + вкл кнопку
    btnQueue.classList.remove('selected');
  } else {
    modalFilm.objFilmQueue = true;
    btnQueue.setAttribute('data-queue', modalFilm.objFilm.queue);
    // спинер вкл + выкл кнопку
    await sleep(sendObj);
    // спинер выкл + вкл кнопку
    btnQueue.classList.add('selected');
  }
}

function closeInfoModal() {
  document.body.style.overflow = 'auto'; //Разрешаем прокрутку body, пока модалка закрыта
  refs.modalInfo.classList.toggle('is-hidden'); //скрываем модалку, вешая класс
}

function sendObj() {
  console.log('отправка объекта'); // отправка
}

function sleep(fn) {
  return new Promise(resolve => {
    setTimeout(() => resolve(fn()), 1200);
  });
}

// document.addEventListener('keydown', evt => {
//   if (evt.code === 'KeyQ') {
//     console.log('You shall not pass!');
//     refs.searchNotify.classList.add('is-hidden');
//   }
// });
