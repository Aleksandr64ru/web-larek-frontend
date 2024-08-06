export interface ProductView {
    id: string;
    title: string;
    price: number;
    imageUrl: string; // Можно убрать описание, если оно не нужно для вывода
}

export interface CartView {
    items: CartItemView[];
    totalPrice: number;
}

export interface CartItemView {
    productId: string;
    quantity: number;
    title: string;
    price: number;
}