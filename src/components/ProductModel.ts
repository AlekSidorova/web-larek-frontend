import { ICard } from '../types/index'

export class ProductModel {
  private product: ICard;

  constructor(productData: ICard) {
    this.product = productData;
  }

  getProduct(): ICard {
    return this.product;
  }

  getId(): string {
    return this.product.id;
  }

  getImage(): string {
    return this.product.image;
  }

  getTitle(): string {
    return this.product.title;
  }

  getCategory(): string {
    return this.product.category;
  }

  getPrice(): number | null {
    return this.product.price;
  }

  getDescription(): string | undefined {
    return this.product.description;
  }
}