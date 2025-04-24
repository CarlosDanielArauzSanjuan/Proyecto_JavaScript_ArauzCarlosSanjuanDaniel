// =====================================================================
// MÓDULO DE GESTIÓN DE API Y CACHÉ
// =====================================================================
// Este módulo se encarga de todas las interacciones con la API de D&D 5e,
// implementando un sistema avanzado de caché para minimizar las llamadas
// al servidor y optimizar el rendimiento de la aplicación.
// =====================================================================

// URL base de la API de D&D 5e
const URL = "https://www.dnd5eapi.co/api"

// Importación de imágenes y funciones desde otros módulos
import { imagenRazas, imagenClases } from "./diccionarios.js"
import {
  cargarTodasArmaduras,
  filtrarArmadurasPorClase,
  mostrarDetallesArmadura,
  cargarOpcionesArmas,
  filtrarArmasPorClase,
  mostrarDetallesArma,
} from "./equipamiento.js"

// =====================================================================
// SISTEMA DE CACHÉ AVANZADO
// =====================================================================
// Este sistema implementa múltiples niveles de caché para optimizar
// el rendimiento y reducir las llamadas a la API:
// 1. Caché en memoria (rápida pero temporal)
// 2. Caché en localStorage (persistente entre sesiones)
// 3. Sistema de limpieza automática para evitar sobrecargar el almacenamiento
// =====================================================================

