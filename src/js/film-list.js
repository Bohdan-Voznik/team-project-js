import filmInfo from '../partials/film-item.hbs';


export function createMarkup(films, lang) {
  if (lang === 'en') {
    const FilmsListEn = films.map(film => {
      const enFilm =  {
        image: film.imageEn,
        title: film.titleEn,
        genre: film.genreEn,
        reliseData: film.reliseData,
        vote: film.vote,
        id: film.id
      };
      return filmInfo(enFilm);

    })
    return FilmsListEn.join('');
  } 
  if (lang === 'ua') {
    const FilmsListUk = films.map(film => {
      const ukFilm =  {
        image: film.imageUk,
        title: film.titleUk,
        genre: film.genreUk,
        reliseData: film.reliseData,
        vote: film.vote,
        id: film.id
      };
      
      return filmInfo(ukFilm);

    })
    return FilmsListUk.join('');
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
}
