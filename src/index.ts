import './scss/styles.scss';

import { OnlineStoreAPI } from './components/OnlineStore';
import { API_URL, CDN_URL } from './utils/constants';
import { settings } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { CardForBasket, CardCatalog, CardPreview } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProductItem, IAddressForm, IContactsForm } from './types';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { AddressForm, ContactsForm } from './components/Form';
import { Success } from './components/Success';

const events = new EventEmitter();

const api = new OnlineStoreAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Получение шаблонов из DOM
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardForBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const addressFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new Page(document.body, events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);

const addressForm = new AddressForm(cloneTemplate(addressFormTemplate), events);

const contactsForm = new ContactsForm(
	cloneTemplate(contactsFormTemplate),
	events
);

// Функция для очистки корзины заказа
function clearOrder() {
	appData.clearBasket();
	page.counter = appData.getCountItems();
	events.off('order:clear', clearOrder);
}

// Обработчик события изменения списка карточек
events.on('cards:changed', (cards: { catalog: IProductItem[] }) => {
	page.catalog = cards.catalog.map((item) => {
		const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		card.setColorCategory(item.category, settings);
		return card.render({
			price: item.price,
			title: item.title,
			image: item.image,
			category: item.category,
		});
	});
});

// Обработчик события выбора карточки товара
events.on('card:select', (item: IProductItem) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.isIncludedCard(item.id)) {
				appData.toggleOrderedItem(item.id, true);
				page.counter = appData.getCountItems();
				card.buttonText = 'Удалить из корзины'; 
			} else {
				appData.toggleOrderedItem(item.id, false);
				page.counter = appData.getCountItems();
				card.buttonText = 'В корзину';
			}
		},
	});

	// Устанавливаем текст кнопки в зависимости от состояния товара в корзине
	card.buttonText = appData.isIncludedCard(item.id)
		? 'Удалить из корзины'
		: 'В корзину';

	card.setColorCategory(item.category, settings);
	card.buttonStatus = item.price;
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});
});

// Обработчик события открытия корзины
events.on('basket:open', () => {
	// Генерация карточек товаров в корзине и их рендеринг
	basket.items = appData.getAddProductInBasket().map((item, index) => {
		const card = new CardForBasket(cloneTemplate(cardForBasketTemplate), {
			onClick: () => {
				appData.toggleOrderedItem(item.id, false);
				page.counter = appData.getCountItems();
				events.emit('basket:open');
			},
		});

		return card.render({
			price: item.price,
			title: item.title,
			index: index + 1,
		});
	});

	// Рендеринг корзины в модальном окне
	modal.render({
		content: basket.render({
			total: appData.getTotal(),
			selected: appData.order.items,
		}),
	});
});

// Обработчик события открытия формы заказа
events.on('order:open', () => {
	// Рендеринг формы адреса в модальном окне
	modal.render({
		content: addressForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик события выбора способа оплаты
events.on('buttonPayments:select', (event: { button: HTMLButtonElement }) => {
	event.button.classList.add('button_alt-active');
	appData.setOrderField('payment', event.button.getAttribute('name'));
});

// Обработчик изменения полей формы адреса
events.on(
	/^order\..*:change/,
	(data: { field: keyof IAddressForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Обработчик изменения ошибок формы адреса
events.on('addressFormErrors:change', (errors: Partial<IAddressForm>) => {
	const { address, payment } = errors;
	addressForm.valid = !address && !payment;
	addressForm.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Обработчик события отправки заказа
events.on('order:submit', () => {
	// Рендеринг формы контактов в модальном окне
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик изменения полей формы контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Обработчик изменения ошибок формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contactsForm.valid = !phone && !email;
	contactsForm.errors = [phone, email].filter((i) => !!i).join('; ');
});

// Обработчик события отправки данных формы контактов
events.on('contacts:submit', () => {
	// Отправка данных формы контактов на сервер
	api
		.orderProduct(appData.order)
		.then((result) => {
			// Отображение сообщения об успешном заказе
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					// Очистка корзины после успешного заказа
					clearOrder();
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
			events.on('order:clear', clearOrder);
		})
		.catch((err) => {
			console.error(err);
		});
});


events.on('modal:open', () => {
	page.locked = true; 
});


events.on('modal:close', () => {
	page.locked = false;
});


events.on('form:reset', () => {
	appData.resetForm();
});


api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
