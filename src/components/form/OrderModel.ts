import { IOrder, IOrderModel } from '../../types/index';
import { isEmpty } from '../../utils/utils';

export class OrderModel implements IOrderModel {
	private data: Record<string, string> = {};
	private errors: Record<string, string> = {};

	constructor(initialData: Record<string, string> = {}) {
		this.setData(initialData);
	}

	setData(inputData: Record<string, string>): void {
		this.data = { ...this.data, ...inputData };
		this.validate();
	}

	getData(): Record<string, string> {
		return { ...this.data };
	}

	getErrors(): Record<string, string> {
		return { ...this.errors };
	}

	getErrorMessage(): string {
    return this.errors.address ?? '';
}

	isValid(): boolean {
		return Object.keys(this.errors).length === 0;
	}

	/** Правила валидации — только адрес */
	private rules: Record<string, (value: string) => string | null> = {
		address: (value: string) =>
			isEmpty(value) || value.trim().length < 5 ? 'Необходимо указать адрес' : null,
	};

	validate(): void {
		this.errors = {};
		const addressError = this.rules.address(this.data.address ?? '');
		if (addressError) this.errors.address = addressError;
	}

	/** Подготовка данных к API */
	toApiOrder(items: string[], total: number): IOrder {
		return {
			items,
			address: this.data.address,
			email: this.data.email,
			phone: this.data.phone,
			payment: this.data.payment as 'online' | 'cash', // приведение типа
			total,
		};
	}
}
