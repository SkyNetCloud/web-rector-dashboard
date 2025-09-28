import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

let reactorStatus = "offline"; // online / offline
let flowValue = 0;

io.on("connection", (socket) => {
  console.log("Client connected");

  // send current state on connect
  socket.emit("reactorData", { status: reactorStatus, flow: flowValue });

  socket.on("setStatus", (status) => {
    if (status === "online" || status === "idle") {
      reactorStatus = status;
      io.emit("reactorData", { status: reactorStatus, flow: flowValue });
    }
  });

  socket.on("setFlow", (value) => {
    flowValue = value;
    io.emit("reactorData", { status: reactorStatus, flow: flowValue });
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
