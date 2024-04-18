const primaryNav = document.querySelector (".primary-navigation");
const navToggle = document.querySelector (".mobile-nav-toggle");
const headerWrapper = document.querySelector(".header-wrapper");

navToggle.addEventListener('click', ()  => {
   const visibility = headerWrapper.getAttribute("data-visible");
   
   if (visibility === "false") {
      headerWrapper.setAttribute ("data-visible", "true");
   } else if (visibility === "true") {
      headerWrapper.setAttribute ("data-visible", "false");
   }
});

navToggle.addEventListener('click', ()  => {
   const visibility = primaryNav.getAttribute("data-visible");
   
   if (visibility === "false") {
      primaryNav.setAttribute ("data-visible", true);
      navToggle.setAttribute ("aria-expanded", true);
   } else if (visibility === "true") {
      primaryNav.setAttribute ("data-visible", false);
      navToggle.setAttribute ("aria-expanded", false);
   }
}); 

// Получаем элемент .how-it-works-list
const howItWorksItem = document.querySelector('.how-it-works-item');

// Функция для установки значения CSS-переменной
function setItemWidth() {
   const itemWidth = howItWorksItem.offsetWidth; // Получаем ширину контейнера
   document.documentElement.style.setProperty('--item-width', `${itemWidth}px`); // Устанавливаем значение переменной
}

// Устанавливаем значение переменной при загрузке страницы
window.addEventListener('load', setItemWidth);

// Устанавливаем значение переменной при изменении размера окна браузера
window.addEventListener('resize', setItemWidth);
