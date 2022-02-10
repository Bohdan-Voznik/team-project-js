import filmInfo from '../partials/film-item.hbs';

export function createMarkup(films, lang) {
  const filmsList = films.map(film => {
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
  return filmsList.join('');
}


