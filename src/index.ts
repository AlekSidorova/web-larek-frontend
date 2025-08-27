import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { templates } from './components/base/templates';
import { API_URL, CDN_URL } from './utils/constants';

import { Page } from './components/view/Page';
import { ProductCard } from './components/view/ProductCard'; 

//единый «телефон» (events), по которому разные 
//кусочки проекта могут общаться, не зная друг о друге напрямую  
export const events = new EventEmitter();

//создаем апи
const api = new AppApi(API_URL, CDN_URL);

//находим элементы на странице
const pageContainer = templates.gallery;
const cartButton = document.querySelector('.header__basket') as HTMLButtonElement;
const cartCounter = document.querySelector('.header__basket-counter') as HTMLElement;

//создаем Page
const page = new Page(pageContainer, cartButton, cartCounter, events);

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

