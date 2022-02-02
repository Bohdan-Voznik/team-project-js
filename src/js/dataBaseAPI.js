import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, onValue, off } from 'firebase/database';

export default class dataBaseApiServise {
  constructor() {
    this.userRefInDatabase = null;
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
      console.log('Вы не зарегистрированы!!!');
      return 'Error';
    }
    if (pasword !== String(pass)) {
      console.log('Неверный пароль!!!!');
      return 'Error';
    }

    this.userRefInDatabase = await ref(this.db, `users/${this.formatEmail(email)}`);
    localStorage.setItem('user', JSON.stringify({ email: email, pasword: pasword }));
    this.user.email = email;
    this.user.pasword = pass;
    this.user.queue = queue;
    this.user.watched = watched;
    console.log(this.user);
    return 'logIn - OK';
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

    console.log(Number(id));
    if (isFilmChecked === -1) {
      console.log('такого нет');
      return;
    }
    category.splice(isFilmChecked, 1);
    console.log('removeMovieFromLibrary: ', this.user);
    this.saveUserDataToDatabase();
    return 'removeMovieFromLibrary - OK';
  }

  //-------Готово
  addMovieToLibrary({ category = null, film = null }) {
    if (!category || !film) {
      console.log('Error');
      return 'Error';
    }

    const isFilmChecked = this.getFilmIndexByID({ category: category, id: film.id });
    if (isFilmChecked !== -1) {
      console.log('in arr');
      return;
    }

    category.splice(0, 0, film);
    console.log('addMovieToLibrary: ', this.user);
    this.saveUserDataToDatabase();
    return 'addMovieToLibrary - OK';
  }

  //-------Готово
  //записывает данные пользователя в БД
  saveUserDataToDatabase() {
    update(this.userRefInDatabase, this.user);
    console.log('Запись успешна');
  }

  //-------Готово
  onСhangeUserData(functions = []) {
    onValue(this.userRefInDatabase, async snapshot => {
      console.log('изменения!!');
      const { pasword: paswordDb, queue: queueDb, watched: watchedDb } = await snapshot.val();
      this.user.pasword = paswordDb;
      this.user.queue = queueDb;
      this.user.watched = watchedDb;

      if (functions.length !== 0) {
        functions.map(fn => {
          fn();
        });
      }
    });
  }

  //-------Готово
  logOut() {
    if (this.userRefInDatabase) {
      off(this.userRefInDatabase);
    }
    this.user = {};
    console.log('12');
    localStorage.removeItem('user');
  }

  async registration({ login = '', pasword = '' }) {
    // console.log(login)

    const data = await this.getDataByRef(formatEmail(login));
    console.log('data: ', data);

    if (data !== null) {
      return 'Пользователь уже зарегистрирован!';
    }
    const user = {
      pasword: pasword,
      queue: '',
      watched: '',
    };
    const refs = await ref(this.db, `users/${formatEmail(login)}`);
    update(refs, user);
    return 'Ok';
  }

  //-------Готово
  getFilmIndexByID({ category = null, id = null }) {
    return category
      .map(film => {
        return film.id;
      })
      .indexOf(Number(id));
  }

  //-------Готово
  getLiberuStatus(id = null) {
    if (!id) {
      console.log('Error');
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

    console.log(id, data);
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
      genreUk,
      genreEn,
      aboutUk,
      aboutEn,
      reliseData,
    };

    console.log('test');

    if (watched) {
      console.log('watched - OK');
      this.addMovieToLibrary({ category: this.user.watched, film: data });
    } else {
      this.removeMovieFromLibrary({ category: this.user.watched, id: data.id });
    }

    if (queue) {
      console.log('queue - OK');
      this.addMovieToLibrary({ category: this.user.queue, film: data });
    } else {
      this.removeMovieFromLibrary({ category: this.user.queue, id: data.id });
    }

    console.log(this.user);
  }

  //-------Готово
  getFilmByid({ category = null, id = null }) {
    console.log(category, id);
    if (!category || !id) {
      return 'Error';
    }
    const filmIndex = this.getFilmIndexByID({ category: this.user.watched, id: Number(id) });

    if (filmIndex === -1) {
      console.log('no film');
      return;
    }
    const data = category[filmIndex];
    return { ...data, ...this.getLiberuStatus(id) };
  }
}

//Возврат
