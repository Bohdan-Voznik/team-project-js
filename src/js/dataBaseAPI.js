import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, onValue, off } from 'firebase/database';

export default class dataBaseApiServise {
  constructor() {
    (this.indexOfSerch = 1), (this.userRefInDatabase = null);
    this.user = {};

    this.firebaseConfig = {
      apiKey: 'AIzaSyDgevhxdEZxnNc8yqSiIrrlMRAzE6e63nU',
      authDomain: 'team-project-js-66dd5.firebaseapp.com',
      databaseURL: 'https://team-project-js-66dd5-default-rtdb.firebaseio.com',
      projectId: 'team-project-js-66dd5',
      storageBucket: 'team-project-js-66dd5.appspot.com',
      messagingSenderId: '48750083472',
      appId: '1:48750083472:web:d4a9cd4b799674e0cbc715',
    };

    this.db = getDatabase(initializeApp(this.firebaseConfig));
  }

  //получаем данные пользователя из БД
  async logIn({ email = null, pasword = null }) {
    const data = await this.getDataByRef(this.formatEmail(email));
    const { pasword: pass, queue: queue, watched: watched } = data === null ? {} : data;
    if (!pass) {
     
      return 'login error';
    }
    if (pasword !== String(pass)) {
     
      return 'password error';
    }

    this.userRefInDatabase = await ref(this.db, `users/${this.formatEmail(email)}`);
    localStorage.setItem('user', JSON.stringify({ email: email, pasword: pasword }));
    this.user.email = email;
    this.user.pasword = pass;
    this.user.queue = queue ? queue : [];
    this.user.watched = watched ? watched : [];
   
    return 'true';
  }

  //-------Готово
  // Получает мавив с данными пользователя по email
  // Если не передать email получим все данные с базы данных
  async getDataByRef(user = '') {
    const starCountRef = await ref(this.db, `users/${user}`);
    return await (await get(starCountRef)).val();
  }

  //-------Готово
  formatEmail(email) {
    return email.toLowerCase().replaceAll('.', '-0162-');
  }

  //-------Готово
  reFormatEmail(email) {
    return email.toLowerCase().replaceAll('-0162-', '.');
  }

  //-------Готово
  //Удаляет фильм из категории (category) по id
  //category (this.user.queue или this.user.watched)
  //id(идентификатор фильма который удаляем)
  removeMovieFromLibrary({ category = null, id = null }) {
    if (!category || !id) {
      return 'Error';
    }
    const isFilmChecked = this.getFilmIndexByID({ category: category, id: id });

    
    if (isFilmChecked === -1) {
     
      return;
    }
    category.splice(isFilmChecked, 1);
   
    this.saveUserDataToDatabase();
    return 'removeMovieFromLibrary - OK';
  }

  //-------Готово
  addMovieToLibrary({ category = null, film = null }) {
    if (!category || !film) {
  
      return 'Error';
    }

    const isFilmChecked = this.getFilmIndexByID({ category: category, id: film.id });
    if (isFilmChecked !== -1) {
     
      return;
    }

    category.splice(0, 0, film);
   
    this.saveUserDataToDatabase();
    return 'addMovieToLibrary - OK';
  }

  //-------Готово
  //записывает данные пользователя в БД
  saveUserDataToDatabase() {
    update(this.userRefInDatabase, this.user);
   
  }

  //-------Готово
  onСhangeUserData(fn) {
    onValue(this.userRefInDatabase, async snapshot => {
      if (this.indexOfSerch === 1) {
        this.indexOfSerch += 1;
        return;
      }
      const { pasword: paswordDb, queue: queueDb, watched: watchedDb } = await snapshot.val();
      this.user.pasword = paswordDb;
      this.user.queue = queueDb;
      this.user.watched = watchedDb;
      fn();
    });
  }

  //-------Готово
  logOut() {
    if (this.userRefInDatabase) {
      off(this.userRefInDatabase);
    }
    this.user = {};
    this.indexOfSerch = 1;
    localStorage.removeItem('user');
  }

  async registration({ login = '', pasword = '' }) {
    const data = await this.getDataByRef(this.formatEmail(login));
    if (data !== null) {
      return 'User error';
    }
    const user = {
      pasword: pasword,
      queue: '',
      watched: '',
    };

    const refs = await ref(this.db, `users/${this.formatEmail(login)}`);
    update(refs, user);

    this.user = {};
    this.user.email = login;
    this.user.pasword = pasword;
    this.user.queue = [];
    this.user.watched = [];
    this.userRefInDatabase = refs;

    localStorage.setItem('user', JSON.stringify({ email: login, pasword: pasword }));
    return 'true';
  }

  //-------Готово
  getFilmIndexByID({ category = null, id = null }) {
    const cat = category ? category : [];
    
    return cat
      .map(film => {
        return film.id;
      })
      .indexOf(Number(id));
  }

  //-------Готово
  getLiberuStatus(id = null) {
    if (!id) {
      
      return 'Error';
    }

    const data = {
      watched:
        this.getFilmIndexByID({ category: this.user.watched, id: Number(id) }) === -1
          ? false
          : true,
      queue:
        this.getFilmIndexByID({ category: this.user.queue, id: Number(id) }) === -1 ? false : true,
    };

    
    return data;
  }

  //-------Готово
  resetLiberuStatus(film) {
    const {
      id,
      imageUk,
      imageEn,
      titleUk,
      titleEn,
      vote,
      votes,
      popularity,
      genreUk,
      genreEn,
      aboutUk,
      aboutEn,
      reliseData,
      watched,
      queue,
    } = film;
    const data = {
      id,
      imageUk,
      imageEn,
      titleUk,
      titleEn,
      vote,
      votes,
      popularity,
      genreUk: typeof genreUk === 'string' ? genreUk.split(', ') : genreUk,
      genreEn: typeof genreEn === 'string' ? genreEn.split(', ') : genreEn,
      aboutUk,
      aboutEn,
      reliseData,
    };

    

    if (watched) {
      
      this.addMovieToLibrary({ category: this.user.watched, film: data });
    } else {
      this.removeMovieFromLibrary({ category: this.user.watched, id: data.id });
    }

    if (queue) {
      
      this.addMovieToLibrary({ category: this.user.queue, film: data });
    } else {
      this.removeMovieFromLibrary({ category: this.user.queue, id: data.id });
    }

    
  }

  //-------Готово
  getFilmByid({ category = null, id = null }) {
  
    if (!category || !id) {
      return 'Error';
    }
    const filmIndex = this.getFilmIndexByID({ category: category, id: Number(id) });

    if (filmIndex === -1) {
     
      return;
    }
    const data = category[filmIndex];
    return { ...data, ...this.getLiberuStatus(id) };
  }
}

//Возврат
