// =====================================================================
// MÓDULO DE GESTIÓN DE ATRIBUTOS
// =====================================================================
// Este módulo se encarga de gestionar el sistema de puntos de atributos
// para la creación de personajes, permitiendo al usuario distribuir
// un número limitado de puntos entre los diferentes atributos.
// =====================================================================

import { atributosBaseRaza, atributosRecomendadosClase } from "./diccionarios.js"

// Configuración del sistema de atributos
const configAtributos = {
  // Puntos totales que el usuario puede distribuir
  PUNTOS_TOTALES: 10,
  // Valor mínimo para cada atributo
  MIN_VALOR: 8,
  // Valor máximo para cada atributo
  MAX_VALOR: 18,
}

// Objeto para almacenar el estado actual de los atributos
const estadoAtributos = {
  // Puntos disponibles para distribuir
  puntosDisponibles: configAtributos.PUNTOS_TOTALES,
  // Valores actuales de cada atributo
  valores: {
    force: configAtributos.MIN_VALOR,
    dexterity: configAtributos.MIN_VALOR,
    constitution: configAtributos.MIN_VALOR,
    intelligence: configAtributos.MIN_VALOR,
    wisdom: configAtributos.MIN_VALOR,
    charisma: configAtributos.MIN_VALOR,
  },
  // Bonificaciones raciales aplicadas
  bonificaciones: {
    force: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  },
}

// Función para inicializar el sistema de atributos
export function inicializarSistemaAtributos() {
  // Reiniciamos los valores a los mínimos
  Object.keys(estadoAtributos.valores).forEach((atributo) => {
    estadoAtributos.valores[atributo] = configAtributos.MIN_VALOR
  })

  // Reiniciamos las bonificaciones
  Object.keys(estadoAtributos.bonificaciones).forEach((atributo) => {
    estadoAtributos.bonificaciones[atributo] = 0
  })

  // Reiniciamos los puntos disponibles
  estadoAtributos.puntosDisponibles = configAtributos.PUNTOS_TOTALES

  // Actualizamos la interfaz
  actualizarInterfazAtributos()

  // Deshabilitamos todos los botones de atributos inicialmente
  deshabilitarBotonesAtributos()
}

// Añadir función para deshabilitar todos los botones de atributos
function deshabilitarBotonesAtributos() {
  Object.keys(estadoAtributos.valores).forEach((atributo) => {
    const btnIncrementar = document.getElementById(`btn-inc-${atributo}`)
    const btnDecrementar = document.getElementById(`btn-dec-${atributo}`)

    if (btnIncrementar) btnIncrementar.disabled = true
    if (btnDecrementar) btnDecrementar.disabled = true
  })
}

// Modificar verificarHabilitacionAtributos para mostrar/ocultar el mensaje
export function verificarHabilitacionAtributos() {
  const razaSeleccionada = document.getElementById("races").value
  const claseSeleccionada = document.getElementById("classes").value

  // Solo habilitamos los botones si se han seleccionado tanto raza como clase
  const habilitarBotones = razaSeleccionada && claseSeleccionada

  // Mostrar u ocultar el mensaje informativo
  const mensajeAtributos = document.getElementById("atributos-mensaje")
  if (mensajeAtributos) {
    if (habilitarBotones) {
      mensajeAtributos.classList.add("oculto")
    } else {
      mensajeAtributos.classList.remove("oculto")
    }
  }

  if (habilitarBotones) {
    // Actualizamos la interfaz para habilitar los botones según corresponda
    actualizarInterfazAtributos()
  } else {
    // Si falta alguna selección, deshabilitamos todos los botones
    deshabilitarBotonesAtributos()
  }
}

// Función para aplicar bonificaciones raciales
export function aplicarBonificacionesRaciales(raza) {
  // Si no hay raza seleccionada o no existe en el diccionario, no hacemos nada
  if (!raza || !atributosBaseRaza[raza]) return

  // Obtenemos las bonificaciones para la raza seleccionada
  const bonificaciones = atributosBaseRaza[raza]

  // Aplicamos las bonificaciones
  Object.keys(bonificaciones).forEach((atributo) => {
    estadoAtributos.bonificaciones[atributo] = bonificaciones[atributo]
  })

  // Actualizamos la interfaz
  actualizarInterfazAtributos()
}

// Función para aplicar recomendaciones de clase
export function aplicarRecomendacionesClase(clase) {
  // Si no hay clase seleccionada o no existe en el diccionario, no hacemos nada
  if (!clase || !atributosRecomendadosClase[clase]) return

  // Reiniciamos los valores a los mínimos
  Object.keys(estadoAtributos.valores).forEach((atributo) => {
    estadoAtributos.valores[atributo] = configAtributos.MIN_VALOR
  })

  // Obtenemos las recomendaciones para la clase seleccionada
  const recomendaciones = atributosRecomendadosClase[clase]

  // Calculamos cuántos puntos necesitamos para las recomendaciones
  let puntosNecesarios = 0
  Object.keys(recomendaciones).forEach((atributo) => {
    puntosNecesarios += recomendaciones[atributo]
  })

  // Si tenemos suficientes puntos, aplicamos las recomendaciones
  if (puntosNecesarios <= configAtributos.PUNTOS_TOTALES) {
    Object.keys(recomendaciones).forEach((atributo) => {
      estadoAtributos.valores[atributo] = configAtributos.MIN_VALOR + recomendaciones[atributo]
    })
    estadoAtributos.puntosDisponibles = configAtributos.PUNTOS_TOTALES - puntosNecesarios
  } else {
    // Si no tenemos suficientes puntos, distribuimos proporcionalmente
    estadoAtributos.puntosDisponibles = 0
    const factorAjuste = configAtributos.PUNTOS_TOTALES / puntosNecesarios
    Object.keys(recomendaciones).forEach((atributo) => {
      const puntos = Math.floor(recomendaciones[atributo] * factorAjuste)
      estadoAtributos.valores[atributo] = configAtributos.MIN_VALOR + puntos
    })
  }

  // Actualizamos la interfaz
  actualizarInterfazAtributos()
}

