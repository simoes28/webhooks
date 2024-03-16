require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors({
    origin: "*"
}));
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado');
  
    // Manipule os eventos do socket aqui
  
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
});

app.use(express.json());

//Captura webhooks:
app.use("/newChat", (req, res, next)=>{
    const data= req.body;
    console.log(data);
    io.emit("webhookNewChat", data);

    res.status(200).send("Webhook recebido com sucesso.")
})


app.use("/newMessage", (req, res, next)=>{
    const data= req.body;
    console.log(data);
    io.emit("webhookNewMessage", data);

    res.status(200).send("Webhook recebido com sucesso.")
})

app.use("/", (req, res, next)=>{
    res.send("Hello World!");
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    console.log(`Socket.IO endpoint: http://localhost:${PORT}`);
});