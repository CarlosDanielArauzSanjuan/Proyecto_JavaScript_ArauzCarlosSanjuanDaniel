// =====================================================================
// MÓDULO DE GESTIÓN DE PERSONAJES
// =====================================================================
// Este módulo se encarga de cargar y mostrar la lista de personajes
// guardados en localStorage, así como los detalles de un personaje
// específico en sus respectivas páginas.
// =====================================================================

// Importar todos los mapeos de imágenes necesarios al principio del archivo
import {
  imagenGenero,
  imagenRazas,
  imagenClases,
  imagenArmaduras,
  imagenArmas,
  imagenHechizos,
  imagenAccesorios,
  imagenEquipamientoDefault,
} from "./diccionarios.js"

// Función para cargar la lista de personajes desde localStorage
export function cargarListaPersonajes(contenedor) {
  try {
    // Obtenemos los personajes guardados en localStorage
    const personajesGuardados = JSON.parse(localStorage.getItem("dnd_personajes")) || []

    // Si no hay personajes, mostramos un mensaje
    if (personajesGuardados.length === 0) {
      contenedor.innerHTML = `
          <div class="empty-list">
            <p>Aún no hay aventureros inscritos en los Pergaminos del Destino.</p>
            <p>¡Sé el primero en forjar tu leyenda!</p>
            <a href="personajes.html" class="create-character-btn">Forjar un Aventurero</a>
          </div>
        `
      return
    }

    // Ordenamos los personajes por fecha de creación (más recientes primero)
    personajesGuardados.sort((a, b) => b.created - a.created)

    // Importamos las imágenes de razas
    import("./diccionarios.js")
      .then(({ imagenRazas }) => {
        // Creamos el HTML para cada personaje
        let listaHTML = ""

        personajesGuardados.forEach((personaje) => {
          // Aseguramos que cada personaje tenga un ID único
          if (!personaje.id) {
            personaje.id = Date.now() + "_" + Math.random().toString(36).substr(2, 9)
          }

          // Determinamos la clase CSS para el tipo de personaje (para estilos visuales)
          let tipoClase = "guerrero" // Por defecto
          if (personaje.classes) {
            if (["wizard", "sorcerer", "warlock"].includes(personaje.classes)) {
              tipoClase = "mago"
            } else if (["rogue", "bard"].includes(personaje.classes)) {
              tipoClase = "picaro"
            } else if (["cleric", "paladin"].includes(personaje.classes)) {
              tipoClase = "clerigo"
            }
          }

          // Obtenemos la imagen de la raza
          const razaImagen =
            personaje.races && imagenRazas[personaje.races] ? imagenRazas[personaje.races] : imagenRazas["default"]

          // Creamos la tarjeta del personaje
          listaHTML += `
          <div class="character-card ${tipoClase}">
            <div class="character-header">
              <div class="character-avatar">
                <img src="${razaImagen}" alt="${personaje.races || "Raza desconocida"}" />
              </div>
              <div class="character-info">
                <h2>${personaje.name || "Aventurero sin nombre"}</h2>
                <span class="character-race-class">${personaje.races || "?"} ${personaje.classes || "?"}</span>
              </div>
            </div>
            <div class="character-body">
              <div class="character-stats">
                <div class="stat">
                  <span class="stat-name">FUE</span>
                  <span class="stat-value">${personaje.force || "?"}</span>
                </div>
                <div class="stat">
                  <span class="stat-name">DES</span>
                  <span class="stat-value">${personaje.dexterity || "?"}</span>
                </div>
                <div class="stat">
                  <span class="stat-name">CON</span>
                  <span class="stat-value">${personaje.constitution || "?"}</span>
                </div>
                <div class="stat">
                  <span class="stat-name">INT</span>
                  <span class="stat-value">${personaje.intelligence || "?"}</span>
                </div>
                <div class="stat">
                  <span class="stat-name">SAB</span>
                  <span class="stat-value">${personaje.wisdom || "?"}</span>
                </div>
                <div class="stat">
                  <span class="stat-name">CAR</span>
                  <span class="stat-value">${personaje.charisma || "?"}</span>
                </div>
              </div>
              <div class="character-equipment">
                <p><strong>Arma:</strong> ${personaje.weapon || "Ninguna"}</p>
                <p><strong>Armadura:</strong> ${personaje.armor || "Ninguna"}</p>
              </div>
            </div>
            <div class="character-footer">
              <a href="detalles.html?name=${encodeURIComponent(personaje.name)}&created=${personaje.created}" class="view-details-btn">Ver Pergamino Completo</a>
            </div>
          </div>
        `
        })

        // Guardamos los personajes actualizados (con IDs si se agregaron)
        localStorage.setItem("dnd_personajes", JSON.stringify(personajesGuardados))

        // Insertamos el HTML en el contenedor
        contenedor.innerHTML = listaHTML
      })
      .catch((error) => {
        console.error("Error al cargar las imágenes de razas:", error)
        // Fallback en caso de error
        mostrarPersonajesSinImagenes(personajesGuardados, contenedor)
      })
  } catch (error) {
    console.error("❌ Error al cargar la lista de personajes:", error)
    contenedor.innerHTML = `
        <div class="error-message">
          <p>Ha ocurrido un error al consultar los Pergaminos del Destino.</p>
          <p>Error: ${error.message}</p>
        </div>
      `
  }
}

