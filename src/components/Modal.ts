import { Component } from './base/Components';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

interface IModalContent {
	content: HTMLElement; 
}

export class Modal extends Component<IModalContent> {
	protected _content: HTMLElement; 
	protected _closeButton: HTMLButtonElement; 

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Инициализация элементов модального окна
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// Обработчики событий для закрытия модального окна
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Установка содержимого модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Метод для открытия модального окна
	open() {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	// Метод для закрытия модального окна
	close() {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null; // Очищаем содержимое модального окна
		this.events.emit('modal:close');
	}

	// Метод для рендеринга модального окна с указанным содержимым
	render(data: IModalContent): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
