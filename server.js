const express = require("express");

const server = express();
const PORT = 5138;

const routes = require("./routes/routes");

server.use(express.static("public"));
server.set("view engine", "ejs");
server.use(express.urlencoded());
server.use(express.json());

server.use("/", routes);

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${ PORT }`);
});