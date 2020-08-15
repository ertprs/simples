var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');
const { ipcRenderer } = require('electron');
db.loadJSON(data);

if (db.getCollection('fabricantesV2') == null) {
  var fabricantesV2 = db.addCollection('fabricantesV2');
  let data = [
    {
      "id": 1,
      "nome": "PADRAO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 2,
      "nome": "NOVAMED",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 3,
      "nome": "BIOSINTET.",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 4,
      "nome": "DELTA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 5,
      "nome": "EMS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 6,
      "nome": "NYCOMED",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 7,
      "nome": "BAYER",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 8,
      "nome": "GROSS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 9,
      "nome": "DM/SRM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 10,
      "nome": "PHARMACIA ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 11,
      "nome": "WYETH CONS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 12,
      "nome": "GSK",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 13,
      "nome": "CATARINENS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 14,
      "nome": "NEO QUIMIC",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 15,
      "nome": "CHIESI",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 16,
      "nome": "ASPEN PHAR",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 17,
      "nome": "LUPER",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 18,
      "nome": "HERTZ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 19,
      "nome": "CIMED",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 20,
      "nome": "SANDOZ-HEX",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 21,
      "nome": "ARISTON",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 22,
      "nome": "AVENTIS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 23,
      "nome": "FARMASA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 24,
      "nome": "MILLET ROU",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 25,
      "nome": "BOEHRINGER",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 26,
      "nome": "NOVARTIS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 27,
      "nome": "LIBBS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 28,
      "nome": "ANDROMED",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 29,
      "nome": "ALCON",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 30,
      "nome": "ALLERGAN",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 31,
      "nome": "CAZI",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 32,
      "nome": "EUROFARMA ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 33,
      "nome": "BUNKER",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 34,
      "nome": "MERCK",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 35,
      "nome": "MARJAN",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 36,
      "nome": "ELOFAR",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 37,
      "nome": "O. MORAES ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 38,
      "nome": "ROCHE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 39,
      "nome": "BRISTOL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 40,
      "nome": "PFIZER",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 41,
      "nome": "LEGRAND",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 42,
      "nome": "ACHE FARMA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 43,
      "nome": "MEDLEY",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 44,
      "nome": "GALDERMA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 45,
      "nome": "ASTRAZENEC",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 46,
      "nome": "VALEANT",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 47,
      "nome": "DIVCOM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 48,
      "nome": "IGEFARMA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 49,
      "nome": "FARMABRAZ ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 50,
      "nome": "GLENMARK",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 51,
      "nome": "JANSSEN",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 52,
      "nome": "MSD",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 53,
      "nome": "FQM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 54,
      "nome": "BAGO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 55,
      "nome": "ABBOTT",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 56,
      "nome": "UNIAO QUIM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 57,
      "nome": "SIGMA FARM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 58,
      "nome": "SYNTHELABO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 59,
      "nome": "CRISTALIA ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 60,
      "nome": "BIOLAB",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 61,
      "nome": "ORGANON",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 62,
      "nome": "NIKKHO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 63,
      "nome": "MELPOEJO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 64,
      "nome": "APSEN",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 65,
      "nome": "REGIUS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 66,
      "nome": "DAUDT",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 67,
      "nome": "PRIMA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 68,
      "nome": "MOMENTA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 69,
      "nome": "PINUS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 70,
      "nome": "WYETH",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 71,
      "nome": "BALDACCI",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 72,
      "nome": "ZAMBON",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 73,
      "nome": "GLOBO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 74,
      "nome": "MINANCORA ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 75,
      "nome": "ELI LILLY ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 76,
      "nome": "ZODIAC",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 77,
      "nome": "BARRENNE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 78,
      "nome": "HEPACHOLAN",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 79,
      "nome": "KNOLL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 80,
      "nome": "EVOLABIS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 81,
      "nome": "CSLBEHRING",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 82,
      "nome": "A.B.L",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 83,
      "nome": "GRUNENTHAL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 84,
      "nome": "SAUAD FARM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 85,
      "nome": "SANOFI",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 86,
      "nome": "SCHERING P",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 87,
      "nome": "SERVIER",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 88,
      "nome": "STIEFEL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 89,
      "nome": "TEUTO-BRAS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 90,
      "nome": "INTENDIS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 91,
      "nome": "AVERT-ZURI",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 92,
      "nome": "SOLVAY FAR",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 93,
      "nome": "MANTECORP ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 94,
      "nome": "UCI-FARMA ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 95,
      "nome": "FERRING",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 96,
      "nome": "SCHERING B",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 97,
      "nome": "SAUDE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 98,
      "nome": "SERONO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 99,
      "nome": "HEBRON",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 100,
      "nome": "BRASTERAP.",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 101,
      "nome": "BAUSCH&LOM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 102,
      "nome": "TRB",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 103,
      "nome": "BELFAR",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 104,
      "nome": "ARESE FARM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 105,
      "nome": "N. NORDISK",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 106,
      "nome": "LUNDBECK",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 107,
      "nome": "ARROW",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 108,
      "nome": "BERGAMO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 109,
      "nome": "HISAMITSU ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 110,
      "nome": "PROCTER &G",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 111,
      "nome": "WESP",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 112,
      "nome": "GERMED",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 113,
      "nome": "NECKERMAN ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 114,
      "nome": "PHARMASCIE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 115,
      "nome": "GENZYME",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 116,
      "nome": "QUIMSUL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 117,
      "nome": "ATIVUS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 118,
      "nome": "THERASKIN ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 119,
      "nome": "LEO PHARMA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 120,
      "nome": "TEVA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 121,
      "nome": "DAIICHI-SA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 122,
      "nome": "BESINS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 123,
      "nome": "CIFARMA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 124,
      "nome": "VITAMEDIC ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 125,
      "nome": "CELESTE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 126,
      "nome": "MABRA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 127,
      "nome": "LA ROCHE P",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 128,
      "nome": "RANBAXY",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 129,
      "nome": "ZYDUS BR",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 130,
      "nome": "PHARLAB",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 131,
      "nome": "GENOM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 132,
      "nome": "GALLIA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 133,
      "nome": "NOVA QUIMI",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 134,
      "nome": "MEDQUIMICA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 135,
      "nome": "MULTILAB",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 136,
      "nome": "LATINOFARM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 137,
      "nome": "GEOLAB",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 138,
      "nome": "BLAUSIEGEL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 139,
      "nome": "DIFFUCAP",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 140,
      "nome": "TORRENT",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 141,
      "nome": "EXELTIS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 142,
      "nome": "PRATI DONA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 143,
      "nome": "AIRELA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 144,
      "nome": "MDCPHARMA ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 145,
      "nome": "JARREL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 146,
      "nome": "CARESSE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 147,
      "nome": "NATURES",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 148,
      "nome": "GEYER",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 149,
      "nome": "MEIZLER",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 150,
      "nome": "JOHNSON",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 151,
      "nome": "LEGRAND-GE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 152,
      "nome": "ASTELLAS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 153,
      "nome": "NEOLATINA ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 154,
      "nome": "SILVESTRE ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 155,
      "nome": "CELLOFARM ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 156,
      "nome": "LAB. BIOL.",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 157,
      "nome": "CHEMICALTE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 158,
      "nome": "AUROBINDO ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 159,
      "nome": "BIOCHIMICO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 160,
      "nome": "SIMOES",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 161,
      "nome": "PASTEUR",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 162,
      "nome": "DOVALLE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 163,
      "nome": "WALDEMIRO ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 164,
      "nome": "BIOGEN IDE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 165,
      "nome": "ACTAVIS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 166,
      "nome": "DR.REDDYS ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 167,
      "nome": "LABORIS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 168,
      "nome": "OPHTHALMOS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 169,
      "nome": "TOMMASI",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 170,
      "nome": "ACTELION",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 171,
      "nome": "BIO-MACRO ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 172,
      "nome": "GRANADO",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 173,
      "nome": "MARIOL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 174,
      "nome": "HEEL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 175,
      "nome": "RECKITT BE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 176,
      "nome": "HERBARIUM ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 177,
      "nome": "SHIRE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 178,
      "nome": "ADAPT",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 179,
      "nome": "HIPOLABOR ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 180,
      "nome": "UNICHEM",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 181,
      "nome": "UNITED MED",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 182,
      "nome": "DARROW",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 183,
      "nome": "ACCORD FAR",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 184,
      "nome": "SOBRAL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 185,
      "nome": "MELCON BR ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 186,
      "nome": "ALTHAIA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 187,
      "nome": "BALM-LABOR",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 188,
      "nome": "TAKEDA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 189,
      "nome": "EISAI LAB ",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 190,
      "nome": "NATULAB",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 191,
      "nome": "SUN PHARMA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 192,
      "nome": "HERALDS",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 193,
      "nome": "MELORAL",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 194,
      "nome": "AMGEN",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 195,
      "nome": "BAXALTA",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 196,
      "nome": "ABBVIE",
      "ativo": "1",
      "created": null,
      "modified": null
    },
    {
      "id": 197,
      "nome": "MOKASH",
      "ativo": "1",
      "created": null,
      "modified": null
    }
  ];

  fabricantesV2.insert(data);
  db.save();
  alert('Coleção de fabricantesV2 criada com sucesso...');
}

var fabricantesV2 = db.getCollection('fabricantesV2');
console.log(fabricantesV2);