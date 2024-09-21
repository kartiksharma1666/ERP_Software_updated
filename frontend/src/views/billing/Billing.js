import {
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CFormTextarea,
  CButton,
  CFormInput,
  CFormLabel,
} from '@coreui/react';
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Billing = () => {
  const initialState = {
    items: [{ itemName: '', unitPrice: '', quantity: '', discount: '' }],
    notes: '',
    creator: '',  // Creator field added
    invoiceNumber: Math.floor(Math.random() * 100000).toString(),
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    subTotal: 0,
    total: 0,
    totalAmount: 0,
    rates: '',
    currency: '',
    dueDate: '',
  };

  const [invoiceData, setInvoiceData] = useState(initialState);

  const handleChange = (index, e) => {
    const values = [...invoiceData.items];
    values[index][e.target.name] = e.target.value;
    setInvoiceData({ ...invoiceData, items: values });
  };

  const handleRemoveField = (index) => {
    const values = [...invoiceData.items];
    values.splice(index, 1);
    setInvoiceData({ ...invoiceData, items: values });
  };

  const handleAddField = (e) => {
    e.preventDefault();
    setInvoiceData((prevState) => ({
      ...prevState,
      items: [...prevState.items, { itemName: '', unitPrice: '', quantity: '', discount: '' }],
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const { items, invoiceNumber, creator, notes } = invoiceData;

    doc.setFontSize(20);
    doc.text(`Invoice #${invoiceNumber}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Created By: ${creator}`, 14, 30);  // Creator added to PDF
    doc.text(`Notes: ${notes}`, 14, 38);

    doc.autoTable({
      head: [['Item', 'Unit Price', 'Quantity', 'Discount', 'Total']],
      body: items.map(item => [
        item.itemName,
        item.unitPrice,
        item.quantity,
        item.discount,
        (item.unitPrice * item.quantity - (item.unitPrice * item.quantity * item.discount) / 100).toFixed(2),
      ]),
      startY: 45,
    });

    doc.save(`invoice_${invoiceNumber}.pdf`);
  };

  const handleSubmit = async () => {
    const subTotal = invoiceData.items.reduce((acc, item) => {
      const itemTotal = (item.unitPrice * item.quantity - (item.unitPrice * item.quantity * item.discount) / 100);
      return acc + itemTotal;
    }, 0);
    

    const total = subTotal; // Assuming VAT is 0 for now, you can modify this

    if (!invoiceData.creator || !invoiceData.client.name || !invoiceData.client.email || !invoiceData.client.phone || !invoiceData.client.address || !invoiceData.dueDate || !invoiceData.currency || !invoiceData.rates) {
      alert('Please fill in all required fields.');
      return;
    }

    const invoicePayload = {
      ...invoiceData,
      subTotal,
      total,
      totalAmount: total, 
    };
    console.log(invoicePayload);

    try {
      const response = await fetch('http://localhost:8080/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoicePayload),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Invoice created: ${JSON.stringify(result)}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert('Failed to create invoice');
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <div className="billing-bar d-flex">
          <div className="invoice" style={{ width: '60%', padding: '10px' }}>
            <h5>Invoice <span>#{invoiceData.invoiceNumber}</span></h5>
            <button className="btn btn-primary" onClick={generatePDF}>Invoice PDF</button>
          </div>
        </div>

        <div className="invoice" style={{ marginTop: '20px', padding: '10px' }}>
          <h5>Client Information</h5>
          <CFormLabel>Name</CFormLabel>
          <CFormInput
            type="text"
            value={invoiceData.client.name}
            onChange={(e) => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, name: e.target.value } })}
            placeholder="Client Name"
          />
          <CFormLabel>Email</CFormLabel>
          <CFormInput
            type="email"
            value={invoiceData.client.email}
            onChange={(e) => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, email: e.target.value } })}
            placeholder="Client Email"
          />
          <CFormLabel>Phone</CFormLabel>
          <CFormInput
            type="tel"
            value={invoiceData.client.phone}
            onChange={(e) => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, phone: e.target.value } })}
            placeholder="Client Phone"
          />
          <CFormLabel>Address</CFormLabel>
          <CFormInput
            type="text"
            value={invoiceData.client.address}
            onChange={(e) => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, address: e.target.value } })}
            placeholder="Client Address"
          />
        </div>

        <div className="invoice" style={{ marginTop: '20px', padding: '10px' }}>
          <h5>Creator Information</h5> {/* Add this section for creator */}
          <CFormLabel>Creator</CFormLabel>
          <CFormInput
            type="text"
            value={invoiceData.creator}
            onChange={(e) => setInvoiceData({ ...invoiceData, creator: e.target.value })}
            placeholder="Creator Name"
          />
        </div>

        <div className="invoice" style={{ marginTop: '20px', padding: '10px' }}>
          <h5>Items</h5>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell>QTY</CTableHeaderCell>
                <CTableHeaderCell>Price</CTableHeaderCell>
                <CTableHeaderCell>Discount(%)</CTableHeaderCell>
                <CTableHeaderCell>Total</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {invoiceData.items.map((itemField, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      name="itemName"
                      onChange={(e) => handleChange(index, e)}
                      value={itemField.itemName}
                      placeholder="Item name"
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      name="quantity"
                      onChange={(e) => handleChange(index, e)}
                      value={itemField.quantity}
                      placeholder="0"
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      name="unitPrice"
                      onChange={(e) => handleChange(index, e)}
                      value={itemField.unitPrice}
                      placeholder="0"
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      name="discount"
                      onChange={(e) => handleChange(index, e)}
                      value={itemField.discount}
                      placeholder="0"
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="number"
                      disabled
                      value={(
                        itemField.unitPrice * itemField.quantity - 
                        (itemField.unitPrice * itemField.quantity * itemField.discount) / 100
                      ).toFixed(2)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton onClick={() => handleRemoveField(index)}>Remove</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <CButton onClick={handleAddField}>Add Item</CButton>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h5>Note/Payment Info</h5>
          <CFormTextarea rows={4} onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <h5>Invoice Details</h5>
          <CFormLabel>Currency</CFormLabel>
          <CFormInput
            type="text"
            value={invoiceData.currency}
            onChange={(e) => setInvoiceData({ ...invoiceData, currency: e.target.value })}
            placeholder="Currency (e.g., USD, INR)"
          />
          <CFormLabel>Tax Rates</CFormLabel>
          <CFormInput
            type="number"
            value={invoiceData.rates}
            onChange={(e) => setInvoiceData({ ...invoiceData, rates: e.target.value })}
            placeholder="Tax Rates (e.g., 18)"
          />
          <CFormLabel>Due Date</CFormLabel>
          <CFormInput
            type="date"
            value={invoiceData.dueDate}
            onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
            placeholder="Due Date"
          />
        </div>

        <CButton style={{ marginTop: '25px' }} onClick={handleSubmit}>Save and Continue</CButton>
      </CCol>
    </CRow>
  );
};

export default Billing;
