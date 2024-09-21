import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';

const InvoiceDetailPopup = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <CModal visible={true} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Invoice Details</CModalTitle>
        <button className="btn-close" onClick={onClose}></button>
      </CModalHeader>
      <CModalBody>
        <h5>Invoice Number: {invoice.invoiceNumber}</h5>
        <p>Client Name: {invoice.client.name}</p>
        <p>Email: {invoice.client.email}</p>
        <p>Phone: {invoice.client.phone}</p>
        <p>Address: {invoice.client.address}</p>
        <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p>Status: {invoice.status}</p>
        <p>Total Amount: {invoice.total}</p>
        <p>Notes: {invoice.notes}</p>
        <h6>Items:</h6>
        <ul>
          {invoice.items.map((item, index) => (
            <li key={index}>
              {item.itemName} - Quantity: {item.quantity}, Price: {item.unitPrice}
            </li>
          ))}
        </ul>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default InvoiceDetailPopup;
