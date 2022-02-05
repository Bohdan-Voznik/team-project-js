const homeBtn = document.querySelector('.home');
const libraryBtn = document.querySelector('.library');
const logoLink = document.getElementById('navigation-logo');
const bgImg = document.getElementById('header');

libraryBtn.addEventListener('click', activeLibraryPage);
homeBtn.addEventListener('click', activeHomePage);
logoLink.addEventListener('click', activeHomePage);

const homePage = document.getElementById('home-page');
const libraryPage = document.getElementById('library-page');


function activeHomePage() {
    libraryBtn.classList.remove('form-group');
    homeBtn.classList.add('search-form');
    libraryPage.classList.add('is-hidden');
    homePage.style.display = 'block';
    libraryPage.style.display = 'none';
    bgImg.classList.remove('header-bg-lib');
    bgImg.classList.add('header-bg');
}

function activeLibraryPage() {

    homeBtn.classList.remove('search-form');
    libraryBtn.classList.add('form-group');
    libraryPage.classList.remove('is-hidden');
    libraryPage.style.display = 'block';
    homePage.style.display = 'none';
    bgImg.classList.remove('header-bg');
    bgImg.classList.add('header-bg-lib');
 }

