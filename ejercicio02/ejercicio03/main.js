const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

function validateStudent(data) {
  const { name, email, course, phone } = data;

  if (!name || name.trim() === "") return "El nombre es obligatorio";
  if (!email || email.trim() === "") return "El email es obligatorio";
  if (!course || course.trim() === "") return "El curso es obligatorio";
  if (!phone || phone.trim() === "") return "El teléfono es obligatorio";

  return null;
}

function parseBody(req, callback, res) {
  let body = "";

  req.on("data", chunk => (body += chunk));

  req.on("end", () => {
    try {
      const data = JSON.parse(body || "{}");
      callback(data);
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "JSON inválido" }));
    }
  });
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const { method, url } = req;

  // GET /students
  if (url === "/students" && method === "GET") {
    return res.end(JSON.stringify(repo.getAll()));
  }

  // GET /students/:id
  if (url.startsWith("/students/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const student = repo.getById(id);

    if (student) return res.end(JSON.stringify(student));

    res.statusCode = 404;
    return res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
  }

  // POST /students
  if (url === "/students" && method === "POST") {
    return parseBody(req, (data) => {
      const error = validateStudent(data);
      if (error) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error }));
      }

      const newStudent = repo.create(data);
      res.statusCode = 201;
      res.end(JSON.stringify(newStudent));
    }, res);
  }

  // PUT /students/:id
  if (url.startsWith("/students/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);

    return parseBody(req, (data) => {
      const updated = repo.update(id, data);

      if (updated) return res.end(JSON.stringify(updated));

      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }, res);
  }

  // DELETE /students/:id
  if (url.startsWith("/students/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const deleted = repo.remove(id);

    if (deleted) return res.end(JSON.stringify(deleted));

    res.statusCode = 404;
    return res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
  }

  if (url === "/ListByStatus" && method === "POST") {
    return parseBody(req, (data) => {
      if (!data.status) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Debe enviar status" }));
      }

      const result = repo.getByStatus(data.status);
      res.end(JSON.stringify(result));
    }, res);
  }

  if (url === "/ListByGrade" && method === "POST") {
    return parseBody(req, (data) => {
      if (data.gpa === undefined) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Debe enviar gpa" }));
      }

      const result = repo.getByGrade(Number(data.gpa));
      res.end(JSON.stringify(result));
    }, res);
  }

  // 404
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
});

server.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});