const cache = {
  // Objeto para almacenar datos en memoria durante la sesión actual
  datos: {},

  // Configuración del sistema de caché
  config: {
    // Tamaño máximo permitido en localStorage (en bytes) - 4MB por defecto
    maxSize: 4 * 1024 * 1024,
    // Tiempo de expiración de la caché (en milisegundos) - 1 día por defecto
    expiracion: 24 * 60 * 60 * 1000,
    // Prefijo para las claves en localStorage
    prefijo: "dnd_cache_",
    // Versión de la caché (cambiar si cambia la estructura de datos)
    version: "1.0",
  },

  // Método para obtener datos de la caché o de la API si no existen
  async obtener(endpoint) {
    // Clave única para este endpoint
    const cacheKey = endpoint

    // Si ya tenemos los datos en caché de memoria, los devolvemos directamente
    if (this.datos[cacheKey]) {
      console.log(`🧠 Usando caché en memoria para: ${endpoint}`)
      return this.datos[cacheKey]
    }

    try {
      // Intentamos recuperar del localStorage
      const itemCacheado = this.recuperarDeLocalStorage(cacheKey)

      if (itemCacheado) {
        // Guardamos en memoria para acceso más rápido
        this.datos[cacheKey] = itemCacheado
        console.log(`💾 Usando caché en localStorage para: ${endpoint}`)
        return itemCacheado
      }

      // Si no está en ninguna caché, hacemos la petición a la API
      console.log(`🌐 Petición a API para: ${endpoint}`)

      // Configuramos un timeout para la petición
      const controlador = new AbortController()
      const timeoutId = setTimeout(() => controlador.abort(), 10000) // 10 segundos de timeout

      try {
        const respuesta = await fetch(`${URL}/${endpoint}`, {
          signal: controlador.signal,
        })

        // Limpiamos el timeout
        clearTimeout(timeoutId)

        // Verificamos si la respuesta es exitosa
        if (!respuesta.ok) {
          throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
        }

        const datos = await respuesta.json()

        // Guardamos en caché de memoria
        this.datos[cacheKey] = datos

        // Guardamos en localStorage con control de tamaño
        this.guardarEnLocalStorage(cacheKey, datos)

        return datos
      } catch (fetchError) {
        // Limpiamos el timeout si hubo un error
        clearTimeout(timeoutId)

        // Verificamos si fue un error de timeout
        if (fetchError.name === "AbortError") {
          throw new Error(`Timeout al conectar con la API para ${endpoint}`)
        }

        // Propagamos otros errores
        throw fetchError
      }
    } catch (error) {
      console.error(`❌ Error al obtener ${endpoint}: `, error)

      // Intentamos recuperar datos del localStorage como último recurso
      const datosGuardados = this.recuperarDeLocalStorage(cacheKey)
      if (datosGuardados) {
        console.log(`🔄 Recuperando ${endpoint} desde localStorage tras error`)
        return datosGuardados
      }

      // Si no hay datos en caché, lanzamos el error para que sea manejado por el llamador
      throw error
    }
  },

  // Método para obtener detalles de un ítem específico
  async obtenerDetalle(categoria, index) {
    const cacheKey = `${categoria}_${index}`

    // Si ya tenemos los datos en caché de memoria, los devolvemos directamente
    if (this.datos[cacheKey]) {
      console.log(`🧠 Usando caché en memoria para detalle: ${cacheKey}`)
      return this.datos[cacheKey]
    }

    try {
      // Intentamos recuperar del localStorage
      const itemCacheado = this.recuperarDeLocalStorage(cacheKey)

      if (itemCacheado) {
        // Guardamos en memoria para acceso más rápido
        this.datos[cacheKey] = itemCacheado
        console.log(`💾 Usando caché en localStorage para detalle: ${cacheKey}`)
        return itemCacheado
      }

      // Si no está en ninguna caché, hacemos la petición a la API
      console.log(`🌐 Petición a API para detalle: ${cacheKey}`)
      const respuesta = await fetch(`${URL}/${categoria}/${index}`)

      // Verificamos si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error en la API: ${respuesta.status} ${respuesta.statusText}`)
      }

      const datos = await respuesta.json()

      // Guardamos en caché de memoria
      this.datos[cacheKey] = datos

      // Guardamos en localStorage con control de tamaño
      this.guardarEnLocalStorage(cacheKey, datos)

      return datos
    } catch (error) {
      console.error(`❌ Error al obtener detalle ${cacheKey}: `, error)

      // Intentamos recuperar datos del localStorage como último recurso
      const datosGuardados = this.recuperarDeLocalStorage(cacheKey)
      if (datosGuardados) {
        console.log(`🔄 Recuperando ${cacheKey} desde localStorage tras error`)
        return datosGuardados
      }

      // Si no hay datos en caché, devolvemos un objeto vacío para evitar errores
      return {}
    }
  },

  // Método para guardar datos en localStorage con control de tamaño
  guardarEnLocalStorage(clave, datos) {
    try {
      // Creamos un objeto con metadatos para gestionar expiración y versión
      const objetoCache = {
        datos: datos,
        timestamp: Date.now(),
        version: this.config.version,
      }

      // Convertimos a JSON
      const datosJSON = JSON.stringify(objetoCache)

      // Verificamos el tamaño antes de guardar
      const tamanoBytes = new Blob([datosJSON]).size

      // Si el ítem es demasiado grande, no lo guardamos
      if (tamanoBytes > this.config.maxSize * 0.2) {
        // No más del 20% del máximo para un solo ítem
        console.warn(`⚠️ Ítem demasiado grande para localStorage: ${clave} (${tamanoBytes} bytes)`)
        return false
      }

      // Limpiamos espacio si es necesario
      this.limpiarEspacioSiNecesario(tamanoBytes)

      // Guardamos con el prefijo
      localStorage.setItem(this.config.prefijo + clave, datosJSON)
      return true
    } catch (e) {
      // Si hay error al guardar en localStorage, solo lo ignoramos
      console.warn("⚠️ No se pudo guardar en localStorage:", e)
      return false
    }
  },

  // Método para recuperar datos del localStorage con verificación de expiración
  recuperarDeLocalStorage(clave) {
    try {
      const datosJSON = localStorage.getItem(this.config.prefijo + clave)
      if (!datosJSON) return null

      const objetoCache = JSON.parse(datosJSON)

      // Verificamos versión
      if (objetoCache.version !== this.config.version) {
        console.log(`🔄 Versión de caché obsoleta para ${clave}, eliminando...`)
        localStorage.removeItem(this.config.prefijo + clave)
        return null
      }

      // Verificamos expiración
      const ahora = Date.now()
      if (ahora - objetoCache.timestamp > this.config.expiracion) {
        console.log(`⏱️ Caché expirada para ${clave}, eliminando...`)
        localStorage.removeItem(this.config.prefijo + clave)
        return null
      }

      // Devolvemos los datos si todo está bien
      return objetoCache.datos
    } catch (e) {
      console.warn(`⚠️ Error al recuperar ${clave} de localStorage:`, e)
      return null
    }
  },

  // Método para limpiar espacio en localStorage si es necesario
  limpiarEspacioSiNecesario(tamanoNecesario) {
    try {
      // Calculamos el espacio total usado por nuestra aplicación
      let espacioUsado = 0
      const elementosCache = []

      // Recorremos todos los elementos de localStorage con nuestro prefijo
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.config.prefijo)) {
          const valor = localStorage.getItem(key)
          const tamano = new Blob([valor]).size
          espacioUsado += tamano

          // Guardamos información para posible eliminación
          try {
            const datos = JSON.parse(valor)
            elementosCache.push({
              key: key,
              tamano: tamano,
              timestamp: datos.timestamp || 0,
            })
          } catch (e) {
            // Si no podemos parsear, simplemente lo añadimos sin timestamp
            elementosCache.push({
              key: key,
              tamano: tamano,
              timestamp: 0,
            })
          }
        }
      }

      // Si el espacio usado más el nuevo ítem supera el límite, eliminamos elementos
      if (
        espacioUsado + tamanoNecesario > this.config.maxSize ||
        elementosCache.length > 100 // Limitamos también por número de elementos
      ) {
        console.warn(`⚠️ Limpiando caché para liberar espacio. Usado: ${espacioUsado} bytes`)

        // Ordenamos por antigüedad (más antiguos primero)
        elementosCache.sort((a, b) => a.timestamp - b.timestamp)

        // Eliminamos elementos hasta tener suficiente espacio
        let espacioLiberado = 0
        for (const elemento of elementosCache) {
          localStorage.removeItem(elemento.key)
          espacioLiberado += elemento.tamano
          console.log(`🗑️ Eliminado ${elemento.key} (${elemento.tamano} bytes)`)

          // Si ya liberamos suficiente espacio, paramos
          if (espacioUsado - espacioLiberado + tamanoNecesario < this.config.maxSize * 0.8) {
            break
          }
        }
      }
    } catch (e) {
      console.warn("⚠️ Error al limpiar espacio en localStorage:", e)
    }
  },

  // Método para limpiar toda la caché (útil para depuración o reinicio)
  limpiarCache() {
    // Limpiamos la caché en memoria
    this.datos = {}

    // Limpiamos la caché en localStorage (solo nuestros elementos)
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.config.prefijo)) {
          localStorage.removeItem(key)
        }
      }
      console.log("🧹 Caché limpiada completamente")
    } catch (e) {
      console.error("❌ Error al limpiar caché:", e)
    }
  },

  // Inicializar caché desde localStorage al cargar la página
  inicializar() {
    console.log("🔄 Inicializando sistema de caché...")

    // Verificamos el espacio disponible
    try {
      let espacioUsado = 0
      let elementosExpirados = 0

      // Recorremos todos los elementos de localStorage con nuestro prefijo
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.config.prefijo)) {
          try {
            const valor = localStorage.getItem(key)
            espacioUsado += new Blob([valor]).size

            // Verificamos si está expirado
            const datos = JSON.parse(valor)
            if (Date.now() - datos.timestamp > this.config.expiracion || datos.version !== this.config.version) {
              localStorage.removeItem(key)
              elementosExpirados++
            }
          } catch (e) {
            // Si hay error al procesar, eliminamos el elemento
            localStorage.removeItem(key)
          }
        }
      }

      console.log(
        `📊 Caché inicializada: ${espacioUsado} bytes usados, ${elementosExpirados} elementos expirados eliminados`,
      )
    } catch (e) {
      console.warn("⚠️ Error al inicializar caché:", e)
    }
  },
}

