const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require("dotenv").config();
require("./models/connection"); // MongoDB connection
const auth = require("./Routes/auth");

// Import routes for NGO / Donor
const ngoRoutes = require("./Routes/ngo");
const donorRoutes = require("./Routes/donor");
const searchRoutes = require('./Routes/searchRoutes');



const app = express();
const server = http.createServer(app);

// ======================
// MIDDLEWARES
// ======================
app.use(express.json());
app.use(cors({ origin: '*' })); // allow all origins

// ======================
// SOCKET.IO
// ======================
const io = socketIO(server, {
  cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
  },
});

const users = {};

io.on('connection', socket => {
  console.log("New socket connected:", socket.id);

  socket.on('new-user-joined', name => {
      console.log("New user joined:", name);
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
      socket.broadcast.emit('receive', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
  });
});

// ======================
// ROUTES
// ======================
app.get("/", (req, res) => {
    res.send("Hello from Save Food Backend!");
});

// Auth routes
app.use("/auth", auth);

// NGO / Donor routes
app.use("/api/ngo", ngoRoutes);
app.use("/api/donor", donorRoutes);
app.use('/api', searchRoutes);


// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
