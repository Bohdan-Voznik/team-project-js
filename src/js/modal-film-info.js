import modalTplEn from '../partials/modal-fim-info-en.hbs';
import modalTplUk from '../partials/modal-fim-info-uk.hbs';

export default class ModalFilm {
  constructor() {
    this.objFilm = {
      watched: false,
      queue: false,
    };
  }

  createMarkup(lang) {
    console.log(lang.dataset.language);
    console.log(this.objFilm);

    if (lang.dataset.language === 'en') return modalTplEn(this.objFilm);
    if (lang.dataset.language === 'ua') {
      this.objFilm.genreUk = this.objFilm.genreUk.join(', ');
      return modalTplUk(this.objFilm);
    }
  }

  //Обработка кликов по кнопкам в модалке:

  set setFilm(film) {
    this.objFilm = film;
  }

  set objFilmWatched(status) {
    this.objFilm.watched = status;
  }

  set objFilmQueue(status) {
    this.objFilm.queue = status;
  }
}
