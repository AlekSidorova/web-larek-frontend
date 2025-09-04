import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { templates } from '../base/templates';
import { Modal } from '../Modal';

export class OrderSuccessView extends Component<number> {
	private events: IEvents;
	private modal: Modal;
	private descriptionEl!: HTMLParagraphElement;
	private closeBtn!: HTMLButtonElement;

	constructor(events: IEvents, modal: Modal) {
		const container = templates.success();
		super(container);

		this.events = events;
		this.modal = modal;

		this.descriptionEl = this.container.querySelector<HTMLParagraphElement>(
			'.order-success__description'
		)!;
		this.closeBtn = this.container.querySelector<HTMLButtonElement>(
			'.order-success__close'
		)!;

		this.closeBtn.addEventListener('click', () => {
			this.modal.close();
		});
	}

	setData(total: number): void {
		this.descriptionEl.textContent = `Списано ${total} синапсов`;
	}

	render(): HTMLElement {
		return this.container;
	}
}
