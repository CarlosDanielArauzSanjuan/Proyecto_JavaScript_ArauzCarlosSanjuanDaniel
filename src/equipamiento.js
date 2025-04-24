// =====================================================================
// MÓDULO DE GESTIÓN DE EQUIPAMIENTO
// =====================================================================
// Este módulo se encarga de gestionar todo lo relacionado con armaduras
// y armas en el sistema de D&D. Implementa funciones para cargar, filtrar
// y mostrar detalles del equipamiento según la clase del personaje.
// =====================================================================

// Importa los objetos que contienen las proficiencias por clase desde el archivo diccionarios.js
import { proficienciasArmaduraClase, proficienciasArmasClase } from "./diccionarios.js"

// URL base de la API de D&D 5e
const URL = "https://www.dnd5eapi.co/api"

// Variables para almacenar todas las armaduras y armas cargadas desde la API
let todasArmaduras = []
let todasArmas = []

// Mapa para almacenar detalles de armaduras y armas ya consultados
// Esto evita hacer múltiples peticiones para el mismo ítem
const detallesEquipamiento = new Map()

// =====================================================================
// FUNCIONES PARA ARMADURAS
// =====================================================================
// Estas funciones gestionan la carga, filtrado y visualización de
// armaduras según las proficiencias de cada clase.
// =====================================================================

// Carga todas las armaduras y las guarda en todasArmaduras
export async function cargarTodasArmaduras(selectId) {
  try {
    // Primero intentamos recuperar del localStorage para evitar llamadas innecesarias
    const armadurasCacheadas = localStorage.getItem("dnd_cache_armaduras")

    if (armadurasCacheadas) {
      console.log("🛡️ Usando armaduras en caché")
      try {
        todasArmaduras = JSON.parse(armadurasCacheadas)
      } catch (e) {
        console.error("❌ Error al parsear armaduras cacheadas:", e)
        todasArmaduras = []
      }
    } else {
      // Si no hay caché, hacemos la solicitud a la API
      console.log("🌐 Cargando armaduras desde API")
      try {
        const respuesta = await fetch(`${URL}/equipment-categories/armor`)

        if (!respuesta.ok) {
          throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
        }

        const datos = await respuesta.json()

        // Guardamos la lista de armaduras en la variable global
        todasArmaduras = datos.equipment || []

        // Guardamos en localStorage para futuras visitas
        // Pero primero verificamos el tamaño para no exceder límites
        const datosJSON = JSON.stringify(todasArmaduras)
        const tamanoBytes = new Blob([datosJSON]).size

        if (tamanoBytes < 500000) {
          // Limitamos a 500KB
          localStorage.setItem("dnd_cache_armaduras", datosJSON)
        } else {
          console.warn("⚠️ Lista de armaduras demasiado grande para localStorage")
        }
      } catch (error) {
        console.error("❌ Error al obtener armaduras de la API:", error)
        todasArmaduras = []
      }
    }

    // Limpia el <select> y deja una opción vacía por defecto
    const select = document.getElementById(selectId)
    if (select) {
      select.innerHTML = '<option value="">Selecciona una armadura</option>'
    }
  } catch (error) {
    // Muestra un error en consola si falla la carga de armaduras
    console.error(`❌ Error al cargar armaduras: `, error)
  }
}

