import { Component } from '../base/Component'; //функциональность
import { ICard, ICategory} from '../../types'; //типы данных
import { categories } from '../base/categories'; //массив с категорями
import { ensureElement, cloneTemplate } from '../../utils/utils';
import { events } from '../../index';

export class ProductCard extends Component<ICard> {
	private cardData!: ICard;
	private cardElement!: HTMLElement;

	constructor() {
		//вызываем конструктор родителя Component
		//это наш основной элемент для карточки
		super(cloneTemplate('#card-catalog'));
	}

	//создает новый элемент карточки
	private createCardElement(): HTMLElement {
		const element = cloneTemplate('#card-catalog'); //базовая разметка для карточки

		//Сохраняем для getElement() и addEventListeners()
		this.cardElement = element;

		//находим элементы внутри карточки
		const categoryElement = ensureElement<HTMLElement>('.card__category', element);
		const title = ensureElement<HTMLElement>('.card__title', element);
		const image = ensureElement<HTMLImageElement>('.card__image', element);
		const price = ensureElement<HTMLElement>('.card__price', element);

// заполняем карточку данными
        categoryElement.textContent = this.cardData.category;

        // Находим соответствующий класс для категории
        const categoryMatch = categories.find((category: ICategory) => 
            category.name === this.cardData.category.toLowerCase()
        );

        // Устанавливаем класс для категории
        categoryElement.className = `card__category ${categoryMatch ? categoryMatch.className : ''}`;

		// title
		title.textContent = this.cardData.title;

		// image
		image.src = this.cardData.image.endsWith('.svg')
			? this.cardData.image.replace('.svg', '.png')
			: this.cardData.image;

		// price
		price.textContent = this.cardData.price
			? `${this.cardData.price} синапсов`
			: 'Бесценно';

		//возвращаем заполненный элемент
		return element;
	}

	//открывает модалку-превью с помощью EventEmitter
	private addEventListeners(): void {
		if (!this.cardElement || this.cardElement.dataset.listenerAdded) return;

		this.cardElement.addEventListener('click', () => {
			events.emit('card:open', { card: this.cardData }); // передаем данные
		});

		this.cardElement.dataset.listenerAdded = 'true';
	}

	private buy(): void {
		//пока пусто
	}

	getElement(): HTMLElement {
		//если this.cardElement пустой метод вернет this.container
		return this.cardElement ?? this.container;
	}

	getData(): ICard {
		return this.cardData;
	}

	setData(data: ICard): void {
		this.cardData = data;
		this.cardElement = this.createCardElement(); //генерируем элемент

		this.addEventListeners();
	}
}
