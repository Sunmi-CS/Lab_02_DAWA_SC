const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        // Ruta del archivo HBS
        const filePath = path.join(__dirname, "views", "home.hbs");

        // Leer el archivo de plantilla
        fs.readFile(filePath, "utf8", (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error interno del servidor");
                return;
            }

            // Compilar la plantilla con Handlebars
            const template = handlebars.compile(templateData);

            // Datos dinámicos a enviar
            const data = {
                title: "Servidor con Handlebars 🚀",
                welcomeMessage: "Bienvenido al laboratorio de Node.js",
                day: new Date().toLocaleDateString("es-PE"),
                students: ["Ana", "Luis", "Pedro", "María"],
            };

            // Renderizar la vista con los datos
            const html = template(data);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        });
    } else {
        res.statusCode = 404;
        res.end("<h1>404 - Página no encontrada</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});