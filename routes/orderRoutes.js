import express from "express";
import { placeOrder, listOrders, updateOrderStatus, deleteOrder, downloadReceipt } from "../controllers/orderController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import Order from "../models/Order.js"; // ✅ FIXED

const router = express.Router();

// Public: place order
router.post("/", placeOrder);

// Admin
router.get("/", protectAdmin, listOrders);
router.put("/:id/status", protectAdmin, updateOrderStatus);
router.delete("/:id", protectAdmin, deleteOrder);
router.get("/:id/receipt", protectAdmin, downloadReceipt);

// ✅ Customer cancel route
router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow cancel if not shipped/delivered
    if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ message: "Error cancelling order" });
  }
});

export default router;
