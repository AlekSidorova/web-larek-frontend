import { ICard, ICategory } from '../../types'; //типы данных
import { categories } from '../base/categories'; //массив с категорями
import { IEvents } from '../base/events';
import { cloneTemplate, ensureElement } from '../../utils/utils';

export class ProductModal {
	private container: HTMLElement;
	private events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;
	}

	displayProduct(product: ICard): void {
		// клонируем шаблон карточки для модалки
		const template = cloneTemplate('#card-preview');

		// заполняем данные категория
		const categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			template
		);
		categoryElement.textContent = product.category;

		// Находим соответствующий класс для категории
		const categoryMatch = categories.find(
			(category: ICategory) => category.name === product.category.toLowerCase()
		);

		// Устанавливаем класс для категории
		categoryElement.className = `card__category ${
			categoryMatch ? categoryMatch.className : ''
		}`;

		ensureElement<HTMLElement>('.card__title', template).textContent =
			product.title;

		//изображение в пнг и с марджином в ноль как в макете
		const imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			template
		);
		imageElement.src = product.image.endsWith('.svg')
			? product.image.replace('.svg', '.png')
			: product.image;
		imageElement.style.margin = '0'; // Устанавливаем марджин 0
    
		//цена
		ensureElement<HTMLElement>('.card__price', template).textContent =
			product.price ? `${product.price} синапсов` : 'Бесценно';

		// добавляем обработчик кнопки "В корзину"
		// кнопка
		const btn = template.querySelector('.card__button') as HTMLButtonElement;

		if (!product.price) {
			btn.textContent = 'Недоступно';
			btn.disabled = true; // делаем кнопку неактивной
		} else {
			btn.textContent = 'В корзину';
			btn.disabled = false;
			btn.addEventListener('click', () =>
				this.events.emit('cart:add', { product })
			);
		}
		// вставляем в контейнер
		this.container.replaceChildren(template);
	}
}
