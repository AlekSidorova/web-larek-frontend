// базовый класс для всех визуальных элементов;
// мы будем создавать другие классы на его основе(abstract)

export abstract class Component<T = unknown> {
  // контейнер нельзя изменить после создания(readonly)
  readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // возвращает контейнер, который мы сохранили DOM
  render(): HTMLElement {
    return this.container;
  }

  show() {
    this.container.classList.add('modal_active');
  }

  hide() {
    this.container.classList.remove('modal_active');
  }

  // Каждый наследник обязан реализовать обновление данных
  abstract setData(data: T): void;
}