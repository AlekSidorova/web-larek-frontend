import { ProductView } from './ProductView';
import { ICard } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

export class ProductModal extends ProductView {
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  setData(product: ICard): void {
    const template = cloneTemplate('#card-preview');
    this.fillBase(template, product);

    // Кнопка
    const btn = ensureElement<HTMLButtonElement>('.card__button', template);
    if (!product.price) {
      btn.textContent = 'Недоступно';
      btn.disabled = true;
    } else {
      btn.textContent = 'В корзину';
      btn.disabled = false;
      btn.addEventListener('click', () => this.events.emit('cart:add', { product }));
    }

		//ставим картинке марджин 0
    const imageEl = ensureElement<HTMLImageElement>('.card__image', template);
    imageEl.style.margin = '0';

    this.container.replaceChildren(template);
  }
}
