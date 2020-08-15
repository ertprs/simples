window.Vue = require('vue');
const path = require("path");
var loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
var read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
const { ipcRenderer, remote } = require('electron');
const { dialog } = require('electron').remote;
db.loadJSON(data);

var empresas = db.getCollection('empresas');
var cidadesestados = db.getCollection('cidadesestados');
var estados = db.getCollection('estados');

new Vue({
    el: 'body',
    data: {
        registered: false,
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
            crt: '1',
            icmstipo: '102',
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
    },
    ready: function () {
        this.empresas = empresas.data[0];
        this.cidadesestados = cidadesestados.data[0].cidades;
        this.estados = [estados.data[0]][0].estados;

        if (this.empresas.length == 0) {
            this.registered = false;
            this.empresa = {
                nome: '',
                site: '',
                ie: '',
                email: '',
                cnpj: '',
                crt: '1',
                icmstipo: '102',
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
            }
            
        } else {
            this.registered = true;
            this.empresa = this.empresas;
        }   
        
        console.log(this.empresas);
    },
    methods: {
        close: function () {
            remote.getCurrentWindow().reload();
            remote.getCurrentWindow().hide();
        },
        companyStoreOrUpdateInner: function () {
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
                                                    dialog.showMessageBox({
                                                        message: 'Sucesso!',
                                                    }, () => {
                                                        remote.getCurrentWindow().hide();
                                                    });
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
        },
        companyStoreOrUpdate: function () {
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
                                                    dialog.showMessageBox({
                                                        message: 'Sucesso!',
                                                    }, () => {
                                                        ipcRenderer.send("show-mainWindow2");
                                                    });
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