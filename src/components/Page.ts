import { IEvents } from './base/events';
import { CardsCatalog } from './cards/CardsCatalog';
import { ensureElement } from '../utils/utils';

export class Page {
	private container: HTMLElement;
	private cartButton: HTMLButtonElement;
	private cartCounter: HTMLElement;
	private events: IEvents;

	constructor(
		containerSelector: string,
		cartButtonSelector: string,
		cartCounterSelector: string,
		events: IEvents
	) {
		this.container = ensureElement<HTMLElement>(containerSelector);
		this.cartButton = ensureElement<HTMLButtonElement>(cartButtonSelector);
		this.cartCounter = ensureElement<HTMLElement>(cartCounterSelector);
		this.events = events;
	}

	//отрисовывает массив карточек на странице
	renderCards(cards: CardsCatalog[]): void {
		this.container.replaceChildren(...cards.map((c) => c.render()));
	}

	//добавляет карточку на страницу
	addCard(card: CardsCatalog): void {
		this.container.appendChild(card.render());
	}

	//обновляет счётчик корзины
	updateCartCounter(count: number): void {
		//переоразовываем число в строку и устанавливаем
		this.cartCounter.textContent = String(count);
	}
}