// Función para incrementar un atributo
export function incrementarAtributo(atributo) {
  // Si no hay puntos disponibles o el atributo ya está al máximo, no hacemos nada
  if (estadoAtributos.puntosDisponibles <= 0 || estadoAtributos.valores[atributo] >= configAtributos.MAX_VALOR)
    return false

  // Incrementamos el valor del atributo
  estadoAtributos.valores[atributo]++
  // Decrementamos los puntos disponibles
  estadoAtributos.puntosDisponibles--

  // Actualizamos la interfaz
  actualizarInterfazAtributos()
  return true
}

// Función para decrementar un atributo
export function decrementarAtributo(atributo) {
  // Si el atributo ya está al mínimo, no hacemos nada
  if (estadoAtributos.valores[atributo] <= configAtributos.MIN_VALOR) return false

  // Decrementamos el valor del atributo
  estadoAtributos.valores[atributo]--
  // Incrementamos los puntos disponibles
  estadoAtributos.puntosDisponibles++

  // Actualizamos la interfaz
  actualizarInterfazAtributos()
  return true
}

// Función para obtener el valor total de un atributo (base + bonificación)
export function obtenerValorTotalAtributo(atributo) {
  return estadoAtributos.valores[atributo] + estadoAtributos.bonificaciones[atributo]
}

// Función para obtener el modificador de un atributo
export function obtenerModificadorAtributo(atributo) {
  const valorTotal = obtenerValorTotalAtributo(atributo)
  return Math.floor((valorTotal - 10) / 2)
}

// Función para obtener todos los valores de atributos para guardar
export function obtenerValoresAtributos() {
  const resultado = {}
  Object.keys(estadoAtributos.valores).forEach((atributo) => {
    resultado[atributo] = obtenerValorTotalAtributo(atributo)
  })
  return resultado
}

// Función para actualizar la interfaz de atributos
function actualizarInterfazAtributos() {
  // Verificamos si se han seleccionado raza y clase
  const razaSeleccionada = document.getElementById("races").value
  const claseSeleccionada = document.getElementById("classes").value
  const habilitarBotones = razaSeleccionada && claseSeleccionada

  // Actualizamos el contador de puntos disponibles
  const contadorPuntos = document.getElementById("puntos-disponibles")
  if (contadorPuntos) {
    contadorPuntos.textContent = estadoAtributos.puntosDisponibles
  }

  // Actualizamos los valores y modificadores de cada atributo
  Object.keys(estadoAtributos.valores).forEach((atributo) => {
    // Actualizamos el valor base
    const inputAtributo = document.getElementById(atributo)
    if (inputAtributo) {
      inputAtributo.value = estadoAtributos.valores[atributo]
    }

    // Actualizamos el valor total (base + bonificación)
    const valorTotal = document.getElementById(`${atributo}-total`)
    if (valorTotal) {
      valorTotal.textContent = obtenerValorTotalAtributo(atributo)
    }

    // Actualizamos el modificador
    const modificador = document.getElementById(`${atributo}-mod`)
    if (modificador) {
      const mod = obtenerModificadorAtributo(atributo)
      modificador.textContent = mod >= 0 ? `+${mod}` : mod
    }

    // Actualizamos la bonificación racial
    const bonificacion = document.getElementById(`${atributo}-bonus`)
    if (bonificacion) {
      const bonus = estadoAtributos.bonificaciones[atributo]
      bonificacion.textContent = bonus > 0 ? `+${bonus}` : bonus === 0 ? "" : bonus
    }

    // Deshabilitamos los botones si es necesario
    const btnIncrementar = document.getElementById(`btn-inc-${atributo}`)
    if (btnIncrementar) {
      btnIncrementar.disabled =
        !habilitarBotones ||
        estadoAtributos.puntosDisponibles <= 0 ||
        estadoAtributos.valores[atributo] >= configAtributos.MAX_VALOR
    }

    const btnDecrementar = document.getElementById(`btn-dec-${atributo}`)
    if (btnDecrementar) {
      btnDecrementar.disabled = !habilitarBotones || estadoAtributos.valores[atributo] <= configAtributos.MIN_VALOR
    }
  })
}

// Función para configurar los eventos de los botones de atributos
export function configurarEventosAtributos() {
  // Configuramos los botones de incrementar
  Object.keys(estadoAtributos.valores).forEach((atributo) => {
    const btnIncrementar = document.getElementById(`btn-inc-${atributo}`)
    if (btnIncrementar) {
      btnIncrementar.addEventListener("click", () => incrementarAtributo(atributo))
    }

    const btnDecrementar = document.getElementById(`btn-dec-${atributo}`)
    if (btnDecrementar) {
      btnDecrementar.addEventListener("click", () => decrementarAtributo(atributo))
    }
  })
}

// Inicializamos el sistema de atributos
document.addEventListener("DOMContentLoaded", () => {
  // Solo inicializamos si estamos en la página de creación de personajes
  if (document.getElementById("form__character")) {
    inicializarSistemaAtributos()
    configurarEventosAtributos()
  }
})
