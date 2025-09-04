import { IOrder, IOrderModel } from '../../types/index';
import { isEmpty } from '../../utils/utils'; //проверяет, является ли значение пустым

export class OrderModel implements IOrderModel {
	private data: Record<string, string> = {};
	private errors: Record<string, string> = {};

	constructor(initialData: Record<string, string> = {}) {
		this.setData(initialData); //вызывается для установки начальных данных и валидации
	}

	setData(inputData: Record<string, string>): void {
		this.data = { ...this.data, ...inputData };
		this.validate();
	}

	//возвращает копию текущиъ данных заказа (... - не будут изменены)
	getData(): Record<string, string> {
		return { ...this.data };
	}

	//возвращает копию объектов ошибок
	getErrors(): Record<string, string> {
		return { ...this.errors };
	}

	getErrorMessage(): string {
		return this.errors.address ?? '';
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
	};

	validate(): void {
		this.errors = {}; //очищает ошибки
		const addressError = this.rules.address(this.data.address ?? '');
		if (addressError) this.errors.address = addressError;
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
