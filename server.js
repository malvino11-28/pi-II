const express = require("express");

const server = express();
const port = 5138;

const routes = require("./routes/routes");

server.use(express.static("public"));
server.set("view engine", "ejs");
server.use(express.urlencoded());

server.use("/", routes);

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});