const teamModalOpenLink = document.querySelector('[data-team-modal-open]');
const teamModalCloseBtn = document.querySelector('[data-team-modal-close]');
const teamModalWindow = document.querySelector('[data-team-modal]');
const backdropTeamModal = document.querySelector('.team-modal-backdrop');
function disabledBodyScroll() {
  let pagePosition = window.scrollY;
  document.body.classList.add('disable-scroll');
  document.body.dataset.position = pagePosition;
  window.scrollTo({ top: pagePosition });
  document.body.style.top = `${-pagePosition}px`;
  document.body.style.position = 'fixed';
}

function enabledBodyScroll() {
  let pagePosition = parseInt(document.body.dataset.position, 10);
  document.body.style.position = 'static';
  document.body.style.top = 'auto';
  document.body.classList.remove('disable-scroll');
  window.scroll({ top: pagePosition, left: 0 });
  document.body.removeAttribute('data-position');
}

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
  }
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
