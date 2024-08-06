export interface IProduct {
    id: string;
    title: string;
    price: number;
    description: string;
    imageUrl: string;
}

export interface ICartItem {
    product: IProduct;
    quantity: number;
}

export interface ICart {
    items: ICartItem[];
    totalPrice: number;
}