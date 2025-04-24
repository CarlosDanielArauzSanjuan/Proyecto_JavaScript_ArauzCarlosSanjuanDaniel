// =====================================================================
// MÓDULO DE GESTIÓN DE COFRE DE EQUIPAMIENTO
// =====================================================================
// Este módulo se encarga de crear y gestionar un inventario visual
// para mostrar los ítems seleccionados por el jugador durante la
// creación de personajes.
// =====================================================================

// Importamos los mapeos de imágenes al inicio del archivo (nivel superior)
import {
  imagenArmaduras,
  imagenArmas,
  imagenHechizos,
  imagenAccesorios,
  imagenEquipamientoDefault,
} from "./diccionarios.js"

// Función para inicializar el cofre de equipamiento
export function inicializarCofre() {
  // Verificamos si estamos en la página de creación de personajes
  if (!document.getElementById("form__character")) return

  // Configuramos los listeners para los selectores de equipamiento
  configurarListenersEquipamiento()

  // Actualizamos el cofre inicialmente para mostrar el mensaje de vacío
  actualizarCofre()
}

// Function to configure listeners for equipment selectors
function configurarListenersEquipamiento() {
  const selectores = ["armor", "weapon", "ability", "accessories"]

  selectores.forEach((selector) => {
    const select = document.getElementById(selector)
    if (select) {
      select.addEventListener("change", () => {
        actualizarCofre()
        // Cargar detalles del ítem seleccionado
        if (selector === "armor" && select.value) {
          cargarDetallesItem("equipment", select.value, "armor")
        } else if (selector === "weapon" && select.value) {
          cargarDetallesItem("equipment", select.value, "weapon")
        } else if (selector === "ability" && select.value) {
          cargarDetallesItem("spells", select.value, "ability")
        }
      })
    }
  })
}

// Función para cargar detalles de un ítem específico
async function cargarDetallesItem(categoria, index, tipo) {
  if (!index) return

  try {
    // URL base de la API de D&D 5e
    const URL = "https://www.dnd5eapi.co/api"

    // Realizamos la petición a la API
    const respuesta = await fetch(`${URL}/${categoria}/${index}`)

    if (!respuesta.ok) {
      throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
    }

    const datos = await respuesta.json()

    // Actualizamos el cofre con los detalles obtenidos
    actualizarDetallesEnCofre(datos, tipo)
  } catch (error) {
    console.error(`❌ Error al obtener detalles de ${tipo}:`, error)
  }
}

// Función para actualizar los detalles en el cofre
function actualizarDetallesEnCofre(datos, tipo) {
  // Buscamos el contenedor del ítem en el cofre
  const itemContainer = document.querySelector(`.cofre-item[data-tipo="${tipo}"]`)

  if (!itemContainer) return

  // Creamos o actualizamos el contenedor de detalles
  let detallesContainer = itemContainer.querySelector(".cofre-item-detalles")

  if (!detallesContainer) {
    detallesContainer = document.createElement("div")
    detallesContainer.className = "cofre-item-detalles"
    itemContainer.appendChild(detallesContainer)
  }

  // Generamos el HTML de detalles según el tipo de ítem
  let detallesHTML = ""

  if (tipo === "armor") {
    detallesHTML = `
      <p><strong>Categoría:</strong> ${datos.armor_category || "Desconocida"}</p>
      <p><strong>CA Base:</strong> ${datos.armor_class?.base || "?"}</p>
      <p><strong>Peso:</strong> ${datos.weight || "?"} lb</p>
    `
  } else if (tipo === "weapon") {
    detallesHTML = `
      <p><strong>Categoría:</strong> ${datos.weapon_category || "Desconocida"}</p>
      <p><strong>Daño:</strong> ${datos.damage?.damage_dice || "?"}</p>
      <p><strong>Tipo:</strong> ${datos.damage?.damage_type?.name || "?"}</p>
    `
  } else if (tipo === "ability") {
    detallesHTML = `
      <p><strong>Nivel:</strong> ${datos.level || "Cantrip"}</p>
      <p><strong>Tiempo:</strong> ${datos.casting_time || "?"}</p>
      <p><strong>Escuela:</strong> ${datos.school?.name || "?"}</p>
    `
  }

  // Actualizamos el contenido
  detallesContainer.innerHTML = detallesHTML
}

