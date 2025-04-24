// =====================================================================
// MÓDULO PRINCIPAL DE LA APLICACIÓN
// =====================================================================
// Este módulo controla la experiencia inicial del usuario, incluyendo
// el modal de introducción y el sistema de diálogos RPG que introduce
// al usuario en el mundo de Dungeons & Dragons.
// =====================================================================

// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // =====================================================================
    // CONFIGURACIÓN DEL MODAL DE INTRODUCCIÓN
    // =====================================================================
    // El modal de bienvenida es lo primero que ve el usuario al entrar
    // en la aplicación. Proporciona una introducción temática al mundo
    // de Dungeons & Dragons.
    // =====================================================================
  
    const modal = document.getElementById("introModal") // Obtiene el elemento modal
    const closeButton = document.getElementById("closeModal") // Obtiene el botón para cerrar el modal
  
    // Mostrar el modal automáticamente al cargar la página
    if (modal) {
      modal.style.display = "block"
    }
  
    // Cerrar el modal al hacer clic en el botón y mostrar el primer diálogo
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        modal.style.display = "none" // Oculta el modal
        showDialog(0) // Muestra el primer diálogo
      })
    }
  
    // =====================================================================
    // CONFIGURACIÓN DEL SISTEMA DE DIÁLOGOS RPG
    // =====================================================================
    // Este sistema simula una conversación RPG con personajes del mundo
    // de D&D que introducen al usuario en los conceptos básicos del juego.
    // =====================================================================
  
    const dialogContainer = document.getElementById("conversation-container") // Contenedor de diálogos
    const prevButton = document.getElementById("prevDialog") // Botón para diálogo anterior
    const nextButton = document.getElementById("nextDialog") // Botón para siguiente diálogo
    const navigationContainer = document.getElementById("navigation") // Contenedor de navegación
  
    // Solo continuamos si estamos en la página correcta con los elementos necesarios
    if (!dialogContainer || !navigationContainer) return
  
    // Crear botón para saltar todos los diálogos
    const skipAllButton = document.createElement("button")
    skipAllButton.id = "skipAll"
    skipAllButton.textContent = "Saltar la Narración"
    skipAllButton.title = "Saltar directamente al final de la historia"
    navigationContainer.prepend(skipAllButton) // Añade el botón al inicio del contenedor de navegación
  
    // Crear botón para continuar a la página principal
    const continueButton = document.createElement("button")
    continueButton.id = "continueToMain"
    continueButton.textContent = "Comenzar la Aventura"
    continueButton.title = "Continuar a la creación de personajes"
    continueButton.style.display = "none" // Inicialmente oculto
    document.querySelector("main")?.appendChild(continueButton) // Añade el botón al final del main
  
    let currentDialogIndex = 0 // Índice del diálogo actual
  
    // =====================================================================
    // DIÁLOGOS DEL SISTEMA RPG
    // =====================================================================
    // Estos diálogos presentan información sobre D&D a través de personajes
    // icónicos del universo. Cada diálogo tiene un hablante, texto y avatar.
    // =====================================================================
  
    // Array de diálogos en formato RPG con terminología propia de D&D
    const dialogs = [
      {
        speaker: "Archimago Elminster de Aguasombría",
        text: "¡Saludos, viajero de los Reinos! Soy Elminster, Elegido de Mystra y guardián del conocimiento arcano. Seré vuestro guía en este viaje a través de los secretos de Dungeons & Dragons.",
        avatar: "mago",
      },
      {
        speaker: "Archimago Elminster de Aguasombría",
        text: "Dungeons & Dragons, o D&D como lo conocen los aventureros de Faerûn, es el juego de rol de mesa más emblemático jamás creado. Desde la Era de los Trastornos, ha permitido a millones de jugadores crear sagas épicas en los infinitos planos de existencia.",
        avatar: "mago",
      },
      {
        speaker: "Lady Alustriel Plateada",
        text: "En los Reinos Olvidados, cada aventurero es definido por su linaje, como nosotros los humanos de Aguas Profundas, los nobles elfos de Evermeet, los robustos enanos de Mithral Hall o los intrépidos medianos del Valle del Viento Helado.",
        avatar: "noble",
      },
      {
        speaker: "Sir Valorian Escudoférreo",
        text: "También por su vocación, que determina sus artes de combate. Podéis ser un guerrero como yo, un mago como Elminster, un clérigo que canaliza el poder divino de los Dioses, o un pícaro experto en las artes del sigilo y la trampa.",
        avatar: "guerrero",
      },
      {
        speaker: "Archimago Elminster de Aguasombría",
        text: "En este grimorio arcano encontraréis conocimiento sobre las diversas razas que pueblan los Reinos, desde los orgullosos aasimar hasta los temidos tieflings con sangre infernal.",
        avatar: "mago",
      },
      {
        speaker: "Lady Alustriel Plateada",
        text: "También conoceréis las clases y sus dones, desde el poder arcano de los magos de la Alta Torre hasta la furia primigenia de los bárbaros de las Tierras del Hielo Eterno.",
        avatar: "noble",
      },
      {
        speaker: "Durnan el Tabernero",
        text: "Por las barbas de Moradin, no olvidéis revisar nuestra sección de equipo. Desde la más sencilla daga hasta la legendaria Blackrazor, todo aventurero necesita herramientas adecuadas para sobrevivir en las Tierras Salvajes.",
        avatar: "tabernero",
      },
      {
        speaker: "Archimago Elminster de Aguasombría",
        text: "Los hechizos son el tejido mismo de la magia. En nuestro grimorio encontraréis desde simples trucos de prestidigitación hasta los poderosos conjuros de nivel 9 como Deseo o Tormenta de Meteoritos.",
        avatar: "mago",
      },
      {
        speaker: "Volothamp Geddarm",
        text: "¡Y no olvidéis mi Compendio de Monstruos! He documentado desde los más comunes goblins de las Montañas Nubladas hasta los temibles dragones cromáticos, pasando por aberraciones del Lejano Reino y no-muertos de Thay.",
        avatar: "bardo",
      },
      {
        speaker: "Archimago Elminster de Aguasombría",
        text: "Ya seáis un veterano de las Guerras de la Corona o un novato que apenas ha escuchado hablar de un d20, este portal os ofrece las herramientas necesarias para forjar leyendas que perdurarán más allá del Tiempo de los Problemas.",
        avatar: "mago",
      },
      {
        speaker: "Archimago Elminster de Aguasombría",
        text: "¡Que los dados os sean propicios, aventureros! Que Tymora bendiga vuestra suerte y que Mystra guíe vuestros pasos en los senderos de la magia. ¡Explorad nuestro grimorio y descubrid los secretos de los Reinos Olvidados!",
        avatar: "mago",
      },
    ]
  
    // =====================================================================
    // FUNCIONES DEL SISTEMA DE DIÁLOGOS
    // =====================================================================
    // Estas funciones controlan la visualización y navegación de los
    // diálogos, permitiendo al usuario avanzar, retroceder o saltar.
    // =====================================================================
  
    // Función para mostrar un diálogo específico
    function showDialog(index) {
      // Validar que el índice esté dentro del rango de diálogos
      if (index < 0 || index >= dialogs.length) return
  
      currentDialogIndex = index // Actualiza el índice actual
  
      // Crear el elemento de diálogo con su contenido
      const dialog = dialogs[index]
      const dialogElement = document.createElement("div")
      dialogElement.className = "dialog"
      dialogElement.innerHTML = `
              <div class="avatar avatar-${dialog.avatar}"></div>
              <div class="dialog-content">
                  <div class="speaker">${dialog.speaker}</div>
                  <div class="text">${dialog.text}</div>
              </div>
          `
  
      // Limpiar y mostrar el nuevo diálogo
      dialogContainer.innerHTML = ""
      dialogContainer.appendChild(dialogElement)
  
      // Actualizar estado de los botones de navegación
      if (prevButton) prevButton.disabled = index === 0 // Deshabilita el botón anterior si es el primer diálogo
      if (nextButton) nextButton.disabled = index === dialogs.length - 1 // Deshabilita el botón siguiente si es el último diálogo
  
      // Mostrar el botón de continuar si estamos en el último diálogo
      if (index === dialogs.length - 1) {
        if (continueButton) continueButton.style.display = "block" // Muestra el botón de continuar
        if (prevButton) prevButton.style.display = "none" // Oculta botones de navegación
        if (nextButton) nextButton.style.display = "none"
        if (skipAllButton) skipAllButton.style.display = "none"
      } else {
        if (continueButton) continueButton.style.display = "none" // Oculta el botón de continuar
        if (prevButton) prevButton.style.display = "block" // Muestra botones de navegación
        if (nextButton) nextButton.style.display = "block"
        if (skipAllButton) skipAllButton.style.display = "block"
      }
    }
  
    // Función para saltar todos los diálogos y mostrar el último
    function skipAllDialogs() {
      showDialog(dialogs.length - 1) // Muestra el último diálogo
    }
  
    // Event listeners para los botones de navegación
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (currentDialogIndex > 0) {
          showDialog(currentDialogIndex - 1) // Muestra el diálogo anterior
        }
      })
    }
  
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (currentDialogIndex < dialogs.length - 1) {
          showDialog(currentDialogIndex + 1) // Muestra el siguiente diálogo
        }
      })
    }
  
    // Event listener para el botón de saltar todos
    if (skipAllButton) {
      skipAllButton.addEventListener("click", skipAllDialogs)
    }
  
    // Event listener para el botón de continuar
    if (continueButton) {
      continueButton.addEventListener("click", () => {
        // Redirigir a la página de personajes
        window.location.href = "personajes.html"
      })
    }
  
    // No mostramos ningún diálogo automáticamente ya que esperamos
    // a que el usuario cierre el modal primero
  })
  