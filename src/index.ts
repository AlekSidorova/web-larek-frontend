import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { templates } from './components/base/templates';
import { API_URL, CDN_URL } from './utils/constants';
import { IModalUpdatePayload, ICard } from './types';

import { Page } from './components/view/Page';
import { ProductCard } from './components/view/ProductCard'; 
import { Modal } from './components/view/Modal';

//единый «телефон» (events), по которому разные 
//кусочки проекта могут общаться, не зная друг о друге напрямую  
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

// Слушаем обновления модалки
events.on('modal:update', ({ type, card }: IModalUpdatePayload) => {
  console.log('modal:update', type, card);

  const contentEl = templates.modalContent;
  contentEl.replaceChildren();

  switch (type) {
    case 'product':
      contentEl.append(templates.cardPreview());
      break;
    case 'basket':
      contentEl.append(templates.basket());
      break;
    case 'checkoutStep1':
      contentEl.append(templates.order());
      break;
    case 'checkoutStep2':
      contentEl.append(templates.contacts());
      break;
  }
});

// Клик на карточку
events.on('card:open', (data?: { card?: ICard }) => {
  if (!data?.card) return; // безопасная проверка
  console.log('card:open → карточка кликнута', data.card);

  modal.setData({
    content: templates.cardPreview(), // HTMLElement шаблона
    card: data.card
  });
});

// Клик на корзину
const cartButton = document.querySelector('.header__basket') as HTMLButtonElement;
cartButton.addEventListener('click', () => {
  console.log('Клик на корзину');
  modal.setData({
    content: templates.basket(), // HTMLElement
    card: undefined               // карточки нет
  });
});

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

