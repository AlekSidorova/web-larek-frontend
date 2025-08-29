import { CardsData } from './CardsData';
import { ICard } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { basketModel } from '../../index';

export class ProductModal extends CardsData {
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

    // Удаляем все предыдущие обработчики
    const newBtn = btn.cloneNode(true) as HTMLButtonElement;
    btn.replaceWith(newBtn);

    newBtn.addEventListener('click', () => {
      if (!product.price) return;

      if (basketModel.isInCart(product.id)) {
        basketModel.removeItem(product.id);
        newBtn.textContent = 'В корзину';
      } else {
        basketModel.addItem(product);
        newBtn.textContent = 'Удалить из корзины';
      }

      // Уведомляем все слушатели об изменении корзины
      this.events.emit('basket:update');
    });

    // Ставим начальное состояние кнопки
    if (!product.price) {
      newBtn.textContent = 'Недоступно';
      newBtn.disabled = true;
    } else if (basketModel.isInCart(product.id)) {
      newBtn.textContent = 'Удалить из корзины';
    } else {
      newBtn.textContent = 'В корзину';
    }

    // Картинка с margin 0
    const imageEl = ensureElement<HTMLImageElement>('.card__image', template);
    imageEl.style.margin = '0';

    this.container.replaceChildren(template);
  }
}
