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

import Loader from './js/loader';

new Darkmode().showWidget();

const dataBaseAPI = new DataBaseAPI();
const serviceApi = new ServiceApi();
const modalFilm = new ModalFilm();

const loaderSignIn = new Loader({ selector: '.auth-sign-in' });
const loaderRegistr = new Loader({ selector: '.reg-btn' });

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
    page: '<a href="#" data-page="{{page}}" class="tui-page-btn my-element-with-background">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected my-element-with-background">{{page}}</strong>',
    moveButton:
      '<a href="#" data-more="{{type}}" class="tui-page-btn tui-{{type}} custom-class-{{type}}">' +
      '<span class="tui-ico-{{type}}"></span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}} custom-class-{{type}} my-element-with-background">' +
      '<span class="tui-ico-{{type}}"></span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip custom-class-{{type}} my-element-with-background">' +
      '<span class="tui-ico-ellip my-element-with-background">...</span>' +
      '</a>',
  },
};
const pagination = new Pagination('pagination', options);

const refs = {
  ulItem: document.querySelector('.film__list'),
  searchForm: document.querySelector('.search-form'),
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

  radioWatched: document.querySelector('.radio-watched'),
  radioQueue: document.querySelector('.radio-queue'),

  radioBtnDay: document.querySelector('.day'),
  radioBtnWeek: document.querySelector('.week'),
  periodLabelDay: document.querySelector('.period-day__label'),
  periodLabelWeek: document.querySelector('.period-week__label'),

};

const switchCheckbox = document.querySelector('.switch__checkbox');
const switchToggle = document.querySelector('.darkmode-toggle');

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


refs.searchForm.addEventListener('submit', onFormSearchSubmit);
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
refs.radioBtnWeek.addEventListener('click', periodPer);
refs.radioBtnDay.addEventListener('click',periodPer);


//================ЗАПУСК ПРИ СТАРТЕ================
storageCheck();
logIn();
//================^^^ЗАПУСК ПРИ СТАРТЕ^^^================

//====================HEADER===================//
function periodPer() {
  let period = '';
  const pageLang = language.language;

  if (refs.radioBtnWeek.checked) {
    period = "week"
  }
   if (refs.radioBtnDay.checked) {
    period = "day"
    }
    serviceApi.fetchTrending({ page: 1, period: period }).then(data => {
      
    console.log(data.films);
    searchStatus = false;
    query = '';
    pagination.reset(serviceApi.totalPages);
    if (pageLang === 'en') {
      const homePage = filmsMarcup.createMarkup(data.films, 'en');
      refs.ulItem.innerHTML = homePage;
      titlMove();
    }
    if (pageLang === 'ua') {
      const homePage = filmsMarcup.createMarkup(data.films, 'ua');
      refs.ulItem.innerHTML = homePage;
      titlMove();
    }
  });
  }

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
  refs.periodLabelDay.classList.remove('display-none');
  refs.periodLabelWeek.classList.remove('display-none');
  refs.pagination.classList.remove('display-none');
  
  //console.log(serviceApi.fetchTrending({ page: 1, period: 'week' }));
  
  // const currentPage = pagination.getCurrentPage();
  periodPer();  
}

function activeLibraryPage() {
  refs.libraryBtn.classList.add('side-nav__link--current');
  refs.homeBtn.classList.remove('side-nav__link--current');
  refs.homeBtn.classList.remove('search-form');
  refs.libraryBtn.classList.add('form-group');
  refs.libraryPage.classList.remove('is-hidden');
  refs.libraryPage.style.display = 'block';
  refs.homePage.style.display = 'none';
  refs.periodLabelDay.classList.add('display-none');
  refs.periodLabelWeek.classList.add('display-none');
  refs.pagination.classList.add('display-none');
  refs.bgImg.classList.remove('header-bg');
  refs.bgImg.classList.add('header-bg-lib');
  
  const pageLang = language.language;

  refs.radioWatched.checked = true;

  if (pageLang === 'en') {
    const dataW = filmsMarcup.createMarkup(dataBaseAPI.user.watched, 'en');
    refs.ulItem.innerHTML = dataW;
    titlMove();
  }
  if (pageLang === 'ua') {
    const dataW = filmsMarcup.createMarkup(dataBaseAPI.user.watched, 'ua');
    refs.ulItem.innerHTML = dataW;
    titlMove();
  }
}

//====================PAGINATION===================//

async function onPage(e) {
  if (e.currentTarget === e.target) {
    return;
  }

  const currentPage = pagination.getCurrentPage();
  pagination.movePageTo(currentPage);
  const lol = searchStatus
    ? await serviceApi.fetchMoviesBySearch({ query: query, page: currentPage })
    : await serviceApi.fetchTrending({ page: currentPage, period: 'week' });

  window.scrollTo(0, 240);

  console.log(lol.films);
  const data = filmsMarcup.createMarkup(lol.films, language.language);
  console.log(data);
  refs.ulItem.innerHTML = data;
  titlMove();
}

