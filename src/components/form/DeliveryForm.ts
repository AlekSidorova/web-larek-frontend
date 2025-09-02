import { Form } from './Form';
import { appData, events } from '../../index';
import { OrderModel } from '../models/OrderModel';
import { IEvents } from '../base/events';
import { IOrderForm } from '../../types';

export class DeliveryForm extends Form {
  private order: OrderModel;
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;
  private errorsEl: HTMLSpanElement;
  private submitBtn: HTMLButtonElement;
  private isFirstRender = true; // флаг первого рендера

  constructor(formEl: HTMLFormElement, events: IEvents, order: OrderModel) {
    super(formEl, events);
    this.order = order;

    // Элементы формы
    this.submitBtn = formEl.querySelector<HTMLButtonElement>('.order__button')!;
    this.addressInput = formEl.querySelector<HTMLInputElement>('input[name="address"]')!;
    this.errorsEl = formEl.querySelector<HTMLSpanElement>('.form__errors')!;
    this.paymentButtons = Array.from(formEl.querySelectorAll<HTMLButtonElement>('.order__buttons button'));

    // Если уже есть активная кнопка оплаты
    const active = this.paymentButtons.find(b => b.classList.contains('button_alt-active'));
    if (active) {
      appData.setOrderField('payment', active.name === 'card' ? 'online' : active.name as 'cash');
    }

    this.validate();

    // Слушатели для кнопок оплаты
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');

        const value = button.name === 'card' ? 'online' : button.name as 'cash';
        this.onFieldChange('payment', value as IOrderForm['payment']);
      });
    });

    // Слушатель ввода адреса
    this.addressInput.addEventListener('input', () => {
      this.onFieldChange('address', this.addressInput.value);
    });

    // Submit формы
    formEl.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    });

    // После первого рендера запрещаем игнорировать ошибки
    this.isFirstRender = false;
  }

  // Обработка изменений полей
  protected onFieldChange(field: keyof IOrderForm, value: string) {
    appData.setOrderField(field, value);
    this.validate();
  }

  // Валидация формы
  private validate() {
    const data = this.order.getData();
    const errors: string[] = [];

    // Показываем ошибку только если выбран способ оплаты и это не первый рендер
    if (data.payment && !this.isFirstRender) {
      if (!this.addressInput.value.trim() || this.addressInput.value.trim().length < 5) {
        errors.push('Необходимо указать адрес');
      }
    }

    this.errorsEl.textContent = errors.join('; ');

    // Кнопка активна только если нет ошибок и выбрана оплата
    this.submitBtn.disabled = errors.length > 0 || !data.payment;
  }

  // Обработка submit
  protected handleSubmit() {
    const data = this.order.getData();
    if (data.payment && data.address) {
      events.emit('checkout:step1Completed');
    }
  }
}
