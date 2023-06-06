/* ---------------------------------------------------------------------------------------------- */
/*                     Código aplicando Principio de Inversión de Dependencias                    */
/* ---------------------------------------------------------------------------------------------- */

const formulario = document.querySelector("#formulario");
const cardsEstudiantes = document.querySelector("#cardsEstudiantes");
const cardsProfesores = document.querySelector("#cardsProfesores");
const templateEstudiante = document.querySelector(
    "#templateEstudiante"
).content;
const templateProfesor = document.querySelector("#templateProfesor").content;
const alert = document.querySelector(".alert");

const estudiantes = [];
const profesores = [];

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
        Persona.pintarPersonaUI(estudiantes, "Estudiante", uiHandler);
    }
});

class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
        this.uid = `${Date.now()}`;
    }

/* ---------------------- pintarPersonaUI recibe una instancia de uiHandler --------------------- */
/* ------------------ Persona depende de la abstracción UIHandler y no del DOM ------------------ */    
static pintarPersonaUI(personas, tipo, uiHandler) {
        uiHandler.clearCards(tipo);

        const fragment = document.createDocumentFragment();
        personas.forEach((item) => {
            fragment.appendChild(uiHandler.agregarNuevaPersona(item, tipo));
        });

        uiHandler.appendCards(fragment, tipo);
    }
}

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

/* ---------------- UIHandler maneja las interacciones con el DOM y las tarjetas ---------------- */
class UIHandler {
    clearCards(tipo) {
        if (tipo === "Estudiante") {
            cardsEstudiantes.textContent = "";
        } else if (tipo === "Profesor") {
            cardsProfesores.textContent = "";
        }
    }

/* ------- UIHandler proporciona métodos abstractos a Persona que inverten su dependencia ------- */
  agregarNuevaPersona(persona, tipo) {
        let clone;
        if (tipo === "Estudiante") {
            clone = persona.agregarNuevoEstudiante();
        } else if (tipo === "Profesor") {
            clone = persona.agregarNuevoProfesor();
        }
        return clone;
    }

    appendCards(fragment, tipo) {
        if (tipo === "Estudiante") {
            cardsEstudiantes.appendChild(fragment);
        } else if (tipo === "Profesor") {
            cardsProfesores.appendChild(fragment);
        }
    }
}

const uiHandler = new UIHandler();

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

/* ----------- Se crea una instancia de UIHandler como argumento en pintarPersonaUI() ----------- */
/* ----------- Permita que Persona le delegue sus tareas y su lógica sea independiente ---------- */
    if (opcion === "Estudiante") {
        const estudiante = new Estudiante(nombre, edad);
        estudiantes.push(estudiante);
        Persona.pintarPersonaUI(estudiantes, opcion, uiHandler);
    }

    if (opcion === "Profesor") {
        const profesor = new Profesor(nombre, edad);
        profesores.push(profesor);
        Persona.pintarPersonaUI(profesores, opcion, uiHandler);
    }
});
