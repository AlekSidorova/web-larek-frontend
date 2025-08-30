import { CardsData } from './CardsData';
import { ICard } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { events } from '../../index';

export class CardsCatalog extends CardsData {
  private cardElement: HTMLElement;

  constructor(data?: ICard) {
    super(cloneTemplate('#card-catalog'));
    this.cardElement = this.container; // используем контейнер как сам элемент
    if (data) this.setData(data);
  }

  setData(data: ICard): void {
    this.fillBase(this.cardElement, data);

    // слушатель клика
    this.cardElement.addEventListener('click', () => {
      events.emit('card:open', { card: data });
    });
  }
}