// Función de respaldo para mostrar personajes sin imágenes
function mostrarPersonajesSinImagenes(personajesGuardados, contenedor) {
  let listaHTML = ""

  personajesGuardados.forEach((personaje) => {
    // Determinamos la clase CSS para el tipo de personaje
    let tipoClase = "guerrero" // Por defecto
    if (personaje.classes) {
      if (["wizard", "sorcerer", "warlock"].includes(personaje.classes)) {
        tipoClase = "mago"
      } else if (["rogue", "bard"].includes(personaje.classes)) {
        tipoClase = "picaro"
      } else if (["cleric", "paladin"].includes(personaje.classes)) {
        tipoClase = "clerigo"
      }
    }

    // Creamos la tarjeta sin imagen
    listaHTML += `
      <div class="character-card ${tipoClase}">
        <div class="character-header">
          <h2>${personaje.name || "Aventurero sin nombre"}</h2>
          <span class="character-race-class">${personaje.races || "?"} ${personaje.classes || "?"}</span>
        </div>
        <div class="character-body">
          <div class="character-stats">
            <div class="stat">
              <span class="stat-name">FUE</span>
              <span class="stat-value">${personaje.force || "?"}</span>
            </div>
            <div class="stat">
              <span class="stat-name">DES</span>
              <span class="stat-value">${personaje.dexterity || "?"}</span>
            </div>
            <div class="stat">
              <span class="stat-name">CON</span>
              <span class="stat-value">${personaje.constitution || "?"}</span>
            </div>
            <div class="stat">
              <span class="stat-name">INT</span>
              <span class="stat-value">${personaje.intelligence || "?"}</span>
            </div>
            <div class="stat">
              <span class="stat-name">SAB</span>
              <span class="stat-value">${personaje.wisdom || "?"}</span>
            </div>
            <div class="stat">
              <span class="stat-name">CAR</span>
              <span class="stat-value">${personaje.charisma || "?"}</span>
            </div>
          </div>
          <div class="character-equipment">
            <p><strong>Arma:</strong> ${personaje.weapon || "Ninguna"}</p>
            <p><strong>Armadura:</strong> ${personaje.armor || "Ninguna"}</p>
          </div>
        </div>
        <div class="character-footer">
          <a href="detalles.html?name=${encodeURIComponent(personaje.name)}&created=${personaje.created}" class="view-details-btn">Ver Pergamino Completo</a>
        </div>
      </div>
    `
  })

  // Insertamos el HTML en el contenedor
  contenedor.innerHTML = listaHTML
}

