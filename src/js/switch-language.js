export default class LanguageApi {
  constructor() {
    this.language = 'en';
    this.select = null;
    this.tranclater = {
      search: {
        en: 'Search result not successful. Enter the correct movie name',
        ua: 'Результат пошуку невдалий. Введіть правильну назву фільму',
      },
      reg: {
        en: 'REGISTRATION',
        ua: 'РЕЄСТРАЦІЯ',
      },
      registr: {
        en: 'REGISTRATION',
        ua: 'РЕЄСТРАЦІЯ',
      },
      avtor: {
        en: 'AUTHORIZATION',
        ua: 'АВТОРИЗАЦІЯ',
      },
      sing: {
        en: 'Sign in',
        ua: 'ВХІД',
      },
      acc: {
        en: 'Create Account',
        ua: 'СТВОРИТИ АКАУНТ',
      },
      day: {
        en: 'TOP day',
        ua: 'ТОП дня',
      },
      week: {
        en: 'TOP  week',
        ua: 'ТОП тижня',
      },
      queue: {
        en: 'Queue',
        ua: 'ДО ЧЕРГИ',
      },
      watch: {
        en: 'Watched',
        ua: 'ПЕРЕГЛЯНУТИ',
      },
      log: {
        en: 'LOG IN',
        ua: 'УВІЙТИ',
      },
      lib: {
        en: 'MY LIBRARY',
        ua: 'БІБЛІОТЕКА',
      },
      home: {
        en: 'HOME',
        ua: 'ГОЛОВНА',
      },

      right: {
        en: '2022 | All Rights Reserved |',
        ua: '2022 | Усі права захищено |',
      },
      developed: {
        en: 'Developed with ',
        ua: 'Розроблено з',
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
  }
  changeLanguage(fn) {
    document.querySelector('.search-field').placeholder =
      this.language === 'en' ? 'Search movies' : 'Пошук фільмів';
    const lang = this.select.dataset.language;

    document.querySelector('.modal-form__placeholder').placeholder =
      this.language === 'en' ? 'login' : 'логін';

    document.querySelector('.form_password').placeholder =
      this.language === 'en' ? 'password' : 'пароль';

    document.querySelector('.form_email').placeholder =
      this.language === 'en' ? 'email' : 'електронна пошта';

    document.querySelector('.form_pas').placeholder =
      this.language === 'en' ? 'password' : 'пароль';

    Object.keys(this.tranclater).map(key => {
      fn(key, lang);
    });
  }
}
