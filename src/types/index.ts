//карточка
export interface ICard { 
  id: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  description?: string;
}

//управление списком карточек (каталог)
export interface ICardData { 
  cards: ICard[];
  preview: string | null; 
  openCard(card: ICard): void;
  closeCard(card: ICard): void;
  getCard(cardID: string): ICard;
  buyCard(card: ICard): void; 
  deleteCard(cardID: string): void; 
} 

// интерфейс для данных корзины
export interface IBasket { 
  id: string;
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

// данные заказа (то, что мы отправляем на сервер)
export interface IOrder {
  items: string[]; //id товары из корзины
  address: string; //адрес доставки
  email: string; //почта
  phone: string; //телефон
}

//ответ от сервера после создания заказа
export interface IOrderResult {
  id: string; //id заказа на сервере
  total: number; //итоговая сумма
}

// интерфейс для модели внутри приложения
export interface IOrderModel {
  setData(inputData: Record<string, string>): void;
  getData(): Record<string, string>;
  getErrors(): Record<string, string>;
  isValid(): boolean;
}

export interface IOrderForm {
  address: string;
  email: string;
  phone: string;
  valid: boolean;         // флаг, есть ли ошибки
  errors: string[];       // массив сообщений об ошибках
}

//тип модалки
export type ModalContentType = 'product' | 'basket' | 'checkoutStep1' | 'checkoutStep2';

export interface IModalData {
  content: HTMLElement | ModalContentType;
  card?: ICard;
}

//интерфейс для типа модалки
export interface IModalUpdatePayload {
  type: ModalContentType;
  card: ICard | null;
}

export interface ICardOpenPayload {
  card: ICard;
}

// создаем интерфейс для категорий
export interface ICategory {
    name: string; // имя категории
    className: string; // соответствующий класс для стиля
}
