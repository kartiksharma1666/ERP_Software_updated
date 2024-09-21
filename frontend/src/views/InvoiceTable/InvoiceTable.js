import React, { useEffect, useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react';
import InvoiceDetailPopup from './InvoiceDetailPopup';

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/invoices'); // Adjust the API endpoint as necessary
        const data = await response.json();
        console.log(data);
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, []);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPopupOpen(true);
  };

  return (
    <>
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Invoice Number</CTableHeaderCell>
            <CTableHeaderCell>Client Name</CTableHeaderCell>
            <CTableHeaderCell>Total Amount</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {invoices.map((invoice) => (
            <CTableRow key={invoice._id}>
              <CTableDataCell>{invoice.invoiceNumber}</CTableDataCell>
              <CTableDataCell>{invoice.client.name}</CTableDataCell>
              <CTableDataCell>{invoice.total}</CTableDataCell>
              <CTableDataCell>{invoice.status}</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" onClick={() => handleViewDetails(invoice)}>
                  View
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {isPopupOpen && (
        <InvoiceDetailPopup
          invoice={selectedInvoice}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </>
  );
};

export default InvoiceTable;
