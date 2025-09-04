import { cloneTemplate, ensureElement } from '../../utils/utils';
import { ICard } from '../../types/index';
import { IEvents } from '../base/events';

export class CardBasket {
  private element: HTMLElement;

  constructor(
    private product: ICard,
    private events: IEvents,
    private index: number
  ) {
    // используй правильный id шаблона
    const template = cloneTemplate('#card-basket');

    ensureElement<HTMLElement>('.basket__item-index', template).textContent = String(index);
    ensureElement<HTMLElement>('.card__title', template).textContent = product.title;
    ensureElement<HTMLElement>('.card__price', template).textContent = `${product.price} синапсов`;

    const deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', template);
    deleteBtn.addEventListener('click', () => {
      this.events.emit('cart:remove', { id: product.id });
    });

    this.element = template;
  }

  render(): HTMLElement {
    return this.element;
  }
}