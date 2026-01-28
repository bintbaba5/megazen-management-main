import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

// PDF Component
const SalesReportPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Sales Report</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.header}>Customer: {item.customerName}</Text>
          <Text>Order Date: {item.orderDate}</Text>
          <Text>Total Amount: ${item.totalAmount}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default SalesReportPDF;
