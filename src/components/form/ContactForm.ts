import { Form } from './Form';
import { appData, events } from '../../index';
import { OrderModel } from '../models/OrderModel';

export class ContactForm extends Form {
  private order: OrderModel;

  constructor(formEl: HTMLFormElement, events: any, order: OrderModel) {
    super(formEl, events);
    this.order = order;

    // начальная проверка
    this.validate();
  }

  protected onFieldChange(field: string, value: string) {
    if (field === 'email') {
      appData.setOrderField('email', value);
    } else if (field === 'phone') {
      // Форматируем телефон
      let digits = value.replace(/\D/g, '');
      if (digits.length > 10) digits = digits.slice(-10);
      const formatted = '+7' + digits;

      this.formEl.querySelector<HTMLInputElement>(
        'input[name="phone"]'
      )!.value = formatted;
      appData.setOrderField('phone', formatted);
    }

    this.validate();
  }

  private validate() {
    this.order.validate();
    const data = this.order.getData();
    const hasError =
      !data.email ||
      this.order.getErrors().email ||
      !data.phone ||
      this.order.getErrors().phone;

    this.setValid(!hasError);
  }

  protected handleSubmit() {
    this.order.setData({
      email: this.formEl
        .querySelector<HTMLInputElement>('input[name="email"]')!
        .value.trim(),
      phone: this.formEl
        .querySelector<HTMLInputElement>('input[name="phone"]')!
        .value.trim(),
    });

    console.log('Данные заказа перед API:', appData.order.getData());
    events.emit('checkout:step2Completed');
  }
}
