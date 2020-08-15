var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');
const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');

if (db.getCollection('fabricantesV2') == null) {
    var fabricantesV2 = db.addCollection('fabricantesV2');
    let data = [
      
    ];
    fabricantesV2.insert(data);
    db.save();
    alert('Coleção de fabricantesV2 de  criada com sucesso...');
}

// var produtosV2 = db.getCollection('produtosV2');
// var ncms = db.getCollection('ncms');
// var cfops = db.getCollection('cfops');
// var fornecedores = db.getCollection('fornecedores');

new Vue({
    el: 'body',
    data: {
        debug: false,
        produtos: [],
        fornecedores: [],
        ncms: [],
        link: true,
        cfops: [],
        mode: '',
        produto: {
        },
        openModal: false
    },
    ready: function () {
       
    },
    methods: {
        makeDebug: function () {
            if (this.debug == false) {
                this.debug = true;
            } else {
                this.debug = false;
            }
        },
        editProduct: function (product) {
            this.openModal = true;
            this.produto = product
        },
        createProduct: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.produto = {
                codigo: '',
                codigoBarra: '',
                referencia: '',
                nome: '',
                unidade: '',
                descricao: '',
                tipo: '',
                fornecedor: '',
                fabricante: '',
                ncm: '',
                cfop: '',
                preco: '',
                quantidade: '',
                percentagem_lucro: '',
                ativo: true
            };
        },
        productStoreOrUpdate: function () {
            if (typeof this.produto.$loki !== 'undefined') {
                produtos.update(this.produto);
            } else {
                produtos.insert(this.produto);
            }
            db.save();
            this.openModal = false;
            location.reload();
        }
    }
});