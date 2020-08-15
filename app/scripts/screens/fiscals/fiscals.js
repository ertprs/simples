const path = require("path");
let loki = require("lokijs");
var db2 = new loki(path.join(__dirname, "./loki/loki.json"));
let db = new loki(path.join(__dirname, "./loki/fiscals.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/fiscals.json"));
let data2 = read(path.join(__dirname, "./loki/loki.json"));
const { remote } = require('electron');
db.loadJSON(data);
db2.loadJSON(data2);
window.Vue = require('vue');

let ncms = db.getCollection('ncms');
let cfops = db.getCollection('cfops');
let rootus = db2.getCollection('rootus').data[0];

new Vue({
    el: 'body',
    data: {
        loading: true,
        ncms: [],
        cfops: [],
        rootus: [],
    },

    ready: function () {
        this.loadingShow();
        this.ncms = ncms.data;
        this.cfops = cfops.data;
        this.rootus = rootus;
    },
    methods: {
        loadingShow: function () {
            setTimeout(() => {
                this.loading = false;
            }, 1200);
        },
        goToPDV: function () {
            if (this.produtos.length === 0) {
                dialog.showMessageBox({
                    message: 'Para acessar o PDV, primeiro você precisa ter produtos cadastrados!'
                });
            } else {
                location.href = "pdv.html";
            }
        },
        reload: function () {
            remote.getCurrentWindow().reload();
        },
        close: function () {
            remote.getCurrentWindow().reload();
            remote.getCurrentWindow().hide();
        },
        openCfops: function () {
            location.replace("cfops.html");
        },
        openNcms: function () {
            location.replace("fiscals.html");
        }
    }
});