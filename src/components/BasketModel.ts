import { ICard } from '../types/index'

export class BasketModel {
  private items: ICard[];
  private totalPrice: number | null;

  constructor(initialItems: ICard[] = []) {
    this.items = initialItems;
    this.totalPrice = this.calculateTotal();
  }

  private calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  addItem(item: ICard): void {
    // проверяем, есть ли в нашем списке эта карточка
    const exists = this.items.some(i => i.id === item.id);
    //если карточка не существует
    if(!exists) {
      this.items.push(item); //добавляем
      this.totalPrice = this.calculateTotal(); //меняем общую цену
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id); //ту что выбрали - отфильтровывем (удаляем)
    this.totalPrice = this.calculateTotal();
  }

  clear(): void {
    this.items = [];
    this.totalPrice = 0;
  }

  getItems(): ICard[] {
    return [...this.items] //создает новую копию карточек
  }

  getTotalPrice(): number {
    return this.totalPrice
  }
}