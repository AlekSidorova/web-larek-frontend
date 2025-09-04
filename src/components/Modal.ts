import { Component } from './base/Component';
import { IModalData, ModalContentType } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement, cloneTemplate } from '../utils/utils';

export class Modal extends Component<IModalData> {
	private modal: HTMLElement;
	private contentEl: HTMLElement;
	private closeBtn: HTMLElement;
	private events: IEvents;

	constructor(containerSelector: string, events: IEvents) {
		const container = ensureElement<HTMLElement>(containerSelector);
		super(container);

		this.events = events;
		this.modal = container;
		this.contentEl = ensureElement<HTMLElement>('.modal__content', container);
		this.closeBtn = ensureElement<HTMLElement>('.modal__close', container);

		this.addEventListeners();
	}

	set content(value: HTMLElement | ModalContentType) {
		const node = typeof value === 'string' ? cloneTemplate(value) : value;
		this.contentEl.replaceChildren(node); //содержимое элемента заменяется на новый узел
	}

	//устанавливает данные для модального окна
	setData(data: IModalData): void {
		this.content = data.content;
		this.open();

		this.events.emit('modal:update', {
			type: data.card ? 'product' : 'basket', //тип модального окна
			card: data.card ?? null,
		});
	}

	open(): void {
		this.toggleClass(this.modal, 'modal_active', true);
		document.body.classList.add('_locked');
		this.events.emit('modal:open');
	}

	close(): void {
		this.toggleClass(this.modal, 'modal_active', false);
		document.body.classList.remove('_locked');

		this.contentEl.replaceChildren(); //очищает содержимое
		this.events.emit('modal:close');
	}

	private addEventListeners(): void {
		this.closeBtn.addEventListener('click', () => this.close());
		this.modal.addEventListener('click', () => this.close());
		this.contentEl.addEventListener('click', (e) => e.stopPropagation());

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') this.close();
		});
	}

	isActive(): boolean {
		return this.modal.classList.contains('modal_active');
	}
}
