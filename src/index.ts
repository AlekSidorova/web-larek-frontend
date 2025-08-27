import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { ProductCard } from './components/view/ProductCard'; 

import { ICard } from './types';

//единый «телефон» (events), по которому разные 
//кусочки проекта могут общаться, не зная друг о друге напрямую  
export const events = new EventEmitter();


//ТЕСТ
// ищем элементы на странице
const catalogContainer = document.querySelector(".gallery") as HTMLElement;
const cartButton = document.querySelector(".header__basket") as HTMLButtonElement;
const cartCounter = document.querySelector(".header__basket-counter") as HTMLElement;

// создаем Page
const page = new Page(catalogContainer, cartButton, cartCounter, events);

// тестовые карточки
const testCards: ICard[] = [
  {
    id: "1",
    title: "Тестовый товар 1",
    category: "Категория А",
    image: "https://placehold.co/200x150",
    price: 100,
    description: "Описание товара 1"
  },
  {
    id: "2",
    title: "Тестовый товар 2",
    category: "Категория B",
    image: "https://placehold.co/200x150",
    price: 200,
    description: "Описание товара 2"
  }
];

// рендерим карточки через ProductCard
const renderedCards = testCards.map((data) => {
  const card = new ProductCard();
  card.setData(data);
  return card.getElement();
});

page.renderCards(renderedCards);