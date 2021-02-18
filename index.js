import gallery from "./gallery-items.js";

const refs = {
  gallery: document.querySelector(".js-gallery"), // Ссылка на галерею ul
  lightbox: document.querySelector(".js-lightbox"), // Ссылка на модалку
  lightboxImage: document.querySelector(".lightbox__image"), // Ссылка на img для оригинальной картинки
  lightboxOverlay: document.querySelector(".lightbox__overlay"), // Ссылка на серый фон (overlay/backdrop)
  btnClose: document.querySelector('[data-action="close-lightbox"]'), //Ссылка на кноку закрытия модалки
};

// Перебираем массив gallery для получения строки-li с нужными атрибутами для создания динамического html

const images = gallery.reduce((acc, img, index) => {
  return (
    acc +
    `<li class="gallery__item">
  <a
    class="gallery__link"
    href=${img.original}
  >
    <img
      class="gallery__image"
      src=${img.preview}
      data-source=${img.original}
      data-index = ${index}
      alt=${img.description}
    />
  </a>
</li>`
  );
}, "");

refs.gallery.insertAdjacentHTML("afterbegin", images); // Создаем динамически разметку HTML, добавляем в нашу галерею ul - созданную выше разметку
refs.gallery.addEventListener("click", onGalleryClick); // Открытие модалки по клику на img
refs.btnClose.addEventListener("click", closeLightbox); // Закрытие модалки по клику на img
refs.lightboxOverlay.addEventListener("click", closeLightbox); // Закрытие Overlay/backdrop (серый фон) по клику

//Функция открытия модального окна
function onGalleryClick(event) {
  event.preventDefault(); // Запрещаем дефолтные действия, в данном случае, переход по ссылке, при клике на img
  if (event.target.nodeName !== "IMG") {
    return;
  }

  openLightbox(); // Функция открытия модалки
  const largeImgUrl = event.target.dataset.source;
  const largeImgAlt = event.target.alt;
  const largeImgIndex = event.target.dataset.index;
  openLargeImg(largeImgUrl, largeImgAlt, largeImgIndex);
}

// Функция открытия модалки

function openLightbox() {
  window.addEventListener("keydown", onEscKeyPress); // Добавляем слушателя на клик по 'ESC'
  window.addEventListener("keydown", onArrowKeyPress); // Добавляем слушателя на клик по стрелке
  refs.lightbox.classList.add("is-open"); // Добавляем класс открытия модалки
}

// Функция закрытия модалки

function closeLightbox() {
  window.removeEventListener("keydown", onEscKeyPress); // Удаляем слушателя на клик по 'ESC'
  window.removeEventListener("keydown", onArrowKeyPress); //Удаляем слушателя на клик по стрелке
  refs.lightbox.classList.remove("is-open"); // Удаляем класс
  refs.lightboxImage.src = "";
  refs.lightboxImage.alt = "";
}
// Функция для открытия img в нашей галереи
function openLargeImg(url, alt, index) {
  refs.lightboxImage.src = url;
  refs.lightboxImage.alt = alt;
  refs.lightboxImage.dataset.index = index;
}
//Функция закрытия модалки по 'ESC'
function onEscKeyPress(event) {
  if (event.code === "Escape") {
    closeLightbox();
  }
}

// Функция для пролистывания img в модальном окне стрелками ArrowRight & ArrowLeft

function onArrowKeyPress(event) {
  let index = +refs.lightboxImage.dataset.index;
  if (event.code === "ArrowRight" && index <= gallery.length - 1) {
    refs.lightboxImage.src = gallery[index + 1].original;
    refs.lightboxImage.dataset.index = index + 1;
  }
  if (event.code === "ArrowLeft" && index >= 0) {
    refs.lightboxImage.src = gallery[index - 1].original;
    refs.lightboxImage.dataset.index = index - 1;
  }
}
