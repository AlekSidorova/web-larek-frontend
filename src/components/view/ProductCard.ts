import { Component } from "../base/Component"; //функциональность
import { ICard } from "../../types"; //типы данных
import { templates } from "../base/templates";

export class ProductCard extends Component<ICard> {
  private cardData!: ICard;
  private cardElement!: HTMLElement;

  constructor() {
    //вызываем конструктор родителя Component
    //это наш основной элемент для карточки
    super(templates.cardCatalog());
  }

  //создает новый элемент карточки
  private createCardElement(): HTMLElement {
    const element = templates.cardCatalog(); //базовая разметка для карточки

    //находим элементы внутри карточки
    const category = element.querySelector('.card__category');
    const title = element.querySelector('.card__title');
    const image = element.querySelector('.card__image') as HTMLImageElement; //это картинка
    const price = element.querySelector('.card__price');

    //заполняем карточку данными
    if (category) {
      category.textContent = this.cardData.category;
    }

    if (title) {
      title.textContent = this.cardData.title;
    }

    if (image) {
      image.src = this.cardData.image;
    }

    if (price) {
      if (this.cardData.price) {
        price.textContent = `${this.cardData.price} синапсов`;
      } else {
         price.textContent = "Бесценно";
      }
    }

    //возвращаем заполненный элемент
    return element;
  }

  private addEventListeners(): void  {
    //пока пусто
  }

  private buy(): void  {
    //пока пусто
  }

  getElement(): HTMLElement {
    //если this.cardElement пустой метод вернет this.container
    return this.cardElement ?? this.container;
  }

  setData(data: ICard): void{
    this.cardData = data;
    this.cardElement = this.createCardElement(); //генерируем элемент

    this.addEventListeners();
  }
}
