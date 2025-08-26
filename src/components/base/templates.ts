//функция для шаблонов
function getTemplate(id: string): HTMLElement {
  const tpl = document.querySelector<HTMLTemplateElement>(id);

  //проверяем, нашелся ли шаблон
  if (!tpl) { //если нет - ошибка
    throw new Error(`Шаблон ${id} не найден`) 
  } 

  //получаем содержимое первого элемента шаблона и клонируем
  return tpl.content.firstElementChild.cloneNode(true) as HTMLElement;
}

export const templates = {
  //постоянные элементы
  page: document.querySelector('.page') as HTMLElement,
  modalContainer: document.getElementById('modal-container') as HTMLElement,

  //копируемые шаблоны
  success:() => getTemplate('#success'),
  cardCatalog:() => getTemplate('#card-catalog'),
  cardPreview:() => getTemplate('#card-preview'),
  cardBasket:() => getTemplate('#card-basket'),
  basket:() => getTemplate('#basket'),
  order:() => getTemplate('#order'),
  contacts:() => getTemplate('#contacts')
}