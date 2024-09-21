const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  dueDate: { type: Date, required: true },
  currency: { type: String, required: true },
  items: [
    {
      itemName: { type: String, required: true },
      unitPrice: { type: Number, required: true }, // Changed to Number for calculations
      quantity: { type: Number, required: true }, // Changed to Number for calculations
      discount: { type: Number, default: 0 }, // Changed to Number and set a default
    },
  ],
  rates: { type: String, required: true },
  vat: { type: Number, default: 0 }, // Changed to Number and set a default
  total: { type: Number, required: true }, // Total amount after all calculations
  subTotal: { type: Number, required: true }, // Subtotal before tax
  notes: { type: String, default: "" },
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  invoiceNumber: { type: String, required: true, unique: true },
  type: { type: String, default: "Invoice" },
  creator: [{ type: String, required: true }],
  totalAmountReceived: { type: Number, default: 0 }, // Changed to Number
  client: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  paymentRecords: [
    {
      amountPaid: { type: Number, required: true },
      datePaid: { type: Date, required: true },
      paymentMethod: { type: String, required: true },
      note: { type: String, default: "" },
      paidBy: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
