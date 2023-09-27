const { Server } = require("socket.io");
const port = process.env.PORT || 9000;
const io = new Server(port, {
  cors: {
    origin: "https://whatsapp-21.web.app/",
  },
});

let users = [];

const addUser = (userData, socketId) => {
  !users.some((user) => user._id === userData._id) &&
    users.push({ ...userData, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user._id === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("addUser", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverid);

    io.to(user.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
