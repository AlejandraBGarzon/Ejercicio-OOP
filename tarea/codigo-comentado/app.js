//Identifiquen herencia, polimorfismo,clases(propiedades y metodos)
//Identifiquen S O L I D 
// Aplicar principios que no estén

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

/* ---------------------------------------- POLIMORFISMO: ---------------------------------------- */
/* ---------- La función de click genera tarjetas de estudiantes en respuesta al evento --------- */
document.addEventListener("click", (e) => {
    // preguntamos por uid
    if (e.target.dataset.uid) {
        if (e.target.matches(".btn-success")) {
            estudiantes.map((item) => {
                // modificamos en caso de que sea true
                if (item.uid === e.target.dataset.uid) {
                    item.setEstado = true;
                }
                // console.log(item);
                return item;
            });
        }
        if (e.target.matches(".btn-danger")) {
            estudiantes.map((item) => {
                if (item.uid === e.target.dataset.uid) {
                    item.setEstado = false;
                }
                console.log(item);
                return item;
            });
        }
        Persona.pintarPersonaUI(estudiantes, "Estudiante");
    }
});

/*  CLASE PERSONA: Propiedades de nombre, edad y uid, Método pintarPersonaUI() */
/* -------------------------------- SOLID - Responsabilidad única: ------------------------------- */
/* --------------------------- Actualizar y mostrar datos de personas ---------------------------- */
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
        // agregamos uid
        this.uid = `${Date.now()}`;
    }

    
/* ---------------------------------------- POLIMORFISMO: ---------------------------------------- */
/*   pintarPersonaUI muestra tarjetas en la interfaz de acuerdo al tipo de persona en argumento    */
   
/* ----------------------------------- SOLID - abierto/cerrado ---------------------------------- */
/* ----------- pintarPersonaUI() es abierta y permite agregar nuevos tipos de personas ---------- */

 /* --------------------------------------- SOLID - Liskov: -------------------------------------- */
 /* -- Utiliza objetos de las clases Estudiante y Profesor en lugar de objetos de la clase Persona -- */
static pintarPersonaUI(personas, tipo) {
        if (tipo === "Estudiante") {
            cardsEstudiantes.textContent = "";
            const fragment = document.createDocumentFragment();

            personas.forEach((item) => {
                fragment.appendChild(item.agregarNuevoEstudiante());
            });

            cardsEstudiantes.appendChild(fragment);
        }

        if (tipo === "Profesor") {
            cardsProfesores.textContent = "";
            const fragment = document.createDocumentFragment();
            personas.forEach((item) => {
                fragment.appendChild(item.agregarNuevoProfesor());
            });
            cardsProfesores.appendChild(fragment);
        }
    }
}

/*  CLASE ESTUDIANTE:  */ 
/* ----- Propiedades de Persona + estado y estudiante, Métodos setEstado() y getEstudiante() ------ */

/* ------------------------------------------ HERENCIA: ------------------------------------------ */
/*       La clase Estudiante hereda de la clase Persona y obtiene todas sus características       */

/* -------------------------------- SOLID - Responsabilidad única: ------------------------------- */
/* ----------- Crea las tarjetas de estudiantes con sus datos y estilo correspondientes ---------- */
class Estudiante extends Persona {
    #estado = false;
    #estudiante = "Estudiante"; 


    set setEstado(estado) {
        this.#estado = estado;
    }

    get getEstudiante() {
        return this.#estudiante;
    }

    /* ---------------------------------------- POLIMORFISMO: ---------------------------------------- */
    /*   agregarNuevoEstudiante() adapta su comportamiento heredado para crear y devolver tarjetas     */
    
    /* ----------------------------------- SOLID - abierto/cerrado ---------------------------------- */
    /* ----- agregarNuevoEstudiante() es cerrado y encapsula cómo se agrega un nuevo estudiante ----- */

/* --------------------------------------- SOLID - Liskov: -------------------------------------- */
/* - Extiende el comportamiento de agregarNuevoEstudiante() en Persona sin cambiar su contrato - */
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

        // reemplaze por uid
        clone.querySelector(".btn-success").dataset.uid = this.uid;
        clone.querySelector(".btn-danger").dataset.uid = this.uid;

        return clone;
    }
}

/*  CLASE PROFESOR: Propiedades de Persona, método agregarNuevoProfesor()  */
/* ------------------------------------------ HERENCIA: ------------------------------------------ */
/*       La clase Profesor hereda de la clase Persona y obtiene todas sus características       */

/* -------------------------------- SOLID - Responsabilidad única: ------------------------------- */
/* -------------------- Crea y muestra una tarjeta de profesor con sus datos -------------------- */
class Profesor extends Persona {
    #profesor = "Profesor";

/* ---------------------------------------- POLIMORFISMO: ---------------------------------------- */
/*   agregarNuevoProfesor() adapta su comportamiento heredado para crear y devolver tarjetas     */
    
/* ----------------------------------- SOLID - abierto/cerrado ---------------------------------- */
/* -------- agregarNuevoProfesor() es cerrado y encapsula cómo agregar un nuevo profesor -------- */

/* --------------------------------------- SOLID - Liskov: -------------------------------------- */
/* - Extiende el comportamiento de agregarNuevoEstudiante() en Persona sin cambiar su contrato - */
agregarNuevoProfesor() {
        const clone = templateProfesor.cloneNode(true);
        clone.querySelector("h5").textContent = this.nombre;
        clone.querySelector("h6").textContent = this.#profesor;
        clone.querySelector(".lead").textContent = this.edad;
        return clone;
    }
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    alert.classList.add("d-none");

    const datos = new FormData(formulario);

    const [nombre, edad, opcion] = [...datos.values()];

    // validación de campos vacíos
    if (!nombre.trim() || !edad.trim() || !opcion.trim()) {
        console.log("Elemento vacío");
        alert.classList.remove("d-none");
        return;
    }

    if (opcion === "Estudiante") {
        const estudiante = new Estudiante(nombre, edad);
        estudiantes.push(estudiante);
        Persona.pintarPersonaUI(estudiantes, opcion);
    }

    if (opcion === "Profesor") {
        const profesor = new Profesor(nombre, edad);
        profesores.push(profesor);
        Persona.pintarPersonaUI(profesores, opcion);
    }
});