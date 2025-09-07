import { Form } from './Form';
import { IEvents } from '../base/events';
import { IOrderForm } from '../../types';

export class DeliveryForm extends Form {
	private addressInput: HTMLInputElement;
	public  paymentButtons: HTMLButtonElement[];
	public  errorsEl: HTMLSpanElement;

	constructor(formEl: HTMLFormElement, events: IEvents) {
		super(formEl, events);

		this.addressInput = formEl.querySelector<HTMLInputElement>(
			'input[name="address"]'
		)!;

		this.errorsEl = formEl.querySelector<HTMLSpanElement>('.form__errors')!;

		this.paymentButtons = Array.from(
			formEl.querySelectorAll<HTMLButtonElement>('.order__buttons button')
		);

		this.initPaymentListeners();
		this.initInputListener();
	}

	//слушатель кнопок оплаты
	private initPaymentListeners(): void {
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach((b) =>
					b.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');

				const paymentMap: Record<string, IOrderForm['payment']> = {
					card: 'online',
					cash: 'cash',
				};
				const value = paymentMap[button.name] ?? 'cash';

				this.events.emit('order:fieldChange', { field: 'payment', value });
			});
		});
	}

	//слушатель адреса
	private initInputListener(): void {
		this.addressInput.addEventListener('input', () => {
			this.events.emit('order:fieldChange', {
				field: 'address',
				value: this.addressInput.value.trim(),
			});
		});
	}

	protected handleSubmit(): void {
		const paymentActive = this.paymentButtons.some((b) =>
			b.classList.contains('button_alt-active')
		);
		const addressValue = this.addressInput.value.trim();

		if (paymentActive && addressValue) {
			this.events.emit('checkout:step1Completed'); //1 шаг завершен
		}
	}

	protected onFieldChange(field: keyof IOrderForm, value: string): void {
		this.events.emit('order:fieldChange', { field, value });
	}

	protected onReset(): void {
		this.paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
		this.addressInput.value = '';
		this.errorsEl.textContent = '';
	}
}
