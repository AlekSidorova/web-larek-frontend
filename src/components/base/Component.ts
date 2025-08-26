// базовый класс для всех визуальных элементов;
// мы будем создавать другие классы на его основе(abstract)

export abstract class Component<T = unknown> {
  // контейнер нельзя изменить после создания(readonly)
  protected readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // возвращает контейнер, которрый мы сохранили
  render(): HTMLElement {
    return this.container;
  }

  abstract setData(data: T): void;
}