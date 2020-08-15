var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');
const { ipcRenderer } = require('electron');
db.loadJSON(data);

if (db.getCollection('fornecedores') == null) {
    var fornecedores = db.addCollection('fornecedores');
    db.save();
    alert('Coleção de fornecedores criada com sucesso...');
}

var fornecedores = db.getCollection('fornecedores');
var cidadesestados = db.getCollection('cidadesestados');
var estados = db.getCollection('estados');

new Vue({
    el: 'body',
    data: {
        debug: false,
        fornecedores: [],
        cidadesestados: [],
        link: true,
        estados: [],
        mode: '',
        fornecedor: {
            nome: '',
            cnpj: '',
            razao_social: '',
            nome_fantasia: '',
            inscricao_estadual: '',
            inscricao_municipal: '',
            telefone: '',
            fax: '',
            celular: '',
            email: '',
            endereco: '',
            numero: '',
            bairro: '',
            cep: '',
            complemento: '',
            apelido: '',
            municipio: '',
            codigoMunicipio: '',
            uf: '',
            codigoPais: '1058',
            Pais: 'Brasil',
        },
        openModal: false
    },
    ready: function () {
        this.mode = 'edicao';
        this.fornecedores = fornecedores.data;
        this.cidadesestados = cidadesestados.data[0].cidades;
        this.estados = [estados.data[0]][0].estados;
    },
    methods: {
        makeDebug: function () {
            if (this.debug == false) {
                this.debug = true;
            } else {
                this.debug = false;
            }
        },
        editFornecedor: function (fornecedor) {
            this.openModal = true;
            this.fornecedor = fornecedor
        },
        createFornecedor: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.fornecedor = {
                nome: '',
                cnpj: '',
                razao_social: '',
                nome_fantasia: '',
                inscricao_estadual: '',
                inscricao_municipal: '',
                telefone: '',
                fax: '',
                celular: '',
                email: '',
                endereco: '',
                numero: '',
                bairro: '',
                cep: '',
                complemento: '',
                apelido: '',
                municipio: '',
                codigoMunicipio: '',
                uf: '',
                codigoPais: '1058',
                Pais: 'Brasil',
            };
        },
        fornecedorStoreOrUpdate: function () {
            for (var c = 0; c < this.cidadesestados.length; c++) {
                if (this.fornecedor.municipio == this.cidadesestados[c].nome_cidade) {
                    this.fornecedor.codigoMunicipio = this.cidadesestados[c].ibge_cidade;
                }
            }

            if (typeof this.fornecedor.$loki !== 'undefined') {
                fornecedores.update(this.fornecedor);
            } else {
                fornecedores.insert(this.fornecedor);
            }
            db.save();
            this.openModal = false;
            location.reload();
        }

    },
    computed: {
        todaInfomacaoFront: function () {
            return this.fornecedor.nome
                && this.fornecedor.telefone
                && this.fornecedor.endereco
                && this.fornecedor.bairro
                && this.fornecedor.numero
                && this.fornecedor.municipio
                && this.fornecedor.uf
                && this.fornecedor.cep
        }
    }
});