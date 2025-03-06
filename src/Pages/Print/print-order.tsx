"use client";

import type React from "react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import { Printer, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { CompanyState, Order } from "@/store/types/order";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PrintOrderProps {
  order: Order;
  company: CompanyState;
}

const PrintOrder: React.FC<PrintOrderProps> = ({ order, company }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Handle printing with error handling
  const handlePrint = useReactToPrint({
    // @ts-ignore
    content: () => printRef.current || null,
    documentTitle: `Order-${order.id}`,
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

  // Function to check browser support and handle printing
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

  // Generate order data for QR code
  const orderQRData = `Order ID: ${order.id}
  Customer: ${order.customerName}
  Phone: ${order.phoneNumber}
  Product: ${order.productName}
  Amount: ${order.amount}
  Payment Method: ${order.paymentMethod}`;

  // Receipt component that's used for both preview and printing
  const ReceiptContent = () => (
    <div
      ref={printRef}
      className="p-2 "
      style={{ width: "80mm", fontFamily: "monospace" }}
    >
      {/* Header */}
      <div className="text-center mb-2">
        <div className="font-bold text-lg">{company?.companyName}</div>
        <div className="text-xs">{company?.address}</div>
        <div className="text-xs">{company?.phoneNumber}</div>
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
  );

  return (
    <div className="flex space-x-2">
      {/* Preview Button */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            <Eye className=" h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[400px] p-0 overflow-auto max-h-[90vh]">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          <div className=" flex justify-center items-center p-4 bg-white border-t">
            <ReceiptContent />
          </div>
          <div className="p-4 flex justify-end space-x-2 border-t">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Close
              </Button>
            </DialogClose>
            {/* Print Button */}
            <Button onClick={handlePrintWithCheck} size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Button */}
      <Button onClick={handlePrintWithCheck} variant="secondary" size="sm">
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>

      {/* Hidden print template */}
      <div className="hidden">
        <div ref={printRef}>
          <ReceiptContent />
        </div>
      </div>
    </div>
  );
};

export default PrintOrder;
