import { CardsData } from './CardsData';
import { ICard } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { basketModel } from '../../index';

export class CardModal extends CardsData {
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  setData(product: ICard): void {
    const template = cloneTemplate('#card-preview');
    this.fillBase(template, product);

    const btn = ensureElement<HTMLButtonElement>('.card__button', template);
    btn.disabled = false;

    const newBtn = btn.cloneNode(true) as HTMLButtonElement;
    btn.replaceWith(newBtn);

    newBtn.addEventListener('click', () => {
      if (!product.price) return;

      if (basketModel.isInCart(product.id)) {
        basketModel.removeItem(product.id);
        this.setText(newBtn, 'В корзину');
      } else {
        basketModel.addItem(product);
        this.setText(newBtn, 'Удалить из корзины');
      }

      this.events.emit('basket:update');
    });

    // Начальное состояние кнопки
    if (!product.price) {
      this.setText(newBtn, 'Недоступно');
      newBtn.disabled = true;
    } else if (basketModel.isInCart(product.id)) {
      this.setText(newBtn, 'Удалить из корзины');
    } else {
      this.setText(newBtn, 'В корзину');
    }

    // Картинка без margin
    const imageEl = ensureElement<HTMLImageElement>('.card__image', template);
    imageEl.style.margin = '0';

    this.container.replaceChildren(template);
  }
}
