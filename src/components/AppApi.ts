import { Api, ApiListResponse } from './base/api';
import { ICard, IOrder, IOrderResult } from '../types';

//класс наследует все от Api
export class AppApi extends Api {
	readonly cdn: string; //нельзя изменять после инициализации - хранит url

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	//метод запрашивает список всех продуктов
	//возвращает промис - если успех - массив объектов типа ICard
	getProductList(): Promise<ICard[]> {
		return this.get('/product/').then(
			(
				data: ApiListResponse<ICard> //then - когда сервер вернул данные
			) =>
				data.items.map((item) => ({
					...item, //распаковка свойств карточки
					image: this.cdn + item.image,
				}))
		);
	}

	//получить информацию карточки по его id
	getProductItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	//создать новый заказ
	createOrder(order: IOrder) {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
