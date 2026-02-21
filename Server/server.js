const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let players = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  players[socket.id] = { x: 0, y: 0 };

  socket.emit("currentPlayers", players);

  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id] = data;
      io.emit("updatePlayers", players);
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

app.get("/", (req, res) => {
  res.json({ status: "Repair Legends MMO Server Running" });
});

server.listen(4000, () => {
  console.log("MMO Server running on port 4000");
});