//============Registration============

async function onMmodalRegistrationFormSubmit(e) {
  e.preventDefault();
  const login = String(e.target.login.value);
  const pasword = e.target.pasword.value;
  loaderRegistr.disabled();
  const status = await dataBaseAPI.registration({ login: login, pasword: pasword });
  loaderRegistr.enabled('REGISTRATION');
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
      //------------------------------
      dataBaseAPI.onСhangeUserData();
      //------------------------------
      break;
  }
}

function onModalRegistrationCloseClick() {
  refs.modalRegistration.classList.add('is-hidden');
}

function oModalRegistrationButtonClick(e) {
  //спинер on
  //кнопка
  //ожидание setTimeout
  refs.modalRegistration.classList.remove('is-hidden');
  //кнопка
}
//============LOGIN============
function resetLoginStatus() {
  if (refs.loginButton.dataset.action === 'true') {
    refs.loginButton.innerHTML = language.language === 'en' ? 'LOG OUT' : 'ВИЙТИ';
    return;
  }
  refs.loginButton.innerHTML = language.language === 'en' ? 'LOG IN' : 'УВІЙТИ';
}

async function onModalAuthorizationFormSubmit(e) {
  e.preventDefault();

  const login = e.target.login.value;
  const pasword = e.target.password.value;
  // показать спинер is-hidden
  //запретить нажатие на кнопки

  loaderSignIn.disabled();
  const status = await dataBaseAPI.logIn({ email: login, pasword: pasword });
  loaderSignIn.enabled();
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
      //------------------------------
      dataBaseAPI.onСhangeUserData(onСhangeUserData);
      // ------------------------------
      break;
  }
}

function onСhangeUserData() {
  onQueueWatchBtnClick();
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

//-----------------Проверяем наичие логина и пароля в localStorage-----------------
async function storageCheck() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return;
  }

  const { email, pasword } = user;
  await dataBaseAPI.logIn({ email: email, pasword: pasword });
  refs.loginButton.dataset.action = 'true';
  loginStatus = true;
  resetLoginStatus();
}
storageDackMoodCheck();
//-----------------Проверяем наичие темы в localStorage-----------------
function storageDackMoodCheck() {
  const darkmode = JSON.parse(localStorage.getItem('darkmode'));

  if (darkmode === null || !darkmode) {
    return;
  }
  switchCheckbox.checked = true;
}

async function logIn() {
  const films = await serviceApi.fetchTrending({ page: 1, period: 'week' });

  pagination.reset(serviceApi.totalPages);

  const data = filmsMarcup.createMarkup(films.films, 'en');
  refs.ulItem.innerHTML = data;

  titlMove();
}

//=================Titl=============================//
function titlMove() {
  const elements = document.querySelectorAll('.film__item');
  elements.forEach(element => VanillaTilt.init(element, { scale: '1.05' }));
}
// ==============================//

async function onFormSearchSubmit(e) {
  e.preventDefault();
  query = e.target.query.value;
  if (query === '') {
    refs.searchNotify.classList.remove('is-hidden');
    setTimeout(() => {
      refs.searchNotify.classList.add('is-hidden');
    }, 3000);
  }

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
    titlMove();
    searchStatus = true;
    pagination.reset(serviceApi.totalPages);
    refs.searchForm.query.value = '';
  } catch (error) {
    console.log(error);
    return;
  }
}

// console.log(switchToggle);

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

function checkUserLog(serviceData, filmId) {
  if (loginStatus) {
    const databaseData = dataBaseAPI.getLiberuStatus(filmId);
    console.log(serviceData, databaseData);
    modalFilm.setFilm = Object.assign(serviceData, databaseData);
    return;
  }
  if (!loginStatus) {
    const statusDefault = {
      watched: false,
      queue: false,
    };
    console.log('serviceData:', serviceData, 'databaseData:', statusDefault);
    modalFilm.setFilm = Object.assign(serviceData, statusDefault);
    return;
  }
}

