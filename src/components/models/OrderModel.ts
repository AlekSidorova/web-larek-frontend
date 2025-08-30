import { IOrder, IOrderModel } from "../../types/index";

export class OrderModel implements IOrderModel {
  private data: Record<string, string> ={};
  private errors: Record<string, string> ={};

  constructor(initialData: Record<string, string> = {}) { //объект с начальными данными
    this.setData(initialData); //устанавливаем начальные данные и выполняем валидацию
  }

  //устанавливаем новые данные
  setData(inputData: Record<string, string>): void {
    this.data = {...this.data, ...inputData}; //объединяем (...) существующие данные
    this.validate(); 
  }

  //возвращаем текущие данные товара
  getData(): Record<string, string> {
    return this.data;
  }

  //возвращаем ошибки
  getErrors(): Record<string, string> {
    return this.errors;
  }

  //есть ли ошибки
  isValid(): boolean {
    //если errors=0 значит ошибок нет-true
    return Object.keys(this.errors).length === 0; 
  }

  //проверяем данные на корректность
  private validate(): void {
    //мы обнуляем объекст с ошибками перед новой валидацией
    this.errors = {}; 

    //валидация полей

    // адрес обязателен
    if (!this.data.address || this.data.address.trim().length < 5) {
      this.errors.address = "Введите корректный адрес";
    }

    // email обязателен и проверка по regex
    if (!this.data.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.data.email)) {
      this.errors.email = "Введите корректный email";
    }

    // телефон обязателен и проверка на цифры (минимум 10)
    if (!this.data.phone || !/^\+?\d{10,15}$/.test(this.data.phone)) {
      this.errors.phone = "Введите корректный телефон";
    }
  }

  // метод для подготовки данных к API (собираем в IOrder)
  toApiOrder(items: string[]): IOrder {
    return {
      items,
      address: this.data.address,
      email: this.data.email,
      phone: this.data.phone,
    };
  }
}