import bcrypt from "bcryptjs";
import { db } from "../config/firebase.js";
import { generateToken } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;

    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing details" });
    }

    const existingUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existingUser.empty) {
      return res.json({ success: false, message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRef = await db.collection("users").add({
      fullName,
      email,
      password: hashedPassword,
      bio,
      profilePic: "",
      createdAt: Date.now(),
    });

    const token = generateToken(userRef.id);

    res.json({
      success: true,
      userData: {
        _id: userRef.id,
        fullName,
        email,
        bio,
        profilePic: "",
      },
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userDoc.id);

    res.json({
      success: true,
      userData: {
        _id: userDoc.id,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic || "",
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedData = {};

    if (fullName) updatedData.fullName = fullName;
    if (bio) updatedData.bio = bio;

    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedData.profilePic = upload.secure_url;
    }

    await db.collection("users").doc(userId).update(updatedData);

    const updatedUserDoc = await db.collection("users").doc(userId).get();

    res.json({
      success: true,
      user: {
        _id: updatedUserDoc.id,
        ...updatedUserDoc.data(),
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};