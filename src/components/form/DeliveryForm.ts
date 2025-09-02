import { appData, events } from '../..';
import { OrderModel } from '../models/OrderModel';
import { ensureElement } from '../../utils/utils';

export class DeliveryForm {
	private formEl: HTMLFormElement;
	private submitButton: HTMLButtonElement;
	private paymentButtons: HTMLButtonElement[];
	private addressInput: HTMLInputElement;
	private errorsEl: HTMLElement;
	private order: OrderModel;

	constructor(container: HTMLElement, order: OrderModel) {
		this.order = order;

		this.formEl = ensureElement<HTMLFormElement>('form', container);
		this.submitButton = ensureElement<HTMLButtonElement>('.order__button', container);
		this.errorsEl = ensureElement<HTMLElement>('.form__errors', container);
		this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
		this.paymentButtons = Array.from(container.querySelectorAll<HTMLButtonElement>('.order__buttons button'));

		this.initListeners();

		// Если есть уже активная кнопка, выставляем payment
		const activeButton = this.paymentButtons.find(b => b.classList.contains('button_active'));
		if (activeButton) {
			appData.setOrderField('payment', activeButton.name as 'online' | 'cash');
		}

		this.validate();
	}

	private initListeners() {
		// Поле адреса
		this.addressInput.addEventListener('input', () => {
			appData.setOrderField('address', this.addressInput.value);
			this.validate();
		});

		// Кнопки оплаты
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach(b => b.classList.remove('button_active', 'button_error'));
				button.classList.add('button_active');

				// Сохраняем payment
				appData.setOrderField('payment', button.name as 'card' | 'cash');

				this.validate();
			});
		});

		// Submit формы
		this.formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			this.validate();
			this.handleSubmit();
		});
	}

	private validate() {
		this.order.validate();

		const data = this.order.getData();
		const payment = data.payment; // теперь поле называется payment
		const address = data.address;

		let errors: string[] = [];

		// Проверка оплаты
		if (!payment) {
			errors.push('Выберите способ оплаты');
			this.paymentButtons.forEach(b => b.classList.add('button_error'));
		} else {
			this.paymentButtons.forEach(b => b.classList.remove('button_error'));
		}

		// Проверка адреса
		if (!address || this.order.getErrors().address) {
			errors.push(this.order.getErrors().address || 'Введите корректный адрес');
		}

		this.errorsEl.textContent = errors.join('; ');
		this.submitButton.disabled = errors.length > 0;
	}

	private handleSubmit() {
		if (!this.errorsEl.textContent) {
			events.emit('checkout:step1Completed');
		} else {
			events.emit('form:validationError', { message: this.errorsEl.textContent });
		}
	}
}
