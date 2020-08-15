const path = require("path");
let loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let moment = require('moment');
const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');

if (db.getCollection('config_nfce') == null) {
    db.addCollection('config_nfce');
    db.save();
    alert('Coleção de config_nfce criada com sucesso...');
}

let config_nfce = db.getCollection('config_nfce');
let debug = db.getCollection('debug');
let rootus = db.getCollection('rootus');
let fiscal = db.getCollection('fiscal');

new Vue({
    el: 'body',
    data: {
        rootus: [],
        fiscal: [],
        mode: '',
        link: true,
        config_nfces: [],
        debug: [],
        config_nfce: {
            geral: [
                {
                    ambiente: '',
                    serie: ''
                }
            ],
            signature: [
                {
                    CanonicalizationMethod: '',
                    SignatureMethod: '',
                    Transform1: '',
                    Transform2: '',
                    SignatureValue: '',
                    X509Certificate: '',
                }
            ],
            cartao_credito: [
                {
                    tpIntegra: '2'
                }
            ]
        },
        openModal: false,
        openModal2: false
    },
    ready: function () {
        this.rootus = rootus.data[0];
        ////this.validity();
        this.debug = debug.data[0];
        this.config_nfces = config_nfce.data;
        this.fiscal = fiscal.data[0];
    },
    methods: {
        editConfigNfce: function (config_nfce) {
            this.mode = 'edicao';
            this.openModal = true;
            this.config_nfce = config_nfce;
        },
        updateSerie: function () {
            this.config_nfces[0].geral[0].serie = 1;
            config_nfce.update(this.config_nfces);
            db.save();
            // location.reload();
        },
        editTypeIntegration: function (config_nfce) {
            this.mode = 'edicao';
            this.openModal2 = true;
            this.config_nfce = config_nfce;
        },
         validity: function () {
            if (this.rootus.logado == true) {

            } else {
                location.replace("login.html");
            }
        },
        configNfceUpdate: function () {
            if (typeof this.config_nfce.$loki !== 'undefined') {
                config_nfce.update(this.config_nfce);
            } else {
                alert('Erro ao atualizar dados!')
            }
            db.save();
            this.openModal = false;
            this.openModal2 = false;
        },
    }
});