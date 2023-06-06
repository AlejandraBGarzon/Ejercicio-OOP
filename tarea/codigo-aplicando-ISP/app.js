/* ---------------------------------------------------------------------------------------------- */
/*                     Código aplicando Principio de Segregación de Interfaces                    */
/* ---------------------------------------------------------------------------------------------- */

const formulario = document.querySelector("#formulario");
const cardsEstudiantes = document.querySelector("#cardsEstudiantes");
const cardsProfesores = document.querySelector("#cardsProfesores");
const templateEstudiante = document.querySelector("#templateEstudiante")
  .content;
const templateProfesor = document.querySelector("#templateProfesor")
  .content;
const alert = document.querySelector(".alert");

const estudiantes = [];
const profesores = [];

/* -- Se crea interfaces para Estudiante y Profesor, y los métodos necesarios para cada tipo -- */
class IEstudiante {
  agregarNuevoEstudiante() {}
}

class IProfesor {
  agregarNuevoProfesor() {}
}

class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
    this.uid = `${Date.now()}`;
  }
}

/* ---------------------- Estudiante que implementa la interfaz IEstudiante --------------------- */
class Estudiante extends Persona {
  #estado = false;
  #estudiante = "Estudiante";

  set setEstado(estado) {
    this.#estado = estado;
  }

  get getEstudiante() {
    return this.#estudiante;
  }

  agregarNuevoEstudiante() {
    const clone = templateEstudiante.cloneNode(true);
    clone.querySelector("h5 .text-primary").textContent = this.nombre;
    clone.querySelector("h6").textContent = this.getEstudiante;
    clone.querySelector(".lead").textContent = this.edad;

    if (this.#estado) {
      clone.querySelector(".badge").className = "badge bg-success";
      clone.querySelector(".btn-success").disabled = true;
      clone.querySelector(".btn-danger").disabled = false;
    } else {
      clone.querySelector(".badge").className = "badge bg-danger";
      clone.querySelector(".btn-danger").disabled = true;
      clone.querySelector(".btn-success").disabled = false;
    }
    clone.querySelector(".badge").textContent = this.#estado
      ? "Aprobado"
      : "Reprobado";

    clone.querySelector(".btn-success").dataset.uid = this.uid;
    clone.querySelector(".btn-danger").dataset.uid = this.uid;

    return clone;
  }
}

/* -------------------------- Profesor implementa la interfaz IProfesor -------------------------- */
class Profesor extends Persona {
  #profesor = "Profesor";

  agregarNuevoProfesor() {
    const clone = templateProfesor.cloneNode(true);
    clone.querySelector("h5").textContent = this.nombre;
    clone.querySelector("h6").textContent = this.#profesor;
    clone.querySelector(".lead").textContent = this.edad;
    return clone;
  }
}

/* ----------- EstudianteUI implementa pintarEstudiantes() sin depender de Estudiante ----------- */
class EstudianteUI {
  static pintarEstudiantes(estudiantes) {
    cardsEstudiantes.textContent = "";
    const fragment = document.createDocumentFragment();

    estudiantes.forEach((estudiante) => {
      fragment.appendChild(estudiante.agregarNuevoEstudiante());
    });

    cardsEstudiantes.appendChild(fragment);
  }
}

/* -------------- ProfesorUI implementa pintarProfesores() sin depender de Profesor ------------- */
class ProfesorUI {
  static pintarProfesores(profesores) {
    cardsProfesores.textContent = "";
    const fragment = document.createDocumentFragment();
    profesores.forEach((profesor) => {
      fragment.appendChild(profesor.agregarNuevoProfesor());
    });
    cardsProfesores.appendChild(fragment);
  }
}

// Evento click
document.addEventListener("click", (e) => {
  if (e.target.dataset.uid) {
    if (e.target.matches(".btn-success")) {
      estudiantes.map((item) => {
        if (item.uid === e.target.dataset.uid) {
          item.setEstado = true;
        }
        return item;
      });
    }
    if (e.target.matches(".btn-danger")) {
      estudiantes.map((item) => {
        if (item.uid === e.target.dataset.uid) {
          item.setEstado = false;
        }
        return item;
      });
    }
    EstudianteUI.pintarEstudiantes(estudiantes);
  }
});

// Evento submit del formulario
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  alert.classList.add("d-none");

  const datos = new FormData(formulario);
  const [nombre, edad, opcion] = [...datos.values()];

  if (!nombre.trim() || !edad.trim() || !opcion.trim()) {
    console.log("Elemento vacío");
    alert.classList.remove("d-none");
    return;
  }

  if (opcion === "Estudiante") {
    const estudiante = new Estudiante(nombre, edad);
    estudiantes.push(estudiante);
    EstudianteUI.pintarEstudiantes(estudiantes);
  }

  if (opcion === "Profesor") {
    const profesor = new Profesor(nombre, edad);
    profesores.push(profesor);
    ProfesorUI.pintarProfesores(profesores);
  }
});
