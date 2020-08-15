const path = require("path");
var loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
var read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let moment = require('moment');
const { ipcRenderer, remote } = require('electron');
db.loadJSON(data);

var fabricantes = db.getCollection('fabricantesV2');
var cidadesestados = db.getCollection('cidadesestados');
var estados = db.getCollection('estados');
let rootus = db.getCollection('rootus');
let debug = db.getCollection('debug');
var fiscal = db.getCollection('fiscal');

new Vue({
    el: 'body',
    data: {
        debug: [],
        fiscal: [],
        rootus: [],
        fabricantes: [],
        cidadesestados: [],
        loading: true,
        link: true,
        estados: [],
        mode: '',
        fabricante: '',
        openModal: false
    },
    ready: function () {
        this.loadingShow();
        this.rootus = rootus.data[0];
        this.debug = debug.data[0];
        this.mode = 'edicao';
        this.fabricantes = fabricantes.data;
        this.cidadesestados = cidadesestados.data[0].cidades;
        this.estados = [estados.data[0]][0].estados;
        this.fiscal = fiscal.data[0];
    },
    methods: {
        loadingShow: function () {
            setTimeout(() => {
                this.loading = false;
            }, 1200);
        },
        reload: function () {
            remote.getCurrentWindow().reload();
        },
        closeModal: function () {
            this.openModal = false;
            remote.getCurrentWindow().reload();
        },
        close: function () {
            remote.getCurrentWindow().reload();
            remote.getCurrentWindow().hide();
        },
        editProducer: function (fabricante) {
            this.openModal = true;
            this.fabricante = fabricante
        },
        createProducer: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.fabricante = {
                dataRegistro: moment().format("DD-MM-YYYY"),
                nome: "",
                ativo: "",
            };
        },
        remove(fabricante) {
            this.fabricante = fabricante;
            fabricantes.remove(this.fabricante);
            db.save();
            location.reload();
        },
        producerStoreOrUpdate: function () {
            if (typeof this.fabricante.$loki !== 'undefined') {
                fabricantes.update(this.fabricante);
            } else {
                fabricantes.insert(this.fabricante);
            }
            db.save();
            this.openModal = false;
            location.reload();
        }

    },
    computed: {
        todaInfomacaoFront: function () {
            return this.fabricante.nome
        }
    }
});