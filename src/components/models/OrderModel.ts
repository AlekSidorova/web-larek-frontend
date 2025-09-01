import { IOrder, IOrderModel } from '../../types/index';
import { isEmpty } from '../../utils/utils';

export class OrderModel implements IOrderModel {
	private data: Record<string, string> = {};
	private errors: Record<string, string> = {};

	constructor(initialData: Record<string, string> = {}) {
		//объект с начальными данными
		this.setData(initialData); //устанавливаем начальные данные и выполняем валидацию
	}

	//устанавливаем новые данные
	setData(inputData: Record<string, string>): void {
		this.data = { ...this.data, ...inputData }; //объединяем (...) существующие данные
		this.validate();
	}

	//возвращаем текущие данные товара
	getData(): Record<string, string> {
		return this.data;
	}

	//возвращаем ошибки
	getErrors(): Record<string, string> {
		return this.errors;
	}

	//получить все ошибки одной строкой
	//собирает сообщения об ошибках, фильтрует и соединяет в одну строку
	getErrorMessage(separator: string = '; '): string {
		return Object.values(this.errors)
			.filter((i) => !!i) //убираем пустые строки
			.join(separator); 
	}

	//есть ли ошибки
	isValid(): boolean {
		//если errors=0 значит ошибок нет-true
		return Object.keys(this.errors).length === 0;
	}

	// правила валидации
	private rules: Record<string, (value: string) => string | null> = {
		address: (value: string) => {
			if (isEmpty(value) || value.trim().length < 5) {
				return 'Необходимо указать адрес';
			}
			return null;
		},
		email: (value: string) => {
			const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
			if (isEmpty(value) || !emailRegex.test(value)) {
				return 'Введите корректный email';
			}
			return null;
		},
		phone: (value: string) => {
			const phoneRegex = /^\+?\d{10,15}$/;
			if (isEmpty(value) || !phoneRegex.test(value)) {
				return 'Введите корректный телефон';
			}
			return null;
		},
	};

	//проверяем данные на корректность
	public validate(): void {
		this.errors = {}; 
		for (const field in this.rules) {
			const value = this.data[field] ?? '';
			const error = this.rules[field](value);
			if (error) this.errors[field] = error;
		}
	}

	// метод для подготовки данных к API (собираем в IOrder)
	toApiOrder(items: string[]): IOrder {
		return {
			items,
			address: this.data.address,
			email: this.data.email,
			phone: this.data.phone,
		};
	}
}
