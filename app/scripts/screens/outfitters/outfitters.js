const path = require("path");
let loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
let read = require('read-file-utf8');
let moment = require('moment');
let data = read(path.join(__dirname, "./loki/loki.json"));
const { ipcRenderer, remote } = require('electron');
db.loadJSON(data);

let fornecedoresV2 = db.getCollection('fornecedoresV2');
let cidadesestados = db.getCollection('cidadesestados');
let rootus = db.getCollection('rootus');
let debug = db.getCollection('debug');
let estados = db.getCollection('estados');
var fiscal = db.getCollection('fiscal');

new Vue({
    el: 'body',
    data: {
        rootus: [],
        debug: [],
        fiscal: [],
        loading: true,
        fornecedores: [],
        cidadesestados: [],
        link: true,
        estados: [],
        mode: '',
        fornecedor: "",
        openModal: false
    },
    ready: function () {
        this.loadingShow();
        this.rootus = rootus.data[0];
        this.debug = debug.data[0];
        this.mode = 'edicao';
        this.fornecedores = fornecedoresV2.data;
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
            remote.getCurrentWindow().reload();
        },
        close: function () {
            remote.getCurrentWindow().reload();
            remote.getCurrentWindow().hide();
        },
        editOutfitter: function (fornecedor) {
            this.openModal = true;
            this.fornecedor = fornecedor;
        },
        createOutfitter: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.fornecedor = {
                dataRegistro: moment().format("DD-MM-YYYY"),
                id: "",
                planocontas_id: "",
                nome: "",
                razao_social: "",
                cnpj_cpf: "",
                ie: "",
                endereco: "",
                numero: "",
                bairro: "",
                cep: "",
                fone: "",
                fax: "",
                email_site: "",
                obs: "",
                estados_id: "",
                cidades_id: "",
                empresas_id: "",
                ativo: "",
                tipo: "",
                created: "",
                modified: "",
                empresa: {
                    id: "",
                    estados_id: "",
                    cidades_id: "",
                    cnpj: "",
                    ie: "",
                    im: "",
                    fantasia: "",
                    razao_social: "",
                    endereco: "",
                    numero: "",
                    bairro: "",
                    cep: "",
                    telefone: "",
                    email: "",
                    juros_diario: "",
                    multa: "",
                    crt: "",
                    cnae: "",
                    codigo_revenda: "",
                    logo: "",
                    ativo: "",
                    created: "",
                    modified: ""
                },
                cidade: {
                    id: "",
                    codigocidade: "",
                    iduf: "",
                    nome: ""
                },
                estado: {
                    id: "",
                    iduf: "",
                    uf: "",
                    nome: "",
                    icmscompra: "",
                    icmsvenda: "",
                    aliquota_interestadual: "",
                    aliquota_fcp: "",
                    created: "",
                    modified: ""
                },
                planoconta: ""
            };
        },
        remove(fornecedor) {
            this.fornecedor = fornecedor
            fornecedoresV2.remove(this.fornecedor);
            db.save();
            location.reload();
        },
        outfitterStoreOrUpdate: function () {
            if (typeof this.fornecedor.$loki !== 'undefined') {
                fornecedoresV2.update(this.fornecedor);
            } else {
                fornecedoresV2.insert(this.fornecedor);
            }
            db.save();
            this.openModal = false;
            location.reload();
        }

    },
    // computed: {
    //     todaInfomacaoFront: function () {
    //         if (this.fornecedor.tipopessoa == 'fisica') {
    //             return this.fornecedor.nome
    //                 && this.fornecedor.rg
    //                 && this.fornecedor.celular
    //                 && this.fornecedor.endereco
    //                 && this.fornecedor.bairro
    //                 && this.fornecedor.numero
    //                 && this.fornecedor.municipio
    //                 && this.fornecedor.uf
    //         }
    //         else {
    //             return this.fornecedor.cnpj
    //                 && this.fornecedor.inscricao_estadual
    //                 && this.fornecedor.inscricao_municipal
    //                 && this.fornecedor.razao_social
    //                 && this.fornecedor.celular
    //                 && this.fornecedor.endereco
    //                 && this.fornecedor.bairro
    //                 && this.fornecedor.numero
    //                 && this.fornecedor.municipio
    //                 && this.fornecedor.uf
    //         }
    //     }
    // }
});