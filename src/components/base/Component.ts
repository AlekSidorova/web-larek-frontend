// базовый класс для всех визуальных элементов
export abstract class Component<T = unknown> {
  readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /** Вернуть корневой DOM-элемент */
  render(): HTMLElement {
    return this.container;
  }

  /** Показать элемент */
  show(): void {
    this.container.classList.add('modal_active');
  }

  /** Скрыть элемент */
  hide(): void {
    this.container.classList.remove('modal_active');
  }

  /** Абстрактный метод для обновления данных в наследниках */
  abstract setData(data: T): void;

  /** Переключить класс у элемента */
  protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
  }

  /** Установить текстовое содержимое */
  protected setText(element: HTMLElement, value: unknown) {
    if (element) element.textContent = String(value);
  }

  /** Заблокировать/разблокировать элемент */
  protected setDisabled(element: HTMLElement, state: boolean) {
    if (!element) return;
    if (state) element.setAttribute('disabled', 'disabled');
    else element.removeAttribute('disabled');
  }

  /** Скрыть элемент (display: none) */
  protected setHidden(element: HTMLElement) {
    if (element) element.style.display = 'none';
  }

  /** Показать элемент (удаляем display) */
  protected setVisible(element: HTMLElement) {
    if (element) element.style.removeProperty('display');
  }

  /** Установить изображение и alt */
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (!element) return;
    element.src = src;
    if (alt) element.alt = alt;
  }
}