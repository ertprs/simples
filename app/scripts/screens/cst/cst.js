const path = require("path");
var loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
var read = require('read-file-utf8');
let moment = require('moment');
let data = read(path.join(__dirname, "./loki/loki.json"));
const { ipcRenderer } = require('electron');
db.loadJSON(data);

if (db.getCollection('csts') == null) {
    var csts = db.addCollection('csts');
    let data = [
        {
            "id": 1,
            "codigotributario": "00",
            "descricao": "Tributada Integralmente",
            "codigofiscal": "0",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 2,
            "codigotributario": "10",
            "descricao": "Tributada e com ICMS por Substituicao Tributaria",
            "codigofiscal": "ff",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 3,
            "codigotributario": "20",
            "descricao": "Com Reducao de base de calculo",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 4,
            "codigotributario": "30",
            "descricao": "Isenta ou nao tributada e com cobranca do ICMS por substituicao tributaria",
            "codigofiscal": "0",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 5,
            "codigotributario": "40",
            "descricao": "Isenta",
            "codigofiscal": "ii",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 6,
            "codigotributario": "41",
            "descricao": "Nao tributada",
            "codigofiscal": "N1",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 7,
            "codigotributario": "90",
            "descricao": "Outras",
            "codigofiscal": "0",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 8,
            "codigotributario": "50",
            "descricao": "Supencao",
            "codigofiscal": "0",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 9,
            "codigotributario": "51",
            "descricao": "Diferimento",
            "codigofiscal": "0",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 10,
            "codigotributario": "60",
            "descricao": "Cobrado Anteriormente por substituicao tributaria",
            "codigofiscal": "0",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 11,
            "codigotributario": "70",
            "descricao": "Com reducao de base de calculo e cobranca do ICMS por substituicao tributaria",
            "codigofiscal": "ff",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 12,
            "codigotributario": "90",
            "descricao": "Outros",
            "codigofiscal": "0",
            "icms": 0,
            "ativo": "1",
            "tabela": "A"
        },
        {
            "id": 13,
            "codigotributario": "101",
            "descricao": "Tributada pelo Simples Nacional com permissao de credito",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 14,
            "codigotributario": "102",
            "descricao": "Tributada pelo Simples Nacional sem permissao de credito ",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 15,
            "codigotributario": "103",
            "descricao": "Isencao do ICMS no Simples Nacional para faixa de receita bruta",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 16,
            "codigotributario": "201",
            "descricao": "Tributada pelo Simples Nacional com permissao de credito e com cobranca do ICMS por substituicao tributaria",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 17,
            "codigotributario": "202",
            "descricao": "Tributada pelo Simples Nacional sem permissao de credito e com cobranca do ICMS por substituicao tributaria ",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 18,
            "codigotributario": "203",
            "descricao": "Isencao do ICMS no Simples Nacional para faixa de receita bruta e com cobranca do ICMS por substituicao tributaria",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 19,
            "codigotributario": "300",
            "descricao": "Imune",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 20,
            "codigotributario": "400",
            "descricao": "Nao tributada pelo Simples Nacional",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 21,
            "codigotributario": "500",
            "descricao": "ICMS cobrado anteriormente por substituicao tributária (substituido) ou por antecipacao",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        },
        {
            "id": 22,
            "codigotributario": "900",
            "descricao": "Outros ",
            "codigofiscal": "",
            "icms": 0,
            "ativo": "1",
            "tabela": "B"
        }
    ];

    csts.insert(data);
    db.save();
    alert('Coleção de csts criada com sucesso...');
}

var csts = db.getCollection('csts');
let debug = db.getCollection('debug');
var fiscal = db.getCollection('fiscal');
let rootus = db.getCollection('rootus');

new Vue({
    el: 'body',
    data: {
        rootus: [],
        debug: [],
        fiscal: [],
        csts: [],
        link: true,
        mode: '',
        cst: {
            codigofiscal: '',
            codigotributario: '',
            descricao: '',
            icms: '',
            tabela: '',

        },
        openModal: false
    },
    ready: function () {
        this.rootus = rootus.data[0];
        //this.validity();
        this.debug = debug.data[0];
        this.mode = 'edicao';
        this.fiscal = fiscal.data[0];
        this.csts = csts.data;
    },
    methods: {
        logout: function () {
            if (confirm("Tem certeza que deseja sair do sistema") == true) {
                if (this.rootus.logado == true) {
                    this.rootus.logado = false;
                    rootus.update(this.rootus);
                    db.save();
                }
            } else {
            }
            
            ipcRenderer.send("show-loginWindow");
        },
        close: function () {
            ipcRenderer.send("close-app");
        },
        editCst: function (cst) {
            this.openModal = true;
            this.cst = cst
        },
        validity: function () {
            if (this.rootus.logado == true) {

            } else {
                location.replace("login.html");
            }
        },
        createCst: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.cst = {
                codigofiscal: '',
                codigotributario: '',
                descricao: '',
                icms: '',
                tabela: '',
            };
        },
        remove(cst) {
            this.cst = cst
            csts.remove(this.cst);
            db.save();
            location.reload();
        },
        cstStoreOrUpdate: function () {
            if (typeof this.cst.$loki !== 'undefined') {
                csts.update(this.cst);
                swal('CST atualizado com sucesso!');
            } else {
                csts.insert(this.cst);
                swal('CST cadastrado com sucesso!');
            }

            db.save();
            this.openModal = false;
        }
    },
    computed: {
        todaInfomacaoFront: function () {
            return this.cst.codigofiscal
                && this.cst.codigotributario
        }
    }
});