  
  // Mapa de qué armaduras puede usar cada clase
  export const proficienciasArmaduraClase = {
    barbarian: ["light", "medium", "shield"], // Bárbaro: ligera, media, escudo
    bard: ["light"], // Bardo: ligera
    cleric: ["light", "medium", "shield"], // Clérigo: ligera, media, escudo
    druid: ["light", "medium", "shield"], // Druida: ligera, media, escudo (no metálicas)
    fighter: ["light", "medium", "heavy", "shield"], // Guerrero: todas
    monk: [], // Monje: ninguna
    paladin: ["light", "medium", "heavy", "shield"], // Paladín: todas
    ranger: ["light", "medium", "shield"], // Explorador: ligera, media, escudo
    rogue: ["light"], // Pícaro: ligera
    sorcerer: [], // Hechicero: ninguna
    warlock: ["light"], // Brujo: ligera
    wizard: [], // Mago: ninguna
  }
  
  // Mapa de qué armas puede usar cada clase
  export const proficienciasArmasClase = {
    barbarian: ["simple", "martial"], // Bárbaro: simples y marciales
    bard: ["simple", "hand crossbows", "longswords", "rapiers", "shortswords"], // Bardo: simples y algunas marciales
    cleric: ["simple"], // Clérigo: simples
    druid: [
      // Druida: simples específicas
      "simple",
      "clubs",
      "daggers",
      "darts",
      "javelins",
      "maces",
      "quarterstaffs",
      "scimitars",
      "sickles",
      "slings",
      "spears",
    ],
    fighter: ["simple", "martial"], // Guerrero: simples y marciales
    monk: ["simple", "shortswords"], // Monje: simples y espadas cortas
    paladin: ["simple", "martial"], // Paladín: simples y marciales
    ranger: ["simple", "martial"], // Explorador: simples y marciales
    rogue: ["simple", "hand crossbows", "longswords", "rapiers", "shortswords"], // Pícaro: simples y algunas marciales
    sorcerer: ["simple"], // Hechicero: simples
    warlock: ["simple"], // Brujo: simples
    wizard: ["simple"], // Mago: simples
  }
