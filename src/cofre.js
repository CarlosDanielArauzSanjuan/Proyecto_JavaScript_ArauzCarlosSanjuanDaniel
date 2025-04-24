// =====================================================================
// MÓDULO DE GESTIÓN DE COFRE DE EQUIPAMIENTO
// =====================================================================
// Este módulo se encarga de crear y gestionar un inventario visual
// para mostrar los ítems seleccionados por el jugador durante la
// creación de personajes.
// =====================================================================

// Función para inicializar el cofre de equipamiento
export function inicializarCofre() {
  // Verificamos si estamos en la página de creación de personajes
  if (!document.getElementById("form__character")) return

  // Creamos el contenedor del cofre si no existe
  let cofreContainer = document.querySelector(".cofre-container")
  if (!cofreContainer) {
    const sectionRight = document.querySelector(".sectionRight__InfoCharacter")
    if (!sectionRight) return

    cofreContainer = document.createElement("div")
    cofreContainer.className = "cofre-container"
    cofreContainer.innerHTML = `
     <h3>Cofre de Equipamiento</h3>
     <div class="cofre" id="cofre-items"></div>
   `
    sectionRight.appendChild(cofreContainer)
  }

  // Configuramos los listeners para los selectores de equipamiento
  configurarListenersEquipamiento()
}

// Función para configurar los listeners de los selectores de equipamiento
function configurarListenersEquipamiento() {
  const selectores = ["armor", "weapon", "ability", "accessories"]

  selectores.forEach((selector) => {
    const select = document.getElementById(selector)
    if (select) {
      select.addEventListener("change", actualizarCofre)
    }
  })
}

// Función para actualizar el cofre con los ítems seleccionados
function actualizarCofre() {
  const cofreItems = document.getElementById("cofre-items")
  if (!cofreItems) return

  // Limpiamos el cofre
  cofreItems.innerHTML = ""

  // Obtenemos los valores seleccionados
  const armadura = document.getElementById("armor")?.value || ""
  const arma = document.getElementById("weapon")?.value || ""
  const habilidad = document.getElementById("ability")?.value || ""
  const accesorios = document.getElementById("accessories")?.value || ""

  // Añadimos los ítems al cofre si están seleccionados
  if (armadura) {
    agregarItemAlCofre(cofreItems, "armor", armadura, "Armadura")
  }

  if (arma) {
    agregarItemAlCofre(cofreItems, "weapon", arma, "Arma")
  }

  if (habilidad) {
    agregarItemAlCofre(cofreItems, "spell", habilidad, "Don Arcano")
  }

  if (accesorios) {
    agregarItemAlCofre(cofreItems, "gear", accesorios, "Equipo")
  }

  // Si no hay ítems, mostramos un mensaje
  if (cofreItems.children.length === 0) {
    const mensajeVacio = document.createElement("div")
    mensajeVacio.className = "cofre-vacio"
    mensajeVacio.textContent = "Tu cofre está vacío. Selecciona equipamiento para tu aventurero."
    cofreItems.appendChild(mensajeVacio)
  }
}

