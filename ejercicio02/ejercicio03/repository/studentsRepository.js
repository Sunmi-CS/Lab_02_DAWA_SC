let students = [
  {
    id: 1,
    name: "Ana",
    grade: 18,
    age: 20,
    email: "ana@email.com",
    phone: "999111222",
    enrollmentNumber: "2023001",
    course: "Ingeniería",
    year: 3,
    subjects: ["Matemática", "Programación"],
    gpa: 17,
    status: "activo",
    admissionDate: "2023-03-01"
  }
];

// CRUD
function getAll() {
  return students;
}

function getById(id) {
  return students.find(s => s.id === id);
}

function create(student) {
  student.id = students.length + 1;
  students.push(student);
  return student;
}

function update(id, updateData) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updateData };
    return students[index];
  }
  return null;
}

function remove(id) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    return students.splice(index, 1)[0];
  }
  return null;
}

// 🔍 Nuevos filtros
function getByStatus(status) {
  return students.filter(s => s.status === status);
}

function getByGrade(minGpa) {
  return students.filter(s => s.gpa >= minGpa);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByStatus,
  getByGrade
};