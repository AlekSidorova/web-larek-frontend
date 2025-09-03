import { ICard } from '../../types/index';

export class BasketModel {
	private items: ICard[] = [];
	private totalPrice: number = 0;

	constructor(initialItems: ICard[] = []) {
		this.items = [...initialItems];
		this.totalPrice = this.calculateTotal();
	}

	private calculateTotal(): number {
		return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	addItem(item: ICard): void {
		if (!this.isInCart(item.id)) {
			this.items.push(item);
			this.totalPrice = this.calculateTotal();
		}
	}

	removeItem(id: string): void {
		this.items = this.items.filter(item => item.id !== id);
		this.totalPrice = this.calculateTotal();
	}

	clear(): void {
		this.items = [];
		this.totalPrice = 0;
	}

	getItems(): ICard[] {
		return [...this.items];
	}

	getTotalPrice(): number {
		return this.totalPrice;
	}

	isInCart(id: string): boolean {
		return this.items.some(item => item.id === id);
	}
}