// Inicializamos la caché al cargar
cache.inicializar()

// =====================================================================
// CARGA INICIAL DE DATOS
// =====================================================================
// Esta sección se encarga de cargar todos los datos necesarios cuando
// la página se carga inicialmente, utilizando carga paralela para
// optimizar el tiempo de respuesta.
// =====================================================================

// Evento principal: cuando el DOM está listo, se cargan las opciones en los select
document.addEventListener("DOMContentLoaded", async () => {
  // Función para mostrar/ocultar el indicador de carga
  const toggleLoadingIndicator = (show) => {
    const loadingStatus = document.getElementById("loading-status")
    if (loadingStatus) {
      if (show) {
        loadingStatus.classList.add("active")
      } else {
        loadingStatus.classList.remove("active")
      }
    }
  }

  // Añadimos botón para limpiar caché (útil para depuración)
  const header = document.querySelector("header")
  if (header) {
    const limpiarCacheBtn = document.createElement("button")
    limpiarCacheBtn.textContent = "🧹 Limpiar Caché"
    limpiarCacheBtn.className = "btn-limpiar-cache"
    limpiarCacheBtn.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas limpiar toda la caché? Esto ralentizará la próxima carga.")) {
        cache.limpiarCache()
        alert("Caché limpiada. Recarga la página para ver los cambios.")
      }
    })
    header.appendChild(limpiarCacheBtn)
  }

  // Verificamos si estamos en la página de creación de personajes
  const formPersonaje = document.getElementById("form__character")
  if (!formPersonaje) {
    console.log("No estamos en la página de creación de personajes, no se cargarán las opciones.")
    return
  }

  // Mostramos el indicador de carga
  toggleLoadingIndicator(true)

  // Mostramos un indicador de carga en el contenedor de información
  const infoContainer = document.getElementById("infoCharacter")
  if (infoContainer) {
    infoContainer.innerHTML = '<div class="loading">Cargando datos del grimorio arcano...</div>'
  }

  // Cargamos todas las opciones con sistema de reintentos
  try {
    console.time("⏱️ Tiempo de carga inicial")

    // Función para reintentar una operación
    const conReintentos = async (fn, maxIntentos = 3) => {
      let ultimoError
      for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
          return await fn()
        } catch (error) {
          console.warn(`Intento ${intento}/${maxIntentos} fallido:`, error)
          ultimoError = error
          // Esperar un poco antes de reintentar (tiempo exponencial)
          if (intento < maxIntentos) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * intento))
          }
        }
      }
      throw ultimoError // Si todos los intentos fallan, lanzamos el último error
    }

    // Cargamos cada tipo de datos con reintentos
    await Promise.all([
      conReintentos(() => cargarOpciones("races", "races")),
      conReintentos(() => cargarOpciones("classes", "classes")),
      conReintentos(() => cargarOpciones("spells", "ability")),
      conReintentos(() => cargarTodasArmaduras("armor")),
      conReintentos(() => cargarOpcionesArmas("weapon")),
      conReintentos(() => cargarOpcionesAccesorios("accessories")),
    ])

    console.timeEnd("⏱️ Tiempo de carga inicial")
    console.log("✅ Todas las opciones cargadas correctamente")

    // Ocultamos el indicador de carga
    toggleLoadingIndicator(false)

    // Limpiamos el contenedor de información
    if (infoContainer) {
      infoContainer.innerHTML = ""
    }
  } catch (error) {
    console.error("❌ Error en la carga inicial:", error)

    // Ocultamos el indicador de carga
    toggleLoadingIndicator(false)

    // Mensaje de error más detallado
    if (infoContainer) {
      infoContainer.innerHTML = `
        <div class="error">
          <h3>¡Por las barbas de Moradin!</h3>
          <p>Ha ocurrido un error al consultar el grimorio arcano. Los pergaminos parecen estar dañados.</p>
          <p>Detalles técnicos: ${error.message || "Error desconocido"}</p>
          <button onclick="window.location.reload()" class="btn">Reintentar</button>
        </div>
      `
    } else {
      alert("Ha ocurrido un error al cargar los datos. Por favor, recarga la página.")
    }
  }
})

