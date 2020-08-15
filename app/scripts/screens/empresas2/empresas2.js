const path = require("path");
var loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
var read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let moment = require('moment');
const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');

var debug = db.getCollection('debug');
var empresas = db.getCollection('empresas');
let rootus = db.getCollection('rootus');
var cidadesestados = db.getCollection('cidadesestados');
var estados = db.getCollection('estados');
var fiscal = db.getCollection('fiscal');

new Vue({
    el: 'body',
    data: {
        debug: [],
        fiscal: [],
        rootus: [],
        add: true,
        empresas: [],
        link: true,
        cidadesestados: [],
        estados: [],
        mode: '',
        empresa: {
            nome: '',
            site: '',
            ie: '',
            email: '',
            cnpj: '',
            csc: '',
            icmstipo: '',
            nomeFantasia: '',
            im: '',
            regimeTributario: '',
            cnae: '',
            responsavel: '',
            status: 1,
            contabilidade: {
                cnpj: '',
                responsavel: '',
                email: '',
                telefone: '',
            },
            endereco: {
                endereco: '',
                complemento: '',
                numero: '',
                bairro: '',
                municipio: '',
                codigoMunicipio: '',
                uf: '',
                cep: '',
                pais: 'Brasil',
                codigoPais: '1058',
                fone: ''
            }
        },
        openModal: false
    },
    ready: function () {
        this.rootus = rootus.data[0];
        this.debug = debug.data[0];
        this.empresas = empresas.data;
        this.fiscal = fiscal.data[0];

        // if (this.empresas[0].$loki !== 'undefined') {
        //     this.add = false;
        // }

        this.cidadesestados = cidadesestados.data[0].cidades;
        this.estados = [estados.data[0]][0].estados;

        console.log(this.empresas);
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
        editEmpresa: function (em) {
            ipcRenderer.send("show-companyWindow");
        },
        validity: function () {
            if (this.rootus.logado == true) {

            } else {
                location.replace("login.html");
            }
        },
        remove(empresa) {
            this.empresa = empresa
            empresas.remove(this.empresa);
            db.save();
        },
        createEmpresa: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.empresa = {
                nome: '',
                site: '',
                email: '',
                cnpj: '',
                csc: '',
                icmstipo: '',
                status: 1,
                contabilidade: {
                    cnpj: '',
                    responsavel: '',
                    email: '',
                    telefone: '',
                },
                endereco: {
                    endereco: '',
                    complemento: '',
                    numero: '',
                    bairro: '',
                    municipio: '',
                    codigoMunicipio: '',
                    uf: '',
                    cep: '',
                    pais: 'Brasil',
                    codigoPais: '1058',
                    fone: ''
                }
            };
        },
        emStoreOrUpdate: function () {
            if (this.empresa.nome == "") {
                alert('O Nome precisa ser preenchido!');
            }
            if (this.empresa.cnpj == "") {
                alert('O CNPJ precisa ser preenchido!');
            }
            if (this.empresa.endereco.endereco == "") {
                alert('O Endereço precisa ser preenchido!');
            }
            if (this.empresa.endereco.numero == "") {
                alert('O Número precisa ser preenchido!');
            }
            if (this.empresa.endereco.bairro == "") {
                alert('O Bairro precisa ser preenchido!');
            }
            if (this.empresa.endereco.municipio == "") {
                alert('O Município precisa ser preenchido!');
            }
            if (this.empresa.endereco.uf == "") {
                alert('O UF do estado precisa ser preenchido!');
            }
            if (this.empresa.endereco.cep == "") {
                alert('O CEP precisa ser preenchido!');
            }
            if (this.empresa.endereco.pais == "") {
                alert('O País precisa ser preenchido!');
            }
            if (this.empresa.endereco.fone == "") {
                alert('O Telefone precisa ser preenchido!');
            }

            if (this.empresa.nome !== "") {
                if (this.empresa.cnpj !== "") {
                    if (this.empresa.endereco.endereco !== "") {
                        if (this.empresa.endereco.numero !== "") {
                            if (this.empresa.endereco.bairro !== "") {
                                if (this.empresa.endereco.municipio !== "") {

                                    for (var c = 0; c < this.cidadesestados.length; c++) {
                                        if (this.empresa.endereco.municipio == this.cidadesestados[c].nome_cidade) {
                                            this.empresa.endereco.codigoMunicipio = this.cidadesestados[c].ibge_cidade;
                                        }
                                    }

                                    if (this.empresa.endereco.uf !== "") {
                                        if (this.empresa.endereco.cep !== "") {
                                            if (this.empresa.endereco.pais !== "") {
                                                if (this.empresa.endereco.fone !== "") {
                                                    if (typeof this.empresa.$loki !== 'undefined') {
                                                        empresas.update(this.empresa);
                                                    } else {
                                                        empresas.insert(this.empresa);
                                                    }
                                                    db.save();
                                                    this.openModal = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});