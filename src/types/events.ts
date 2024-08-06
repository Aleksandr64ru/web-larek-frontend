export enum EventTypes {
    PRODUCT_ADDED = "PRODUCT_ADDED",
    PRODUCT_REMOVED = "PRODUCT_REMOVED",
    CART_CLEARED = "CART_CLEARED",
}

export interface ProductAddedEvent {
    type: EventTypes.PRODUCT_ADDED;
    productId: string;
    quantity: number;
}

export interface ProductRemovedEvent {
    type: EventTypes.PRODUCT_REMOVED;
    productId: string;
}

export interface CartClearedEvent {
    type: EventTypes.CART_CLEARED;
}