// =====================================================================
// FUNCIONES DE CARGA DE DATOS
// =====================================================================
// Estas funciones se encargan de obtener datos de la API o caché
// y llenar los elementos select correspondientes en la interfaz.
// =====================================================================

// Función genérica para cargar datos desde un endpoint de la API y llenar un <select>
async function cargarOpciones(endpoint, selectId) {
  try {
    // Verificamos primero si el elemento select existe
    const select = document.getElementById(selectId)
    if (!select) {
      console.warn(`⚠️ No se encontró el elemento select con id ${selectId}`)
      return
    }

    // Añadimos un indicador de carga al select
    select.disabled = true
    const opcionOriginal = select.innerHTML
    select.innerHTML = '<option value="">Cargando opciones...</option>'

    // Usamos el sistema de caché para obtener los datos
    const datos = await cache.obtener(endpoint)

    // Verificamos que los datos tengan el formato esperado
    if (!datos || !datos.results || !Array.isArray(datos.results)) {
      console.warn(`⚠️ Formato de datos inesperado para ${endpoint}:`, datos)
      // Restauramos el select a su estado original
      select.innerHTML = opcionOriginal
      select.disabled = false
      return
    }

    // Limpiamos el select y añadimos la opción por defecto
    select.innerHTML = `<option value="">Selecciona ${
      selectId === "races"
        ? "tu raza"
        : selectId === "classes"
          ? "tu clase"
          : selectId === "ability"
            ? "tu don arcano"
            : selectId === "armor"
              ? "tu armadura"
              : selectId === "weapon"
                ? "tu arma"
                : "una opción"
    }</option>`

    // Llenamos el select con las opciones devueltas por la API
    datos.results.forEach((item) => {
      const option = document.createElement("option")
      option.value = item.index
      option.textContent = item.name
      select.appendChild(option)
    })

    // Habilitamos el select nuevamente
    select.disabled = false

    console.log(`✅ Opciones de ${endpoint} cargadas correctamente (${datos.results.length} items)`)
  } catch (error) {
    console.error(`❌ Error al cargar ${selectId}: `, error)

    // Restauramos el select a un estado utilizable
    const select = document.getElementById(selectId)
    if (select) {
      select.innerHTML = `<option value="">Error al cargar opciones</option>`
      select.disabled = false
    }

    // Propagamos el error para que pueda ser manejado por el llamador
    throw new Error(`Error al cargar opciones de ${endpoint}: ${error.message}`)
  }
}

