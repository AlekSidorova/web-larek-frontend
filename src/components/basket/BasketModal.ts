import { Component } from '../base/Component';
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { IEvents } from '../base/events';
import { basketModel } from '../../index';

export class BasketModal extends Component<unknown> {
	private events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
	}

	setData(): void {
		const template = cloneTemplate('#basket');
		const listEl = ensureElement<HTMLElement>('.basket__list', template);
		const totalEl = ensureElement<HTMLElement>('.basket__price', template);
		const btn = ensureElement<HTMLButtonElement>('.basket__button', template);

		const items = basketModel.getItems();

		// Пустая корзина
		if (items.length === 0) {
			listEl.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
			btn.disabled = true;
			totalEl.textContent = '0 синапсов';
		} else {
			listEl.replaceChildren(
				...items.map((item, idx) => {
					const li = document.createElement('li');
					li.className = 'basket__item card card_compact';

					li.innerHTML = `
						<span class="basket__item-index">${idx + 1}</span>
						<span class="card__title">${item.title}</span>
						<span class="card__price">${item.price} синапсов</span>
						<button class="basket__item-delete" aria-label="удалить"></button>
					`;

					const deleteBtn = li.querySelector<HTMLButtonElement>('.basket__item-delete')!;
					deleteBtn.addEventListener('click', () => {
						basketModel.removeItem(item.id);
						this.setData(); // обновляем корзину
						this.events.emit('basket:update'); // уведомляем другие компоненты
					});

					return li;
				})
			);

			btn.disabled = false;
			totalEl.textContent = basketModel.getTotalPrice() + ' синапсов';
		}

		// Кнопка "Оформить заказ"
		btn.addEventListener('click', () => {
			if (basketModel.getItems().length === 0) return;
			this.events.emit('checkout:step1');
		});

		this.container.replaceChildren(template);
	}
}