// Function to update the cofre with the selected items
function actualizarCofre() {
  const cofreItems = document.getElementById("cofre-items")
  if (!cofreItems) return

  // Limpiamos el cofre
  cofreItems.innerHTML = ""

  // Obtenemos los valores seleccionados con verificación de existencia
  const armorElement = document.getElementById("armor")
  const weaponElement = document.getElementById("weapon")
  const abilityElement = document.getElementById("ability")
  const accessoriesElement = document.getElementById("accessories")

  const armadura = armorElement?.value || ""
  const arma = weaponElement?.value || ""
  const habilidad = abilityElement?.value || ""
  const accesorios = accessoriesElement?.value || ""

  // Creamos un contenedor para la primera fila (armadura)
  const armorContainer = document.createElement("div")
  armorContainer.className = "cofre-section animate-fadeIn"

  // Añadimos título a la sección
  if (armadura) {
    const sectionTitle = document.createElement("h4")
    sectionTitle.className = "cofre-section-title"
    sectionTitle.textContent = "Armadura"
    armorContainer.appendChild(sectionTitle)

    const imagenSrc = imagenArmaduras[armadura] || imagenArmaduras["default"]
    agregarItemAlCofre(armorContainer, "armor", armadura, "Armadura", imagenSrc)
    cofreItems.appendChild(armorContainer)
  }

  // Creamos un contenedor para la segunda fila (arma)
  const weaponContainer = document.createElement("div")
  weaponContainer.className = "cofre-section animate-fadeIn"

  // Añadimos título a la sección
  if (arma) {
    const sectionTitle = document.createElement("h4")
    sectionTitle.className = "cofre-section-title"
    sectionTitle.textContent = "Arma"
    weaponContainer.appendChild(sectionTitle)

    const imagenSrc = imagenArmas[arma] || imagenArmas["default"]
    agregarItemAlCofre(weaponContainer, "weapon", arma, "Arma", imagenSrc)
    cofreItems.appendChild(weaponContainer)
  }

  // Creamos un contenedor para la tercera fila (don arcano)
  const spellContainer = document.createElement("div")
  spellContainer.className = "cofre-section animate-fadeIn"

  // Añadimos título a la sección
  if (habilidad) {
    const sectionTitle = document.createElement("h4")
    sectionTitle.className = "cofre-section-title"
    sectionTitle.textContent = "Don Arcano"
    spellContainer.appendChild(sectionTitle)

    const imagenSrc = imagenHechizos[habilidad] || imagenHechizos["default"]
    agregarItemAlCofre(spellContainer, "ability", habilidad, "Don Arcano", imagenSrc)
    cofreItems.appendChild(spellContainer)
  }

  // Creamos un contenedor para la cuarta fila (accesorios)
  const accessoriesContainer = document.createElement("div")
  accessoriesContainer.className = "cofre-section animate-fadeIn"

  // Añadimos título a la sección
  if (accesorios) {
    const sectionTitle = document.createElement("h4")
    sectionTitle.className = "cofre-section-title"
    sectionTitle.textContent = "Equipo"
    accessoriesContainer.appendChild(sectionTitle)

    const imagenSrc = imagenAccesorios[accesorios] || imagenAccesorios["default"]
    agregarItemAlCofre(accessoriesContainer, "accessories", accesorios, "Equipo", imagenSrc)
    cofreItems.appendChild(accessoriesContainer)
  }

  // Si no hay ítems, mostramos un mensaje
  if (!armadura && !arma && !habilidad && !accesorios) {
    const mensajeVacio = document.createElement("div")
    mensajeVacio.className = "cofre-vacio animate-fadeIn"
    mensajeVacio.textContent = "Tu cofre está vacío. Selecciona equipamiento para tu aventurero."
    cofreItems.appendChild(mensajeVacio)
  }

  // Cargamos los detalles de los ítems seleccionados
  if (armadura) cargarDetallesItem("equipment", armadura, "armor")
  if (arma) cargarDetallesItem("equipment", arma, "weapon")
  if (habilidad) cargarDetallesItem("spells", habilidad, "ability")
}