// Carga accesorios desde el endpoint 'adventuring-gear'
async function cargarOpcionesAccesorios(selectId) {
  try {
    // Usamos el sistema de caché para obtener los datos
    const datos = await cache.obtener("equipment-categories/adventuring-gear")
    const select = document.getElementById(selectId)

    if (!select) {
      console.warn(`⚠️ No se encontró el elemento select con id ${selectId}`)
      return
    }

    // Añade cada accesorio como una opción en el select
    if (datos.equipment && Array.isArray(datos.equipment)) {
      datos.equipment.forEach((item) => {
        const option = document.createElement("option")
        option.value = item.index
        option.textContent = item.name
        select.appendChild(option)
      })
    } else {
      console.warn("⚠️ Formato de datos inesperado para accesorios:", datos)
    }
  } catch (error) {
    console.error(`❌ Error al cargar accesorios: `, error)
  }
}

// =====================================================================
// EVENTOS DE INTERFAZ DE USUARIO
// =====================================================================
// Esta sección maneja los eventos de la interfaz, como la selección
// de razas, clases, armaduras y armas, mostrando la información
// correspondiente y filtrando opciones según sea necesario.
// =====================================================================

// Evento: al seleccionar una raza, se muestra su información
const razasSelect = document.getElementById("races")
if (razasSelect) {
  razasSelect.addEventListener("change", async (event) => {
    const razaIndex = event.target.value
    // Obtiene la imagen correspondiente a la raza o usa la predeterminada
    const imagenSrc = imagenRazas[razaIndex] || imagenRazas["default"]

    if (!razaIndex) return // Si no hay selección, no hace nada

    try {
      // Mostramos indicador de carga
      const infoContainer = document.getElementById("infoCharacter")
      if (infoContainer) {
        infoContainer.innerHTML = '<div class="loading">Consultando los pergaminos antiguos...</div>'
      }

      // Usamos el sistema de caché para obtener los detalles de la raza
      const datos = await cache.obtenerDetalle("races", razaIndex)

      // Verificamos que tengamos datos válidos
      if (!datos || Object.keys(datos).length === 0) {
        throw new Error("No se pudieron obtener datos de la raza")
      }

      // HTML con la información de la raza seleccionada
      const infoRazaHTML = `
              <img src="${imagenSrc}" alt="${datos.name}" class="race-image" />
              <h2>${datos.name}</h2>
              <p><strong>Velocidad:</strong> ${datos.speed} pies por turno</p>
              <p><strong>Alineamiento:</strong> ${datos.alignment}</p>
              <p><strong>Longevidad:</strong> ${datos.age}</p>
              <p><strong>Tamaño:</strong> ${datos.size}</p>
              <p><strong>Descripción física:</strong> ${datos.size_description}</p>
              <p><strong>Idiomas:</strong> ${datos.language_desc}</p>
          `

      // Muestra la información en el panel lateral
      if (infoContainer) {
        infoContainer.innerHTML = infoRazaHTML
      }
    } catch (error) {
      console.error("❌ Error al obtener detalles de la raza: ", error)
      // Mostramos mensaje de error
      const infoContainer = document.getElementById("infoCharacter")
      if (infoContainer) {
        infoContainer.innerHTML =
          '<div class="error">Los pergaminos de esta raza se han perdido en las brumas del tiempo...</div>'
      }
    }
  })
}

