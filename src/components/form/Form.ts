import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export abstract class Form {
	protected formEl: HTMLFormElement;
	protected inputs: NodeListOf<HTMLInputElement | HTMLTextAreaElement>; //инпут или текстареа в форме
	protected submitButton: HTMLButtonElement;
	protected errors: Partial<Record<string, HTMLElement>> = {};
	protected events: IEvents;

	constructor(formEl: HTMLFormElement, events: IEvents) {
		this.formEl = formEl;
		this.events = events;

		this.inputs = this.formEl.querySelectorAll('input, textarea');
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.formEl
		);

		this.initErrors();
		this.initListeners();
	}

	private initErrors(): void {
		this.inputs.forEach((input) => {
			const errorEl = this.formEl.querySelector<HTMLElement>(
				`.error-${input.name}`
			);
			if (errorEl) this.errors[input.name] = errorEl;
		});
	}

	//навешиваем инпут слушатели для всех полей
	private initListeners(): void {
		this.inputs.forEach((input) => {
			input.addEventListener('input', () => {
				this.onFieldChange(input.name, input.value);
			});
		});

		this.formEl.addEventListener('submit', (e) => {
			e.preventDefault();
			this.handleSubmit();
		});
	}

	public reset(): void {
		this.formEl.reset();

		Object.keys(this.errors).forEach((field) => {
			this.hideInputError(field);
		});
		this.setValid(false);
		this.onReset();
	}

	protected onReset(): void {
		// по умолчанию ничего
	}

	protected setValid(isValid: boolean): void {
		this.submitButton.disabled = !isValid;
	}

	protected showInputError(field: string, message: string): void {
		const el = this.errors[field];
		if (el) el.textContent = message;
	}

	protected hideInputError(field: string): void {
		const el = this.errors[field];
		if (el) el.textContent = '';
	}

	protected setError(data: {
		field: string;
		value: string;
		validInformation: string;
	}): void {
		if (data.validInformation)
			this.showInputError(data.field, data.validInformation);
		else this.hideInputError(data.field);
	}

	public getElement(): HTMLFormElement {
		return this.formEl;
	}

	protected abstract handleSubmit(): void; //обработка отправки формы
	protected abstract onFieldChange(field: string, value: string): void; //обработка изменения поля
}
