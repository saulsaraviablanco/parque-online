import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({
  origin: ["https://precisemindsolutions.com", "https://www.precisemindsolutions.com"],
  methods: ["GET", "POST"]
}));
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://precisemindsolutions.com", "https://www.precisemindsolutions.com"],
    methods: ["GET", "POST"]
  }
});
const players = {};

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  socket.on("join", (name) => {
    players[socket.id] = { name, x: 100, y: 100 };
    io.emit("playersUpdate", players);
  });

  socket.on("move", (pos) => {
    if (players[socket.id]) {
      players[socket.id].x = pos.x;
      players[socket.id].y = pos.y;
      io.emit("playersUpdate", players);
    }
  });

  socket.on("message", (text) => {
    if (players[socket.id]) {
      io.emit("bubble", { id: socket.id, text });
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("playersUpdate", players);
  });
});

server.listen(process.env.PORT || 3000, () => 
  console.log("🌳 Servidor corriendo en puerto", process.env.PORT || 3000)
);
