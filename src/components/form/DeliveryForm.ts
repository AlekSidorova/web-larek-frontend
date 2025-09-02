import { Form } from './Form';
import { appData, events } from '../../index';
import { OrderModel } from '../models/OrderModel';

export class DeliveryForm extends Form {
	private order: OrderModel;
	private paymentButtons: HTMLButtonElement[];

	constructor(formEl: HTMLFormElement, events: any, order: OrderModel) {
		super(formEl, events);
		this.order = order;

		this.paymentButtons = Array.from(
			formEl.querySelectorAll<HTMLButtonElement>('.order__buttons button')
		);

		// Если уже выбрана кнопка оплаты
		const active = this.paymentButtons.find((b) =>
			b.classList.contains('button_active')
		);
		if (active)
			appData.setOrderField('payment', active.name as 'online' | 'cash');

		this.validate();

		// Слушатели для кнопок оплаты
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach((b) => b.classList.remove('button_active'));
				button.classList.add('button_active');

				appData.setOrderField('payment', button.name as 'online' | 'cash');
				this.validate();
			});
		});
	}

	protected onFieldChange(field: string, value: string) {
		if (field === 'address') {
			appData.setOrderField('address', value);
			this.validate();
		}
	}

	private validate() {
		this.order.validate();
		const data = this.order.getData();
		const errors = !data.address || this.order.getErrors().address;

		this.setValid(!errors && !!data.payment);
	}

	protected handleSubmit() {
		const data = appData.order.getData();
		if (data.payment && data.address) {
			events.emit('checkout:step1Completed');
		}
	}
}
