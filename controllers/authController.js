import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ id: admin._id, role: "admin", email: admin.email });
  res.json({ token, email: admin.email });
};

// One-time utility: create first admin (call and then disable in routes)
export const createAdmin = async (req, res) => {
  const { email, password } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: "Admin already exists" });
  const admin = await Admin.create({ email, password });
  res.status(201).json({ id: admin._id, email: admin.email });
};
