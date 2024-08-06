export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

export interface ProductApiResponse {
    id: string;
    title: string;
    price: number;
    description: string;
    imageUrl: string;
}

export interface CartApiResponse {
    items: CartItemApiResponse[];
    totalPrice: number;
}

export interface CartItemApiResponse {
    product: ProductApiResponse;
    quantity: number;
}