// Filtra las armaduras por clase seleccionada
export async function filtrarArmadurasPorClase(claseIndex, cacheSystem) {
  // Obtiene el <select> donde se mostrarán las armaduras
  const selectArmadura = document.getElementById("armor")
  if (!selectArmadura) return

  // Limpia el contenido actual del <select>
  selectArmadura.innerHTML = '<option value="">Selecciona una armadura</option>'

  // Si no hay clase seleccionada, se detiene la ejecución
  if (!claseIndex) return

  // Obtiene las categorías de armadura permitidas para la clase seleccionada
  const categoriasPermitidas = proficienciasArmaduraClase[claseIndex] || []

  // Si la clase no puede usar ninguna armadura, se desactiva el <select> y se termina
  if (categoriasPermitidas.length === 0) {
    selectArmadura.disabled = true
    selectArmadura.innerHTML = '<option value="">No proficiente en armaduras</option>'
    return
  }

  // Habilita el <select> si hay categorías permitidas
  selectArmadura.disabled = false

  // Lista de armaduras que cumplen con los requisitos
  const armadurasPermitidas = []

  // Verificamos si ya tenemos los detalles de las armaduras en caché
  const cacheKey = `armaduras_clase_${claseIndex}`
  const armadurasClaseCacheadas = localStorage.getItem(cacheKey)

  if (armadurasClaseCacheadas) {
    // Si tenemos los datos en caché, los usamos directamente
    console.log(`🛡️ Usando armaduras filtradas en caché para clase ${claseIndex}`)
    try {
      const armadurasCache = JSON.parse(armadurasClaseCacheadas)

      // Agregamos las armaduras al select
      armadurasCache.forEach((armadura) => {
        const option = document.createElement("option")
        option.value = armadura.index
        option.textContent = armadura.name
        selectArmadura.appendChild(option)
      })

      return
    } catch (e) {
      console.error("❌ Error al parsear armaduras cacheadas para clase:", e)
      // Si hay error, continuamos con el proceso normal
    }
  }

  // Si no hay caché, procesamos todas las armaduras
  console.log(`🔍 Filtrando armaduras para clase ${claseIndex}`)

  // Mostramos que estamos cargando
  selectArmadura.innerHTML = '<option value="">Cargando armaduras...</option>'

  // Verificamos si tenemos armaduras para filtrar
  if (todasArmaduras.length === 0) {
    selectArmadura.innerHTML = '<option value="">No hay armaduras disponibles</option>'
    return
  }

  // Obtenemos todos los detalles de armaduras en una sola llamada si es posible
  // o usamos los detalles ya almacenados en el mapa
  for (const armadura of todasArmaduras) {
    try {
      let detallesArmadura

      // Verificamos si ya tenemos los detalles de esta armadura
      if (detallesEquipamiento.has(armadura.index)) {
        detallesArmadura = detallesEquipamiento.get(armadura.index)
      } else if (cacheSystem) {
        // Si tenemos sistema de caché, lo usamos
        detallesArmadura = await cacheSystem.obtenerDetalle("equipment", armadura.index)
        // Guardamos los detalles para futuras consultas
        detallesEquipamiento.set(armadura.index, detallesArmadura)
      } else {
        // Si no los tenemos, hacemos la petición
        const respuesta = await fetch(`${URL}/equipment/${armadura.index}`)

        if (!respuesta.ok) {
          throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
        }

        detallesArmadura = await respuesta.json()

        // Guardamos los detalles para futuras consultas
        detallesEquipamiento.set(armadura.index, detallesArmadura)
      }

      // Obtiene la categoría de armadura (ej: light, medium, heavy)
      const categoriaArmadura = detallesArmadura.armor_category?.toLowerCase()

      // Verifica si el ítem es un escudo
      const esEscudo = detallesArmadura.equipment_category?.index === "shield"

      // Si la armadura pertenece a una categoría permitida, o es un escudo permitido, se agrega a la lista
      if (categoriasPermitidas.includes(categoriaArmadura) || (categoriasPermitidas.includes("shield") && esEscudo)) {
        armadurasPermitidas.push(armadura)
      }
    } catch (error) {
      // Muestra un error si falla la solicitud de detalles
      console.error(`❌ Error al obtener detalles de armadura para ${armadura.index}: `, error)
    }
  }

  // Limpiamos el select para quitar el mensaje de carga
  selectArmadura.innerHTML = '<option value="">Selecciona una armadura</option>'

  // Verificamos si encontramos armaduras permitidas
  if (armadurasPermitidas.length === 0) {
    selectArmadura.innerHTML = '<option value="">No hay armaduras disponibles</option>'
    selectArmadura.disabled = true
    return
  }

  // Guardamos las armaduras filtradas en localStorage para esta clase
  // Pero primero verificamos el tamaño para no exceder límites
  try {
    const datosJSON = JSON.stringify(armadurasPermitidas)
    const tamanoBytes = new Blob([datosJSON]).size

    if (tamanoBytes < 100000) {
      // Limitamos a 100KB
      localStorage.setItem(cacheKey, datosJSON)
    }
  } catch (e) {
    console.warn("⚠️ Error al guardar armaduras filtradas en caché:", e)
  }

  // Agrega las armaduras filtradas como opciones en el <select>
  armadurasPermitidas.forEach((armadura) => {
    const option = document.createElement("option")
    option.value = armadura.index
    option.textContent = armadura.name
    selectArmadura.appendChild(option)
  })
}

