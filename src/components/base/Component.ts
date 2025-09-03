// базовый класс для всех визуальных элементов
export abstract class Component<T = unknown> {
  readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  //возвращает корневой элемент
  render(): HTMLElement {
    return this.container;
  }

  //показать элемент
  show(): void {
    this.container.classList.add('modal_active');
  }

  //скрыть элемент
  hide(): void {
    this.container.classList.remove('modal_active');
  }

  //абстрактный метод для обновления данных в наследниках
  abstract setData(data: T): void;

  //переключить класс у элемента
  protected toggleClass(
    element: HTMLElement,
    className: string,
    force?: boolean
  ) {
    element.classList.toggle(className, force);
  }

  //установить текстовое содержимое
  protected setText(element: HTMLElement, value: unknown) {
    if (element) element.textContent = String(value);
  }

  //заблокироват/разблокировать элемент
  protected setDisabled(element: HTMLElement, state: boolean) {
    if (!element) return;
    if (state) element.setAttribute('disabled', 'disabled');
    else element.removeAttribute('disabled');
  }

  protected setHidden(element: HTMLElement) {
    if (element) element.style.display = 'none';
  }

  protected setVisible(element: HTMLElement) {
    if (element) element.style.removeProperty('display');
  }

  //установить изображение и алт
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (!element) return;
    element.src = src;
    if (alt) element.alt = alt;
  }
}
