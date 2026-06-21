import jwt from "jsonwebtoken";
import { db } from "../config/firebase.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userDoc = await db.collection("users").doc(decoded.userId).get();

    if (!userDoc.exists) {
      return res.json({ success: false, message: "User not found" });
    }

    req.user = {
      _id: userDoc.id,
      ...userDoc.data(),
    };

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};