// Muestra detalles de la armadura seleccionada
export async function mostrarDetallesArmadura(armaduraIndex, cache) {
  // Si no hay armadura seleccionada, no hace nada
  if (!armaduraIndex) return

  const infoContainer = document.getElementById("infoCharacter")
  if (!infoContainer) return

  // Mostramos indicador de carga
  infoContainer.innerHTML = '<div class="loading">Consultando el Compendio de Armaduras...</div>'

  try {
    // Usamos el sistema de caché si está disponible
    let datos
    if (cache) {
      datos = await cache.obtenerDetalle("equipment", armaduraIndex)
    } else if (detallesEquipamiento.has(armaduraIndex)) {
      // Si no hay sistema de caché pero tenemos los detalles en nuestro mapa
      datos = detallesEquipamiento.get(armaduraIndex)
    } else {
      // Si no tenemos los datos, hacemos la petición
      const respuesta = await fetch(`${URL}/equipment/${armaduraIndex}`)

      if (!respuesta.ok) {
        throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
      }

      datos = await respuesta.json()
      // Guardamos para futuras consultas
      detallesEquipamiento.set(armaduraIndex, datos)
    }

    // Verificamos que tengamos datos válidos
    if (!datos || Object.keys(datos).length === 0) {
      throw new Error("No se pudieron obtener datos de la armadura")
    }

    // Crea el HTML con la información de la armadura
    const infoArmaduraHTML = `
            <h2>${datos.name}</h2>
            <p><strong>Categoría:</strong> ${datos.armor_category || "Desconocida"}</p>
            <p><strong>Clase de Armadura Base:</strong> ${datos.armor_class?.base || "Desconocida"}</p>
            <p><strong>Bonificación por Destreza:</strong> ${datos.armor_class?.dex_bonus ? "Sí" : "No"}</p>
            <p><strong>Fuerza Mínima Requerida:</strong> ${datos.str_minimum || "Ninguna"}</p>
            <p><strong>Desventaja en Pruebas de Sigilo:</strong> ${datos.stealth_disadvantage ? "Sí" : "No"}</p>
            <p><strong>Peso:</strong> ${datos.weight || "Desconocido"} libras</p>
            <p><strong>Coste:</strong> ${datos.cost?.quantity || "?"} ${datos.cost?.unit || "monedas"}</p>
        `

    // Inserta el HTML generado en el contenedor
    infoContainer.innerHTML = infoArmaduraHTML
  } catch (error) {
    // Muestra un error si falla la solicitud
    console.error("❌ Error al obtener detalles de armadura: ", error)
    infoContainer.innerHTML = '<div class="error">Los pergaminos sobre esta armadura se han perdido...</div>'
  }
}

// =====================================================================
// FUNCIONES PARA ARMAS
// =====================================================================
// Estas funciones gestionan la carga, filtrado y visualización de
// armas según las proficiencias de cada clase.
// =====================================================================

// Función para cargar únicamente las armas desde la categoría 'weapon'
export async function cargarOpcionesArmas(selectId) {
  try {
    // Primero intentamos recuperar del localStorage para evitar llamadas innecesarias
    const armasCacheadas = localStorage.getItem("dnd_cache_armas")

    if (armasCacheadas) {
      console.log("⚔️ Usando armas en caché")
      try {
        todasArmas = JSON.parse(armasCacheadas)
      } catch (e) {
        console.error("❌ Error al parsear armas cacheadas:", e)
        todasArmas = []
      }
    } else {
      // Si no hay caché, hacemos la solicitud a la API
      console.log("🌐 Cargando armas desde API")
      try {
        const respuesta = await fetch(`${URL}/equipment-categories/weapon`)

        if (!respuesta.ok) {
          throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
        }

        const datos = await respuesta.json()

        // Guardamos todas las armas para futuros filtros
        todasArmas = datos.equipment || []

        // Guardamos en localStorage para futuras visitas
        // Pero primero verificamos el tamaño para no exceder límites
        const datosJSON = JSON.stringify(todasArmas)
        const tamanoBytes = new Blob([datosJSON]).size

        if (tamanoBytes < 500000) {
          // Limitamos a 500KB
          localStorage.setItem("dnd_cache_armas", datosJSON)
        } else {
          console.warn("⚠️ Lista de armas demasiado grande para localStorage")
        }
      } catch (error) {
        console.error("❌ Error al obtener armas de la API:", error)
        todasArmas = []
      }
    }

    // Limpia el <select> dejando solo una opción vacía
    const select = document.getElementById(selectId)
    if (select) {
      select.innerHTML = '<option value="">Selecciona un arma</option>'
    }
  } catch (error) {
    // Muestra un error en consola si algo sale mal
    console.error(`❌ Error al cargar armas: `, error)
  }
}

