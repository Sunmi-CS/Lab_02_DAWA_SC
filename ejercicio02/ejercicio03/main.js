const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

// ✅ Validación
function validateStudent(data) {
  const { name, email, course, phone } = data;

  if (!name || !email || !course || !phone) {
    return "Faltan campos obligatorios: name, email, course, phone";
  }
  return null;
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const { method, url } = req;

  // GET /students
  if (url === "/students" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify(repo.getAll()));
  }

  // GET /students/:id
  else if (url.startsWith("/students/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const student = repo.getById(id);

    if (student) {
      res.statusCode = 200;
      res.end(JSON.stringify(student));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }
  }

  // POST /students
  else if (url === "/students" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));

    req.on("end", () => {
      const data = JSON.parse(body);

      const error = validateStudent(data);
      if (error) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error }));
      }

      const newStudent = repo.create(data);
      res.statusCode = 201;
      res.end(JSON.stringify(newStudent));
    });
  }

  // PUT /students/:id
  else if (url.startsWith("/students/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);

    let body = "";
    req.on("data", chunk => (body += chunk));

    req.on("end", () => {
      const data = JSON.parse(body);

      const updated = repo.update(id, data);

      if (updated) {
        res.statusCode = 200;
        res.end(JSON.stringify(updated));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
      }
    });
  }

  // DELETE /students/:id
  else if (url.startsWith("/students/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const deleted = repo.remove(id);

    if (deleted) {
      res.statusCode = 200;
      res.end(JSON.stringify(deleted));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }
  }

  // POST /ListByStatus
  else if (url === "/ListByStatus" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));

    req.on("end", () => {
      const { status } = JSON.parse(body);
      const result = repo.getByStatus(status);

      res.statusCode = 200;
      res.end(JSON.stringify(result));
    });
  }

  // POST /ListByGrade
  else if (url === "/ListByGrade" && method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));

    req.on("end", () => {
      const { gpa } = JSON.parse(body);
      const result = repo.getByGrade(gpa);

      res.statusCode = 200;
      res.end(JSON.stringify(result));
    });
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});