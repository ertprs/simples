const path = require("path");
let loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/notes.json"));
// let fileExists = require('file-exists');
// let read = require('read-file-utf8');
// let data = read(path.join(__dirname, "./loki/notes.json"));

var notas = db.addCollection('notas');

notas.insert(
    {
        nota: 'Victor',
    });
db.save();

// var loki = require("lokijs");
// var db = new loki("loki2.json");
// var clientes = db.addCollection('clientes');

// clientes.insert(
//     {
//         nome: 'Victor',
//         email: 'victor.porto7@gmail.com'
//     });
// db.save();