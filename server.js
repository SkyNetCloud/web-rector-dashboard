const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files (frontend in public/)
app.use(express.static("public"));

// Example simulated reactor state
let reactorState = {
  status: "idle",
  temperature: 2500,
  fieldStrength: 50,
  output: 0
};

// Send state updates every 2s
setInterval(() => {
  // Fake temperature fluctuation
  reactorState.temperature += Math.floor(Math.random() * 200 - 100);

  // Clamp values
  if (reactorState.temperature < 0) reactorState.temperature = 0;
  if (reactorState.temperature > 9000) reactorState.temperature = 9000;

  io.emit("reactorUpdate", reactorState);
}, 2000);

// Socket.io listeners
io.on("connection", (socket) => {
  console.log("New client connected");

  // Send initial state
  socket.emit("reactorUpdate", reactorState);

  // Example: handle control commands
  socket.on("setStatus", (status) => {
    reactorState.status = status;
    io.emit("reactorUpdate", reactorState);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
