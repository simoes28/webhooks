const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const cors = require("cors");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Permitir qualquer origem (você pode restringir se necessário)
    methods: ["GET", "POST"],
  },
  path: "/webhook", // A URL deve ser '/webhook', com a barra na frente
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("Cliente conectado", socket.id);

  // Evento para adicionar o cliente a uma sala
  socket.on("joinRoom", ({ url, queueId }) => {
    const room = `${url}_${queueId}`;
    socket.join(room);
    console.log(`Cliente ${socket.id} entrou na sala: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado", socket.id);
  });
});

app.use(express.json());

//TESTE
app.get("/webhook", (req, res) => {
  console.log("Webhook recebido!");
  res.send("OK");
});

//Captura webhooks:
app.post("/newChat", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookNewChat", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/newMessage", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila, numero_cliente, mensagem, chat_id

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookNewMessage", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/chatClosedHook", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookchatClosedHook", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/typingHook", (req, res, next) => {
  const data = req.body;
  console.log(data);

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhooktypingHook", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/authStatusHook", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookauthStatusHook", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/msgReceivedByServerHook", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookmsgReceivedByServerHook", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/msgReceivedByUserHook", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila, chat_id

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookmsgReceivedByUserHook", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/msgReadedHook", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila, chat_id

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookmsgReadedHook", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/msgSentHook", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookmsgSentHook", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/msgDeletedHook", (req, res, next) => {
  const data = req.body;
  console.log(data);
  //Data= instancia, fila

  if (validarDados(data)) {
    const room = determinarSala(data);
    if (room) {
      io.to(room).emit("webhookmsgDeletedHook", data);
      res
        .status(200)
        .send(`Webhook recebido com sucesso. Enviado para sala: ${room}`);
    } else {
      res.status(400).send(`Erro ao determinar a sala correspondente. ${room}`);
    }
  } else {
    res.status(400).send(`Dados do webhook inválidos. ${data}`);
  }
});

app.post("/", (req, res, next) => {
  res.send("Hello World!");
});

//Função para validação de dados do Webhook:
function validarDados(data) {
  return typeof data.instancia === "string" && !isNaN(data.fila);
}

//Função para determinar sala do webhook:
function determinarSala(data) {
  console.log(data);
  return `${data.instancia}_${data.fila}`;
}

const PORT = process.env.PORT || 8006;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  console.log(`Socket.IO endpoint: http://localhost:${PORT}`);
});
