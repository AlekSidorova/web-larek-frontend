import { CardComponent } from './CardComponent';
import { ICard } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { events } from '../../index';

export class CardsCatalog extends CardComponent {
	private cardElement: HTMLElement; //карточка в dom

	constructor(data?: ICard) {
		super(cloneTemplate('#card-catalog'));
		this.cardElement = this.container;
		if (data) this.setData(data);
	}

	//принимает и заполняет интерфейс карточки
	setData(data: ICard): void {
		this.fillBase(this.cardElement, data);

		this.cardElement.addEventListener('click', () => {
			events.emit('card:open', { card: data });
		});
	}
}
