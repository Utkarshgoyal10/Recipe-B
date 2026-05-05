const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require("dotenv").config();
require("./models/connection"); // MongoDB connection
const auth = require("./Routes/auth");
const Message = require("./models/Message");

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
      origin: '*',
      methods: ['GET', 'POST'],
  },
});

const users = {};

io.on('connection', async socket => {
  console.log("New socket connected:", socket.id);

  // Send last 50 messages when client explicitly requests
  socket.on('get-history', async () => {
    try {
      const history = await Message.find().sort({ createdAt: 1 }).limit(50);
      socket.emit('chat-history', history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  });

  socket.on('new-user-joined', name => {
      console.log("New user joined:", name);
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', async message => {
      const name = users[socket.id];
      const createdAt = new Date();
      socket.broadcast.emit('receive', { message, name, createdAt });
      // Save to DB
      try {
        await Message.create({ name, message: message.message, createdAt });
      } catch (err) {
        console.error('Failed to save message:', err);
      }
  });

  socket.on('user-left', (name) => {
      if (name) {
        socket.broadcast.emit('left', name);
      }
      delete users[socket.id];
  });

  socket.on('disconnect', () => {
      const userName = users[socket.id];
      if (userName) {
        socket.broadcast.emit('left', userName);
      }
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
