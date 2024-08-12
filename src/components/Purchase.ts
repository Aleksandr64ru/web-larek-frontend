import { Component } from './base/Components'; 
import { ensureElement, formatNumber } from '../utils/utils'; 
import { TSuccess } from '../types/index'; 

interface ISuccessPurchase {
	onClick: () => void; // Интерфейс для обработчика события клика
}

export class Success extends Component<TSuccess> {
	protected _close: HTMLElement; // Элемент для закрытия
	protected _successSum: HTMLElement; // Элемент для отображения суммы заказа

	constructor(container: HTMLElement, purchase: ISuccessPurchase) {
		super(container);

		// Инициализация элементов
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._successSum = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		// Добавление обработчика клика на кнопку закрытия
		if (purchase?.onClick) {
			this._close.addEventListener('click', purchase.onClick);
		}
	}

	// Установка общей суммы заказа
	set total(value: number) {
		this.setText(this._successSum, `Потрачено ${formatNumber(value)} синапсов`);
	}
}
