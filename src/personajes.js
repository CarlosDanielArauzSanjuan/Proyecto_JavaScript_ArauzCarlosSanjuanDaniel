// =====================================================================
// MÓDULO DE GESTIÓN DE PERSONAJES
// =====================================================================
// Este módulo se encarga de cargar y mostrar la lista de personajes
// guardados en localStorage, así como los detalles de un personaje
// específico en sus respectivas páginas.
// =====================================================================

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

    // Creamos el HTML para cada personaje
    let listaHTML = ""

    personajesGuardados.forEach((personaje, index) => {
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

      // Creamos la tarjeta del personaje
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
              <a href="detalles.html?id=${index}" class="view-details-btn">Ver Pergamino Completo</a>
            </div>
          </div>
        `
    })

    // Insertamos el HTML en el contenedor
    contenedor.innerHTML = listaHTML
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

// Función para cargar los detalles de un personaje específico
export function cargarDetallesPersonaje(contenedor) {
  try {
    // Obtenemos el ID del personaje de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const personajeId = urlParams.get("id")

    // Si no hay ID, mostramos un error
    if (personajeId === null) {
      contenedor.innerHTML = `
          <div class="error-message">
            <p>No se ha especificado ningún aventurero para consultar.</p>
            <a href="listas.html" class="back-btn">Volver al Salón de la Fama</a>
          </div>
        `
      return
    }

    // Obtenemos los personajes guardados en localStorage
    const personajesGuardados = JSON.parse(localStorage.getItem("dnd_personajes")) || []

    // Obtenemos el personaje específico
    const personaje = personajesGuardados[personajeId]

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

    // Creamos el HTML con los detalles completos del personaje
    const detallesHTML = `
        <div class="character-details ${tipoClase}">
          <div class="character-header">
            <h1>${personaje.name || "Aventurero sin nombre"}</h1>
            <div class="character-subtitle">
              <span class="character-race-class">${personaje.races || "?"} ${personaje.classes || "?"}</span>
              <span class="character-gender">${personaje.gender || "?"}</span>
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
                <div class="equipment-label">Arma:</div>
                <div class="equipment-value">${personaje.weapon || "Ninguna"}</div>
              </div>
              <div class="equipment-item">
                <div class="equipment-label">Armadura:</div>
                <div class="equipment-value">${personaje.armor || "Ninguna"}</div>
              </div>
              <div class="equipment-item">
                <div class="equipment-label">Don Arcano:</div>
                <div class="equipment-value">${personaje.ability || "Ninguno"}</div>
              </div>
              <div class="equipment-item">
                <div class="equipment-label">Accesorios:</div>
                <div class="equipment-value">${personaje.accesories || "Ninguno"}</div>
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