// Función para filtrar armas según la clase seleccionada
export async function filtrarArmasPorClase(claseIndex, cacheSystem) {
  const selectArma = document.getElementById("weapon")
  if (!selectArma) return

  // Limpia el <select> dejando solo la opción vacía
  selectArma.innerHTML = '<option value="">Selecciona un arma</option>'

  // Si no hay clase seleccionada, sale de la función
  if (!claseIndex) return

  // Obtiene las categorías de armas permitidas para esa clase
  const categoriasPermitidas = proficienciasArmasClase[claseIndex] || []

  // Si no hay categorías permitidas, desactiva el <select>
  if (categoriasPermitidas.length === 0) {
    selectArma.disabled = true
    selectArma.innerHTML = '<option value="">No proficiente en armas</option>'
    return
  }

  // Activa el <select> si hay categorías permitidas
  selectArma.disabled = false

  // Verificamos si ya tenemos los detalles de las armas en caché
  const cacheKey = `armas_clase_${claseIndex}`
  const armasClaseCacheadas = localStorage.getItem(cacheKey)

  if (armasClaseCacheadas) {
    // Si tenemos los datos en caché, los usamos directamente
    console.log(`⚔️ Usando armas filtradas en caché para clase ${claseIndex}`)
    try {
      const armasCache = JSON.parse(armasClaseCacheadas)

      // Agregamos las armas al select
      armasCache.forEach((arma) => {
        const option = document.createElement("option")
        option.value = arma.index
        option.textContent = arma.name
        selectArma.appendChild(option)
      })

      return
    } catch (e) {
      console.error("❌ Error al parsear armas cacheadas para clase:", e)
      // Si hay error, continuamos con el proceso normal
    }
  }

  // Mostramos que estamos cargando
  selectArma.innerHTML = '<option value="">Cargando armas...</option>'

  // Lista que contendrá las armas filtradas
  const armasPermitidas = []

  // Verificamos si tenemos armas para filtrar
  if (todasArmas.length === 0) {
    selectArma.innerHTML = '<option value="">No hay armas disponibles</option>'
    return
  }

  // Si no hay caché, procesamos todas las armas
  console.log(`🔍 Filtrando armas para clase ${claseIndex}`)

  // Recorre todas las armas para obtener sus detalles individuales
  for (const arma of todasArmas) {
    try {
      let detallesArma

      // Verificamos si ya tenemos los detalles de esta arma
      if (detallesEquipamiento.has(arma.index)) {
        detallesArma = detallesEquipamiento.get(arma.index)
      } else if (cacheSystem) {
        // Si tenemos sistema de caché, lo usamos
        detallesArma = await cacheSystem.obtenerDetalle("equipment", arma.index)
        // Guardamos los detalles para futuras consultas
        detallesEquipamiento.set(arma.index, detallesArma)
      } else {
        // Si no los tenemos, hacemos la petición
        const respuesta = await fetch(`${URL}/equipment/${arma.index}`)

        if (!respuesta.ok) {
          throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
        }

        detallesArma = await respuesta.json()

        // Guardamos los detalles para futuras consultas
        detallesEquipamiento.set(arma.index, detallesArma)
      }

      // Obtiene la categoría del arma en minúsculas
      const categoriaArma = detallesArma.weapon_category?.toLowerCase()

      // Verifica si hay armas específicas permitidas por nombre (como las de bardos o pícaros)
      const esArmaEspecificaPermitida = categoriasPermitidas.some((cat) =>
        detallesArma.name.toLowerCase().includes(cat),
      )

      // Si la categoría está permitida o el nombre coincide con una arma específica, se guarda
      if (categoriasPermitidas.includes(categoriaArma) || esArmaEspecificaPermitida) {
        armasPermitidas.push(arma)
      }
    } catch (error) {
      // Muestra error si falla la obtención de detalles de un arma
      console.error(`❌ Error al obtener detalles de arma para ${arma.index}: `, error)
    }
  }

  // Limpiamos el select para quitar el mensaje de carga
  selectArma.innerHTML = '<option value="">Selecciona un arma</option>'

  // Verificamos si encontramos armas permitidas
  if (armasPermitidas.length === 0) {
    selectArma.innerHTML = '<option value="">No hay armas disponibles</option>'
    selectArma.disabled = true
    return
  }

  // Guardamos las armas filtradas en localStorage para esta clase
  // Pero primero verificamos el tamaño para no exceder límites
  try {
    const datosJSON = JSON.stringify(armasPermitidas)
    const tamanoBytes = new Blob([datosJSON]).size

    if (tamanoBytes < 100000) {
      // Limitamos a 100KB
      localStorage.setItem(cacheKey, datosJSON)
    }
  } catch (e) {
    console.warn("⚠️ Error al guardar armas filtradas en caché:", e)
  }

  // Agrega las armas filtradas al <select>
  armasPermitidas.forEach((arma) => {
    const option = document.createElement("option")
    option.value = arma.index
    option.textContent = arma.name
    selectArma.appendChild(option)
  })
}

