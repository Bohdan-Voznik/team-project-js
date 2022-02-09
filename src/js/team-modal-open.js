const teamModalOpenLink = document.querySelector('[data-team-modal-open]');
const teamModalCloseBtn = document.querySelector('[data-team-modal-close]');
const teamModalWindow = document.querySelector('[data-team-modal]');

teamModalOpenLink.addEventListener('click', teamModalClickToggle);
teamModalCloseBtn.addEventListener('click', teamModalClickToggle);
function onEscapeClickTeamModal(e) {
 
      if (e.code === 'Escape') {
        teamModalWindow.classList.toggle('is-hidden');
        document.removeEventListener('keydown', onEscapeClickTeamModal);
        // teamModalClickToggle()
      } 
      console.log(e.code);
}

function teamModalClickToggle(event) {
  document.addEventListener('keydown', onEscapeClickTeamModal);
  event.preventDefault();
  teamModalWindow.classList.toggle('is-hidden');
  // if (!teamModalWindow.classList.contains('is-hidden')) {
  //   document.body.classList.toggle('.no-scroll');
  //   document.body.style.overflow = 'hidden';
  //   console.log(document.body.classList);
  //   console.log(teamModalWindow.classList);
  // } else {
  //   document.body.style.overflow = 'auto';
  //   document.body.classList.toggle('.no-scroll');
  //   console.log(document.body.classList);
  //   console.log(teamModalWindow.classList);
  // }
}
