const socket = io();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const name = prompt("Tu nombre:");
socket.emit("join", name);

let players = {};

socket.on("playersUpdate", (data) => {
  players = data;
});

socket.on("bubble", ({ id, text }) => {
  const p = players[id];
  if (p) {
    p.bubble = text;
    setTimeout(() => delete p.bubble, 3000);
  }
});

let me = { x: 100, y: 100, speed: 5 };

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") me.y -= me.speed;
  if (e.key === "ArrowDown") me.y += me.speed;
  if (e.key === "ArrowLeft") me.x -= me.speed;
  if (e.key === "ArrowRight") me.x += me.speed;
  socket.emit("move", { x: me.x, y: me.y });
});

document.getElementById("sendBtn").onclick = () => {
  const msg = document.getElementById("msg").value;
  if (msg.trim() !== "") {
    socket.emit("message", msg);
    document.getElementById("msg").value = "";
  }
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const id in players) {
    const p = players[id];
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(p.name, p.x, p.y - 25);

    if (p.bubble) {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillRect(p.x - 40, p.y - 60, 80, 25);
      ctx.strokeRect(p.x - 40, p.y - 60, 80, 25);
      ctx.fillStyle = "black";
      ctx.fillText(p.bubble, p.x, p.y - 42);
    }
  }

  requestAnimationFrame(draw);
}
draw();
