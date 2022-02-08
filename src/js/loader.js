export default class Loader {
  constructor({ selector, hidden = true }) {
    this.refs = this.getRefs(selector);

    if (!hidden) {
      this.hidden();
    }
  }

  resetLoaderColor() {
    this.refs.loadMoreIcon.classList.toggle('loader-color');
    this.refs.loadMoreIcon.classList.toggle('loader');
  }

  getRefs(selector) {
    return {
      loadMoreButton: document.querySelector(selector),
      loadMoreText: document.querySelector(`${selector} .modal-btn_text`),
      loadMoreIcon: document.querySelector(`${selector} .loader`),
    };
  }

  enabled(text) {
    this.refs.loadMoreButton.disabled = false;
    this.refs.loadMoreText.textContent = text;
    this.refs.loadMoreIcon.classList.add('is-hidden');
  }

  disabled() {
    this.refs.loadMoreButton.disabled = true;
    this.refs.loadMoreText.textContent = '';
    this.refs.loadMoreIcon.classList.remove('is-hidden');
  }

  show() {
    this.refs.loadMoreButton.classList.remove('is-hidden');
  }

  hidden() {
    this.refs.loadMoreButton.classList.add('is-hidden');
  }
}
