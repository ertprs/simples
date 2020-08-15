const path = require("path");
const { dialog } = require('electron').remote;
let loki = require("lokijs");
let db = new loki(path.join(__dirname, "./loki/loki.json"));
let db2 = new loki(path.join(__dirname, "./loki/fiscals.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let data2 = read(path.join(__dirname, "./loki/fiscals.json"));
const { remote } = require('electron');
db.loadJSON(data);
db2.loadJSON(data2);
let fs = require('fs');
let produtosV2 = db.getCollection('produtosV2');
let ncms = db2.getCollection('ncms');
let cfops = db2.getCollection('cfops');
let fornecedoresV2 = db.getCollection('fornecedoresV2');
let fabricantesV2 = db.getCollection('fabricantesV2');
let unidades = db.getCollection('unidades');
let debug = db.getCollection('debug');
let fiscal = db.getCollection('fiscal');
let rootus = db.getCollection('rootus');
let csts = db.getCollection('csts');
let pis = db.getCollection('pis');
let cofins = db.getCollection('cofins');
var empresas = db.getCollection('empresas');
let fileExists = require('file-exists');
let image2base64 = require('image-to-base64');
window.Vue = require('vue');

new Vue({
    el: 'body',
    data: {
        loading: true,
        debug: [],
    },
    ready: function () {
        this.loadingShow();
    },
    methods: {
        goToPDV: function () {
            if (this.produtos.length === 0) {
                dialog.showMessageBox({
                    message: 'Para acessar o PDV, primeiro você precisa ter produtos cadastrados!'
                });
            } else {
                location.href = "pdv.html";
            }
        },
        loadingShow: function () {
            setTimeout(() => {
                this.loading = false;
            }, 1200);
        }
    }
});