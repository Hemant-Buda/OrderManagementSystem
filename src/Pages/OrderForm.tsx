"use client";

import type React from "react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { addOrder } from "../store/orderSlice";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/lable";

const OrderForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    customerName: "",
    paymentMethod: "",
    customerAddress: "",
    phoneNumber: "",
    productName: "",
    productColor: "",
    price: "",
    quantity: "",
  });

  // State to track validation errors
  const [errors, setErrors] = useState({
    customerName: "",
    paymentMethod: "",
    customerAddress: "",
    phoneNumber: "",
    productName: "",
    productColor: "",
    price: "",
    quantity: "",
  });

  const amount = Number(formData.price) * Number(formData.quantity) || 0;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear the error when the user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      customerName: "",
      paymentMethod: "",
      customerAddress: "",
      phoneNumber: "",
      productName: "",
      productColor: "",
      price: "",
      quantity: "",
    };

    let isValid = true;

    // Validate customer name
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required.";
      isValid = false;
    }

    // Validate customer address
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = "Customer address is required.";
      isValid = false;
    }

    // Validate phone number
    const phoneNumberRegex = /^\d{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
      isValid = false;
    } else if (!phoneNumberRegex.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
      isValid = false;
    }

    // Validate product name
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required.";
      isValid = false;
    }

    // Validate product color
    if (!formData.productColor.trim()) {
      newErrors.productColor = "Product color is required.";
      isValid = false;
    }

    // Validate price
    if (!formData.price.trim()) {
      newErrors.price = "Price is required.";
      isValid = false;
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
      isValid = false;
    }

    // Validate quantity
    if (!formData.quantity.trim()) {
      newErrors.quantity = "Quantity is required.";
      isValid = false;
    } else if (Number(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number.";
      isValid = false;
    }

    // Validate payment method
    if (!formData.paymentMethod.trim()) {
      newErrors.paymentMethod = "Payment method is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    toast({
      variant: "default",
      title: "Order Added",
      description: "The order has been successfully added.",
    });

    const newOrder = {
      id: Date.now().toString(),
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      customerAddress: formData.customerAddress,
      productName: formData.productName,
      productColor: formData.productColor,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      paymentMethod: formData.paymentMethod,
      amount,
    };
    // @ts-ignore
    dispatch(addOrder(newOrder));

    // Reset form
    setFormData({
      customerName: "",
      customerAddress: "",
      phoneNumber: "",
      productName: "",
      productColor: "",
      price: "",
      quantity: "",
      paymentMethod: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border shadow-sm p-6 dark:bg-card"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Order</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 dark:bg-card">
        {/* Customer Name */}
        <div className="space-y-2">
          <label htmlFor="customerName" className="text-sm font-medium">
            Customer Name
          </label>
          <input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm">{errors.customerName}</p>
          )}
        </div>
        {/* Customer Address */}
        <div className="space-y-2">
          <label htmlFor="customerAddress" className="text-sm font-medium">
            Customer Address
          </label>
          <input
            id="customerAddress"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
            placeholder="Enter customer address"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
          />
          {errors.customerAddress && (
            <p className="text-red-500 text-sm">{errors.customerAddress}</p>
          )}
        </div>
        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium">
            Customer Phone.no
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="number"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter customer phone.no"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>
        {/* Product Name */}
        <div className="space-y-2">
          <label htmlFor="productName" className="text-sm font-medium">
            Product Name
          </label>
          <input
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
          />
          {errors.productName && (
            <p className="text-red-500 text-sm">{errors.productName}</p>
          )}
        </div>
        {/* Product Color */}
        <div className="space-y-2">
          <label htmlFor="productColor" className="text-sm font-medium">
            Product Color
          </label>
          <input
            id="productColor"
            name="productColor"
            value={formData.productColor}
            onChange={handleChange}
            placeholder="Enter product color"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
          />
          {errors.productColor && (
            <p className="text-red-500 text-sm">{errors.productColor}</p>
          )}
        </div>
        {/* Price */}
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>
        {/* Quantity */}
        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            min="1"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity}</p>
          )}
        </div>
        {/* Payment Method */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value: string) => {
              setFormData((prev) => ({ ...prev, paymentMethod: value }));
              // Clear the payment method error when a value is selected
              setErrors((prev) => ({ ...prev, paymentMethod: "" }));
            }}
          >
            <SelectTrigger
              className="border border-gray-300"
              id="paymentMethod"
            >
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="COD">Cash on Delivery</SelectItem>
            </SelectContent>
          </Select>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
          )}
        </div>
        {/* Amount (Read-only) */}
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            value={amount.toFixed(2)}
            readOnly
            disabled
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card "
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-black text-white rounded-md px-4 py-2 text-sm font-medium dark:bg-primary dark:text-primary-foreground"
          >
            Add Order
          </button>
        </div>
      </div>
    </form>
  );
};

export default OrderForm;
