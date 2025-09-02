import { Form } from './Form';
import { appData, events } from '../../index';
import { OrderModel } from '../models/OrderModel';
import { IEvents } from '../base/events';

export class ContactForm extends Form {
	private order: OrderModel;
	private submitBtn: HTMLButtonElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;

	constructor(formEl: HTMLFormElement, events: IEvents, order: OrderModel) {
		super(formEl, events);
		this.order = order;

		// Элементы формы
		this.submitBtn = formEl.querySelector<HTMLButtonElement>(
			'button[type="submit"]'
		)!;
		this.emailInput = formEl.querySelector<HTMLInputElement>(
			'input[name="email"]'
		)!;
		this.phoneInput = formEl.querySelector<HTMLInputElement>(
			'input[name="phone"]'
		)!;

		// Начальная проверка
		this.validate();

		// Слушатели ввода
		this.emailInput.addEventListener('input', () => {
			this.onFieldChange('email', this.emailInput.value);
		});

		this.phoneInput.addEventListener('input', (e: Event) => {
			const input = e.target as HTMLInputElement;

			// Берём только цифры
			let digits = input.value.replace(/\D/g, '');

			// Убираем ведущую 7 или 8 (если пользователь вводит +7...)
			if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);

			// Ограничиваем максимум 10 цифр
			digits = digits.substring(0, 10);

			// Форматируем красиво
			let formatted = '+7';
			if (digits.length > 0) formatted += ' (' + digits.substring(0, 3);
			if (digits.length >= 4) formatted += ') ' + digits.substring(3, 6);
			if (digits.length >= 7) formatted += ' ' + digits.substring(6, 8);
			if (digits.length >= 9) formatted += ' ' + digits.substring(8, 10);

			// Прописываем в поле
			input.value = formatted;

			// Сохраняем чистый номер в модель
			appData.setOrderField('phone', '+7' + digits);

			// Валидация
			this.validate();
		});

		// Слушатель сабмита
		formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			this.handleSubmit();
		});
	}

	// Обновление данных модели и валидация
	protected onFieldChange(field: string, value: string) {
		const strValue = value || '';

		if (field === 'email') {
			appData.setOrderField('email', strValue);
		}

		this.validate();
	}

	// Валидация формы
	private validate() {
		const data = this.order.getData();
		const email = data.email || '';
		const phone = data.phone || '';

		const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
		const phoneDigits = phone.replace(/\D/g, '');
		const phoneValid = phoneDigits.length === 11;

		this.submitBtn.disabled = !(emailValid && phoneValid);
	}

	// Сабмит формы
	protected handleSubmit() {
		// Данные уже сохранены в appData
		events.emit('checkout:step2Completed');
	}
}