// Modificar la función agregarItemAlCofre para usar los nuevos mapeos
function agregarItemAlCofre(contenedor, tipo, index, titulo) {
  const item = document.createElement("div")
  item.className = "cofre-item"

  // Importamos los mapeos de imágenes
  import { imagenArmaduras, imagenArmas, imagenHechizos, imagenAccesorios, imagenEquipamientoDefault } from "./diccionarios.js"

  // Creamos una imagen genérica basada en el tipo de ítem
  // Esto evita problemas con rutas de imágenes que no existen
  let imagenSrc = imagenEquipamientoDefault

  // Intentamos cargar imágenes específicas si existen
  try {
    switch (tipo) {
      case "armor":
        imagenSrc = imagenArmaduras[index] || imagenArmaduras["default"]
        break
      case "weapon":
        imagenSrc = imagenArmas[index] || imagenArmas["default"]
        break
      case "spell":
        imagenSrc = imagenHechizos[index] || imagenHechizos["default"]
        break
      case "gear":
        imagenSrc = imagenAccesorios[index] || imagenAccesorios["default"]
        break
    }
  } catch (error) {
    console.warn(`No se pudo cargar la imagen para ${index}`, error)
  }

  // Creamos el contenido del ítem con manejo de errores mejorado
  item.innerHTML = `
   <div class="cofre-item-imagen">
     <img src="${imagenSrc}" alt="${index}" 
          onerror="this.onerror=null; this.src='${imagenEquipamientoDefault}'; 
                  if(!this.complete) this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEHUlEQVR4nO2dW4hNURjHf2PGZVwil5kYt5TbICO5lGSKPCgP8iKXFE+UXKJQlJJCkQcPXkR5kFJKHpQHD0QpRHkQJZfJPTNmzMzSt9bRNmPO3mvvs9ba5/y/+j+dOWu+9f3PWXvttb+1wHEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3GcVNQAncBzoBsYVOQCdAHvgA6gWjuQUaAJeAkMFbkAL4Am7UBGgVbgq3YQBSrAF6BFO5BR4KJ2EAUswAXtIEaBWuCndhAFKsAPoCbpQIZTfGwFJgJLgRZgDvAE6ANmAe+BH8A0YDYwHhgLvAZ+A/OAD8Av4AAwAZgKPAO+AYuAj8Ag0AgsAKqAB8B3YDmwCOgFHgGrgCXAVOAucBxYDUwG7gCngLXANOA+cBbYAMwAngJXgM3ATGAQuAFsA+qAV8Bt4ACwGOgBHgP7gSXAJ+AZcARYBnwGXgDHgJXAF+A1cBJYDXwF3gFngHXAb+A9cB7YCIwBPgJXgW3AeOANcAvYCUwCuoF7wB5gKtAH3Af2AfXAR+AhcAiYA/QCj4EjwHzgM/AcOAYsB74Ar4CTwBqgH3gLnAHWAwPAe+A8sAkYC3wCrgHbgQnAa+A2sBuYDPQA94G9QB3wAXgEHAYagR7gCXAUWAp8Al4CJ4BVwFfgHXAW2AD8Ad4DF4CNwBjgA3AV2A6MB94At4BdQDXQBdwF9gLTgD7gAXAAmA30Ao+BI8B84AvwAjgOLAe+Aa+Bk8AaYAB4B5wDNgGVwEfgGrADmAi8Bm4De4ApQA9wD9gP1AMfgIfAIWAu0As8AY4CS4HPwEvgBLAK6AfeAmeBjcAg8B64AGwGKoFPwHVgBzABeAPcAnYD1UA3cBfYB0wH+oAHwEFgDtALPAaOAguAr8AL4DiwAvgGvAZOAWuBAeAdcB7YBFQAn4BrwE5gIvAauAPsAaYCPcB94AAwG+gFHgNHgYXAF+AFcAJYDfQDb4GzwEZgEPgAXAK2ABXAJ+A6sBOYBLwB7gC7gWqgG7gL7AWmA33AfeAgMBfoBZ4AR4FFwGfgJXASWAP0A++Ac8BmoBL4CFwHdgITgdfAHWAPMAXoAe4BB4A5QC/wGDgKLAS+AC+A48AKoB94A5wG1gGDwHvgArAZqAA+AdeAHcBE4DVwG9gNVAPdwF1gHzAd6AMeAAeBOUAv8AQ4CiwCPgMvgZPAaqAfeAucAzYBlcBH4BqwE5gEvAHuAHuAqUAP8AA4AMwGeoHHwFFgIfAFeAmcAFYD/cBb4CywERgEPgCXgC1ABfAJuAHsBCYBb4C7wB6gGugG7gL7genAP0OLlKWcgZ3/AAAAAElFTkSuQmCC'">
   </div>
   <span class="cofre-item-nombre">${index.replace(/-/g, " ")}</span>
   <span class="cofre-item-tipo">${titulo}</span>
 `

  contenedor.appendChild(item)
}

// Inicializamos el cofre cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarCofre)
