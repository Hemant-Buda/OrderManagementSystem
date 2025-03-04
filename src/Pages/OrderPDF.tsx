import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Order } from "@/store/types/order";

interface OrderPDFProps {
  orders: Order[];
  totalAmount: number;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: "#112233",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#bfbfbf",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#bfbfbf",
    flex: 1,
    fontSize: 8,
    textOverflow: "ellipsis",
  },
  tableCellText: {
    width: "100%",
  },
  amountCell: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#bfbfbf",
    flex: 0.8,
    fontSize: 8,
  },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: "#bfbfbf",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    width: "100px",
    textAlign: "right",
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
    width: "80px",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    borderTop: 1,
    borderTopColor: "#bfbfbf",
    paddingTop: 10,
  },
});

const OrderPDF: React.FC<OrderPDFProps> = ({ orders, totalAmount }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.subtitle}>
          Generated on: {new Date().toLocaleString()}
        </Text>
        <Text style={styles.subtitle}>Total Orders: {orders.length}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Customer Name</Text>
          <Text style={styles.tableCell}>Customer Address</Text>
          <Text style={styles.tableCell}>Customer Phone.No</Text>
          <Text style={styles.tableCell}>Product Name</Text>
          <Text style={styles.tableCell}>Product Color</Text>
          <Text style={styles.amountCell}>Price</Text>
          <Text style={styles.amountCell}>Quantity</Text>
          <Text style={styles.amountCell}>Payment Method</Text>
          <Text style={styles.amountCell}>Amount</Text>
        </View>

        {orders.map((order) => (
          <View key={order.id} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellText}>{order.customerName}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellText}>{order.customerAddress}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellText}>{order.phoneNumber}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellText}>{order.productName}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellText}>{order.productColor}</Text>
            </View>
            <View style={styles.amountCell}>
              <Text>Rs {order.price.toFixed(2)}</Text>
            </View>
            <View style={styles.amountCell}>
              <Text>{order.quantity}</Text>
            </View>
            <View style={styles.amountCell}>
              <Text>{order.paymentMethod}</Text>
            </View>
            <View style={styles.amountCell}>
              <Text>Rs {order.amount.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>Rs {totalAmount.toFixed(2)}</Text>
      </View>

      <Text style={styles.footer}> Genrated By Angle collection</Text>
    </Page>
  </Document>
);

export default OrderPDF;
