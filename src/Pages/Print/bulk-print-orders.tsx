"use client";

import type React from "react";
import { useState } from "react";
import { Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import type { Order, CompanyState } from "@/store/types/order";

interface StickerPrintProps {
  orders: Order[];
  company: CompanyState;
  sortBy?: keyof Order;
  sortDirection?: "asc" | "desc";
  onPrintComplete?: () => void;
}

const StickerPrint: React.FC<StickerPrintProps> = ({
  orders,
  company,
  sortBy = "id",
  sortDirection = "desc",
  onPrintComplete,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const { address, companyName, phoneNumber } = company;

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

  const handlePrint = async () => {
    if (!orders || orders.length === 0) {
      toast({
        title: "Nothing to Print",
        description: "There are no orders to print stickers for.",
        variant: "destructive",
      });
      return;
    }

    setIsPrinting(true);

    try {
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        throw new Error("Could not open print window.");
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Orders</title>
            <style>
              @page {
               size: 80mm 50mm; 
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                font-size: 10px;
                background-color: white;
              }
              .sticker {
                width: 80mm;
              height: 50mm;
                page-break-after: always;
                position: relative;
                box-sizing: border-box;
                padding: 5mm;
                display: flex;
                flex-direction: column;
              }
              .sticker-header {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #000;
                padding-bottom: 2mm;
                margin-bottom: 2mm;
              }
              .company-name {
                font-weight: bold;
                font-size: 12px;
              }
              .order-id {
                font-weight: bold;
              }
              .customer-info {
                margin-bottom: 2mm;
              }
              .product-info {
                margin-bottom: 2mm;
              }
              .qr-code {
                position: absolute;
                right: 5mm;
                top: 12mm;
              }
              .bold {
                font-weight: bold;
              }
              .footer {
                margin-top: auto;
                border-top: 1px solid #000;
                padding-top: 2mm;
                font-size: 8px;
                text-align: center;
              }
            </style>
          </head>
          <body>
      `);

      sortedOrders.forEach((order) => {
        const orderQRData = `ID: ${order.id}, 
        Customer: ${order.customerName}, 
        Phone: ${order.phoneNumber}, 
        Product: ${order.productName},
       Amount: ${order.amount}`;

        printWindow.document.write(`
          <div class="sticker">
            <div class="sticker-header">
              <div class="company-name">${companyName}</div>
              <div class="order-id">ID: ${order.id}</div>
            </div>
            <div class="customer-info">
              <div class="bold">Customer Details:</div>
              <div>${order.customerName}</div>
              <div>${order.customerAddress}</div>
              <div>Phone: ${order.phoneNumber}</div>
            </div>
            <div class="product-info">
              <div><span class="bold">Product:</span> ${order.productName}</div>
              <div><span class="bold">Qty:</span> ${
                order.quantity
              } | <span class="bold">Color:</span> ${order.productColor}</div>
              <div><span class="bold">Amount:</span> Rs ${
                typeof order.amount === "number"
                  ? order.amount.toFixed(2)
                  : order.amount
              }</div>
              <div><span class="bold">Payment Method:</span> <span class="bold">${
                order.paymentMethod
              }</div>
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                orderQRData
              )}" width="80" height="80" alt="QR Code" />
            </div>
            <div class="footer">
              <div>Date: ${new Date().toLocaleDateString()}</div>
              <div>${companyName} | ${phoneNumber}</div>
              <span>${address}</span>
            </div>
          </div>
        `);
      });

      printWindow.document.write(`
          </body>
        </html>
      `);

      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();

        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
          }
        }, 1000);
      };

      if (onPrintComplete) {
        onPrintComplete();
      }
    } catch (error) {
      toast({
        title: "Print Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while printing.",
        variant: "destructive",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        disabled={!orders || orders.length === 0 || isPrinting}
      >
        {isPrinting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Printer className="mr-2 h-4 w-4" />
        )}
        Print {orders.length > 0 ? `(${orders.length})` : ""}
      </Button>
    </>
  );
};

export default StickerPrint;
