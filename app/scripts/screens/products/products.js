const path = require("path");
const { dialog } = require('electron').remote;
let loki = require("lokijs");
let db = new loki(path.join(__dirname, "./loki/loki.json"));
let db2 = new loki(path.join(__dirname, "./loki/fiscals.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let data2 = read(path.join(__dirname, "./loki/fiscals.json"));
const { remote } = require('electron');
db.loadJSON(data);
db2.loadJSON(data2);
let fs = require('fs');
let produtosV2 = db.getCollection('produtosV2');
let ncms = db2.getCollection('ncms');
let cfops = db2.getCollection('cfops');
let fornecedoresV2 = db.getCollection('fornecedoresV2');
let fabricantesV2 = db.getCollection('fabricantesV2');
let unidades = db.getCollection('unidades');
let debug = db.getCollection('debug');
let fiscal = db.getCollection('fiscal');
let rootus = db.getCollection('rootus');
let csts = db.getCollection('csts');
let pis = db.getCollection('pis');
let cofins = db.getCollection('cofins');
var empresas = db.getCollection('empresas');
let fileExists = require('file-exists');
let image2base64 = require('image-to-base64');
window.Vue = require('vue');

new Vue({
    el: 'body',
    data: {
        debug: [],
        fiscal: [],
        empresa: [],
        pis: [],
        cofins: [],
        rootus: [],
        loading: true,
        produtosV2: [],
        unidades: [],
        fornecedoresV2: [],
        fabricantesV2: [],
        ncms: [],
        link: true,
        cfops: [],
        produtoV2: "",
        produtoGeral: false,
        detalhesPreco: false,
        tabelaProdutos: true,
        tributos: false,
        menu: false,
        foto: false,
        foto64: ""
    },
    ready: function () {
        this.loadingShow();
        this.rootus = rootus.data[0];
        this.debug = debug.data[0];
        this.produtosV2 = produtosV2.data;
        this.unidades = unidades.data[0].unidades;
        this.csts = csts.data;
        this.ncms = ncms.data;
        this.cfops = cfops.data;
        this.pis = pis.data;
        this.cofins = cofins.data;
        this.fiscal = fiscal.data[0];
        this.empresa = empresas.data[0];

        if (fornecedoresV2.data.length == 0) {
            this.fornecedoresV2 = false;
        }
        else 
        {
            this.fornecedoresV2 = fornecedoresV2.data;
        }

        if (fabricantesV2.data.length == 0) {
            this.fabricantesV2 = false;
        }
        else 
        {
            this.fabricantesV2 = fabricantesV2.data;
        }
    },
    methods: {
        goToPDV: function () {
            if (this.produtos.length === 0) {
                dialog.showMessageBox({
                    message: 'Para acessar o PDV, primeiro você precisa ter produtos cadastrados!'
                });
            } else {
                location.href = "pdv.html";
            }
        },
        openPriceDetails: function () {
            if (this.produtoGeral == true) {
                this.produtoGeral = false;
                this.tabelaProdutos = false;
                this.detalhesPreco = true;
                this.tributos = false;
            } else {
                this.produtoGeral = false;
                this.tabelaProdutos = false;
                this.detalhesPreco = true;
                this.tributos = false;
                this.foto = false;
            }
        },
        openTaxes: function () {
            if (this.tributos == false) {
                this.produtoGeral = false;
                this.tabelaProdutos = false;
                this.detalhesPreco = false;
                this.tributos = true;
                this.foto = false;
            }
            else {
                this.produtoGeral = false;
                this.tabelaProdutos = false;
                this.detalhesPreco = false;
                this.tributos = true;
                this.foto = false;
            }
        },
        addImage: function () {
            dialog.showOpenDialog((fileNames) => {
                let filePath = path.join(__dirname, "images/logo.txt");
                fileExists(filePath).then(exists => {
                    image2base64(fileNames[0])
                        .then(
                            (response) => {
                                if (fileNames === undefined) {
                                    dialog.showErrorBox("Arquivo não selecionado!");
                                    return;
                                }
                                let base64 = 'data:image/jpeg;base64,' + response;
                                this.foto64 = base64;
                                console.info(this.foto64);
                            }
                        )
                        .catch(
                            (error) => {
                                dialog.showErrorBox("Erro ao carregar arquivo.!");
                            }
                        );
                });
            });
        },
        openFoto: function () {
            if (this.foto == false) {
                this.foto = true;
                this.produtoGeral = false;
                this.tabelaProdutos = false;
                this.detalhesPreco = false;
                this.tributos = false;
            }
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
            this.produtoGeral = false;
            remote.getCurrentWindow().reload();
        },
        close: function () {
            remote.getCurrentWindow().reload();
            remote.getCurrentWindow().hide();
        },
        editProduct: function (product) {
            this.produtoGeral = true;
            this.produtoV2 = product;
        },
        remove(product) {
            this.produtoV2 = product
            produtosV2.remove(this.produtoV2);
            db.save();
            location.reload();
        },
        createProduct: function () {
            this.tabelaProdutos = false;
            this.produtoGeral = true;
            this.detalhesPreco = false;
            this.tributos = false;
            this.menu = true;
            this.foto = false;

            if (this.empresa.crt == 1) {
                this.produtoV2 = {
                    codigo: "",
                    referencia: "",
                    codigo_barras: "",
                    nome: "",
                    descricao: "",
                    preco_compra: "",
                    preco_custo: "",
                    custo_medio: "",
                    custo_frete: "",
                    preco_venda: "",
                    margem_lucro: "",
                    desconto_max: "",
                    quantidade: "",
                    peso_bruto: "",
                    peso_liquido: "",
                    ativo: "",
                    observacoes: "",
                    foto: "",
                    unidade: {
                        descricao: "",
                        nome: "",
                        fator_conversao: "",
                        ativo: "",
                    },
                    fornecedor: {
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
                        email: "",
                        site: "",
                        obs: "",
                        ativo: "",
                    },
                    fabricante: {
                        nome: "",
                        ativo: "",
                    },
                    cest: {
                        cest: "",
                        ncm: "",
                        descricao: "",
                    },
                    ncm: {
                        codigo: "",
                        descricao: "",
                        aliquota_nacional: "",
                        aliquota_internacional: "",
                        aliquota_estadual: "",
                        aliquota_municipal: "",
                        ativo: "",
                    },
                    cst: {
                        codigotributario: "102",
                        descricao: "",
                        icms: "",
                        ativo: "",
                    },
                    cfopEntrada: {
                        codigocfop: "1403",
                        descricao: "CLASSIFICAM-SE NESTE CODIGO AS COMPRAS DE MERCADORIAS A SEREM COMERCIALIZADAS, DECORRENTES DE OPERACOES COM MERCADORIAS SUJEITAS AO REGIME DE SUBSTITUICAO TRIBUTARIA. TAMBEM SERAO CLASSIFICADAS NESTE CODIGO AS COMPRAS DE MERCADORIAS SUJEITAS AO REGIME DE SUBSTITUICAO TRIBUTARIA EM ESTABELECIMENTO COMERCIAL DE COOPERATIVA.",
                        ativo: "",
                    },
                    cfopSaida: {
                        codigocfop: "5102",
                        descricao: "CLASSIFICAM-SE NESTE CODIGO AS VENDAS DE MERCADORIAS ADQUIRIDAS OU RECEBIDAS DE TERCEIROS PARA INDUSTRIALIZACAO OU COMERCIALIZACAO, QUE NAO TENHAM SIDO OBJETO DE QUALQUER PROCESSO INDUSTRIAL NO ESTABELECIMENTO. TAMBEM SERAO CLASSIFICADAS NESTE CODIGO AS VENDAS DE MERCADORIAS POR ESTABELECIMENTO COMERCIAL DE COOPERATIVA DESTINADAS A SEUS COOPERADOS OU ESTABELECIMENTO DE OUTRA COOPERATIVA.",
                        ativo: "",
                    },
                    icms: {
                        orig: "",
                        CST: "",
                        modBC: "",
                        vBC: "",
                        pICMS: "",
                        vICMSEntrada: "0.00",
                        reducaoBaseCalculoEntrada: "0.00",
                        vICMSSaida: "0.00",
                        reducaoBaseCalculoSaida: "0.00",
                        observacao: "",
                        FCP: "0.00"
                    },
                    pisEntrada: {
                        aliquota: "0.00",
                        descricao: "",
                        CST: "",
                        vBC: "",
                        pPIS: "",
                        vPIS: ""
                    },
                    pisSaida: {
                        aliquota: "0.00",
                        descricao: "Operação Tributável Monofásica - Revenda a Alíquota Zero",
                        CST: "04",
                        vBC: "",
                        pPIS: "",
                        vPIS: ""
                    },
                    confinsEntrada: {
                        aliquota: "0.00",
                        descricao: "",
                        CST: "",
                        vBC: "",
                        pCOFINS: "",
                        vCOFINS: ""
                    },
                    confinsSaida: {
                        aliquota: "0.00",
                        descricao: "Operação Tributável Monofásica - Revenda a Alíquota Zero",
                        CST: "04",
                        vBC: "",
                        pCOFINS: "",
                        vCOFINS: ""
                    },
                };
            }
        },
        productStoreOrUpdate: function () {
            if (typeof this.produtoV2.$loki !== 'undefined') {
                if (this.foto64 !== "") {
                    this.produtoV2.foto = this.foto64;
                }
                produtosV2.update(this.produtoV2);
            } else {
                if (this.foto64 !== "") {
                    this.produtoV2.foto = this.foto64;
                }
                produtosV2.insert(this.produtoV2);
            }
            db.save();
            this.produtoGeral = false;
            location.reload();
        }
    },
    computed: {
        allInformationFront: function () {
            return this.produtoV2.codigo
                && this.produtoV2.codigo_barras
                && this.produtoV2.referencia
                && this.produtoV2.unidade.nome
                && this.produtoV2.nome
                && this.produtoV2.descricao
                && this.produtoV2.ncm.codigo
                && this.produtoV2.cfopSaida.codigocfop
                && this.produtoV2.cst.codigotributario
                && this.produtoV2.preco_venda
                && this.produtoV2.quantidade
        }
    }
});