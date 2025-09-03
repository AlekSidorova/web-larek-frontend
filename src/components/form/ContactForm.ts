import { Form } from './Form';
import { appData, events } from '../../index';
import { OrderModel } from '../models/OrderModel';
import { IEvents } from '../base/events';

export class ContactForm extends Form {
	private order: OrderModel;
	private phoneInput: HTMLInputElement;

	constructor(formEl: HTMLFormElement, events: IEvents, order: OrderModel) {
		super(formEl, events);
		this.order = order;

		this.phoneInput = formEl.querySelector<HTMLInputElement>('input[name="phone"]')!;

		// Начальная валидация
		this.validate();
	}

	protected onFieldChange(field: string, value: string) {
		if (field === 'email') {
			appData.setOrderField('email', value || '');
		} else if (field === 'phone') {
			const formatted = this.formatPhone(value);
			appData.setOrderField('phone', formatted);
			this.phoneInput.value = formatted;
		}

		this.validate();
	}

	protected handleSubmit() {
		events.emit('checkout:step2Completed');
	}

	private validate() {
		const data = this.order.getData();
		const email = data.email || '';
		const phone = data.phone || '';

		const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
		const phoneDigits = phone.replace(/\D/g, '');
		const phoneValid = phoneDigits.length === 11;

		this.setValid(emailValid && phoneValid);
	}

	private formatPhone(value: string): string {
		let digits = value.replace(/\D/g, '');
		if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
		digits = digits.substring(0, 10);

		let formatted = '+7';
		if (digits.length > 0) formatted += ' (' + digits.substring(0, 3);
		if (digits.length >= 4) formatted += ') ' + digits.substring(3, 6);
		if (digits.length >= 7) formatted += ' ' + digits.substring(6, 8);
		if (digits.length >= 9) formatted += ' ' + digits.substring(8, 10);

		return formatted;
	}
}
