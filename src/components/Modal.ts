import { Component } from './base/Component';
import { IModalData, ModalContentType } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement, cloneTemplate } from '../utils/utils';

export class Modal extends Component<IModalData> {
  private modal: HTMLElement;
  private contentEl: HTMLElement;
  private closeBtn: HTMLElement;
  private events: IEvents;

  constructor(
    containerSelector: string,
    events: IEvents
  ) {
    const container = ensureElement<HTMLElement>(containerSelector);
    super(container);

    this.events = events;
    this.modal = container;
    this.contentEl = ensureElement<HTMLElement>('.modal__content', container);
    this.closeBtn = ensureElement<HTMLElement>('.modal__close', container);

    this.addEventListeners();
  }

  // Сеттер для контента
  set content(value: HTMLElement | ModalContentType) {
    const node = typeof value === 'string' ? cloneTemplate(value) : value;
    this.contentEl.replaceChildren(node);
  }

  // Абстрактный метод Component
 setData(data: IModalData): void {
  this.content = data.content;
  this.open();
  if (data.card) {
    this.events.emit('modal:update', { type: 'product', card: data.card });
  } else {
    this.events.emit('modal:update', { type: 'basket', card: null });
  }
}

  // Открытие
  open(): void {
    this.modal.classList.add('modal_active');
    document.body.classList.add('_locked');
    this.events.emit('modal:open');
  }

  // Закрытие
  close(): void {
    this.modal.classList.remove('modal_active');
    document.body.classList.remove('_locked');
    this.contentEl.replaceChildren(); // очищаем контент
    this.events.emit('modal:close');
  }

  private addEventListeners(): void {
    // крестик
    this.closeBtn.addEventListener('click', () => this.close());

    // клик вне контента
    this.modal.addEventListener('click', () => this.close());

    // клик по контенту не закрывает модалку
    this.contentEl.addEventListener('click', (e) => e.stopPropagation());

    // Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }
}
