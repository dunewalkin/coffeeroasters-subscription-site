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
