// --- Карточка ---
export interface ICard {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  description?: string;
}

// --- Заказ ---
export interface IOrder {
  items: string[]; // id товаров
  address: string;
  email: string;
  phone: string;
  payment: 'online' | 'cash';
  total: number;
}

//ответ сервера после создания заказа
export interface IOrderResult {
  id: string;
  total: number;
}

//модель заказа внутри приложения
export interface IOrderModel {
  setData(inputData: Record<string, string>): void;
  getData(): Record<string, string>;
  getErrors(): Record<string, string>;
  isValid(): boolean;
  toApiOrder?(items: string[], total: number): IOrder; // метод для API
}

//интерфейс для формы в чекауте
export interface IOrderForm {
  payment: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
}

// --- Модалки ---
export type ModalContentType =
  | 'product'
  | 'basket'
  | 'checkoutStep1'
  | 'checkoutStep2';

export interface IModalData {
  content: HTMLElement | ModalContentType;
  card?: ICard;
}

// --- Категории ---
export interface ICategory {
  name: string;
  className: string;
}
