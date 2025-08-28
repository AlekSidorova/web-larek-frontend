import { ensureElement,cloneTemplate } from "../../utils/utils" 

export const templates = { 
  page: ensureElement<HTMLElement>('.page'), 
  modalContainer: ensureElement<HTMLElement>('#modal-container'), 
  modalContent: ensureElement<HTMLElement>('.modal__content'), 
  modalClose: ensureElement<HTMLElement>('.modal__close'), 
  gallery: ensureElement<HTMLElement>('.gallery'), 

  success:() => cloneTemplate('#success'),
  cardCatalog:() => cloneTemplate('#card-catalog'),
  cardPreview:() => cloneTemplate('#card-preview'),
  cardBasket:() => cloneTemplate('#card-basket'),
  basket:() => cloneTemplate('#basket'),
  order:() => cloneTemplate('#order'),
  contacts:() => cloneTemplate('#contacts')
};



