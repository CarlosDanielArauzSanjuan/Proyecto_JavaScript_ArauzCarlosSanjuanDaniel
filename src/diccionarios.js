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
  ranger: ["simple", "martial"], // Explorador: ligera, media, escudo
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
  dragonborn: "./assets/img/personajes/dragonborn.jpg",
  dwarf: "./assets/img/personajes/dwarf.webp",
  elf: "./assets/img/personajes/elf.jpg",
  gnome: "./assets/img/personajes/gnome.jpg",
  "half-elf": "./assets/img/personajes/half-elf.jpg",
  "half-orc": "./assets/img/personajes/half-orc.jpg",
  halfling: "./assets/img/personajes/halfling.png",
  human: "./assets/img/personajes/human.jpg",
  tiefling: "./assets/img/personajes/tiefling.png",
  default: "./assets/img/personajes/default.webp",
}

// Mapeo de imágenes para clases
export const imagenClases = {
  barbarian: "./assets/img/clases/barbarian.jpg",
  bard: "./assets/img/clases/bard.png",
  cleric: "./assets/img/clases/cleric.png",
  druid: "./assets/img/clases/druid.jpg",
  fighter: "./assets/img/clases/fighter.png",
  monk: "./assets/img/clases/monk.jpg",
  paladin: "./assets/img/clases/paladin.jpg",
  ranger: "./assets/img/clases/ranger.jpg",
  rogue: "./assets/img/clases/rogue.png",
  sorcerer: "./assets/img/clases/sorcerer.jpg",
  warlock: "./assets/img/clases/Warlock.webp",
  wizard: "./assets/img/clases/wizard.webp",
  default: "./assets/img/personajes/durnan.webp",
}

// Mapeo de imágenes para armaduras
export const imagenArmaduras = {
  // Armaduras ligeras
  padded: "./assets/img/item/armor/Padded.webp",
  leather: "./assets/img/item/armor/leather.webp",
  "studded-leather": "./assets/img/item/armor/studded.webp",

  // Armaduras medias
  hide: "./assets/img/item/armor/hide.webp",
  "chain-shirt": "./assets/img/item/armor/chain_shirt.webp",
  "scale-mail": "./assets/img/item/armor/scale.webp",
  breastplate: "./assets/img/item/armor/Plate.webp",
  "half-plate": "./assets/img/item/armor/armadura.png",

  // Armaduras pesadas
  "ring-mail": "./assets/img/item/armor/Ringmail.webp",
  "chain-mail": "./assets/img/item/armor/chain_mail.png",
  splint: "./assets/img/item/armor/splint.webp",
  plate: "./assets/img/item/armor/Plate.webp",

  // Escudos
  shield: "./assets/img/item/armor/shield.png",

  // Imagen por defecto
  default: "./assets/img/item/armor/armadura.png",
}

