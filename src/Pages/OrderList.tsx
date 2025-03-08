"use client";

import type React from "react";
import { useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  selectOrders,
  selectTotalAmount,
  clearOrders,
  deleteOrder,
  editOrder,
} from "../store/orderSlice";
import type { Order } from "@/store/types/order";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Ellipsis, Edit, Trash, Save } from "lucide-react";
import PDFDownloadButton from "./PDFDownloadButton";
import BulkPrintOrders from "./Print/bulk-print-orders";
import { selectCompany } from "@/store/companySilice";

const OrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const company = useAppSelector(selectCompany);

  const totalAmount = useAppSelector(selectTotalAmount);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<Order | null>(null);

  const handleCompleteOrders = () => {
    dispatch(clearOrders());
    toast({ title: "Orders Completed", description: "All orders cleared." });
  };

  const handleDeleteOrder = (orderId: string) => {
    dispatch(deleteOrder(orderId));
    toast({
      title: "Order Deleted",
      description: "Order successfully deleted.",
    });
  };

  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
    setFormData(order); // Populate the form fields with selected order data
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      const updatedFormData = { ...formData };

      // Handle numeric fields properly
      if (name === "quantity" || name === "price") {
        updatedFormData[name] = Number.parseFloat(value) || 0; // Convert to number, default to 0 if NaN
      } else {
        // @ts-ignore
        updatedFormData[name] = value;
      }

      // Recalculate amount if quantity or price changes
      if (name === "quantity" || name === "price") {
        const quantity =
          Number.parseFloat(updatedFormData.quantity.toString()) || 0;
        const price = Number.parseFloat(updatedFormData.price.toString()) || 0;
        updatedFormData.amount = quantity * price;
      }

      setFormData(updatedFormData);
    }
  };

  const handleSubmit = () => {
    if (formData) {
      // Validate phone number - must be exactly 10 digits
      const phoneNumberPattern = /^\d{10}$/;
      if (!phoneNumberPattern.test(formData.phoneNumber.toString())) {
        toast({
          title: "Invalid Phone Number",
          description: "Phone number must be exactly 10 digits.",
          variant: "destructive",
        });
        return; // Stop the submission
      }

      // Ensure price and quantity are numbers before dispatching
      const sanitizedFormData = {
        ...formData,
        price:
          typeof formData.price === "number"
            ? formData.price
            : Number.parseFloat(
                (formData.price as number | string).toString()
              ) || 0,
        quantity:
          typeof formData.quantity === "number"
            ? formData.quantity
            : Number.parseFloat(
                (formData.quantity as number | string).toString()
              ) || 0,
        amount:
          typeof formData.amount === "number"
            ? formData.amount
            : Number.parseFloat(
                (formData.amount as number | string).toString()
              ) || 0,
      };

      dispatch(editOrder(sanitizedFormData));
      toast({
        title: "Order Updated",
        description: "Order successfully updated.",
      });
      setEditingOrder(null);
      setFormData(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Order List</CardTitle>
          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <BulkPrintOrders
                orders={orders}
                //@ts-ignore
                company={company}
                sortBy="id"
                sortDirection="desc"
              />
            )}
            <PDFDownloadButton orders={orders} totalAmount={totalAmount} />
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          Orders {orders.length}
        </span>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden border rounded-md">
          <div className="overflow-x-auto">
            <div className="max-h-[calc(50vh-40px)] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[60px]">S.N.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center text-muted-foreground"
                      >
                        No orders added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Sort orders to display newest first (assuming orders have a createdAt property)
                    [...orders]
                      .sort((a, b) => {
                        return b.id.localeCompare(a.id);
                      })
                      .map((order, index) => (
                        <TableRow key={order.id}>
                          {editingOrder?.id === order.id ? (
                            <>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Input
                                  className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="customerName"
                                  value={formData?.customerName || ""}
                                  onChange={handleChange}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  className="w-50 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="customerAddress"
                                  value={formData?.customerAddress || ""}
                                  onChange={handleChange}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="phoneNumber"
                                  value={formData?.phoneNumber || ""}
                                  onChange={handleChange}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="productName"
                                  value={formData?.productName || ""}
                                  onChange={handleChange}
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="productColor"
                                  value={formData?.productColor || ""}
                                  onChange={handleChange}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Input
                                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="price"
                                  type="number"
                                  value={formData?.price || ""}
                                  onChange={handleChange}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Input
                                  className="w-16 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="quantity"
                                  type="number"
                                  value={formData?.quantity || ""}
                                  onChange={handleChange}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Input
                                  className="w-[60px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="paymentMethod"
                                  value={formData?.paymentMethod || ""}
                                  onChange={handleChange}
                                />
                              </TableCell>
                              <TableCell className="text-right ">
                                <Input
                                  className="w-[86px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:bg-card"
                                  name="amount"
                                  type="number"
                                  value={formData?.amount || ""}
                                  onChange={handleChange}
                                  disabled
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" onClick={handleSubmit}>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save
                                </Button>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                {order.customerName || "N/A"}
                              </TableCell>
                              <TableCell>
                                {order.customerAddress || "N/A"}
                              </TableCell>
                              <TableCell>
                                {order.phoneNumber || "N/A"}
                              </TableCell>
                              <TableCell>
                                {order.productName || "N/A"}
                              </TableCell>
                              <TableCell>
                                {order.productColor || "N/A"}
                              </TableCell>
                              <TableCell className="text-right">
                                Rs{" "}
                                {(typeof order.price === "number"
                                  ? order.price.toFixed(2)
                                  : order.price) || "N/A"}
                              </TableCell>
                              <TableCell className="text-right">
                                {order.quantity || "N/A"}
                              </TableCell>
                              <TableCell className="text-center">
                                {order.paymentMethod || "N/A"}
                              </TableCell>
                              <TableCell className="text-right">
                                Rs{" "}
                                {(typeof order.amount === "number"
                                  ? order.amount.toFixed(2)
                                  : order.amount) || "N/A"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Ellipsis />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-30 p-2">
                                    <div className="flex flex-col space-y-2">
                                      <Button
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={() => handleEditClick(order)}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        className="justify-start text-red-500"
                                        onClick={() =>
                                          handleDeleteOrder(order.id)
                                        }
                                      >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
      {orders.length > 0 && (
        <CardFooter className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Total Amount: Rs {totalAmount.toFixed(2)}
          </div>

          <Button onClick={handleCompleteOrders} variant="secondary" size="sm">
            Complete Orders
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderList;
