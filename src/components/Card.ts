import { Component } from './base/Components';
import { IProductItem, TCategoryProduct } from '../types/index';
import { ensureElement, formatNumber } from '../utils/utils';

interface ICardBehavior {
	onClick: (event: MouseEvent) => void; // Обработчик события клика
}


export interface ICard extends IProductItem {
	index: number; // Индекс карточки
}

export abstract class Card extends Component<ICard> {
	// Защищенные поля карточки
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(protected container: HTMLElement, behavior?: ICardBehavior) {
		super(container);

		// Инициализация полей карточки
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	// Установка заголовка карточки
	set title(value: string) {
		this.setText(this._title, value);
	}

	// Установка цены карточки
	set price(value: number) {
		const priceText = value ? `${formatNumber(value)} синапсов` : 'Бесценно';
		this.setText(this._price, priceText);
	}

	// Установка изображения карточки
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	// Установка категории карточки
	set category(value: TCategoryProduct) {
		this.setText(this._category, value);
	}

	// Установка цвета категории карточки
	setColorCategory(
		value: TCategoryProduct,
		settings: Record<TCategoryProduct, string>
	): void {
		this.toggleClass(this._category, settings[value]);
	}
}

// Класс карточки для каталога товаров
export class CardCatalog extends Card {
	constructor(container: HTMLElement, behavior?: ICardBehavior) {
		super(container, behavior);

		// Инициализация полей карточки для каталога товаров
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);

		if (behavior?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', behavior.onClick);
			} else {
				container.addEventListener('click', behavior.onClick);
			}
		}
	}
}

// Класс карточки для корзины
export class CardForBasket extends Card {
	protected _itemIndex: HTMLElement; // Поле индекса товара

	constructor(container: HTMLElement, behavior?: ICardBehavior) {
		super(container, behavior);

		// Инициализация полей карточки для корзины
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._itemIndex = ensureElement<HTMLElement>(
			'.basket__item-index',
			container
		);

		if (behavior?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', behavior.onClick);
			}
		}
	}

	// Установка индекса товара
	set index(value: number) {
		this.setText(this._itemIndex, String(value));
	}
}

// Класс карточки для предварительного просмотра
export class CardPreview extends Card {
	constructor(container: HTMLElement, behavior?: ICardBehavior) {
		super(container, behavior);

		// Инициализация полей карточки для предварительного просмотра
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		if (behavior?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', behavior.onClick);
			}
		}
	}

	// Установка описания карточки
	set description(value: string) {
		this.setText(this._description, value);
	}

	// Установка текста кнопки карточки
	set buttonText(value: string) {
		this.setText(this._button, value);
	}

	// Установка состояния кнопки карточки
	set buttonStatus(value: number) {
		this.setDisabled(this._button, !value);
	}
}
