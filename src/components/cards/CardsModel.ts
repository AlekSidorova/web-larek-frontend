import { ICard } from '../../types/index';
import { IEvents } from '../base/events';

export class CardsModel {
	private cards: ICard[] = [];
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	//устанавливаем карточки (данные приходят из вне!!!)
	setCards(cards: ICard[]): void {
		this.cards = cards;
		this.events.emit('cards:update', { cards: this.cards });
	}

	getCards(): ICard[] {
		return this.cards;
	}

	//получить карточку по id
	getCardById(id: string): ICard | undefined {
		return this.cards.find((c) => c.id === id);
	}
}
