import { IOrder, IOrderModel } from '../../types/index';
import { isEmpty } from '../../utils/utils'; //проверяет, является ли значение пустым
import { IEvents } from '../base/events';

export class OrderModel implements IOrderModel {
	private data: Record<string, string> = {};
	private errors: Record<string, string> = {};
	private events: IEvents;

	constructor(events: IEvents, initialData: Record<string, string> = {}) {
		this.events = events;
		this.setData(initialData); //вызывается для установки начальных данных и валидации
	}

	setData(inputData: Record<string, string>): void {
		this.data = { ...this.data, ...inputData };
		this.validate();
		this.events.emit('order:validated', {
			data: this.data,
			errors: this.errors,
		});
	}

	//возвращает копию текущиъ данных заказа (... - не будут изменены)
	getData(): Record<string, string> {
		return { ...this.data };
	}

	//возвращает копию объектов ошибок
	getErrors(): Record<string, string> {
		return { ...this.errors };
	}

	getErrorMessage(field: string): string {
		return this.errors[field] ?? '';
	}

	isValid(): boolean {
		return Object.keys(this.errors).length === 0; //если пусто - данные валидны - true
	}

	//правила валидации
	private rules: Record<string, (value: string) => string | null> = {
    address: (value: string) =>
        isEmpty(value) || value.trim().length < 5
            ? 'Необходимо указать адрес'
            : null,

    phone: (value: string) => {
        if (isEmpty(value)) return 'Необходимо указать телефон';
        const digits = value.replace(/\D/g, '');
        return digits.length === 11 ? null : 'Телефон должен содержать 11 цифр';
    },

    email: (value: string) => {
        if (isEmpty(value)) return 'Необходимо указать email';
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
            ? null
            : 'Некорректный email';
    },

    payment: (value: string) => null,
};

	validate(): void {
        this.errors = {};
        Object.keys(this.rules).forEach((field) => {
            const error = this.rules[field](this.data[field] ?? '');
            if (error) this.errors[field] = error;
        });
    }

	//подготовка данных к API
	toApiOrder(items: string[], total: number): IOrder {
		return {
			items,
			address: this.data.address,
			email: this.data.email,
			phone: this.data.phone,
			payment: this.data.payment as 'online' | 'cash', //приведение типа
			total,
		};
	}
}
