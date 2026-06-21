import { db } from "../config/firebase.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../server.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const usersSnapshot = await db.collection("users").get();

    const users = usersSnapshot.docs
      .map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }))
      .filter((user) => user._id !== loggedInUserId)
      .map(({ password, ...safeUser }) => safeUser);

    const unseenMessages = {};

    for (const user of users) {
      const unseenSnapshot = await db
        .collection("messages")
        .where("senderId", "==", user._id)
        .where("receiverId", "==", loggedInUserId)
        .where("seen", "==", false)
        .get();

      if (!unseenSnapshot.empty) {
        unseenMessages[user._id] = unseenSnapshot.size;
      }
    }

    res.json({
      success: true,
      users,
      unseenMessages,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messagesSnapshot = await db
      .collection("messages")
      .orderBy("createdAt", "asc")
      .get();

    const messages = messagesSnapshot.docs
      .map((doc) => ({
        _id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (msg) =>
          (msg.senderId === myId && msg.receiverId === selectedUserId) ||
          (msg.senderId === selectedUserId && msg.receiverId === myId)
      );

    const unseenMessages = messages.filter(
      (msg) => msg.senderId === selectedUserId && msg.receiverId === myId && !msg.seen
    );

    for (const msg of unseenMessages) {
      await db.collection("messages").doc(msg._id).update({ seen: true });
    }

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("messages").doc(id).update({
      seen: true,
    });

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = "";

    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const messageRef = await db.collection("messages").add({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      seen: false,
      createdAt: Date.now(),
    });

    const newMessage = {
      _id: messageRef.id,
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      seen: false,
      createdAt: Date.now(),
    };

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};