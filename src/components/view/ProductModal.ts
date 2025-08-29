import { ICard } from '../../types';
import { IEvents } from '../base/events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class ProductModal {
  private container: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;
  }

  displayProduct(product: ICard): void {
    // клонируем шаблон карточки для модалки
    const template = cloneTemplate('#card-preview');

    // заполняем данные
    ensureElement<HTMLElement>('.card__category', template).textContent = product.category;
    ensureElement<HTMLElement>('.card__title', template).textContent = product.title;
    ensureElement<HTMLImageElement>('.card__image', template).src = product.image;
    ensureElement<HTMLElement>('.card__price', template).textContent = `${product.price} синапсов`;

    // добавляем обработчик кнопки "В корзину"
    const btn = template.querySelector('.card__button') as HTMLButtonElement;
    btn?.addEventListener('click', () => this.events.emit('cart:add', { product }));

    // вставляем в контейнер
    this.container.replaceChildren(template);
  }
}