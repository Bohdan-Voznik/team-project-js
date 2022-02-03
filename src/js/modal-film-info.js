import modalTpl from '../partials/modal-fim-info.hbs';

export default class ModalFilm {
  constructor() {
    this.objFilm = {
      watched: false,
      queue: false,
    };
  }

  createMarkup() {
    //Подставляем инфу про фильм в модалку (в hbs):
    return modalTpl(this.objFilm);
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
