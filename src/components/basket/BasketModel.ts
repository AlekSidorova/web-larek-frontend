import { ICard } from '../../types/index';
import { IEvents } from '../base/events';

export class BasketModel {
	private items: ICard[] = [];
	private totalPrice: number = 0;

	constructor(private events: IEvents, initialItems: ICard[] = []) {
		this.items = [...initialItems];
		this.totalPrice = this.calculateTotal();
	}

	private calculateTotal(): number {
		return this.items.reduce((sum, item) => sum + (item.price || 0), 0); //0+цена товара
	}

	addItem(item: ICard): void {
		//проверяет, есить ли товар id в корзине
		if (!this.isInCart(item.id)) {
			this.items.push(item);
			this.totalPrice = this.calculateTotal();
			this.events.emit('basket:update');
		}
	}

	//удаляет товар по его id
	removeItem(id: string): void {
		this.items = this.items.filter((item) => item.id !== id);
		this.totalPrice = this.calculateTotal();
		this.events.emit('basket:update');
	}

	//очищает корзину
	clear(): void {
		this.items = [];
		this.totalPrice = 0;
		this.events.emit('basket:update');
	}

	//возвращает копию товаров в корзине
	getItems(): ICard[] {
		return this.items;
	}

	getTotalPrice(): number {
		return this.totalPrice;
	}

	//проверяет, есть ли товар в корзине
	isInCart(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}
}
