import { isDev, isEmptyString } from '../util';
import { config } from '../conf';

const localIp = config.getLocalIp();
const locGenesis = isDev() ? `http://${localIp}:3010` : 'app/genesis';
const locSms = locGenesis;

const loc7800 = isDev() ? `http://${localIp}:3020` : 'app/7800';
const locNes = isDev() ? `http://${localIp}:3030` : 'app/nes';
const locDoom = isDev() ? `http://${localIp}:3040` : 'app/doom';
const loc2600 = isDev() ? `http://${localIp}:3050` : 'app/2600';
const locSnes = isDev() ? `http://${localIp}:3060` : 'app/snes';
const locGba = isDev() ? `http://${localIp}:3070` : 'app/gba';

const checkRom = app => {
  if (app.props === undefined || isEmptyString(app.props.rom)) {
    throw new Error("Missing 'rom' property");
  }
}

const APP_TYPE_KEYS = Object.freeze({
  // Types
  FCEUX: "fceux",
  GENPLUSGX_GG: "genplusgx-gg",
  GENPLUSGX_MD: "genplusgx-md",
  GENPLUSGX_SMS: "genplusgx-sms",
  JAVATARI: "javatari",
  JS7800: "js7800",
  PRBOOM: "prboom",
  SNES9X: "snes9x",
  VBA_M_GBA: "vba-m-gba",
  // Aliases
  A2600: "2600",
  A7800: "7800",
  DOOM: "doom",
  GBA: "gba",
  GENESIS: "genesis",
  GG: "gg",
  NES: "nes",
  SMS: "sms",
  SNES: "snes"
});

let types = [
  {
    key: APP_TYPE_KEYS.SNES9X,
    name: 'Super Nintendo',
    shortName: 'Nintendo SNES',
    coreName: 'SNES9X',
    location: locSnes,
    thumbnail: "images/app/snes-thumb.png",
    background: "images/app/snes-background.png",
    validate: checkRom,
    extensions: ['smc', 'sfc', 'swc'],
    defaults: {
      rom: "",
      pal: false
    }
  },
  {
    key: APP_TYPE_KEYS.JAVATARI,
    name: 'Atari 2600',
    coreName: 'Javatari',
    location: loc2600,
    thumbnail: "images/app/2600-thumb.png",
    background: "images/app/2600-background.png",
    validate: checkRom,
    extensions: ['a26'],
    defaults: {
      rom: "",
      swap: false
    }
  }, {
    key: APP_TYPE_KEYS.JS7800,
    name: 'Atari 7800',
    coreName: 'JS7800',
    location: loc7800,
    background: 'images/app/7800-background.png',
    thumbnail: 'images/app/7800-thumb.png',
    validate: checkRom,
    extensions: ['a78'],
    defaults: {
      rom: ""
    }
  }, {
    key: APP_TYPE_KEYS.GENPLUSGX_MD,
    name: 'Sega Genesis',
    coreName: 'Genesis Plus GX',
    location: locGenesis,
    background: 'images/app/genesis-background.png',
    thumbnail: 'images/app/genesis-thumb.png',
    validate: checkRom,
    extensions: ['smd', 'md', 'gen', 'sg'],
    defaults: {
      rom: "",
      pal: false
    }
  }, {
    key: APP_TYPE_KEYS.FCEUX,
    name: 'Nintendo Entertainment System',
    shortName: 'Nintendo NES',
    coreName: 'FCEUX',
    location: locNes,
    background: 'images/app/nes-background.png',
    thumbnail: 'images/app/nes-thumb.png',
    validate: checkRom,
    extensions: ['nes'],
    defaults: {
      rom: "",
      pal: false
    }
  }, {
    key: APP_TYPE_KEYS.GENPLUSGX_SMS,
    name: 'Sega Master System',
    coreName: 'Genesis Plus GX',
    location: locSms,
    background: 'images/app/mastersystem-background.png',
    thumbnail: 'images/app/mastersystem-thumb.png',
    validate: checkRom,
    extensions: ['sms'],
    defaults: {
      rom: "",
      pal: false,
      sms2: false,
      ym2413: false
    }
  }, {
    key: APP_TYPE_KEYS.GENPLUSGX_GG,
    name: 'Sega Game Gear',
    coreName: 'Genesis Plus GX',
    location: locSms,
    background: 'images/app/gamegear-background.png',
    thumbnail: 'images/app/gamegear-thumb.png',
    validate: checkRom,
    extensions: ['gg'],
    defaults: {
      rom: ""
    }
  }, {
    key: APP_TYPE_KEYS.PRBOOM,
    name: 'Doom Classic',
    coreName: 'PrBoom',
    location: locDoom,
    background: 'images/app/doom-background.png',
    thumbnail: 'images/app/doom-thumb.png',
    validate: app => {
      if (app.props === undefined || isEmptyString(app.props.game)) {
        throw new Error("Missing 'game' property");
      }
    },
    defaults: {
      game: ""
    }
  }, {
    key: APP_TYPE_KEYS.VBA_M_GBA,
    name: 'Nintendo Game Boy Advance',
    shortName: 'Nintendo GBA',
    coreName: 'VBA-M',
    location: locGba,
    background: 'images/app/gba-background.png',
    thumbnail: 'images/app/gba-thumb.png',
    validate: checkRom,
    extensions: ['gba'],
    defaults: {
      rom: "",
      rotation: 0,
      rtc: false,
      mirroring: false,
      saveType: 0,
      flashSize: 65536
    }
  }
];

const addAlias = (types, alias, typeKey) => {
  const { key, ...props } = types.filter(t => t.key === typeKey)[0];
  types.push({ key: alias, absoluteKey: typeKey, ...props });
}

// Aliases
addAlias(types, APP_TYPE_KEYS.A2600, APP_TYPE_KEYS.JAVATARI);
addAlias(types, APP_TYPE_KEYS.A7800, APP_TYPE_KEYS.JS7800);
addAlias(types, APP_TYPE_KEYS.DOOM, APP_TYPE_KEYS.PRBOOM);
addAlias(types, APP_TYPE_KEYS.GBA, APP_TYPE_KEYS.VBA_M_GBA);
addAlias(types, APP_TYPE_KEYS.GENESIS, APP_TYPE_KEYS.GENPLUSGX_MD);
addAlias(types, APP_TYPE_KEYS.GG, APP_TYPE_KEYS.GENPLUSGX_GG);
addAlias(types, APP_TYPE_KEYS.NES, APP_TYPE_KEYS.FCEUX);
addAlias(types, APP_TYPE_KEYS.SMS, APP_TYPE_KEYS.GENPLUSGX_SMS);
addAlias(types, APP_TYPE_KEYS.SNES, APP_TYPE_KEYS.SNES9X);

const APP_TYPES = types;

export { APP_TYPE_KEYS, APP_TYPES };