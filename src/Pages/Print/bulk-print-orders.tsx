"use client";

import type React from "react";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import { Printer, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { Order, CompanyState } from "@/store/types/order";

interface BulkPrintOrdersProps {
  orders: Order[];
  company: CompanyState;
  sortBy?: keyof Order;
  sortDirection?: "asc" | "desc";
}

const BulkPrintOrders: React.FC<BulkPrintOrdersProps> = ({
  orders,
  company,
  sortBy = "id",
  sortDirection = "desc",
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { address, companyName, phoneNumber } = company;

  // Sort orders based on provided criteria
  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => printRef.current,
    documentTitle: "Orders-List",
    pageStyle: `
    @page {
      size: 80mm auto;
      margin: 0;
    }
    @media print {
      body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }
      .page-break {
        page-break-after: always;
        height: 0;
        display: block;
      }
    }
  `,
    onPrintError: (error) => {
      console.error("Print failed:", error);
      toast({
        title: "Printer Error",
        description:
          "Could not connect to printer. Please check your printer connection.",
        variant: "destructive",
      });
    },
  });

  // Add a function to check printer and handle printing
  const handlePrintWithCheck = () => {
    // Check if window.print is available (browser support)
    if (typeof window.print !== "function") {
      toast({
        title: "Printing Not Supported",
        description:
          "Printing is not supported in this browser or environment.",
        variant: "destructive",
      });
      return;
    }

    // Attempt to print
    handlePrint();
  };

  // Calculate total amount of all orders
  const totalAmount = orders.reduce((sum, order) => {
    const amount =
      typeof order.amount === "number"
        ? order.amount
        : Number.parseFloat((order.amount as number | string).toString()) || 0;
    return sum + amount;
  }, 0);

  // Receipt content component that's used for both preview and printing
  const ReceiptContent = () => (
    <div style={{ width: "80mm", fontFamily: "monospace" }}>
      {/* Summary Page */}
      <div className="p-2">
        <div className="text-center mb-2">
          <div className="font-bold text-lg">{companyName}</div>
          <div className="text-xs">{address}</div>
          <div className="text-xs">{phoneNumber}</div>
          <div className="text-xs mt-1">----- ORDERS SUMMARY -----</div>
        </div>

        <div className="text-xs mb-2">
          <div>Date: {new Date().toLocaleString()}</div>
          <div>Total Orders: {orders.length}</div>
        </div>

        <div className="text-xs mb-2">
          <div>---------------------------------------</div>
          <div className="flex justify-between">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Amount</span>
          </div>
          <div>---------------------------------------</div>

          {sortedOrders.map((order) => (
            <div key={order.id} className="flex justify-between">
              <span className="w-16 truncate">{order.id.slice(-6)}</span>
              <span className="w-20 truncate">{order.customerName}</span>
              <span>
                Rs{" "}
                {typeof order.amount === "number"
                  ? order.amount.toFixed(2)
                  : order.amount}
              </span>
            </div>
          ))}

          <div>---------------------------------------</div>
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>Rs {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center text-xs mb-2">
          <div>--- Individual order details follow ---</div>
        </div>
      </div>

      <div className="page-break"></div>

      {/* Individual Order Pages */}
      {sortedOrders.map((order, index) => {
        // Generate order data for QR code
        const orderQRData = JSON.stringify({
          id: order.id,
          customer: order.customerName,
          phone: order.phoneNumber,
          product: order.productName,
          amount: order.amount,
        });

        return (
          <div key={order.id}>
            <div className="p-2">
              {/* Header */}
              <div className="text-center mb-2">
                <div className="font-bold text-lg">{companyName}</div>
                <div className="text-xs">{address}</div>
                <div className="text-xs">{phoneNumber}</div>
                <div className="text-xs mt-1">----- ORDER RECEIPT -----</div>
              </div>

              {/* Order Info */}
              <div className="text-xs mb-2">
                <div>Order ID: {order.id}</div>
                <div>Date: {new Date().toLocaleString()}</div>
              </div>

              {/* Customer Info */}
              <div className="text-xs mb-2">
                <div>Customer: {order.customerName}</div>
                <div>Address: {order.customerAddress}</div>
                <div>Phone: {order.phoneNumber}</div>
              </div>

              {/* Order Items */}
              <div className="text-xs mb-2">
                <div>---------------------------------------</div>
                <div className="flex justify-between">
                  <span>Item</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span>Total</span>
                </div>
                <div>---------------------------------------</div>
                <div className="flex justify-between">
                  <span className="w-20 truncate">{order.productName}</span>
                  <span>{order.quantity}</span>
                  <span>
                    Rs{" "}
                    {typeof order.price === "number"
                      ? order.price.toFixed(2)
                      : order.price}
                  </span>
                  <span>
                    Rs{" "}
                    {typeof order.amount === "number"
                      ? order.amount.toFixed(2)
                      : order.amount}
                  </span>
                </div>
                <div className="mt-1">Color: {order.productColor}</div>
                <div>---------------------------------------</div>
              </div>

              {/* Total */}
              <div className="text-xs mb-2">
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>
                    Rs{" "}
                    {typeof order.amount === "number"
                      ? order.amount.toFixed(2)
                      : order.amount}
                  </span>
                </div>
                <div>Payment Method: {order.paymentMethod}</div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-2">
                <QRCodeSVG value={orderQRData} size={120} />
              </div>

              {/* Footer */}
              <div className="text-center text-xs mb-2">
                <div>Thank you for your purchase!</div>
                <div>Please scan QR code for order details</div>
              </div>
            </div>

            {index < sortedOrders.length - 1 && (
              <div className="page-break"></div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Preview Button */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[400px] p-0 max-h-[80vh] flex flex-col">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Bulk Receipt Preview</DialogTitle>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="p-4 bg-white flex  justify-center overflow-y-auto border-t">
            <ReceiptContent />
          </div>

          <div className="p-4 flex justify-end space-x-2 border-t">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Close
              </Button>
            </DialogClose>
            <Button onClick={handlePrintWithCheck} size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Button */}
      <Button onClick={handlePrintWithCheck} variant="outline" size="sm">
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>

      {/* Hidden print template */}
      <div className="hidden">
        <div ref={printRef}>
          <ReceiptContent />
        </div>
      </div>
    </>
  );
};

export default BulkPrintOrders;
