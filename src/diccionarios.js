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

// Valores base de atributos por raza
export const atributosBaseRaza = {
  dragonborn: { force: 2, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 1 },
  dwarf: { force: 0, dexterity: 0, constitution: 2, intelligence: 0, wisdom: 0, charisma: 0 },
  elf: { force: 0, dexterity: 2, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
  gnome: { force: 0, dexterity: 0, constitution: 0, intelligence: 2, wisdom: 0, charisma: 0 },
  "half-elf": { force: 0, dexterity: 1, constitution: 0, intelligence: 0, wisdom: 0, charisma: 2 },
  "half-orc": { force: 2, dexterity: 0, constitution: 1, intelligence: 0, wisdom: 0, charisma: 0 },
  halfling: { force: 0, dexterity: 2, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
  human: { force: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
  tiefling: { force: 0, dexterity: 0, constitution: 0, intelligence: 1, wisdom: 0, charisma: 2 },
}

// Valores recomendados de atributos por clase
export const atributosRecomendadosClase = {
  barbarian: { force: 3, dexterity: 1, constitution: 2, intelligence: 0, wisdom: 1, charisma: 0 },
  bard: { force: 0, dexterity: 2, constitution: 1, intelligence: 0, wisdom: 0, charisma: 4 },
  cleric: { force: 0, dexterity: 0, constitution: 1, intelligence: 0, wisdom: 4, charisma: 2 },
  druid: { force: 0, dexterity: 1, constitution: 1, intelligence: 0, wisdom: 4, charisma: 1 },
  fighter: { force: 3, dexterity: 2, constitution: 2, intelligence: 0, wisdom: 0, charisma: 0 },
  monk: { force: 0, dexterity: 3, constitution: 2, intelligence: 0, wisdom: 2, charisma: 0 },
  paladin: { force: 2, dexterity: 0, constitution: 1, intelligence: 0, wisdom: 0, charisma: 4 },
  ranger: { force: 0, dexterity: 3, constitution: 1, intelligence: 0, wisdom: 3, charisma: 0 },
  rogue: { force: 0, dexterity: 4, constitution: 1, intelligence: 1, wisdom: 0, charisma: 1 },
  sorcerer: { force: 0, dexterity: 1, constitution: 1, intelligence: 0, wisdom: 0, charisma: 5 },
  warlock: { force: 0, dexterity: 1, constitution: 1, intelligence: 0, wisdom: 0, charisma: 5 },
  wizard: { force: 0, dexterity: 1, constitution: 1, intelligence: 5, wisdom: 0, charisma: 0 },
}

// Mapeo de imágenes para razas
export const imagenRazas = {
  dragonborn: "./assets/img/personajes/Dragonborn.jpg",
  dwarf: "./assets/img/personajes/dwarf.webp",
  elf: "./assets/img/personajes/elf.jpg",
  gnome: "./assets/img/personajes/gnome.jpg",
  "half-elf": "./assets/img/personajes/half-elf.jpg",
  "half-orc": "./assets/img/personajes/half-orc.jpg",
  halfling: "./assets/img/personajes/Halfling.png",
  human: "./assets/img/personajes/human.jpg",
  tiefling: "./assets/img/personajes/tiefling.png",
  default: "./assets/img/personajes/durnan.webp",
}

// Mapeo de imágenes para clases
export const imagenClases = {
  barbarian: "./assets/img/clase/barbarian.jpg",
  bard: "./assets/img/clase/bard.png",
  cleric: "./assets/img/clase/cleric.png",
  druid: "./assets/img/clase/druid.jpg",
  fighter: "./assets/img/clase/fighter.png",
  monk: "./assets/img/clase/monk.jpg",
  paladin: "./assets/img/clase/paladin.jpg",
  ranger: "./assets/img/clase/ranger.jpg",
  rogue: "./assets/img/clase/rogue.png",
  sorcerer: "./assets/img/clase/sorcerer.jpg",
  warlock: "./assets/img/clase/Warlock.webp",
  wizard: "./assets/img/clase/wizard.webp",
  default: "./assets/img/personajes/durnan.webp",
}