function openInfoModal(e) {
  e.preventDefault();

  document.body.style.overflow = 'hidden'; //Запрещаем прокрутку body, пока открыта модалка

  const filmCard = e.target.closest('.film__item');

  filmId = +filmCard.dataset.id;
  console.log('filmId', filmId);
  //============

  console.log('in lib', refs.libraryButton.classList.contains('.side-nav__link--current'));
  if (refs.libraryButton.classList.contains('side-nav__link--current')) {
    if (refs.radioWatched.checked) {
      console.log('watched');
      modalFilm.setFilm = dataBaseAPI.getFilmByid({
        category: dataBaseAPI.user.watched,
        id: filmId,
      });
    } else {
      console.log('queue');
      modalFilm.setFilm = dataBaseAPI.getFilmByid({ category: dataBaseAPI.user.queue, id: filmId });
    }
  } else {
    const serviceData = serviceApi.getFilmById(filmId);
    console.log('serviceData', serviceData);

    checkUserLog(serviceData, filmId);
  }

  //dataBaseAPI.getFilmByid({ category: dataBaseAPI.user.watched, id: filmId });
  // modalFilm.joinGenre();

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
  const loaderWatched = new Loader({ selector: '.btn-add-to-watched' });

  const textSpinner = language.language === 'en' ? 'Add to watched' : 'Додати до переглянутого';

  if (modalFilm.objFilm.watched) {
    modalFilm.objFilmWatched = false;
    btnWatched.setAttribute('data-watched', modalFilm.objFilm.watched);

    loaderWatched.resetLoaderColor();
    loaderWatched.disabled();
    await sleep(sendObj);
    loaderWatched.enabled(textSpinner);
    loaderWatched.resetLoaderColor();

    btnWatched.classList.remove('selected');
  } else {
    modalFilm.objFilmWatched = true;
    btnWatched.setAttribute('data-watched', modalFilm.objFilm.watched);

    loaderWatched.disabled();
    await sleep(sendObj);
    loaderWatched.enabled(textSpinner);

    btnWatched.classList.add('selected');
  }
}

async function addToQueue() {
  const loaderQueue = new Loader({ selector: '.btn-add-to-queue' });
  const textSpinner = language.language === 'en' ? 'Add to queue' : 'Додати до черги';

  if (modalFilm.objFilm.queue) {
    modalFilm.objFilmQueue = false;
    btnQueue.setAttribute('data-queue', modalFilm.objFilm.queue);

    loaderQueue.resetLoaderColor();
    loaderQueue.disabled();
    await sleep(sendObj);
    loaderQueue.enabled(textSpinner);
    loaderQueue.resetLoaderColor();

    btnQueue.classList.remove('selected');
  } else {
    modalFilm.objFilmQueue = true;
    btnQueue.setAttribute('data-queue', modalFilm.objFilm.queue);

    loaderQueue.disabled();
    await sleep(sendObj);
    loaderQueue.enabled(textSpinner);

    btnQueue.classList.add('selected');
  }
}

function closeInfoModal() {
  document.body.style.overflow = 'auto'; //Разрешаем прокрутку body, пока модалка закрыта
  refs.modalInfo.classList.toggle('is-hidden'); //скрываем модалку, вешая класс
}

function sendObj() {
  dataBaseAPI.resetLiberuStatus(modalFilm.objFilm); // отправка
}

function sleep(fn) {
  return new Promise(resolve => {
    setTimeout(() => resolve(fn()), 1200);
  });
}

// ------------------------QUEUE-WATCH---------------

const libraryBtnsForm = document.querySelector('#library-page');

libraryBtnsForm.addEventListener('change', onQueueWatchBtnClick);

function onQueueWatchBtnClick() {
  let selectedBtnValue = '';
  const pageLang = language.language;
  if (refs.libraryButton.classList.contains('side-nav__link--current')) {
    if (refs.radioWatched.checked) {
      selectedBtnValue = 'watched';
    } else {
      selectedBtnValue = 'queue';
    }
  }

  if (pageLang === 'en') {
    if (selectedBtnValue === 'queue') {
      console.log('posmotret');
      console.log(selectedBtnValue);
      const dataQ = filmsMarcup.createMarkup(dataBaseAPI.user.queue, 'en');
      refs.ulItem.innerHTML = dataQ;
      titlMove();
    }
    if (selectedBtnValue === 'watched') {
      console.log('videli');
      console.log(selectedBtnValue);
      const dataW = filmsMarcup.createMarkup(dataBaseAPI.user.watched, 'en');
      refs.ulItem.innerHTML = dataW;
      titlMove();
    }
  }

  if (pageLang === 'ua') {
    if (selectedBtnValue === 'queue') {
      console.log('posmotret');
      // console.log(dataBaseAPI.user.queue);
      const dataQ = filmsMarcup.createMarkup(dataBaseAPI.user.queue, 'ua');
      refs.ulItem.innerHTML = dataQ;
      titlMove();
    }
    if (selectedBtnValue === 'watched') {
      console.log('videli');
      // console.log(dataBaseAPI.user.watched);
      const dataW = filmsMarcup.createMarkup(dataBaseAPI.user.watched, 'ua');
      refs.ulItem.innerHTML = dataW;
      titlMove();
    }
  }
}
