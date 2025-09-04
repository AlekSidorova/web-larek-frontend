import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { templates } from './components/base/templates';
import { API_URL, CDN_URL } from './utils/constants';

import { ICard, IOrderForm } from './types';

import { BasketModel } from './components/basket/BasketModel';
import { OrderModel } from './components/form/OrderModel';

import { Modal } from './components/Modal';
import { CardModal } from './components/cards/CardModal';
import { BasketModal } from './components/basket/BasketModal';
import { CardBasket } from './components/cards/CardBasket';

import { Page } from './components/Page';
import { CardsCatalog } from './components/cards/CardsCatalog';

import { DeliveryForm } from './components/form/DeliveryForm';
import { ContactForm } from './components/form/ContactForm';

//события и модели
export const events = new EventEmitter();
export const basketModel = new BasketModel(events);
export const orderModel = new OrderModel();

//модалки
const basketModal = new BasketModal(templates.modalContainer, events);
const modal = new Modal('#' + templates.modalContainer.id, events);

const deliveryFormEl = templates.order() as HTMLFormElement;
const deliveryForm = new DeliveryForm(deliveryFormEl, events);
const contactFormEl = templates.contacts() as HTMLFormElement;
const contactForm = new ContactForm(contactFormEl, events);

//API и страница
const api = new AppApi(API_URL, CDN_URL);
const page = new Page(
	'.gallery',
	'.header__basket',
	'.header__basket-counter',
	events
);

// --- слушатели событий ---
//открытие модальных карточек товара
events.on('card:open', ({ card }: { card: ICard }) => {
	const contentEl = templates.cardPreview();
	const cardModal = new CardModal(contentEl, events);
	cardModal.setData(card);
	modal.setData({ content: contentEl, card });
});

//добавление товара в корзину
events.on('cart:add', ({ product }: { product: ICard }) => {
	basketModel.addItem(product); //модель обновляет данные
});

//удаление товара из корзины
events.on('cart:remove', ({ id }: { id: string }) => {
	basketModel.removeItem(id); //модель удаляет товар
});

//обновление корзины и отображение
events.on('basket:update', () => {
	//преобразуем товары модели в элементы CardBasket
	const items = basketModel.getItems().map((item, idx) => {
		const element = new CardBasket(item, events, idx + 1);
		return element.render(); // HTMLElement
	});

	basketModal.list = items;
	basketModal.total = basketModel.getTotalPrice();

	//обновляем счётчик корзины в шапке
	page.updateCartCounter(basketModel.getItems().length);
});

//шаг 1 - устанавливается форма доставки
events.on('checkout:step1', () => {
	deliveryForm.reset();
	modal.setData({ content: deliveryForm.getElement() });
});

//слушает изменение полей заказа
events.on('order:fieldChange', ({ field, value }: { field: keyof IOrderForm; value: string }) => {
		orderModel.setData({ [field]: value });
	}
);

//завершение шага 1 - переход к шагу 2
events.on('checkout:step1Completed', () => events.emit('checkout:step2'));

//шаг 2 - форма контактных данных
events.on('checkout:step2', () => {
	contactForm.reset();
	modal.setData({ content: contactForm.getElement() });
});

//завершение шага 2 - создание заказа и отправка на сервер
events.on('checkout:step2Completed', async () => {
  const itemsIds = basketModel.getItems().map((i) => i.id);
  const totalPrice = basketModel.getTotalPrice();

  try {
    const apiOrder = orderModel.toApiOrder(itemsIds, totalPrice);
    const result = await api.createOrder(apiOrder);

    const successEl = templates.success();
    const descriptionEl = successEl.querySelector<HTMLParagraphElement>('.order-success__description');
    if (descriptionEl)
      descriptionEl.textContent = `Списано ${totalPrice} синапсов`;

    const closeBtn = successEl.querySelector<HTMLButtonElement>('.order-success__close');
    if (closeBtn) closeBtn.addEventListener('click', () => modal.close());

    modal.setData({ content: successEl });

    // очищаем корзину
    basketModel.clear();
  } catch (err) {
    console.error(err);
    alert('Ошибка при отправке заказа');
  }
});

//открывает модалку корзины
const cartButton = document.querySelector('.header__basket') as HTMLButtonElement;
cartButton.addEventListener('click', () => {
  const modalContent = templates.modalContainer.querySelector('.modal__content');
  if (modalContent) {
    modalContent.replaceChildren(basketModal.render());
  }
  templates.modalContainer.classList.add('modal_active');
});

//загрузка карточек
api.getProductList().then((products) => {
  const cards = products.map((product) => {
    const card = new CardsCatalog();
    card.setData(product);
    return card;
  });
  page.renderCards(cards);
});
