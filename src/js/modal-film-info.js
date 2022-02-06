import modalTplEn from '../partials/modal-fim-info-en.hbs';
import modalTplUk from '../partials/modal-fim-info-uk.hbs';

export default class ModalFilm {
  constructor() {
    this.objFilm = {
      watched: false,
      queue: false,
    };
  }

  joinGenre() {
    if (typeof this.objFilm.genreUk !== 'string')
      this.objFilm.genreUk = this.objFilm.genreUk.join(', ');
  }

  createMarkup(lang) {
    console.log(lang.dataset.language);
    console.log(this.objFilm);

    if (lang.dataset.language == 'en') return modalTplEn(this.objFilm);
    if (lang.dataset.language == 'ua') {
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
