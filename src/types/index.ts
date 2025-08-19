export interface ICard { //карточка
  _id: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  description?: string;
}

export interface ICardData { //структура, которая отвечает за множество карточек 
  cards: ICard[];
  preview: string | null; 
  openCard(card: ICard): void;
  closeCard(card: ICard): void;
  getCard(cardID: string): ICard;
  buyCard(card: ICard): void; 
  deleteCard(cardID: string): void; 
} 

export interface IBasket { //корзина 
  _id: string;
  total: number | null;
  items: ICard[]; 
  addItem(card: ICard): void; 
  removeItem(cardId: string): void; 
  clear(): void; 
  getItems(): ICard[]; 
}


export interface IValidationForm {
  buttonError: boolean; //не выбрана кнопка
  addressError: string; //не введен адрес доставки
  emailError: string; //неверный email
  phoneError: string; //неверный номер телефона
  checkValidation(): boolean; // Метод для проверки всех полей
}




// пример типа, которые могут использовать
// уже прописанные интерфейсы T... = Pick<ICard, '_id' | 'category' | 'title' | 'image' | 'price'>; //главная страница