import './sass/main.scss';
import ServiceApi from './js/header';
const api = new ServiceApi();
console.log(api.fetchTrending({}))
import './js/my-header';
