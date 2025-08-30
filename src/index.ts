import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { templates } from './components/base/templates';
import { API_URL, CDN_URL } from './utils/constants';
import { ICard } from './types';

import { Modal } from './components/Modal';
import { Page } from './components/Page';

import { CardsCatalog } from './components/cards/CardsCatalog'; 
import { CardModal } from './components/cards/CardModal';

import { BasketModal } from './components/basket/BasketModal';
import { BasketModel } from './components/models/BasketModel';

// единый «телефон» (events), по которому разные кусочки проекта могут общаться
export const events = new EventEmitter();

// создаём модель корзины
export const basketModel = new BasketModel();

// создаём BasketModal
const basketModal = new BasketModal(
  document.createElement('div'), // временный контейнер, потом заменим content в Modal
  events
);

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

const cartButton = document.querySelector('.header__basket') as HTMLButtonElement;


// --- Слушатели событий ---

// Клик на карточку
events.on('card:open', (data?: { card?: ICard }) => {
  if (!data?.card) return;
  console.log('card:open → карточка кликнута', data.card);

  // Создаём контейнер с шаблоном для модалки
  const contentEl = templates.cardPreview();

  // Рендерим карточку в модалке через CardModal
  const cardModal = new CardModal(contentEl, events);
  cardModal.setData(data.card); // теперь используем setData

  // Открываем модалку
  modal.setData({
    content: contentEl,
    card: data.card
  });
});

// Клик на корзину
cartButton.addEventListener('click', () => {
  basketModal.setData(); // наполняем корзину
  modal.setData({
    content: basketModal.render(), // передаём готовый контейнер
    card: undefined
  });
});

// Добавление товара в корзину
events.on('cart:add', (data: { product: ICard }) => {
  basketModel.addItem(data.product);
  events.emit('basket:update'); // обновляем счётчик
});

// Обновление счётчика корзины в шапке
events.on('basket:update', () => {
  page.updateCartCounter(basketModel.getItems().length);
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
    const card = new CardsCatalog();

    card.setData(product);

    return card;
  });

  //выводим карточки
  page.renderCards(cards);
})

