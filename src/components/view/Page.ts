import { IEvents } from '../base/events'; //инт определяет как нужно работать с событиями
import { ProductCard } from './ProductCard';
import { ensureElement } from '../../utils/utils';

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

		this.addEventListeners();
	}

	renderCards(cards: ProductCard[]): void {
		this.container.replaceChildren(...cards.map((c) => c.getElement()));
	}

	/** Добавляет карточку на страницу */
	addCard(card: ProductCard): void {
		this.container.appendChild(card.getElement());
	}

	updateCartCounter(count: number): void {
		this.cartCounter.textContent = String(count);
	}

	private addEventListeners(): void {
		this.cartButton.addEventListener('click', () => {
			this.events.emit('card:open');
		});
	}
}
