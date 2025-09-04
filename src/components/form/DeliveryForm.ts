import { Form } from './Form';
import { IEvents } from '../base/events';
import { IOrderForm } from '../../types';

export class DeliveryForm extends Form {
	private addressInput: HTMLInputElement;
	private paymentButtons: HTMLButtonElement[];
	private errorsEl: HTMLSpanElement;
	private isFirstRender = true; //флаг, показывающий, находится ли форма в первом состоянии рендеринга (для ошибок)

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
		this.isFirstRender = false;
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

				// эмитим событие, presenter обновляет модель
				this.events.emit('order:fieldChange', { field: 'payment', value });
				this.validate();
			});
		});
	}

	//слушаеть инпут (адрес)
	private initInputListener(): void {
		this.addressInput.addEventListener('input', () => {
			this.events.emit('order:fieldChange', {
				field: 'address',
				value: this.addressInput.value.trim(),
			});
			this.validate();
		});
	}

	//валидация формы
	private validate(): void {
		let error: string | null = null;

		const paymentActive = this.paymentButtons.some((b) =>
			b.classList.contains('button_alt-active')
		);

		const addressValue = this.addressInput.value.trim();

		if (!this.isFirstRender) {
			if (!addressValue || addressValue.length < 5) {
				error = 'Необходимо указать адрес';
			}
		}

		this.errorsEl.textContent = error ?? ''; //отображение ошибок
		this.setValid(!error && paymentActive && !!addressValue); //состояние кнопок
	}

	//обрабатывает событие отправки формы
	protected handleSubmit(): void {
		const paymentActive = this.paymentButtons.some((b) =>
			b.classList.contains('button_alt-active')
		);
		const addressValue = this.addressInput.value.trim();

		if (paymentActive && addressValue) {
			// уведомляем presenter, что шаг завершен
			this.events.emit('checkout:step1Completed'); //1 шаг успешно завершен
		}
	}

	protected onFieldChange(field: keyof IOrderForm, value: string): void {
		// делаем через события, напрямую модель не трогаем
		this.events.emit('order:fieldChange', { field, value });
		this.validate();
	}

	public getElement(): HTMLFormElement {
		return this.formEl;
	}

	protected onReset(): void {
		this.paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
		this.addressInput.value = '';
		this.errorsEl.textContent = '';
	}
}