// Evento: al seleccionar una clase, se muestra su información y se filtran armas y armaduras
const clasesSelect = document.getElementById("classes")
if (clasesSelect) {
  clasesSelect.addEventListener("change", async (event) => {
    const claseIndex = event.target.value
    // Obtiene la imagen correspondiente a la clase o usa la predeterminada
    const imagenSrc = imagenClases[claseIndex] || imagenClases["default"]

    if (!claseIndex) return // Si no hay selección, no hace nada

    try {
      // Mostramos indicador de carga
      const infoContainer = document.getElementById("infoCharacter")
      if (infoContainer) {
        infoContainer.innerHTML = '<div class="loading">Consultando los tomos de conocimiento arcano...</div>'
      }

      // Usamos el sistema de caché para obtener los detalles de la clase
      const datos = await cache.obtenerDetalle("classes", claseIndex)

      // Verificamos que tengamos datos válidos
      if (!datos || Object.keys(datos).length === 0) {
        throw new Error("No se pudieron obtener datos de la clase")
      }

      // HTML con la información de la clase seleccionada
      const infoClaseHTML = `
              <img src="${imagenSrc}" alt="${datos.name}" class="race-image" />
              <h2>${datos.name}</h2>
              <p><strong>Dado de Golpe:</strong> d${datos.hit_die}</p>
              <p><strong>Competencias:</strong> ${datos.proficiencies ? datos.proficiencies.map((p) => p.name).join(", ") : "Ninguna"}</p>
              <p><strong>Tiradas de Salvación:</strong> ${datos.saving_throws ? datos.saving_throws.map((s) => s.name).join(", ") : "Ninguna"}</p>
          `

      // Muestra la información en el panel lateral
      if (infoContainer) {
        infoContainer.innerHTML = infoClaseHTML
      }

      // Se filtran las armaduras y armas según la clase elegida
      filtrarArmadurasPorClase(claseIndex, cache)
      filtrarArmasPorClase(claseIndex, cache)
    } catch (error) {
      console.error("❌ Error al obtener detalles de la clase: ", error)
      // Mostramos mensaje de error
      const infoContainer = document.getElementById("infoCharacter")
      if (infoContainer) {
        infoContainer.innerHTML =
          '<div class="error">Los secretos de esta clase han sido sellados por los dioses...</div>'
      }
    }
  })
}

// Evento: al seleccionar una armadura, se muestra su detalle
const armorSelect = document.getElementById("armor")
if (armorSelect) {
  armorSelect.addEventListener("change", async (event) => {
    const armaduraIndex = event.target.value
    mostrarDetallesArmadura(armaduraIndex, cache) // Pasamos el sistema de caché
  })
}

// Evento: al seleccionar un arma, se muestra su detalle
const weaponSelect = document.getElementById("weapon")
if (weaponSelect) {
  weaponSelect.addEventListener("change", async (event) => {
    const armaIndex = event.target.value
    mostrarDetallesArma(armaIndex, cache) // Pasamos el sistema de caché
  })
}

// Exportamos el sistema de caché para que pueda ser usado por otros módulos
export { cache }
