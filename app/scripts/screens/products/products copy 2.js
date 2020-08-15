const path = require("path");
const { dialog } = require('electron').remote;
let loki = require("lokijs");
let db = new loki(path.join(__dirname, "./loki/loki.json"));
let db2 = new loki(path.join(__dirname, "./loki/fiscals.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let data2 = read(path.join(__dirname, "./loki/fiscals.json"));
let convert = require('xml-js');
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
window.Vue = require('vue');

new Vue({
    el: 'body',
    data: {
        debug: [],
        fiscal: [],
        rootus: [],
        produtosV2: [],
        unidades: [],
        fornecedoresV2: [],
        fabricantesV2: [],
        ncms: [],
        link: true,
        cfops: [],
        mode: '',
        produtoV2: "",
        openModal: false
    },
    ready: function () {
        this.rootus = rootus.data[0];
        this.debug = debug.data[0];
        this.mode = 'edicao';
        this.produtosV2 = produtosV2.data;
        this.unidades = unidades.data[0].unidades;
        this.csts = csts.data;
        this.ncms = ncms.data;
        this.cfops = cfops.data;
        this.fiscal = fiscal.data[0];

        if (fornecedoresV2.data[0] == undefined) {
            // swal('Você não possui fornecedores cadastrados...');
        } else {
            this.fornecedoresV2 = fornecedoresV2.data[0].fornecedores;
        }

        if (fabricantesV2.data[0] == undefined) {
            // swal('Você não possui fabricantes cadastrados...');
        } else {
            this.fabricantesV2 = fabricantesV2.data[0].fabricantes;
        }

        console.log(this.produtosV2);
    },
    methods: {
        reload: function () {
            remote.getCurrentWindow().reload();
        },
        closeModal: function () {
            this.openModal = false;
            remote.getCurrentWindow().reload();
        },
        close: function () {
            remote.getCurrentWindow().reload();
            remote.getCurrentWindow().hide();
        },
        editProduct: function (product) {
            this.openModal = true;
            this.produtoV2 = product;
        },
        remove(product) {
            this.produtoV2 = product
            produtosV2.remove(this.produtoV2);
            db.save();
            location.reload();
        },
        validity: function () {
            if (this.rootus.logado == true) {

            } else {
                location.replace("login.html");
            }
        },
        addFromNote: function () {
            dialog.showOpenDialog((fileNames) => {
                if (fileNames === undefined) {
                    console.log("Nenhum arquivo selecionado!!");
                    return;
                }

                fs.readFile(fileNames[0], 'utf-8', (err, data) => {
                    if (err) {
                        alert("Ocorreu um erro ao ler o arquivo:" + err.message);
                        return;
                    }

                    var xml = data;
                    var result1 = convert.xml2json(xml, { compact: true, spaces: 4 });
                    // var result2 = convert.xml2json(xml, {compact: false, spaces: 4});
                    // console.log(result2);
                    // console.log("O conteúdo do arquivo é: " + data);
                    console.log(result1);
                });
            });

            // const path = require("path");
            // let fs = require('fs');
            // let filePath = path.join(__dirname, "images/logo.txt");
            // fileExists(filePath).then(exists => {
            //     fs.readFile(filePath, 'utf-8', (err, data) => {
            //         if (err) {
            //             alert("An error ocurred reading the file :" + err.message);
            //             return;
            //         }
            //         this.logo = data;
            //     });
            // });
        },
        createProduct: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.produtoV2 = {
                codigo: "",
                referencia: "",
                codigo_barras: "",
                nome: "",
                descricao: "",
                cst: "",
                pode_desconto: "",
                pode_fracionado: "",
                pode_balanca: "",
                pode_lote: "",
                pode_comissao: "",
                preco_compra: "",
                preco_custo: "",
                custo_medio: "",
                preco_venda: "",
                margem_lucro: "",
                desconto_max: "",
                preco_venda2: "",
                margem_lucro2: "",
                qtd_minimapv2: "",
                desconto_max2: "",
                preco_venda3: "",
                margem_lucro3: "",
                qtd_minimapv3: "",
                desconto_max3: "",
                preco_venda4: "",
                margem_lucro4: "",
                qtd_minimapv4: "",
                quantidade: "",
                desconto_max4: "",
                preco_antigo: "",
                valor_frete: "",
                ipi: "",
                preco_promocao: "",
                data_promocao: "",
                comissao: "",
                estoque: "",
                estoque_minimo: "",
                estoque_max: "",
                estoque_tara: "",
                qtd_embalagem: "",
                qtd_diasvalidade: "",
                peso_bruto: "",
                peso_liquido: "",
                tipo_produto: "",
                origem_produto: "",
                ex_tipi: "",
                ativo: "",
                observacoes: "",
                foto: "",
                foto2: "",
                foto3: "",
                local: "",
                ref_cruzada1: "",
                ref_cruzada2: "",
                ref_cruzada3: "",
                ref_cruzada4: "",
                ref_cruzada5: "",
                ref_cruzada6: "",
                cod_ean: "",
                codigo_med: "",
                tipo_med: "",
                tabela_med: "",
                linha_med: "",
                ref_anvisa_med: "",
                portaria_med: "",
                rms_med: "",
                data_vigencia_med: "",
                edicao_pharmacos: "",
                comb_cprodanp: "",
                comb_descanp: "",
                med_classeterapeutica: "",
                med_unidademedida: "",
                med_usoprolongado: "",
                med_podeatualizar: "",
                med_precovendafpop: "",
                med_margemfpop: "",
                med_apresentacaofpop: "",
                trib_issaliqsaida: "",
                trib_icmsaliqsaida: "",
                trib_icmsaliqredbasecalcsaida: "",
                trib_icmsobs: "",
                trib_icmsaliqentrada: "",
                trib_icmsaliqredbasecalcentrada: "",
                trib_icmsfcpaliq: "",
                trib_ipisaida: "",
                trib_ipialiqsaida: "",
                trib_ipientrada: "",
                trib_ipialiqentrada: "",
                trib_pissaida: "",
                trib_pisaliqsaida: "",
                trib_pisentrada: "",
                trib_pisaliqentrada: "",
                trib_cofinssaida: "",
                trib_cofinsaliqsaida: "",
                trib_cofinsentrada: "",
                trib_cofinsaliqentrada: "",
                trib_genero: "",
                empresa: {
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
                },
                subcategoria_produto: {
                    nome: "",
                    ativo: "",
                },
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
                    email_site: "",
                    obs: "",
                    ativo: "",
                    tipo: "",
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
                    codigotributario: "",
                    descricao: "",
                    icms: "",
                    ativo: "",
                },
                cfop: {
                    codigocfop: "",
                    descricao: "",
                    aplicacao: "",
                    ativo: "",
                },
                categoria_produto: {
                    nome: "",
                    ativo: "",
                    comissao: "",
                },
                grupotributaco: {
                    nome: "",
                    origem: "",
                    icms_saida_aliquota: "",
                    icms_saida_aliquota_red_base_calc: "",
                    pis_saida: "",
                    pis_saida_aliquota: "",
                    cofins_saida: "",
                    cofins_saida_aliquota: "",
                    ativo: ""
                }
            };
        },
        productStoreOrUpdate: function () {
            if (typeof this.produtoV2.$loki !== 'undefined') {
                produtosV2.update(this.produtoV2);
            } else {
                produtosV2.insert(this.produtoV2);
            }
            db.save();
            this.openModal = false;
            location.reload();
        }
    }
});