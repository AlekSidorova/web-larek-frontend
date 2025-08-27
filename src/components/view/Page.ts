import { IEvents } from "../base/events"; //инт определяет как нужно работать с событиями
import { ProductCard } from "./ProductCard";

export class Page {
  private container: HTMLElement;
  private cartButton: HTMLButtonElement;
  private cartCounter: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, cartButton: HTMLButtonElement, cartCounter: HTMLElement, events: IEvents) {
    this.container = container;
    this.cartButton = cartButton;
    this.cartCounter = cartCounter;
    this.events = events;

    //добавляем слушателя
    this.addEventListeners();
  }

  renderCards(cards: ProductCard[]): void {
    this.container.replaceChildren(...cards.map(c => c.getElement()));
  }

  updateCartCounter(count: number): void {
    this.cartCounter.textContent = String(count);
  }

  private addEventListeners(): void {
    this.cartButton.addEventListener('click', () => {
      this.events.emit('card:open')
    });
  }
}