// Función optimizada para crear elementos del cofre con animaciones
function agregarItemAlCofre(contenedor, tipo, index, titulo, imagenCustom = null) {
  const item = document.createElement("div")
  item.className = "cofre-item animate-fadeIn"
  item.setAttribute("data-tipo", tipo)
  item.setAttribute("data-index", index)

  // Creamos una imagen genérica basada en el tipo de ítem
  // Esto evita problemas con rutas de imágenes que no existen
  let imagenSrc = imagenEquipamientoDefault

  // Si se proporciona una imagen personalizada, la usamos
  if (imagenCustom) {
    imagenSrc = imagenCustom
  }

  // Obtenemos el nombre formateado para mostrar
  const nombreFormateado = index.replace(/-/g, " ")

  // Creamos el contenido del ítem con manejo de errores mejorado
  item.innerHTML = `
    <div class="cofre-item-imagen">
      <img src="${imagenSrc}" alt="${nombreFormateado}" 
           onerror="this.onerror=null; this.src='${imagenEquipamientoDefault}'; 
                   if(!this.complete) this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEHUlEQVR4nO2dW4hNURjHf2PGZVwil5kYt5TbICO5lGSKPCgP8iKXFE+UXKJQlJJCkQcPXkR5kFJKHpQHD0QpRHkQJZfJPTNmzMzSt9bRNmPO3mvvs9ba5/y/+j+dOWu+9f3PWXvttb+1wHEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3GcVNQAncBzoBsYVOQCdAHvgA6gWjuQUaAJeAkMFbkAL4Am7UBGgVbgq3YQBSrAF6BFO5BR4KJ2EAUswAXtIEaBWuCndhAFKsAPoCbpQIZTfGwFJgJLgRZgDvAE6ANmAe+BH8A0YDYwHhgLvAZ+A/OAD8Av4AAwAZgKPAO+AYuAj8Ag0AgsAKqAB8B3YDmwCOgFHgGrgCXAVOAucBxYDUwG7gCngLXANOA+cBbYAMwAngJXgM3ATGAQuAFsA+qAV8Bt4ACwGOgBHgP7gSXAJ+AZcARYBnwGXgDHgJXAF+A1cBJYDXwF3gFngHXAb+A9cB7YCIwBPgJXgW3AeOANcAvYCUwCuoF7wB5gKtAH3Af2AfXAR+AhcAiYA/QCj4EjwHzgM/AcOAYsB74Ar4CTwBqgH3gLnAHWAwPAe+A8sAkYC3wCrgHbgQnAa+A2sBuYDPQA94G9QB3wAXgEHAYagR7gCXAUWAp8Al4CJ4BVwFfgHXAW2AD8Ad4DF4CNwBjgA3AV2A6MB94At4BdQDXQBdwF9gLTgD7gAXAAmA30Ao+BI8B84AvwAjgOLAe+Aa+Bk8AaYAB4B5wDNgGVwEfgGrADmAi8Bm4De4ApQA9wD9gP1AMfgIfAIWAu0As8AY4CS4HPwEvgBLAK6AfeAmeBjcAg8B64AGwGKoFPwHVgBzABeAPcAnYD1UA3cBfYB0wH+oAHwEFgDtALPAaOAguAr8AL4DiwAvgGvAZOAWuBAeAdcB7YBFQAn4BrwE5gIvAauAPsAaYCPcB94AAwG+gFHgNHgYXAF+AFcAJYDfQDb4GzwEZgEPgAXAK2ABXAJ+A6sBOYBLwB7gL7gWqgG7gL7AWmA33AfeAgMBfoBZ4AR4FFwGfgJXASWAP0A++Ac8BmoBL4CFwHdgITgdfAHWAPMAXoAe4BB4A5QC/wGDgKLAS+AC+A48AKoB94A5wG1gGDwHvgArAZqAA+AdeAHcBE4DVwG9gNVAPdwF1gHzAd6AMeAAeBOUAv8AQ4CiwCPgMvgZPAaqAfeAucAzYBlcBH4BqwE5gEvAHuAHuAqUAP8AA4AMwGeoHHwFFgIfAFeAmcAFYD/cBb4CywERgEPgCXgC1ABfAJuAHsBCYBb4C7wB6gGugG7gL7genAP0OLlKWcgZ3/AAAAAElFTkSuQmCC'">
    </div>
    <div class="cofre-item-info">
      <span class="cofre-item-nombre">${nombreFormateado}</span>
      <span class="cofre-item-tipo">${titulo}</span>
    </div>
  `

  contenedor.appendChild(item)
}

// Inicializamos el cofre cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarCofre)

// Exportamos la función para que pueda ser usada desde otros módulos
export { actualizarCofre }