// Mapeo de imágenes para armas
export const imagenArmas = {
  // Armas simples cuerpo a cuerpo
  club: "./assets/img/item/arma/club.png",
  dagger: "./assets/img/item/arma/dagger.jpg",
  greatclub: "./assets/img/item/arma/great_club.png",
  handaxe: "./assets/img/item/arma/handaxe.png",
  javelin: "./assets/img/item/arma/javelin.png",
  "light-hammer": "./assets/img/item/arma/light_hammer.png",
  mace: "./assets/img/item/arma/mace.webp",
  quarterstaff: "./assets/img/item/arma/quarter_staff.webp",
  sickle: "./assets/img/item/arma/sickle.png",
  spear: "./assets/img/item/arma/spear.png",

  // Armas simples a distancia
  "light-crossbow": "./assets/img/item/arma/crossbow.jpg",
  dart: "./assets/img/item/arma/dard.png",
  shortbow: "./assets/img/item/arma/shortbow.png",
  sling: "./assets/img/item/arma/sling.png",

  // Armas marciales cuerpo a cuerpo
  battleaxe: "./assets/img/item/arma/battle_axe.jpg",
  flail: "./assets/img/item/arma/flail.png",
  glaive: "./assets/img/item/arma/glaive.jpg",
  greataxe: "./assets/img/item/arma/greataxe.webp",
  greatsword: "./assets/img/item/arma/greatsword.jpg",
  halberd: "./assets/img/item/arma/halberd.jpg",
  lance: "./assets/img/item/arma/lance.png",
  longsword: "./assets/img/item/arma/longsword.png",
  maul: "./assets/img/item/arma/maul.png",
  morningstar: "./assets/img/item/arma/morningstar.jpg",
  pike: "./assets/img/item/arma/pike.png",
  rapier: "./assets/img/item/arma/rapier.png",
  scimitar: "./assets/img/item/arma/scimitar.png",
  shortsword: "./assets/img/item/arma/shortsword.png",
  trident: "./assets/img/item/arma/trident.png",
  "war-pick": "./assets/img/item/arma/warpick.png",
  warhammer: "./assets/img/item/arma/warhammer.png",
  whip: "./assets/img/item/arma/whip.webp",

  // Armas marciales a distancia
  blowgun: "./assets/img/item/arma/blowgun.png",
  "hand-crossbow": "./assets/img/item/arma/crossbowhand.png",
  "heavy-crossbow": "./assets/img/item/arma/crossbowheavy.png",
  longbow: "./assets/img/item/arma/longbow.png",
  net: "./assets/img/item/arma/net.png",

  // Imagen por defecto
  default: "./assets/img/item/arma/default.png",
}

// Mapeo de imágenes para hechizos/dones arcanos
export const imagenHechizos = {
  // Cantrips (Trucos)
  "acid-splash": "./assets/img/arcanos/acidsplash.jpg",
  "chill-touch": "./assets/img/arcanos/chill-touch.jpg",
  "dancing-lights": "./assets/img/arcanos/dancing-lights.jpeg",
  "fire-bolt": "./assets/img/arcanos/fire-bolt.png",
  light: "./assets/img/arcanos/light.jpg",
  "mage-hand": "./assets/img/arcanos/mage-hand.jpg",
  mending: "./assets/img/arcanos/Mending.webp",
  message: "./assets/img/arcanos/message.jpeg",
  "minor-illusion": "./assets/img/arcanos/minor-illusion.png",
  "poison-spray": "./assets/img/arcanos/poison-spray.webp",
  prestidigitation: "./assets/img/arcanos/prestidigitation.webp",
  "ray-of-frost": "./assets/img/arcanos/Ray-of-frost.webp",
  "shocking-grasp": "./assets/img/arcanos/shocking-grasp.jpeg",
  "true-strike": "./assets/img/arcanos/true-strike.jpg",

  // Nivel 1
  "burning-hands": "./assets/img/arcanos/burning-hands.webp",
  "charm-person": "./assets/img/arcanos/charm-person.jpeg",
  "detect-magic": "./assets/img/arcanos/detect-magic.webp",
  "feather-fall": "./assets/img/arcanos/feather-fall.jpg",
  "magic-missile": "./assets/img/arcanos/magic-missile.webp",
  shield: "./assets/img/item/armor/shield.png",
  sleep: "./assets/img/arcanos/sleep.webp",

  // Imagen por defecto para todos los dones arcanos sin imagen específica
  default: "./assets/img/arcanos/default.webp",
}

// Mapeo de imágenes para género
export const imagenGenero = {
  masculino: "./assets/img/gender/male.png",
  femenino: "./assets/img/gender/female.png",
  otro: "./assets/img/gender/elle.png",
  default: "./assets/img/gender/elle.png",
}

// Imagen por defecto para equipamiento
export const imagenEquipamientoDefault = "./assets/img/item/default.jpg"

// Mapeo de imágenes para accesorios/equipo de aventura
export const imagenAccesorios = {
  // Imagen por defecto
  default: "./assets/img/item/default.jpg",
}
