import type React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

import OrderPDF from "./OrderPDF";
import { Order } from "@/store/types/order";

interface PDFDownloadButtonProps {
  orders: Order[];
  totalAmount: number;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  orders,
  totalAmount,
}) => {
  if (orders.length === 0) return null;

  return (
    <PDFDownloadLink
      document={<OrderPDF orders={orders} totalAmount={totalAmount} />}
      fileName={`orders-${new Date().toISOString().split("T")[0]}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" disabled={loading}>
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? "Generating PDF..." : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
