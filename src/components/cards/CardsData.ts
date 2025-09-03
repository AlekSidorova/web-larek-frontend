import { Component } from '../base/Component';
import { ICard, ICategory } from '../../types';
import { categories } from '../base/categories';
import { ensureElement } from '../../utils/utils';

export abstract class CardsData extends Component<ICard> {
  protected cardData!: ICard;

  //принимает html шаблон и данные карточки
  protected fillBase(template: HTMLElement, data: ICard): void {
    this.cardData = data;

    //категория
    const categoryEl = ensureElement<HTMLElement>('.card__category', template);
    categoryEl.textContent = data.category;

    const categoryMatch = categories.find(
      (c: ICategory) => c.name === data.category.toLowerCase()
    );
    this.toggleClass(
      categoryEl,
      categoryMatch ? categoryMatch.className : '',
      !!categoryMatch
    );

    //заголовок
    this.setText(
      ensureElement<HTMLElement>('.card__title', template),
      data.title
    );

    //картинка
    const imgEl = ensureElement<HTMLImageElement>('.card__image', template);
    this.setImage(
      imgEl,
      data.image.endsWith('.svg')
        ? data.image.replace('.svg', '.png')
        : data.image
    );

    //цена
    const priceEl = ensureElement<HTMLElement>('.card__price', template);
    this.setText(priceEl, data.price ? `${data.price} синапсов` : 'Бесценно');
  }
}
