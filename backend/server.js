const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http"); // Import HTTP module
const { Server } = require("socket.io");

const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});



const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app); // Create HTTP server from Express
const io = new Server(server, { cors: { origin: "*" } }); // WebSocket server

// ✅ Middleware (Placed before routes)
app.use(express.json());
app.use(cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

// ✅ WebSocket (Socket.io) Logic
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// ✅ Database Connection & Start Server (Unified Express & Socket.io)
const PORT = process.env.PORT || 5000; // Use a single port for both
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT} with Socket.io`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
