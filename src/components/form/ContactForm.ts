import { appData, events } from "../../index";
import { OrderModel } from "../models/OrderModel";
import { ensureElement } from "../../utils/utils";

export class ContactForm {
  private formEl: HTMLFormElement;
  private submitButton: HTMLButtonElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private errorsEl: HTMLElement;
  private order: OrderModel;

  constructor(container: HTMLElement, order: OrderModel) {
    this.order = order;

    // Получаем элементы формы
    this.formEl = ensureElement<HTMLFormElement>('form', container);
    this.submitButton = ensureElement<HTMLButtonElement>('.order__button', container);
    this.errorsEl = ensureElement<HTMLElement>('.form__errors', container);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

    this._initListeners();
    this.validate(); // начальная проверка
  }

  private _initListeners() {
    // Поле email
    this.emailInput.addEventListener('input', () => {
      appData.setOrderField('email', this.emailInput.value);
      this.validate();
    });

    // Поле телефона с форматированием
    this.phoneInput.addEventListener('input', () => {
      let digits = this.phoneInput.value.replace(/\D/g, '');

      // Оставляем только 10 последних цифр
      if (digits.length > 10) digits = digits.slice(-10);

      // Формируем номер в формате +7XXXXXXXXXX
      const formatted = '+7' + digits;
      this.phoneInput.value = formatted;

      appData.setOrderField('phone', formatted);
      this.validate();
    });

    // Submit формы
    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  private validate() {
    this.order.validate(); // проверка email и телефона

    const data = this.order.getData();
    const errors: string[] = [];

    if (!data.email || this.order.getErrors().email) {
      errors.push(this.order.getErrors().email || 'Введите корректный email');
    }

    if (!data.phone || this.order.getErrors().phone) {
      errors.push(this.order.getErrors().phone || 'Введите корректный телефон');
    }

    // Вывод ошибок в одну строку
    this.errorsEl.textContent = errors.join('; ');

    // Кнопка подтверждения активна только если ошибок нет
    this.submitButton.disabled = errors.length > 0;
  }

  private handleSubmit() {
  // Принудительно обновляем данные в OrderModel
  this.order.setData({
    email: this.emailInput.value.trim(),
    phone: this.phoneInput.value.trim()
  });

  // Лог для проверки
  console.log('Данные заказа перед API:', appData.order.getData());

  if (!this.errorsEl.textContent) {
    events.emit('checkout:step2Completed');
  } else {
    events.emit('form:validationError', { message: this.errorsEl.textContent });
  }
}
}