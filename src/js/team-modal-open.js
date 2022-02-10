const teamModalOpenLink = document.querySelector('[data-team-modal-open]');
const teamModalCloseBtn = document.querySelector('[data-team-modal-close]');
const teamModalWindow = document.querySelector('[data-team-modal]');
const backdropTeamModal = document.querySelector('.team-modal-backdrop');


backdropTeamModal.addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    teamModalClickToggle();
  }
});

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

  if (teamModalWindow.classList.contains('is-hidden')) {
    enabledBodyScroll();
  }
  else {
    disabledBodyScroll();
  }
  
}
