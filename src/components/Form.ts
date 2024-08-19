import { Component } from './base/Components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IAddressForm, IContactsForm } from '../types/index';

interface IFormCondition {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T> extends Component<IFormCondition> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Обработчик изменения значений полей формы
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    // Метод для обработки изменения значений полей формы
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value,
        });
    }

    // Установка состояния валидности формы
    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }

    // Установка сообщения об ошибке
    set errors(value: string) {
        this.setText(this._errors, value);
    }

    // Метод для рендеринга формы
    render(state: Partial<T> & IFormCondition) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}

// Класс формы для адреса
export class AddressForm extends Form<IAddressForm> {
    protected _buttonPayments: HTMLButtonElement[]; // Кнопки выбора оплаты
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttonPayments = Array.from(container.querySelectorAll('.button_alt'));

        // Обработчики для кнопок выбора оплаты
        this._buttonPayments.forEach((button) => {
            button.addEventListener('click', (e: Event) => {
                this._buttonPayments.forEach((button) => {
                    if (button === e.target) return;
                    this.toggleClass(button, 'button_alt-active');
                });
                events.emit('buttonPayments:select', {
                    button: e.target as HTMLButtonElement,
                });
                this.toggleClass(e.target as HTMLButtonElement, 'button_alt-active');
            });
        });
    }

    // Установка значения адреса
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

// Класс формы для контактов
export class ContactsForm extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    // Установка значения email
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    // Установка значения телефона
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}