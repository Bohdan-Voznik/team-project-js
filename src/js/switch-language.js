// import ServiceApi from './js/header';
// const API = ServiceApi();
// console.log(api.fetchTrending)

export default class LanguageApi {
  constructor() {
    this.language = 'en';
    this.select = null;
    this.tranclater = {
      // search:{
      //   en: 'Search movies',
      //   ua: 'Пошук фільмів',
      // },
      log:{
        en: 'LOG IN',
        ua: 'УВІЙТИ',
      },
      lib:{
        en: 'MY LIBRARY',
        ua: 'МОЯ БІБЛІОТЕКА',
      },
      home:{
        en: 'HOME',
        ua: 'ГОЛОВНА',
      },
      film:{
        en: 'Filmoteka',
        ua: 'Фільмотека',
      },
      right: {
        en: '2022 | All Rights Reserved',
        ua: '2022 | Усі права захищено',
      },
      developed: {
        en: '| Developed with',
        ua: '| Розроблено',
      },
      by: {
        en: 'by',
        ua: '',
      },
      goit: {
        en: 'GoIT Students',
        ua: 'Студентами GoIT',
      },
    };
  }
  changeDataSet() {
    let lang = this.select.value;
    this.select.dataset.language = lang;
    this.language = lang;
    console.log(lang);
  }
  changeLanguage(fn) {
    const lang = this.select.dataset.language;
    console.log(lang);
    Object.keys(this.tranclater).map(key => {
      console.log(key);

      fn(key, lang);
    });
  }
}

//
// console.log(select)

// const  allLang=['en','ua'];


const refs={
  place: document.querySelector('.search-form'),
};
console.log(refs.place);