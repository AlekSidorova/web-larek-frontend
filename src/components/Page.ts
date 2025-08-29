import { IEvents } from './base/events'; // интерфейс для работы с событиями
import { ProductCard } from './product/ProductCard';
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

		// можно добавить слушатели здесь, если будут внутренние события страницы
		// сейчас клик по корзине обрабатывается в index.ts
	}

	/** Отрисовывает массив карточек на странице */
	renderCards(cards: ProductCard[]): void {
		this.container.replaceChildren(...cards.map((c) => c.render()));
	}

	/** Добавляет карточку на страницу */
	addCard(card: ProductCard): void {
		this.container.appendChild(card.render());
	}

	/** Обновляет счётчик корзины */
	updateCartCounter(count: number): void {
		this.cartCounter.textContent = String(count);
	}
}
