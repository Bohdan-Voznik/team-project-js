import filmInfo from '../partials/film-item.hbs';

export function createMarkup(films, lang) {
  const filmsList = films.map(film => {
    const genreEn = film.genreEn;
    const genreUk = film.genreUk;
    console.log(genreEn);
    console.log(genreUk);

    return filmInfo({
      image: lang === 'en' ? film.imageEn : film.imageUk,
      title: lang === 'en' ? film.titleEn : film.titleUk,
      genre:
        lang === 'en' ? genreEn.slice(0, 2).join(', ') : genreUk.slice(0, 2).join(', '),
      reliseData: film.reliseData,
      vote: film.vote,
      id: film.id,
    });
  });
  return filmsList.join('');
}


