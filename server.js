const express = require("express");
const expressEjsLayout = require("express-ejs-layouts");

const server = express();
const port = 5138;
const routes = require("./routes/routes");

server.use(express.static("public"));

server.set("view engine", "ejs");

// server.set("layout", "./layout.ejs"); // header e footer

server.use(express.urlencoded()); // desserialização de dados

// server.use(expressEjsLayout);

server.use("/", routes);

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
