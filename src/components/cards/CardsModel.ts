import { ICard } from '../../types/index';
import { IEvents } from '../base/events';
import { AppApi } from '../AppApi';

export class CardsModel {
	private cards: ICard[] = [];
	private events: IEvents;
	private api: AppApi;

	constructor(api: AppApi, events: IEvents) {
		this.api = api;
		this.events = events;
	}

	//получение карточек с сервера
	async fetchCards(): Promise<void> {
		try {
			const products = await this.api.getProductList();
			this.cards = products;
			this.events.emit('cards:update', { cards: this.cards });
		} catch (err) {
			console.error('Ошибка при загрузке карточек', err);
			this.events.emit('cards:error', { error: err });
		}
	}

	getCards(): ICard[] {
		return this.cards;
	}

	//получить карточку по id
	getCardById(id: string): ICard | undefined {
		return this.cards.find((c) => c.id === id);
	}
}
