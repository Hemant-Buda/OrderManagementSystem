export interface Order {
  id: string;
  customerName: string;
  productName: string;
  price: number;
  quantity: number;
  amount: number;
  paymentMethod: number;
  customerAddress: string;
  phoneNumber: number;
  productColor: string;
}

export interface OrderState {
  orders: Order[];
}
