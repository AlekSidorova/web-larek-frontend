import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { basketModel } from '../../index';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class BasketModal extends Component<unknown> {
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
  }

  setData(): void {
    const template = cloneTemplate('#basket');
    const listEl = ensureElement<HTMLElement>('.basket__list', template);
    const totalEl = ensureElement<HTMLElement>('.basket__price', template);
    const btn = ensureElement<HTMLButtonElement>('.basket__button', template);

    btn.addEventListener('click', () => {
      if (!basketModel.getItems().length) return;
      this.events.emit('checkout:step1');
    });

    const items = basketModel.getItems();

    if (!items.length) {
      listEl.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
      this.setDisabled(btn, true);
      this.setText(totalEl, '0 синапсов');
    } else {
      listEl.replaceChildren(
        ...items.map((item, idx) => {
          const li = document.createElement('li');
          li.className = 'basket__item card card_compact';
          li.innerHTML = `
            <span class="basket__item-index">${idx + 1}</span>
            <span class="card__title">${item.title}</span>
            <span class="card__price">${item.price} синапсов</span>
            <button class="basket__item-delete" aria-label="удалить"></button>
          `;
          const deleteBtn = li.querySelector('.basket__item-delete') as HTMLButtonElement;
          deleteBtn.addEventListener('click', () => {
            basketModel.removeItem(item.id);
            this.setData();
            this.events.emit('basket:update');
          });
          return li;
        })
      );
      this.setDisabled(btn, false);
      this.setText(totalEl, basketModel.getTotalPrice() + ' синапсов');
    }

    this.container.replaceChildren(template);
  }
}
