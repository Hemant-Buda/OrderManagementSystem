import type React from "react";
import OrderForm from "./OrderForm";
import OrderList from "./OrderList";

const OrderManagement: React.FC = () => {
  return (
    <div className="space-y-8">
      <OrderForm />
      <OrderList />
    </div>
  );
};

export default OrderManagement;
