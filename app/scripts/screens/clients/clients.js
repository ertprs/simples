const path = require("path");
var loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
var read = require('read-file-utf8');
let moment = require('moment');
let data = read(path.join(__dirname, "./loki/loki.json"));
const { ipcRenderer, remote } = require('electron');
db.loadJSON(data);

if (db.getCollection('clientes') == null) {
    var clientes = db.addCollection('clientes');
    db.save();
    alert('Coleção de clientes criada com sucesso...');
}

var clientes = db.getCollection('clientes');
var cidadesestados = db.getCollection('cidadesestados');
var estados = db.getCollection('estados');

new Vue({
    el: '#main',
    data: {
        clientes: [],
        cidadesestados: [],
        link: true,
        estados: [],
        loading: true,
        client: {
            nome: '',
            cpf: '',
            rg: '',
            razao_social: '',
            nome_fantasia: '',
            cnpj: '',
            inscricao_estadual: '',
            inscricao_municipal: '',
            inscricao_municipal: '',
            limite_credito: '',
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
            estado_civil: '',
            sexo: '',
            municipio: '',
            codigoMunicipio: '',
            uf: '',
            codigoPais: '1058',
            Pais: 'Brasil',
        },
        openModal: ''
    },
    ready: function () {
        this.loadingShow();
        this.clientes = clientes.data;
        this.cidadesestados = cidadesestados.data[0].cidades;
        this.estados = [estados.data[0]][0].estados;
    },
    methods: {
        closeApplication: function () {
            ipcRenderer.send("close-app");
        },
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
        listClients: function () {
            location.replace("clients.html");
        },
        editClient: function (client) {
            this.openModal = true;
            this.client = client
        },
        createClient: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.client = {
                dataRegistro: moment().format("DD-MM-YYYY"),
                nome: '',
                cpf: '',
                rg: '',
                razao_social: '',
                nome_fantasia: '',
                cnpj: '',
                inscricao_estadual: '',
                inscricao_municipal: '',
                inscricao_municipal: '',
                limite_credito: '',
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
                estado_civil: '',
                sexo: '',
                municipio: '',
                codigoMunicipio: '',
                uf: '',
                codigoPais: '1058',
                Pais: 'Brasil',
            };
        },
        remove(client) {
            this.client = client
            clientes.remove(this.client);
            db.save();
            location.reload();
        },
        clientStoreOrUpdate: function () {
            for (var c = 0; c < this.cidadesestados.length; c++) {
                if (this.client.municipio == this.cidadesestados[c].nome_cidade) {
                    this.client.codigoMunicipio = this.cidadesestados[c].ibge_cidade;
                }
            }

            if (typeof this.client.$loki !== 'undefined') {
                clientes.update(this.client);
            } else {
                clientes.insert(this.client);
            }

            db.save();
            this.openModal = false;
            location.reload();
        }
    },
    computed: {
        allInformationFront: function () {
            return this.client.nome
                && this.client.celular
                && this.client.endereco
                && this.client.numero
                && this.client.uf
                && this.client.municipio
        }
    }
});