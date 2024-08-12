import _ from 'lodash'; 
import {
    FormErrors, 
    IAddressForm, 
    IAppState, 
    IContactsForm, 
    IOrder, 
    IProductItem 
} from '../types/index';
import { Model } from './base/Model'; 

// Класс состояния приложения, наследующий Model<IAppState>
export class AppState extends Model<IAppState> {
    catalog: IProductItem[] = []; // Список продуктов в каталоге
    order: IOrder = {
        payment: '', 
        address: '', 
        email: '', 
        phone: '', 
        total: 0, 
        items: [] 
    };
    formErrors: FormErrors = {}; // Ошибки формы

    // Метод для добавления или удаления продукта из заказа
    toggleOrderedItem(id: string, isIncluded: boolean): void {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]);
        } else {
            this.order.items = _.without(this.order.items, id);
        }
        this.order.total = this.getTotal();
    }

    // Метод для проверки, включен ли продукт в заказ
    isIncludedCard(cardId: string): boolean {
        return this.order.items.some((itemId) => itemId === cardId);
    }

    // Метод для вычисления общей суммы заказа
    getTotal(): number {
        return this.order.items.reduce((total, itemId) => {
            const item = this.catalog.find((it) => it.id === itemId);
            return total + (item ? item.price : 0);
        }, 0);
    }

    // Метод для установки списка продуктов в каталоге
    setCatalog(items: IProductItem[]): void {
        this.catalog = items;
        this.emitChanges('cards:changed', { catalog: this.catalog });
    }

    // Метод для получения продуктов, добавленных в корзину
    getAddProductInBasket(): IProductItem[] {
        return this.catalog.filter((item) => this.order.items.includes(item.id));
    }

    // Метод для установки значений полей заказа
    setOrderField(field: keyof IAddressForm, value: string): void {
        this.order[field] = value;
        this.validateOrderForm();
    }

    // Метод для валидации формы заказа
    validateOrderForm(): boolean {
        const errors: FormErrors = {};

        if (!this.order.payment) {
            errors.payment = 'Укажите способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Укажите адрес';
        }

        this.formErrors = errors;
        this.events.emit('addressFormErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }

    // Метод для установки значений полей контактов
    setContactsField(field: keyof IContactsForm, value: string): void {
        this.order[field] = value;
        this.validateContactsForm();
    }

    // Метод для валидации формы контактов
    validateContactsForm(): boolean {
        const errors: FormErrors = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }

    // Метод для получения количества элементов в заказе
    getCountItems(): number {
        return this.order.items.length;
    }

    // Метод для очистки корзины
    clearBasket(): void {
        this.order.items.forEach((id) => {
            this.toggleOrderedItem(id, false);
        });
    }

    // Метод для сброса значений формы
    resetForm(): void {
        this.order.payment = '';
        this.order.address = '';
        this.order.email = '';
        this.order.phone = '';
    }
}