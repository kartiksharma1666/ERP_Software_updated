const InvoiceModel = require('../models/Invoice.model');
const Joi = require('joi');

// Validation schema
// Validation schema
const invoiceSchema = Joi.object({
  creator: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  items: Joi.array().items(Joi.object({
    itemName: Joi.string().required(),
    unitPrice: Joi.number().required(),
    quantity: Joi.number().required(),
    discount: Joi.number().min(0).max(100).default(0),
  })).required(),
  totalAmount: Joi.number().required(),
  notes: Joi.string().optional(),
  status: Joi.string().valid('Paid', 'Unpaid').default('Unpaid'),
  subTotal: Joi.number().required(), // Make sure to add this if not already included
  total: Joi.number().required(), // Also make sure this is included
  rates: Joi.string().required(), // Ensure that rates is required as per your requirements
  currency: Joi.string().required(), // Ensure that currency is required
  dueDate: Joi.date().required(), // Ensure that dueDate is required
  client: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
  }).required(), // Add the client object here
});


// Create new invoice
exports.createInvoice = async (req, res) => {
  const { error } = invoiceSchema.validate(req.body);
  console.log(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newInvoice = new InvoiceModel(req.body);
    await newInvoice.save();
    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Get all invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceModel.find().sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get invoice by ID
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await InvoiceModel.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  const { error } = invoiceSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({ message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await InvoiceModel.findByIdAndRemove(req.params.id);
    if (!deletedInvoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