// Función para mostrar los detalles del arma seleccionada
export async function mostrarDetallesArma(armaIndex, cache) {
  if (!armaIndex) return

  const infoContainer = document.getElementById("infoCharacter")
  if (!infoContainer) return

  // Mostramos indicador de carga
  infoContainer.innerHTML = '<div class="loading">Consultando el Manual de Armas...</div>'

  try {
    // Usamos el sistema de caché si está disponible
    let datos
    if (cache) {
      datos = await cache.obtenerDetalle("equipment", armaIndex)
    } else if (detallesEquipamiento.has(armaIndex)) {
      // Si no hay sistema de caché pero tenemos los detalles en nuestro mapa
      datos = detallesEquipamiento.get(armaIndex)
    } else {
      // Si no tenemos los datos, hacemos la petición
      const respuesta = await fetch(`${URL}/equipment/${armaIndex}`)

      if (!respuesta.ok) {
        throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
      }

      datos = await respuesta.json()
      // Guardamos para futuras consultas
      detallesEquipamiento.set(armaIndex, datos)
    }

    // Verificamos que tengamos datos válidos
    if (!datos || Object.keys(datos).length === 0) {
      throw new Error("No se pudieron obtener datos del arma")
    }

    // Crea el HTML con los detalles del arma
    const infoArmaHTML = `
            <h2>${datos.name}</h2>
            <p><strong>Categoría:</strong> ${datos.weapon_category || "Desconocida"}</p>
            <p><strong>Alcance:</strong> ${datos.range?.normal || "Cuerpo a cuerpo"} ${datos.range?.long ? `/ ${datos.range.long} a distancia` : ""}</p>
            <p><strong>Daño:</strong> ${datos.damage?.damage_dice || "Varía"} (${datos.damage?.damage_type?.name || "Desconocido"})</p>
            <p><strong>Propiedades:</strong> ${datos.properties?.map((p) => p.name).join(", ") || "Ninguna"}</p>
            <p><strong>Peso:</strong> ${datos.weight || "Desconocido"} libras</p>
            <p><strong>Coste:</strong> ${datos.cost?.quantity || "?"} ${datos.cost?.unit || "monedas"}</p>
        `

    // Inserta el HTML en el contenedor correspondiente
    infoContainer.innerHTML = infoArmaHTML
  } catch (error) {
    // Muestra error si falla la solicitud
    console.error("❌ Error al obtener detalles del arma: ", error)
    infoContainer.innerHTML = '<div class="error">Los pergaminos sobre esta arma se han perdido...</div>'
  }
}
