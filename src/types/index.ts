export interface ICardsPreview { //набор карточек на главной странице
  _id: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface ICard { //сама карточка товара когда мы на нее нажимаем и хотим посмотреть 
  cards: ICardsPreview[];
  description: string;
  preview: string | null; //превью карточки, которую хотим посмотреть
}

export interface IValidationForm { //валидация форм
  error: string;
}

export interface IBasket { //корзина 
  _id: string;
  total: number | null;
}

export interface ICardPreview { //набор карточек на главной странице
  _id: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// пример типа, которые могут использовать
// уже прописанные интерфейсы T... = Pick<ICard, '_id' | 'category' | 'title' | 'image' | 'price'>; //главная страница