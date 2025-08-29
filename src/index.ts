import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { templates } from './components/base/templates';
import { API_URL, CDN_URL } from './utils/constants';
import { ICard } from './types';

import { Page } from './components/Page';
import { ProductCard } from './components/product/ProductCard'; 
import { Modal } from './components/Modal';
import { ProductModal } from './components/product/ProductModal';


// единый «телефон» (events), по которому разные кусочки проекта могут общаться
export const events = new EventEmitter();

//создаем апи
const api = new AppApi(API_URL, CDN_URL);

//создаем Page
const page = new Page(
  '.gallery', 
  '.header__basket', 
  '.header__basket-counter', 
  events
);

//создаем modal
const modal = new Modal('#' + templates.modalContainer.id, events);


// --- Слушатели событий ---

// Клик на карточку
events.on('card:open', (data?: { card?: ICard }) => {
  if (!data?.card) return;
  console.log('card:open → карточка кликнута', data.card);

  // Создаём контейнер с шаблоном для модалки
  const contentEl = templates.cardPreview();

  // Рендерим карточку в модалке через ProductModal
  const productModal = new ProductModal(contentEl, events);
  productModal.setData(data.card); // теперь используем setData

  // Открываем модалку
  modal.setData({
    content: contentEl,
    card: data.card
  });
});

// Клик на корзину
const cartButton = document.querySelector('.header__basket') as HTMLButtonElement;
cartButton.addEventListener('click', () => {
  console.log('Клик на корзину');
  modal.setData({
    content: templates.basket(), // HTMLElement
    card: undefined              // карточки нет
  });
});

// // Переход к чекауту (этапы оформления)
// events.on('checkout:step1', () => {
//   modal.setData({ content: templates.order() });
// });

// events.on('checkout:step2', () => {
//   modal.setData({ content: templates.contacts() });
// });

//загружаем список карточек
api.getProductList().then((products) => {
  const cards = products.map((product) => {
    const card = new ProductCard();

    card.setData(product);

    return card;
  });

  //выводим карточки
  page.renderCards(cards);
})

