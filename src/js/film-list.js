import filmInfo from '../partials/film-item.hbs';

export function createMarkup(films) {
  console.log(films);

  const FilmsList = films.map(film => {
    if (!film.genreEn) {
      film.genreEn = '';
    } else {
      film.genreEn = film.genreEn.slice(0, 2).join(', ');
    }

    return filmInfo(film);
  });

  return FilmsList.join('');
}
