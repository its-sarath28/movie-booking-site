import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create TicketPDF component
const TicketPDF = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.section}>Movie Ticket</Text>
        <Text style={styles.section}>Movie name: {booking.movie.name}</Text>
        <Text style={styles.section}>Date: {booking.showDate}</Text>
        <Text style={styles.section}>Time: {booking.showTime}</Text>
      </View>
    </Page>
  </Document>
);

export default TicketPDF;
