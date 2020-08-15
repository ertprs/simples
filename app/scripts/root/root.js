var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');
const { ipcRenderer } = require('electron');
db.loadJSON(data);

if (db.getCollection('rootus') == null) {
  var rootus = db.addCollection('rootus');
  let data = [
    {
      "user": "rootus",
      "pass": "rootus",
      "date_now": "date",
      "validity": "date"
    }
  ];

  rootus.insert(data);
  db.save();
  alert('Coleção de rootus criada com sucesso...');
}

var rootus = db.getCollection('rootus');
console.log(rootus);