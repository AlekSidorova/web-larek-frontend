import { CardComponent } from './CardComponent';
import { ICard } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { basketModel } from '../../index';

export class CardModal extends CardComponent {
	private events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
	}

	//принимает объект продукта
	setData(product: ICard): void {
		const template = cloneTemplate('#card-preview'); //клонируем шаблон
		this.fillBase(template, product); //заполняем шаблон данными продукта

		//клонируем кнопки и заменяем (чтобы не было висящих обработчиков)
		const btn = ensureElement<HTMLButtonElement>('.card__button', template);
		btn.disabled = false;

		const newBtn = btn.cloneNode(true) as HTMLButtonElement;
		btn.replaceWith(newBtn);

		newBtn.addEventListener('click', () => {
			if (!product.price) return; //проверяет цену

			if (basketModel.isInCart(product.id)) {
				basketModel.removeItem(product.id);
				this.setText(newBtn, 'В корзину');
			} else {
				basketModel.addItem(product);
				this.setText(newBtn, 'Удалить из корзины');
			}

			this.events.emit('basket:update'); //оповещаем другие части приложения об изменениях корзины
		});

		//установка текста кнопки
		if (!product.price) {
			this.setText(newBtn, 'Недоступно');
			newBtn.disabled = true;
		} else if (basketModel.isInCart(product.id)) {
			this.setText(newBtn, 'Удалить из корзины');
		} else {
			this.setText(newBtn, 'В корзину');
		}

		//картинка без margin (как в макете)
		const imageEl = ensureElement<HTMLImageElement>('.card__image', template);
		imageEl.style.margin = '0';

		this.container.replaceChildren(template);
	}
}
