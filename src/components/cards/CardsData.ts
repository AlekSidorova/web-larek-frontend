import { Component } from '../base/Component';
import { ICard, ICategory } from '../../types';
import { categories } from '../base/categories';
import { ensureElement } from '../../utils/utils';

export abstract class CardsData extends Component<ICard> {
  protected cardData!: ICard;

  protected fillBase(template: HTMLElement, data: ICard): void {
    this.cardData = data;

    // Категория
    const categoryEl = ensureElement<HTMLElement>('.card__category', template);
    categoryEl.textContent = data.category;

    const categoryMatch = categories.find(
      (c: ICategory) => c.name === data.category.toLowerCase()
    );
    categoryEl.className = `card__category ${categoryMatch ? categoryMatch.className : ''}`;

    // Заголовок
    ensureElement<HTMLElement>('.card__title', template).textContent = data.title;

    // Картинка
    const imgEl = ensureElement<HTMLImageElement>('.card__image', template);
    imgEl.src = data.image.endsWith('.svg') ? data.image.replace('.svg', '.png') : data.image;

    // Цена
    ensureElement<HTMLElement>('.card__price', template).textContent =
      data.price ? `${data.price} синапсов` : 'Бесценно';
  }
}