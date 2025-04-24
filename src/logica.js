// =====================================================================
// MÓDULO DE LÓGICA PRINCIPAL
// =====================================================================
// Este módulo se encarga de la lógica principal de la aplicación,
// incluyendo la gestión del formulario de creación de personajes,
// la carga de personajes guardados y la navegación entre páginas.
// =====================================================================

import { cargarListaPersonajes, cargarDetallesPersonaje } from "./personajes.js"
import {
  verificarHabilitacionAtributos,
  aplicarBonificacionesRaciales,
  aplicarRecomendacionesClase,
  obtenerValoresAtributos,
} from "./atributos.js"

// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
  // Identificamos en qué página estamos para ejecutar la lógica correspondiente
  const paginaActual = obtenerPaginaActual()

  // Ejecutamos la lógica específica según la página
  switch (paginaActual) {
    case "personajes":
      inicializarPaginaCreacionPersonaje()
      break
    case "lista":
      inicializarPaginaListaPersonajes()
      break
    case "detalles":
      inicializarPaginaDetallesPersonaje()
      break
    default:
      // Si no estamos en ninguna de las páginas específicas, no hacemos nada
      console.log("Página no reconocida para lógica específica")
      break
  }
})

/**
 * Determina en qué página se encuentra el usuario actualmente
 * @returns {string} - Identificador de la página actual
 */
function obtenerPaginaActual() {
  const rutaActual = window.location.pathname

  if (rutaActual.includes("personajes.html")) {
    return "personajes"
  } else if (rutaActual.includes("lista.html") || rutaActual.includes("listas.html")) {
    return "lista"
  } else if (rutaActual.includes("detalles.html")) {
    return "detalles"
  } else {
    return "otra"
  }
}

/**
 * Inicializa la lógica para la página de creación de personajes
 * @returns {void}
 */
function inicializarPaginaCreacionPersonaje() {
  console.log("Inicializando página de creación de personaje")

  // Obtenemos el formulario
  const formulario = document.getElementById("form__character")

  if (!formulario) {
    console.warn("No se encontró el formulario de creación de personaje")
    return
  }

  // Configuramos los eventos para los selectores de raza y clase
  const selectRaza = document.getElementById("races")
  const selectClase = document.getElementById("classes")

  if (selectRaza) {
    selectRaza.addEventListener("change", (e) => {
      const razaSeleccionada = e.target.value
      if (razaSeleccionada) {
        aplicarBonificacionesRaciales(razaSeleccionada)
        verificarHabilitacionAtributos()
      }
    })
  }

  if (selectClase) {
    selectClase.addEventListener("change", (e) => {
      const claseSeleccionada = e.target.value
      if (claseSeleccionada) {
        aplicarRecomendacionesClase(claseSeleccionada)
        verificarHabilitacionAtributos()
      }
    })
  }

  // Configuramos el evento de envío del formulario
  formulario.addEventListener("submit", guardarPersonaje)
}

/**
 * Guarda un nuevo personaje en localStorage
 * @param {Event} evento - Evento de envío del formulario
 * @returns {void}
 */
function guardarPersonaje(evento) {
  evento.preventDefault()

  try {
    // Obtenemos los valores del formulario
    const nombre = document.getElementById("name")?.value || ""
    const genero = document.getElementById("gender")?.value || ""
    const raza = document.getElementById("races")?.value || ""
    const clase = document.getElementById("classes")?.value || ""
    const armadura = document.getElementById("armor")?.value || ""
    const arma = document.getElementById("weapon")?.value || ""
    const habilidad = document.getElementById("ability")?.value || ""
    const accesorios = document.getElementById("accessories")?.value || "" // Fixed spelling

    // Validate required fields
    if (!nombre || !genero || !raza || !clase) {
      alert("Por favor, completa todos los campos obligatorios.")
      return
    }

    // Obtenemos los valores de los atributos
    const atributos = obtenerValoresAtributos()

    // Creamos el objeto personaje
    const personaje = {
      name: nombre,
      gender: genero,
      races: raza,
      classes: clase,
      armor: armadura,
      weapon: arma,
      ability: habilidad,
      accessories: accesorios, // Fixed spelling from "accesories" to "accessories"
      ...atributos,
      created: Date.now(), // Timestamp de creación
    }

    // Obtenemos los personajes existentes
    const personajesGuardados = JSON.parse(localStorage.getItem("dnd_personajes")) || []

    // Añadimos el nuevo personaje
    personajesGuardados.push(personaje)

    // Guardamos en localStorage
    localStorage.setItem("dnd_personajes", JSON.stringify(personajesGuardados))

    // Mostramos mensaje de éxito
    alert("¡Tu aventurero ha sido inscrito en los Pergaminos del Destino!")

    // Redirigimos a la lista de personajes
    window.location.href = "listas.html"
  } catch (error) {
    console.error("❌ Error al guardar el personaje:", error)
    alert("Ha ocurrido un error al inscribir tu aventurero. Por favor, inténtalo de nuevo.")
  }
}

/**
 * Inicializa la lógica para la página de lista de personajes
 * @returns {void}
 */
function inicializarPaginaListaPersonajes() {
  console.log("Inicializando página de lista de personajes")

  // Obtenemos el contenedor donde se mostrarán los personajes
  const contenedor = document.getElementById("listCharacters")

  if (!contenedor) {
    console.warn("No se encontró el contenedor para la lista de personajes")
    return
  }

  // Cargamos la lista de personajes
  cargarListaPersonajes(contenedor)
}

/**
 * Inicializa la lógica para la página de detalles de personaje
 * @returns {void}
 */
function inicializarPaginaDetallesPersonaje() {
  console.log("Inicializando página de detalles de personaje")

  // Obtenemos el contenedor donde se mostrarán los detalles
  const contenedor = document.getElementById("detailsCharacter")

  if (!contenedor) {
    console.warn("No se encontró el contenedor para los detalles del personaje")
    return
  }

  // Verificamos que exista un ID en la URL
  const urlParams = new URLSearchParams(window.location.search)
  const personajeId = urlParams.get("id")

  if (!personajeId) {
    contenedor.innerHTML = `
      <div class="error-message">
        <p>No se ha especificado ningún aventurero para consultar.</p>
        <a href="listas.html" class="back-btn">Volver al Salón de la Fama</a>
      </div>
    `
    return
  }

  // Cargamos los detalles del personaje
  cargarDetallesPersonaje(contenedor)
}

// Exportamos las funciones que podrían ser utilizadas por otros módulos
export {
  guardarPersonaje,
  inicializarPaginaCreacionPersonaje,
  inicializarPaginaListaPersonajes,
  inicializarPaginaDetallesPersonaje,
}
