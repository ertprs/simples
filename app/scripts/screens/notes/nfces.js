const path = require("path");
var loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
var read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
const { remote } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');

let registroDeNotas = db.getCollection('registroDeNotas');
let rootus = db.getCollection('rootus').data[0];

new Vue({
    el: 'body',
    data: {
        registroDeNotas: [],
        rootus: [],
    },
    ready: function () {
        this.registroDeNotas = registroDeNotas.data;
        this.rootus = rootus;
        console.log(this.rootus);
    },
    methods: {
        reload: function () {
            remote.getCurrentWindow().reload();
        },
        remove(nfce) {
            registroDeNotas.remove(nfce);
            db.save();
            location.reload();
        },
        close: function () {
            remote.getCurrentWindow().reload();
            remote.getCurrentWindow().hide();
        },
    }
});