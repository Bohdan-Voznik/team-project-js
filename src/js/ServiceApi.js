import axios from 'axios';

export default class ServiceApi {
  constructor() {
    this.API_KEY = '410621b9cfc5cc5268eeae574da75634';
    this.BASE_URL = 'https://api.themoviedb.org/3/';
    this.axInstance = axios.create({
      baseURL: this.BASE_URL,
      params: {
        api_key: this.API_KEY,
      },
    });

    this.country = null;
    this.page = 1;
    this.arrayForGenresUk = [];
    this.arrayForGenresEn = [];
    this.getGenresListUk('uk');
    this.getGenresListEn('en-US');
    this.arrayForFilms = [];
    this.totalPages = null;
  }
  async getGenresListUk(language) {
    const url = `genre/movie/list`;
    const response = await this.axInstance.get(url, { params: { language } });
    this.arrayForGenresUk = response.data.genres;
    return this.arrayForGenres;
  }
  async getGenresListEn(language) {
    const url = `genre/movie/list`;
    const response = await this.axInstance.get(url, { params: { language } });
    this.arrayForGenresEn = response.data.genres;
    return this.arrayForGenres;
  }
  async fetchTrending({ page = 1, period = 'day' }) {
    try {
      this.page = page;
      const url = `trending/movie/${period}`;
      const responseEn = await this.axInstance.get(url, { params: { page: this.page } });
      this.totalPages = responseEn.data.total_results;
      const dataEn = responseEn.data.results.map(
        ({
          id,
          popularity,
          title,
          vote_average,
          poster_path,
          genre_ids,
          release_date,
          overview,
          vote_count,
        }) => ({
          id,
          popularity,
          titleEn: title,
          vote: vote_average,
          imageEn:
            poster_path !== null
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : 'https://bflix.biz/no-poster.png',
          reliseData: release_date === undefined ? '' : release_date.slice(0, 4),
          aboutEn: overview,
          votes: vote_count,
          genreEn: this.arrayForGenresEn
            .filter(genre => genre_ids.includes(genre.id))
            .map(({ name }) => name),
        }),
      );
      const responseUk = await this.axInstance.get(url, { params: { page, language: 'uk' } });
      const data = responseUk.data.results.map(
        ({ title, poster_path, genre_ids, overview }, index) => ({
          popularity: dataEn[index].popularity,
          titleEn: dataEn[index].titleEn,
          id: dataEn[index].id,
          vote: dataEn[index].vote,
          imageEn: dataEn[index].imageEn,
          reliseData: dataEn[index].reliseData,
          votes: dataEn[index].votes,
          genreEn: dataEn[index].genreEn,
          titleUk: title,
          imageUk:
            poster_path !== null
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : 'https://bflix.biz/no-poster.png',
          aboutUk: overview,
          aboutEn: dataEn[index].aboutEn,
          genreUk: this.arrayForGenresUk
            .filter(genre => genre_ids.includes(genre.id))
            .map(({ name }) => name),
        }),
      );
      this.arrayForFilms = [...data];
      return { films: this.arrayForFilms, totalPages: this.totalPages };
    } catch (error) {
      console.log(`Here is ${error}`);
      return error;
    }
  }
  async fetchMoviesBySearch({ query, page = 1 }) {
    try {
      this.pageNumber = page;
      const url = `search/movie`;
      const responseEn = await this.axInstance.get(url, {
        params: { query, page: this.page },
      });
      this.totalPages = responseEn.data.total_results;
      console.log(responseEn.data.results);
      if (responseEn.data.results.length === 0) {
        return false;
      }

      const dataEn = responseEn.data.results.map(
        ({
          id,
          popularity,
          title,
          vote_average,
          poster_path,
          genre_ids,
          release_date,
          overview,
          vote_count,
        }) => ({
          id,
          popularity,
          titleEn: title,
          vote: vote_average,
          imageEn:
            poster_path !== null
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : 'https://bflix.biz/no-poster.png',
          reliseData: release_date === undefined ? '' : release_date.slice(0, 4),
          aboutEn: overview,
          votes: vote_count,
          genreEn: this.arrayForGenresEn
            .filter(genre => genre_ids.includes(genre.id))
            .map(({ name }) => name),
        }),
      );
      const responseUk = await this.axInstance.get(url, {
        params: { query, page, language: 'uk' },
      });
      const data = responseUk.data.results.map(
        ({ title, poster_path, genre_ids, overview }, index) => ({
          popularity: dataEn[index].popularity,
          titleEn: dataEn[index].titleEn,
          id: dataEn[index].id,
          vote: dataEn[index].vote,
          imageEn: dataEn[index].imageEn,
          reliseData: dataEn[index].reliseData,
          votes: dataEn[index].votes,
          genreEn: dataEn[index].genreEn,
          titleUk: title,
          imageUk:
            poster_path !== null
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : 'https://bflix.biz/no-poster.png',
          aboutUk: overview,
          aboutEn: dataEn[index].aboutEn,
          genreUk: this.arrayForGenresUk
            .filter(genre => genre_ids.includes(genre.id))
            .map(({ name }) => name),
        }),
      );
      this.arrayForFilms = [...data];
      return { films: this.arrayForFilms, totalPages: this.totalPages };
    } catch (error) {
      console.log(`Here is ${error}`);
      return error;
    }
  }
  getFilmById(id = null) {
    console.log(id);
    if (!id) {
      return 'Error';
    }
    const filmIndex = this.arrayForFilms.map(film => {
      return film.id;
    });

    if (filmIndex === -1) {
      console.log('no film');
      return 'Error';
    }
    console.log(filmIndex.indexOf(+id));
    return this.arrayForFilms[filmIndex.indexOf(+id)];
  }
  get pageNumber() {
    return this.page;
  }
  set pageNumber(newPage) {
    this.page = newPage;
  }

  async getGeoInfo() {
    const res = await axios.get('https://ipapi.co/json/');
    // let response = response.data;
    this.country = res.data.country_name;
    return this.country;
  }
}
