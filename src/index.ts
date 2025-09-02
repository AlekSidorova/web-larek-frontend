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
const setupStep1 = () => {
	const form = document.querySelector<HTMLFormElement>('form[name="order"]');
	if (!form) return;

	const submitBtn = form.querySelector<HTMLButtonElement>('.order__button')!;
	const paymentButtons = form.querySelectorAll<HTMLButtonElement>(
		'.order__buttons button'
	);
	const addressInput = form.querySelector<HTMLInputElement>(
		'input[name="address"]'
	)!;
	const errorsEl = form.querySelector<HTMLSpanElement>('.form__errors')!;

	const update = () => {
	const errors: string[] = [];

	// Проверяем адрес только если выбрана оплата
	if (appData.order.getData().payment) {
		if (!addressInput.value.trim() || addressInput.value.trim().length < 5) {
			errors.push('Необходимо указать адрес');
		}
	}

	// Показываем ошибки (до выбора оплаты будет пусто)
	errorsEl.textContent = errors.join('; ');

	// Кнопка активна, если нет ошибок и выбрана оплата
	submitBtn.disabled = errors.length > 0 || !appData.order.getData().payment;
};

	// Выбор способа оплаты
	paymentButtons.forEach((btn) => {
		btn.addEventListener('click', () => {
			paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
			btn.classList.add('button_alt-active');

			const value = btn.name === 'card' ? 'online' : btn.name;
			appData.setOrderField('payment', value as 'online' | 'cash');

			update();
		});
	});

	// Ввод адреса
	addressInput.addEventListener('input', () => {
		appData.setOrderField('address', addressInput.value);
		update();
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		update();
		if (!submitBtn.disabled) events.emit('checkout:step2');
	});

	update(); // начальное состояние
};

// --- Шаг 2: email и телефон ---
const setupStep2 = () => {
	const form = document.querySelector<HTMLFormElement>('form[name="contacts"]');
	if (!form) return;

	const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
	const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')!;
	const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]')!;

	const validateStep2 = () => {
		const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailInput.value);
		const phoneDigits = phoneInput.value.replace(/\D/g, '');
		const phoneValid = phoneDigits.length === 11;

		// Кнопка активна только если оба поля валидны
		submitBtn.disabled = !(emailValid && phoneValid);
	};

	// Форматирование телефона во время ввода
	phoneInput.addEventListener('input', () => {
		let value = phoneInput.value.replace(/\D/g, '');
		if (value.startsWith('7')) value = value.slice(1);

		let formatted = '+7';
		if (value.length > 0) formatted += ' (' + value.substring(0, 3);
		if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
		if (value.length >= 7) formatted += ' ' + value.substring(6, 8);
		if (value.length >= 9) formatted += ' ' + value.substring(8, 10);

		phoneInput.value = formatted;

		validateStep2();
	});

	emailInput.addEventListener('input', validateStep2);

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		validateStep2();

		if (!submitBtn.disabled) {
			// Сохраняем данные в OrderModel
			appData.order.setData({
				email: emailInput.value.trim(),
				phone: phoneInput.value.replace(/\D/g, '').padStart(11, '7'), // формат +7XXXXXXXXXX
			});

			console.log('Данные заказа перед API:', appData.order.getData());
			events.emit('checkout:step2Completed');
		}
	});

	validateStep2(); // начальная проверка
};

// --- Слушатели событий ---
events.on('checkout:step1', () => {
	modal.setData({ content: templates.order() });
	setupStep1();
});

events.on('checkout:step2', () => {
	modal.setData({ content: templates.contacts() });
	setupStep2();
});

// --- Отправка заказа ---
events.on('checkout:step2Completed', () => {
  const itemsIds = basketModel.getItems().map(item => item.id);
  const totalPrice = basketModel.getTotalPrice(); // <--- берём сумму

  try {
    const apiOrder = {
      ...appData.order.toApiOrder(itemsIds),
      total: totalPrice, // <--- добавляем total
    };


    api.createOrder(apiOrder).then(result => {
      const successEl = templates.success();
      const descriptionEl = successEl.querySelector<HTMLParagraphElement>('.order-success__description');
      if (descriptionEl) descriptionEl.textContent = `Списано ${totalPrice} синапсов`;

      const closeBtn = successEl.querySelector<HTMLButtonElement>('.order-success__close');
      if (closeBtn) closeBtn.addEventListener('click', () => modal.close());

      modal.setData({ content: successEl });

      appData.clearBasket();
    });
  } catch (err) {
    console.error(err);
    alert('Ошибка при отправке заказа');
  }
});

// Отображение ошибок на странице
events.on('formErrors:change', (data: { message: string }) => {
	const errorEl = document.querySelector('.order__errors');
	if (errorEl) errorEl.textContent = data.message;
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
