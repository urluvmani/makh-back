import Order from "../models/Order.js";
import PDFDocument from "pdfkit";
import { sendEmail } from "../utils/sendEmail.js";
import { orderConfirmationHTML, orderStatusHTML } from "../utils/emailTemplates.js";

// 🟢 Place new order
export const placeOrder = async (req, res) => {
  const { name, email, phone, address, items, total } = req.body;

  const order = await Order.create({
    name,
    email,
    phone,
    address,
    items,
    total,
    status: "Pending",
  });

  // ✅ Respond immediately (frontend ko delay na ho)
  res.status(201).json(order);

  // ✅ Fire-and-forget confirmation email
  if (email) {
    sendEmail({
      to: email,
      subject: "Order Confirmation - Makhsoos Store",
      html: orderConfirmationHTML({ name, orderId: order._id, total }),
    }).catch((e) => console.error("Email send error:", e.message));
  }
};

// 🟢 Get all orders
export const listOrders = async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

// 🟢 Update order status
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status || order.status;
  await order.save();

  res.json(order);

  // ✅ Send status update email
  if (order.email) {
    sendEmail({
      to: order.email,
      subject: `Your order ${order._id} is now ${order.status}`,
      html: orderStatusHTML({
        name: order.name || "Customer",
        orderId: order._id,
        status: order.status,
      }),
    }).catch((e) => console.error("Status email error:", e.message));
  }
};

// 🟢 Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order" });
  }
};

// 🟢 Download receipt (PDF)
export const downloadReceipt = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // PDF setup
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${order._id}.pdf`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Makhsoos Store - Order Receipt", { align: "center" });
    doc.moveDown();

    // Customer Info
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.name}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    // Items
    doc.fontSize(14).text("Items:");
    order.items.forEach((i, idx) => {
      doc
        .fontSize(12)
        .text(
          `${idx + 1}. ${i.name} | Size: ${i.size} | Color: ${i.color} | Qty: ${
            i.qty
          } | Rs.${i.price * i.qty}`
        );
    });
    doc.moveDown();

    // Total
    doc.fontSize(14).text(`Total: Rs.${order.total}`, { align: "right" });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