// Modificar la función cargarDetallesPersonaje para incluir las imágenes
export function cargarDetallesPersonaje(contenedor) {
  try {
    // Obtenemos los parámetros del personaje de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const personajeName = urlParams.get("name")
    const personajeCreated = urlParams.get("created")
    const personajeId = urlParams.get("id")

    // Obtenemos los personajes guardados en localStorage
    const personajesGuardados = JSON.parse(localStorage.getItem("dnd_personajes")) || []

    let personaje = null

    // Primero intentamos buscar por nombre y fecha de creación (nuevo método)
    if (personajeName && personajeCreated) {
      personaje = personajesGuardados.find(
        (p) => p.name === decodeURIComponent(personajeName) && p.created.toString() === personajeCreated,
      )
    }

    // Si no encontramos por nombre y fecha, intentamos buscar por ID (método antiguo)
    if (!personaje && personajeId !== null) {
      const personajeIndex = Number.parseInt(personajeId, 10)
      if (!isNaN(personajeIndex) && personajeIndex >= 0 && personajeIndex < personajesGuardados.length) {
        personaje = personajesGuardados[personajeIndex]
      }
    }

    // Si no existe el personaje, mostramos un error
    if (!personaje) {
      contenedor.innerHTML = `
        <div class="error-message">
          <p>El aventurero solicitado no existe en los Pergaminos del Destino.</p>
          <a href="listas.html" class="back-btn">Volver al Salón de la Fama</a>
        </div>
      `
      return
    }

    // Formateamos la fecha de creación
    const fechaCreacion = new Date(personaje.created)
    const fechaFormateada = `${fechaCreacion.getDate()}/${fechaCreacion.getMonth() + 1}/${fechaCreacion.getFullYear()}`

    // Determinamos la clase CSS para el tipo de personaje (para estilos visuales)
    let tipoClase = "guerrero" // Por defecto
    if (personaje.classes) {
      if (["wizard", "sorcerer", "warlock"].includes(personaje.classes)) {
        tipoClase = "mago"
      } else if (["rogue", "bard"].includes(personaje.classes)) {
        tipoClase = "picaro"
      } else if (["cleric", "paladin"].includes(personaje.classes)) {
        tipoClase = "clerigo"
      }
    }

    // Obtenemos las imágenes correspondientes a las selecciones del usuario
    const imagenGeneroSrc = personaje.gender
      ? imagenGenero[personaje.gender] || imagenGenero.default
      : imagenGenero.default

    const imagenRazaSrc = personaje.races ? imagenRazas[personaje.races] || imagenRazas.default : imagenRazas.default

    const imagenClaseSrc = personaje.classes
      ? imagenClases[personaje.classes] || imagenClases.default
      : imagenClases.default

    const imagenArmaduraSrc = personaje.armor
      ? imagenArmaduras[personaje.armor] || imagenArmaduras.default
      : imagenEquipamientoDefault

    const imagenArmaSrc = personaje.weapon
      ? imagenArmas[personaje.weapon] || imagenArmas.default
      : imagenEquipamientoDefault

    const imagenHabilidadSrc = personaje.ability
      ? imagenHechizos[personaje.ability] || imagenHechizos.default
      : imagenEquipamientoDefault

    const imagenAccesoriosSrc = personaje.accessories
      ? imagenAccesorios[personaje.accessories] || imagenAccesorios.default
      : imagenEquipamientoDefault

    // Creamos el HTML con los detalles completos del personaje
    const detallesHTML = `
        <div class="character-details ${tipoClase}">
          <div class="character-header">
            <div class="character-images">
              <div class="character-avatar">
                <img src="${imagenGeneroSrc}" alt="Avatar de ${personaje.name}" class="gender-image">
                <span class="image-label">Género</span>
              </div>
              <div class="character-avatar">
                <img src="${imagenRazaSrc}" alt="Raza: ${personaje.races}" class="race-image">
                <span class="image-label">Raza</span>
              </div>
              <div class="character-avatar">
                <img src="${imagenClaseSrc}" alt="Clase: ${personaje.classes}" class="class-image">
                <span class="image-label">Clase</span>
              </div>
            </div>
            <div class="character-title">
              <h1>${personaje.name || "Aventurero sin nombre"}</h1>
              <div class="character-subtitle">
                <span class="character-race-class">${personaje.races || "?"} ${personaje.classes || "?"}</span>
                <span class="character-gender">${personaje.gender || "?"}</span>
              </div>
            </div>
          </div>
          
          <div class="character-section">
            <h2>Atributos</h2>
            <div class="attributes-grid">
              <div class="attribute">
                <div class="attribute-name">Fuerza</div>
                <div class="attribute-value">${personaje.force || "?"}</div>
                <div class="attribute-mod">${Math.floor((personaje.force - 10) / 2) || "?"}</div>
              </div>
              <div class="attribute">
                <div class="attribute-name">Destreza</div>
                <div class="attribute-value">${personaje.dexterity || "?"}</div>
                <div class="attribute-mod">${Math.floor((personaje.dexterity - 10) / 2) || "?"}</div>
              </div>
              <div class="attribute">
                <div class="attribute-name">Constitución</div>
                <div class="attribute-value">${personaje.constitution || "?"}</div>
                <div class="attribute-mod">${Math.floor((personaje.constitution - 10) / 2) || "?"}</div>
              </div>
              <div class="attribute">
                <div class="attribute-name">Inteligencia</div>
                <div class="attribute-value">${personaje.intelligence || "?"}</div>
                <div class="attribute-mod">${Math.floor((personaje.intelligence - 10) / 2) || "?"}</div>
              </div>
              <div class="attribute">
                <div class="attribute-name">Sabiduría</div>
                <div class="attribute-value">${personaje.wisdom || "?"}</div>
                <div class="attribute-mod">${Math.floor((personaje.wisdom - 10) / 2) || "?"}</div>
              </div>
              <div class="attribute">
                <div class="attribute-name">Carisma</div>
                <div class="attribute-value">${personaje.charisma || "?"}</div>
                <div class="attribute-mod">${Math.floor((personaje.charisma - 10) / 2) || "?"}</div>
              </div>
            </div>
          </div>
          
          <div class="character-section">
            <h2>Equipamiento</h2>
            <div class="equipment-grid">
              <div class="equipment-item">
                <div class="equipment-image">
                  <img src="${imagenArmaduraSrc}" alt="${personaje.armor || "Sin armadura"}" class="item-image">
                </div>
                <div class="equipment-info">
                  <div class="equipment-label">Armadura:</div>
                  <div class="equipment-value">${personaje.armor || "Ninguna"}</div>
                </div>
              </div>
              <div class="equipment-item">
                <div class="equipment-image">
                  <img src="${imagenArmaSrc}" alt="${personaje.weapon || "Sin arma"}" class="item-image">
                </div>
                <div class="equipment-info">
                  <div class="equipment-label">Arma:</div>
                  <div class="equipment-value">${personaje.weapon || "Ninguna"}</div>
                </div>
              </div>
              <div class="equipment-item">
                <div class="equipment-image">
                  <img src="${imagenHabilidadSrc}" alt="${personaje.ability || "Sin don arcano"}" class="item-image">
                </div>
                <div class="equipment-info">
                  <div class="equipment-label">Don Arcano:</div>
                  <div class="equipment-value">${personaje.ability || "Ninguno"}</div>
                </div>
              </div>
              <div class="equipment-item">
                <div class="equipment-image">
                  <img src="${imagenAccesoriosSrc}" alt="${personaje.accessories || "Sin accesorios"}" class="item-image">
                </div>
                <div class="equipment-info">
                  <div class="equipment-label">Accesorios:</div>
                  <div class="equipment-value">${personaje.accessories || "Ninguno"}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="character-footer">
            <div class="character-creation-date">
              Inscrito en los Pergaminos del Destino el ${fechaFormateada}
            </div>
            <a href="listas.html" class="back-btn">Volver al Salón de la Fama</a>
          </div>
        </div>
      `

    // Insertamos el HTML en el contenedor
    contenedor.innerHTML = detallesHTML
  } catch (error) {
    console.error("❌ Error al cargar los detalles del personaje:", error)
    contenedor.innerHTML = `
        <div class="error-message">
          <p>Ha ocurrido un error al consultar el Pergamino del Aventurero.</p>
          <p>Error: ${error.message}</p>
          <a href="listas.html" class="back-btn">Volver al Salón de la Fama</a>
        </div>
      `
  }
}
