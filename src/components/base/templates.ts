import { ensureElement, cloneTemplate } from "../../utils/utils";

export const templates = {
  page: ensureElement<HTMLElement>('.page'),
  modalContainer: ensureElement<HTMLElement>('#modal-container'),
  gallery: ensureElement<HTMLElement>('.gallery'),

  success: () => cloneTemplate('#success'),
  cardCatalog: () => cloneTemplate('#card-catalog'),
  cardPreview: () => cloneTemplate('#card-preview'),
  basket: () => cloneTemplate('#basket'),
  order: () => cloneTemplate('#order'),
  contacts: () => cloneTemplate('#contacts')
};