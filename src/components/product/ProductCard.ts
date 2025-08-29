import { ProductView } from './ProductView';
import { ICard } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { events } from '../../index';


export class ProductCard extends ProductView {
  private cardElement!: HTMLElement;

  constructor() {
    super(cloneTemplate('#card-catalog'));
  }

  setData(data: ICard): void {
    this.cardElement = cloneTemplate('#card-catalog');
    this.fillBase(this.cardElement, data);

    this.cardElement.addEventListener('click', () => {
      events.emit('card:open', { card: data });
    });

    this.container.replaceChildren(this.cardElement);
  }
}
