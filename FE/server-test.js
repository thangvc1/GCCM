const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.emit("notification", {
    id: Date.now(),
    title: "Kết nối thành công",
    message: "Bạn đã kết nối tới Socket Server!",
    createdAt: new Date().toISOString(),
  });

  socket.on("send_message", (data) => {
    io.emit("notification", {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Endpoint gửi notification test qua HTTP POST
app.post("/api/notify", (req, res) => {
  const { title, message } = req.body;
  const payload = {
    id: Date.now(),
    title: title || "Thông báo mới",
    message: message || "Đơn hàng mới vừa được tạo!",
    createdAt: new Date().toISOString(),
  };

  io.emit("notification", payload);
  res.json({ success: true, data: payload });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
