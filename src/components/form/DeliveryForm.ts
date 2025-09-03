import { Form } from './Form';
import { appData, events } from '../../index';
import { OrderModel } from '../models/OrderModel';
import { IEvents } from '../base/events';
import { IOrderForm } from '../../types';

export class DeliveryForm extends Form {
	private order: OrderModel;
	private addressInput: HTMLInputElement;
	private paymentButtons: HTMLButtonElement[];
	private errorsEl: HTMLSpanElement;
	private isFirstRender = true;

	constructor(formEl: HTMLFormElement, events: IEvents, order: OrderModel) {
		super(formEl, events);
		this.order = order;

		this.addressInput = formEl.querySelector<HTMLInputElement>('input[name="address"]')!;
		this.errorsEl = formEl.querySelector<HTMLSpanElement>('.form__errors')!;
		this.paymentButtons = Array.from(
			formEl.querySelectorAll<HTMLButtonElement>('.order__buttons button')
		);

		// Если уже есть активная кнопка оплаты
		const active = this.paymentButtons.find(b => b.classList.contains('button_alt-active'));
		if (active) this.updatePayment(active);

		this.initPaymentListeners();
		this.validate();
		this.isFirstRender = false;
	}

	/** Навешиваем обработчики на кнопки оплаты */
	private initPaymentListeners(): void {
		this.paymentButtons.forEach(button => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
				button.classList.add('button_alt-active');
				this.updatePayment(button);
			});
		});
	}

	/** Обновляем способ оплаты в модели */
	private updatePayment(button: HTMLButtonElement): void {
		const paymentMap: Record<string, IOrderForm['payment']> = {
			card: 'online',
			cash: 'cash'
		};
		const value = paymentMap[button.name] ?? 'cash';
		this.onFieldChange('payment', value);
	}

	/** Обработка изменения полей */
	protected onFieldChange(field: keyof IOrderForm, value: string): void {
		appData.setOrderField(field, value);
		this.validate();
	}

	/** Валидация формы */
	private validate(): void {
		const data = this.order.getData();
		let error: string | null = null;

		if (data.payment && !this.isFirstRender) {
			if (!this.addressInput.value.trim() || this.addressInput.value.trim().length < 5) {
				error = 'Необходимо указать адрес';
			}
		}

		this.errorsEl.textContent = error ?? '';
		this.setValid(!error && !!data.payment);
	}

	/** Сабмит формы */
	protected handleSubmit(): void {
		const data = this.order.getData();
		if (data.payment && data.address) {
			events.emit('checkout:step1Completed');
		}
	}
}
