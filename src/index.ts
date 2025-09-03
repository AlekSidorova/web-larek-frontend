import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { templates } from './components/base/templates';
import { API_URL, CDN_URL } from './utils/constants';
import { ICard, IOrderForm } from './types';

import { Modal } from './components/Modal';
import { Page } from './components/Page';

import { CardsCatalog } from './components/cards/CardsCatalog';
import { CardModal } from './components/cards/CardModal';

import { BasketModal } from './components/basket/BasketModal';
import { BasketModel } from './components/models/BasketModel';

import { OrderModel } from './components/models/OrderModel';

import { DeliveryForm } from './components/form/DeliveryForm';
import { ContactForm } from './components/form/ContactForm';

// единый «телефон» (events), по которому разные кусочки проекта могут общаться
export const events = new EventEmitter();

// модели
export const basketModel = new BasketModel();
export const order = new OrderModel();

// appData — единый объект состояния
export const appData = {
	order,
	setOrderField(field: keyof IOrderForm, value: string) {
		if (field === 'payment') {
			if (value === 'online' || value === 'cash') {
				this.order.setData({ [field]: value });
			}
		} else {
			this.order.setData({ [field]: value });
		}
	},
	clearBasket() {
		basketModel.clear();
		events.emit('basket:update');
	},
};
// Модалки
const basketModal = new BasketModal(document.createElement('div'), events);
const modal = new Modal('#' + templates.modalContainer.id, events);

//создаем апи
const api = new AppApi(API_URL, CDN_URL);

//создаем Page
const page = new Page(
	'.gallery',
	'.header__basket',
	'.header__basket-counter',
	events
);

// Кнопка корзины
const cartButton = document.querySelector(
	'.header__basket'
) as HTMLButtonElement;

// --- Слушатели событий ---

// Клик на карточку
events.on('card:open', (data?: { card?: ICard }) => {
	if (!data?.card) return;

	// Создаём контейнер с шаблоном для модалки
	const contentEl = templates.cardPreview();

	// Рендерим карточку в модалке через CardModal
	const cardModal = new CardModal(contentEl, events);
	cardModal.setData(data.card); // теперь используем setData

	// Открываем модалку
	modal.setData({
		content: contentEl,
		card: data.card,
	});
});

// Клик на корзину
cartButton.addEventListener('click', () => {
	basketModal.setData();
	modal.setData({
		content: basketModal.render(),
		card: undefined,
	});
});

// Добавление товара в корзину
events.on('cart:add', (data: { product: ICard }) => {
	basketModel.addItem(data.product);
	events.emit('basket:update'); // обновляем счётчик
});

// Обновление счётчика корзины в шапке
events.on('basket:update', () => {
	page.updateCartCounter(basketModel.getItems().length);
});


// --- Оформление заказа ---

// --- Шаг 1: выбор оплаты и адрес ---
events.on('checkout:step1', () => {
  const formElement = templates.order();        // создаём форму
  modal.setData({ content: formElement });      // вставляем в DOM

  const formEl = document.querySelector<HTMLFormElement>('form[name="order"]'); // ищем уже в DOM
  if (!formEl) return;

  new DeliveryForm(formEl, events, appData.order); // теперь кнопки реально есть
});

events.on('checkout:step1Completed', () => {
  events.emit('checkout:step2'); // вызывает существующий код для шага 2
});

// --- Шаг 2: email и телефон ---
events.on('checkout:step2', () => {
  // создаём форму через шаблон
  const formElement = templates.contacts();
  // вставляем форму в модалку
  modal.setData({ content: formElement });

  // ищем форму в DOM
  const formEl = document.querySelector<HTMLFormElement>('form[name="contacts"]');
  if (!formEl) return;

  // создаём экземпляр ContactForm
  new ContactForm(formEl, events, appData.order);
});

events.on('checkout:step2Completed', () => {
	const itemsIds = basketModel.getItems().map((item) => item.id);
	const totalPrice = basketModel.getTotalPrice();

	try {
		const apiOrder = appData.order.toApiOrder(itemsIds, totalPrice);

		console.log('Готовый заказ для API:', apiOrder);

		api.createOrder(apiOrder).then((result) => {
			const successEl = templates.success();
			const descriptionEl = successEl.querySelector<HTMLParagraphElement>(
				'.order-success__description'
			);
			if (descriptionEl)
				descriptionEl.textContent = `Списано ${totalPrice} синапсов`;

			const closeBtn = successEl.querySelector<HTMLButtonElement>(
				'.order-success__close'
			);
			if (closeBtn) closeBtn.addEventListener('click', () => modal.close());

			modal.setData({ content: successEl });

			appData.clearBasket();
		});
	} catch (err) {
		console.error(err);
		alert('Ошибка при отправке заказа');
	}
});

//загружаем список карточек
api.getProductList().then((products) => {
	const cards = products.map((product) => {
		const card = new CardsCatalog();

		card.setData(product);

		return card;
	});

	//выводим карточки
	page.renderCards(cards);
});
