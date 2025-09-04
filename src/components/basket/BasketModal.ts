import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class BasketModal extends Component<unknown> {
  private events: IEvents;

  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private btn: HTMLButtonElement;
  private _template: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    //клонируем шаблон корзины
    this._template = cloneTemplate('#basket');

    //получаем элементы списка, кнопки и цены
    this.listEl = ensureElement<HTMLElement>('.basket__list', this._template);
    this.totalEl = ensureElement<HTMLElement>('.basket__price', this._template);
    this.btn = ensureElement<HTMLButtonElement>('.basket__button', this._template);

    // событие оформления заказа
    this.btn.addEventListener('click', () => {
      this.events.emit('checkout:step1');
    });
  }

  //абстрактный метод для соответствия Component
  setData(_data?: unknown): void {
  }

  //возвращает готовый элемент для вставки в .modal__content
  render(): HTMLElement {
    return this._template;
  }

  //обновление списка товаров
  set list(items: HTMLElement[]) {
    if (!items.length) {
      this.listEl.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
      this.setDisabled(this.btn, true);
      this.setText(this.totalEl, '0 синапсов');
    } else {
      this.listEl.replaceChildren(...items);
      this.setDisabled(this.btn, false);
    }
  }

  //обновление стоимости корзины
  set total(value: number) {
    this.setText(this.totalEl, `${value} синапсов`);
  }
}
