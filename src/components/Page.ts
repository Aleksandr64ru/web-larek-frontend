import { Component } from './base/Components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

// Интерфейс для данных страницы
interface IPage {
    counter: number; 
    catalog: HTMLElement[];
    locked: boolean; 
}

// Класс для отображения страницы
export class Page extends Component<IPage> {
    // Элементы DOM
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    // Конструктор класса
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов DOM
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // Установка обработчика события клика на элемент корзины
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    // Установка значения счетчика
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    // Установка элементов каталога
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    // Установка состояния прокрутки страницы
    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }
}