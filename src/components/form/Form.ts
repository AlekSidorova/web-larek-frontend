import { IEvents } from "../base/events";
import { ensureElement } from '../../utils/utils';

export abstract class Form {
  protected formEl: HTMLFormElement; 
  protected inputs: NodeListOf<HTMLInputElement>; //список всех инпутов и тексареа
  protected submitButton: HTMLButtonElement; 
  protected errors: Record<string, HTMLElement> = {};
  protected events: IEvents;

  constructor(formEl: HTMLFormElement, events: IEvents) {
    //при создании форм-передаем элементы и объекты событий
    this.formEl = formEl; 
    this.events = events;

    this.inputs = this.formEl.querySelectorAll<HTMLInputElement>('input');
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.formEl);

    //методы, чтобы настроить обработку ошибок событий
    this.initErrors();
    this.initListeners();
  }

  //перебирает все элементы ввода и инициализирует объект ошибок
  private initErrors(): void {
    this.inputs.forEach(input => {
       const errorEl = this.formEl.querySelector<HTMLElement>(`.error-${input.name}`);
      if (errorEl) this.errors[input.name] = errorEl;
    });
  }

  //устанавливаются обрб событий на каждом поле ввода
  private initListeners(): void {
    this.inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.events.emit(`${this.formEl.name}.${input.name}:change`, {
          field: input.name,
          value: input.value });
      });
    });

    //устанивается так же на кнопку отправки
    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  //методы упралвения валидностью и отображением ошибок
  protected setValid(isValid: boolean): void { //вкл/откл кнопки
    this.submitButton.disabled = !isValid;
  }

  protected showInputError(field: string, message: string) { //показывает сообщение
     const el = this.errors[field];
    if (el) el.textContent = message;
  }

  protected hideInputError(field: string) { //очищает сообещние
   const el = this.errors[field];
    if (el) el.textContent = '';
  }

  //показывает нужный метот из вышеперечисленных 
  protected setError(data: { field: string; value: string; validInformation: string }) {
    if (data.validInformation) this.showInputError(data.field, data.validInformation);
    else this.hideInputError(data.field);
  }

  protected handleSubmit(): void {
    // заглушка, переопределяется в наследниках
  }
}