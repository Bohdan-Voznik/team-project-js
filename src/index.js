import './sass/main.scss';
import Darkmode from 'darkmode-js';
new Darkmode().showWidget();
const options = {
  bottom: '64px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '32px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: false, // default: true,
  label: '🌖', // default: ''
  autoMatchOsTheme: true // default: true
  
}
const switchCheckbox = document.querySelector('.switch__checkbox');
const switchToggle = document.querySelector('.darkmode-toggle');
console.log(switchToggle);

switchToggle.addEventListener('click', onChangeBg);
function onChangeBg() {
  // switchCheckbox.classList.toggle("slider")
  
  if (switchCheckbox.checked) switchCheckbox.checked = false

    
 else switchCheckbox.checked = true;
 };
