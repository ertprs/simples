const path = require("path"),
    { ipcRenderer, remote } = require('electron'),
    { dialog } = require('electron').remote,
    image2base64 = require('image-to-base64');

let loki = require("lokijs"),
    db = new loki(path.join(__dirname, "./loki/loki.json")),
    read = require('read-file-utf8'),
    moment = require('moment'),
    data = read(path.join(__dirname, "./loki/loki.json")),
    fileExists = require('file-exists'),
    fs = require('fs'),
    axios = require("axios");

db.loadJSON(data);

let rootus = db.getCollection('rootus'),
    fiscal = db.getCollection('fiscal').data[0],
    notas = db.getCollection('notas'),
    produtosV2 = db.getCollection('produtosV2'),
    debug = db.getCollection('debug'),
    printer = db.getCollection('printer'),
    empresas = db.getCollection('empresas'),
    salesPDVTest = db.getCollection('salesPDVTest'),
    clientes = db.getCollection('clientes'),
    fornecedores = db.getCollection('fornecedoresV2'),
    fabricantes = db.getCollection('fabricantesV2');

new Vue({
    el: '#main',
    data: {
        produtos: [],
        fiscal: [],
        rootus: [],
        loading: true,
        currentTab: 'logo',
        registered: '',
        validity: '',
        tabs: {
            logo: 'logo',
            manual: 'manual',
            support: 'support',
            mainnotes: 'mainnotes',
            shortcut: 'shortcut',
            reports: 'reports',
            mainregisters: 'mainregisters',
            settings: 'settings',
            register: 'register'
        }
    },
    beforeCreate: function () {
    },
    mounted: function () {
        this.loadingShow();
        this.rootus = rootus.data[0];
        this.fiscal = fiscal;
        this.produtos = produtosV2.data;

        if (this.rootus.user === 'admin') {
            this.registered = false;
            // console.info('Usuário:', 'Não Registrado');
        } else {
            this.registered = true;
            // console.info('Usuário:', 'Registrado');
            // axios.post('http://apiv1.focux.me/Products/addOr.json', produto)
            //     .then(function (response) {
            //         console.info('exportDbProducts:',
            //             {
            //                 Resultado: response,
            //                 Produto: produto
            //             });
            //     })
            //     .catch(function (error) {
            //         console.info('exportDbProducts:',
            //             {
            //                 Resultado: error,
            //             });
            //     });
        }
    },
    beforeMount: function () {
    },
    computed: {
        currentTabComponent: function () {
            return this.currentTab.toLowerCase();
        }
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
        emissionNfces: function () {
            ipcRenderer.send("show-nfcesWindow");
        },
        emissionNfe: function () {
            ipcRenderer.send("show-nfeWindow");
        },
        importNotes: function () {
            ipcRenderer.send("show-notesWindow");
        }
    }
});
