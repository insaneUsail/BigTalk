import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connect } from "http2";
import { connectDB } from "./lib/db.js";
import {userRouter} from "./routes/userRouter.js"
import messageRouter from "./routes/messageRountes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app)

//socket.io
export const io= new Server(server, {
    cors:{origin: "*"}
})
//store online users
export const userSocketMap={};

//connection handler

io.on("connection", (socket)=>{
const userId=socket.handshake.query.userId;
console.log("User Connected", userId);

if(userId) userSocketMap[userId]=socket.id;

io.emit("getOnlineUsers", Object.keys(userSocketMap));

socket.on("disconnect", ()=>{
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
}) 
})



// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

//route setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages",messageRouter)

//mongo connect
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("Server is running on PORT: " + PORT));