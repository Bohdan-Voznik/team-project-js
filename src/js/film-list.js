import filmInfo from '../partials/film-item.hbs';

export function createMarkup(films, lang) {
  const FilmsList = films.map(film => {
    return filmInfo({
      image: lang === 'en' ? film.imageEn : film.imageUk,
      title: lang === 'en' ? film.titleEn : film.titleUk,
      genre:
        lang === 'en' ? film.genreEn.slice(0, 2).join(', ') : film.genreUk.slice(0, 2).join(', '),
      reliseData: film.reliseData,
      vote: film.vote,
      id: film.id,
    });
  });
  return FilmsList.join('');
}

// const FilmsList = films.map(film => {
//   // if (!film.genreEn) {
//   //   film.genreEn = '';
//   // } else {
//   //   film.genreEn = film.genreEn.slice(0, 2).join(', ');
//   // }

// //   return filmInfo(film);

// }
// });

// return FilmsList.join('');
// }
