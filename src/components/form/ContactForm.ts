import { Form } from './Form';
import { IEvents } from '../base/events';
import { IOrderForm } from '../../types';

export class ContactForm extends Form {
	private phoneInput: HTMLInputElement;
	private emailInput: HTMLInputElement;

	constructor(formEl: HTMLFormElement, events: IEvents) {
		super(formEl, events);

		this.phoneInput = formEl.querySelector<HTMLInputElement>(
			'input[name="phone"]'
		)!;
		this.emailInput = formEl.querySelector<HTMLInputElement>(
			'input[name="email"]'
		)!;

		this.initFieldListeners();
	}

	//слушатели полей
	private initFieldListeners(): void {
    this.phoneInput.addEventListener('input', () => {
        const formatted = this.formatPhone(this.phoneInput.value);
        this.phoneInput.value = formatted;
        this.events.emit('order:fieldChange', {
            field: 'phone',
            value: formatted,
        });
    });

    this.emailInput.addEventListener('input', () => {
        this.events.emit('order:fieldChange', {
            field: 'email',
            value: this.emailInput.value,
        });
    });
}

	//обрабатывает изменение полей ввода
	protected onFieldChange(field: keyof IOrderForm, value: string): void {
		this.events.emit('order:fieldChange', { field, value });
	}

	//обработка отправки формы
	protected handleSubmit(): void {
		if (!this.submitButton.disabled) {
			this.events.emit('checkout:step2Completed', {
				email: this.emailInput.value.trim(),
				phone: this.phoneInput.value.trim(),
			});
		}
	}

	//форматирует номер телефона
	private formatPhone(value: string): string {
		let digits = value.replace(/\D/g, '');
		if (digits.startsWith('7') || digits.startsWith('8'))
			digits = digits.slice(1);
		digits = digits.substring(0, 10);

		let formatted = '+7';
		if (digits.length > 0) formatted += ' (' + digits.substring(0, 3);
		if (digits.length >= 4) formatted += ') ' + digits.substring(3, 6);
		if (digits.length >= 7) formatted += ' ' + digits.substring(6, 8);
		if (digits.length >= 9) formatted += ' ' + digits.substring(8, 10);

		return formatted;
	}

	protected onReset(): void {
		this.phoneInput.value = '';
		this.emailInput.value = '';
	}
}
