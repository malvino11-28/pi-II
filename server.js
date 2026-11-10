const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");

const server = express();
const PORT = 5138;

const routes = require("./routes/routes");

const {
    formatarCPF,
    formatarTelefone,
    formatarData,
    formatarCNPJ,
    formatarValor
} = require("./utils/formatadores");

server.use(express.static(path.join(__dirname, "public")));
server.set("view engine", "ejs");

server.locals.formatarCPF = formatarCPF;
server.locals.formatarTelefone = formatarTelefone;
server.locals.formatarData = formatarData;
server.locals.formatarCNPJ = formatarCNPJ;
server.locals.formatarValor = formatarValor;

server.use(express.urlencoded());
server.use(express.json());
server.use(expressLayouts);

server.set("layout", false);
server.use(cookieParser());

server.use("/", routes);

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});