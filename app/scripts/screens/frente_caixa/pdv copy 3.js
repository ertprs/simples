const path = require("path");
let loki = require("lokijs");
let db = new loki(path.join(__dirname, "./loki/loki.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let moment = require('moment');
let Mousetrap = require('mousetrap');
let sha1 = require('sha1');
let fileExists = require('file-exists');
const { dialog } = require('electron').remote;
db.loadJSON(data);
let rootus = db.getCollection('rootus');
let salesPDVTest = db.getCollection('salesPDVTest');
let produtos = db.getCollection('produtosV2');
let clientes = db.getCollection('clientes');
let empresas = db.getCollection('empresas');
let debug = db.getCollection('debug');
let config_nfce = db.getCollection('config_nfce');
let printer = db.getCollection('printer');
let registroDeNotas = db.getCollection('registroDeNotas');

window.Vue = require('vue');

new Vue({
    el: 'body',
    data: {
        rootus: [],
        registroDeNotas: [],
        logo: '',
        configs_nfce: [],
        search: '',
        openRemoveProd: '',
        date: '',
        debug: [],
        printer: [],
        empresas: [],
        salesPDVTest: [],
        produtos: [],
        produtosEstoque: [],
        clientes: [],
        venda: {
            cupomDados: {
                chaveDeAcessoNumricaMontadaEmTransmit: '',
            },
            qrCodeDados: {
                chaveDeAcessoNumricaMontadaEmTransmit: '',
                versao: '2',
                ambiente: '2',
            },
            produto: [
                {
                    codigo: '',
                    codigoBarra: '',
                    cean: '',
                    cfop: '',
                    ncm: '',
                    cest: '',
                    nome: '',
                    descricao: '',
                    preco: '',
                    quantidade: 1,
                    desconto: '0',
                    unidade: '',
                    total: '',
                    subtotal: '',
                    valorRecebido: '',
                    troco: '',
                    imposto: '',
                }
            ],
            listProduto: [
            ],
            total: [
            ],
            totalParaLeitura: [
            ],
            nota: [],
            totalParaLeituraShow: null,
            paraExibirNatela: [
                {
                    totalParaLeituraEmString: ''
                }
            ],
            totalDescontoParaLeituraShow: null,
            totTribNot: null,
            preco_unitario: 0,
            quantidade: '',
            quantidadeTotalParaLeitura: 0,
            qrcode: '',
            tPag: '',
            digest: [],
            listViewSale: {
                nameProdStealth: '',
                qtdProdStealth: '',
                priceProdStealth: '',
                valueSaleStealth: '',
                redux: {
                    nameProdStealthRedux: ''
                },
            },
            cupom: ''

        },
        vendaPDV: [],
        nota: {
            enviNFe: {
                versao: '4.00',
                xmlns: 'http://www.portalfiscal.inf.br/nfe',
                idLote: '',
                indSinc: '1',
                NFe: {
                    infNFe: {
                        ide: {
                            cUF: '15',
                            cNF: '',
                            natOp: 'REVENDA DE MERCADORIAS SIMPLES NACIONAL',
                            indPag: '0',
                            mod: '65',
                            serie: '001',
                            nNF: '',
                            dhEmi: '',
                            tpNF: '1',
                            idDest: '1',
                            cMunFG: '',
                            tpImp: '4',
                            tpEmis: '1',
                            cDV: 'Ver na hora que for começar os testes de transmissão online.',
                            tpAmb: '',
                            finNFe: '1',
                            indFinal: '1',
                            indPres: '1',
                            procEmi: '0',
                            verProc: '1',
                        },
                        emit: {
                            CNPJ: '',
                            xNome: '',
                            xFant: '',
                            enderEmit: {
                                xLgr: '',
                                nro: '',
                                xCpl: '',
                                xBairro: '',
                                cMun: '',
                                xMun: '',
                                UF: '',
                                CEP: '',
                                cPais: '',
                                xPais: '',
                                fone: '',
                            }
                        },
                        IE: '',
                        CRT: ''
                    },
                    dest: {
                        CPF: '',
                        xNome: '',
                        enderDest: {
                            xLgr: '',
                            nro: '',
                            xCpl: '',
                            xBairro: '',
                            cMun: '',
                            xMun: '',
                            UF: '',
                            CEP: '',
                            cPais: '1058',
                            xPais: 'Brasil',
                            fone: '',
                        }
                    },
                    det: [
                    ],
                    total: {
                        ICMSTot: {
                            vBC: '0.00',
                            vICMS: '0.00',
                            vBCST: '0.00',
                            vST: '0.00',
                            vProd: '',
                            vFrete: '0.00',
                            vSeg: '0.00',
                            vDesc: '',
                            vII: '0.00',
                            vIPI: '0.00',
                            vPIS: '0.00',
                            vCOFINS: '0.00',
                            vOutro: '0.00',
                            vNF: '',
                        }
                    },
                    transp: {
                        modFrete: '9'
                    },
                    pag: {
                        tPag: '01',
                        vPag: '',
                        card: {
                            tpIntegra: '2',
                            CNPJ: '',
                            tBand: '',
                            cAut: ''
                        }
                    },
                    infAdic: {
                    },
                }
            },
        },
    },
    ready: function () {
        this.loadConfig();
        this.loadDataPattern();
        this.fillPatternNote();
        this.focusInProductField();
    },
    methods: {
        loadConfig: function () {
            console.count('Method => loadConfig');
            this.rootus = rootus.data[0];
            this.loadLogo();
            this.configs_nfce = config_nfce.data;
            this.debug = debug.data[0];
            this.printer = printer.data[0];

            Mousetrap.bind('*', function () {
                document.getElementById("qtdeInFocus").focus();
                console.log('*');
            }, 'keyup');
        },
        loadLogo: function () {
            const path = require("path");
            let fs = require('fs');
            let filePath = path.join(__dirname, "images/logo.txt");
            fileExists(filePath).then(exists => {
                fs.readFile(filePath, 'utf-8', (err, data) => {
                    if (err) {
                        alert("An error ocurred reading the file :" + err.message);
                        return;
                    }
                    this.logo = data;
                });
            });
        },
        focuInRemoveButtom: function () {
            console.count('Method => focuInRemoveButtom');
            document.getElementById("removeItemButtom").focus();
        },
        loadDataPattern: function () {
            console.count('Method => loadDataPattern');
            this.salesPDVTest = salesPDVTest.data;
            this.produtos = produtos.data;
            this.clientes = clientes.data;
            this.empresas = empresas.data;
            this.registroDeNotas = registroDeNotas.data;
            console.log(this.empresas);
            
            if (this.produtos.length === 0) {
                location.href = "main2.html";
            }
        },
        fillPatternNote: function () {
            console.count('Method => fillPatternNote');
            let codigoNotaOr = Math.floor(Math.random() * 100000000 + 1);
            let codigoNota = String(codigoNotaOr);

            if (codigoNota.length == 1) {
                codigoNota = "0000000" + codigoNota;
            } else if (codigoNota.length == 2) {
                codigoNota = "000000" + codigoNota;
            } else if (codigoNota.length == 3) {
                codigoNota = "00000" + codigoNota;
            } else if (codigoNota.length == 4) {
                codigoNota = "0000" + codigoNota;
            } else if (codigoNota.length == 5) {
                codigoNota = "000" + codigoNota;
            } else if (codigoNota.length == 6) {
                codigoNota = "00" + codigoNota;
            } else if (codigoNota.length == 7) {
                codigoNota = "0" + codigoNota;
            }

            let numNota = Math.floor(Math.random() * 1000000000 + 10);
            let idDoLote = Math.floor(Math.random() * 1000000000 + 7);
            this.nota.enviNFe.idLote = idDoLote;
            this.nota.enviNFe.NFe.infNFe.ide.cNF = codigoNota;
            this.nota.enviNFe.NFe.infNFe.ide.cMunFG = this.empresas[0].endereco.codigoMunicipio;
            this.nota.enviNFe.NFe.infNFe.emit.CNPJ = this.empresas[0].cnpj;
            this.nota.enviNFe.NFe.infNFe.emit.xNome = this.empresas[0].nome;
            this.nota.enviNFe.NFe.infNFe.emit.xFant = this.empresas[0].nome;
            this.nota.enviNFe.NFe.infNFe.IE = this.empresas[0].ie;
            this.nota.enviNFe.NFe.infNFe.CRT = this.empresas[0].regimeTributario;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.xLgr = this.empresas[0].endereco.endereco;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.nro = this.empresas[0].endereco.numero;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.xCpl = this.empresas[0].endereco.complemento;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.xBairro = this.empresas[0].endereco.bairro;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.cMun = this.empresas[0].endereco.codigoMunicipio;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.xMun = this.empresas[0].endereco.municipio;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.UF = this.empresas[0].endereco.uf;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.CEP = this.empresas[0].endereco.cep;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.cPais = this.empresas[0].endereco.codigoPais;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.xPais = this.empresas[0].endereco.pais;
            this.nota.enviNFe.NFe.infNFe.emit.enderEmit.fone = this.empresas[0].endereco.fone;
        },
        /**
         *----------------------------------------------------
         * Adiciona produtos na nota baseado em ICMSSN102.
         *----------------------------------------------------
         */
        adicionarProdutosNaNFCEICMSSN102: function () {
            console.count('Method => adicionarProdutosNaNFCEICMSSN102');
            console.log("Caracteres do Preço:");
            console.log(String(this.venda.produto[0].preco).length);

            let vUnCom = this.adjustValuesvUnCom(this.venda.produto[0].preco);

            this.nota.enviNFe.NFe.det.push(
                {
                    nItem: '',
                    prod: {
                        cProd: this.venda.produto[0].codigo,
                        cEAN: this.venda.produto[0].codigoBarra,
                        xProd: this.venda.produto[0].descricao,
                        NCM: this.venda.produto[0].ncm,
                        CEST: this.venda.produto[0].cest,
                        CFOP: this.venda.produto[0].cfop,
                        uCom: this.venda.produto[0].unidade,
                        qCom: this.venda.produto[0].quantidade + '.' + "0000",
                        vUnCom: vUnCom,
                        vProd: this.venda.produto[0].preco,
                        cEANTrib: this.venda.produto[0].codigoBarra,
                        uTrib: this.venda.produto[0].unidade,
                        qTrib: this.venda.produto[0].quantidade + '.' + "0000",
                        vUnTrib: vUnCom,
                        vDesc: this.venda.produto[0].desconto,
                        indTot: '1',
                    },
                    imposto: {
                        vTotTrib: this.venda.produto[0].imposto,
                        ICMS: {
                            ICMSSN102: {
                                orig: '0', //0 para nacional.
                                CSOSN: 102
                            }
                        },
                        PIS: {
                            PISNT: {
                                CST: '04',
                            }
                        },
                        COFINS: {
                            COFINSNT: {
                                CST: '04',
                            }
                        }
                    }
                });
        },
        adjustValuesvUnCom: function (val) {
            let regExp0 = /^\d$/;
            let regExp0_2 = /^\d\d$/;
            let regExp0_3 = /^\d\d\d$/;
            let regExp0_4 = /^\d\d\d\d$/;
            let regExp1 = /^\d\.\d\d$/;
            let regExp1_2 = /^\d\d\.\d\d$/;
            let regExp1_3 = /^\d\d\d\.\d\d$/;
            let regExp1_4 = /^\d\d\d\d\.\d\d$/;
            let value = String(val);

            console.log('regExp0', regExp0.test(value));
            console.log('regExp0_2', regExp0_2.test(value));
            console.log('regExp0_3', regExp0_3.test(value));
            console.log('regExp0_4', regExp0_4.test(value));
            console.log('regExp1', regExp1.test(value));
            console.log('regExp1_2', regExp1_2.test(value));
            console.log('regExp1_3', regExp1_3.test(value));
            console.log('regExp1_4', regExp1_4.test(value));

            if (regExp0.test(value) == true
                && regExp0_2.test(value) == false
                && regExp0_3.test(value) == false
                && regExp0_4.test(value) == false
                && regExp1.test(value) == false
                && regExp1_2.test(value) == false
                && regExp1_3.test(value) == false
                && regExp1_4.test(value) == false
            ) {
                console.log(regExp0.test(value));
                console.log('regExp0 rodando....');
                value = value + '.00';
                console.log(value);
                return value = value;
            }

            if (regExp0.test(value) == false
                && regExp0_2.test(value) == true
                && regExp0_3.test(value) == false
                && regExp0_4.test(value) == false
                && regExp1.test(value) == false
                && regExp1_2.test(value) == false
                && regExp1_3.test(value) == false
                && regExp1_4.test(value) == false
            ) {
                console.log(regExp0_2.test(value));
                console.log('regExp0_2 rodando....');
                value = value + '.00';
                console.log(value);
                return value = value;
            }

            if (regExp0.test(value) == false
                && regExp0_2.test(value) == false
                && regExp0_3.test(value) == true
                && regExp0_4.test(value) == false
                && regExp1.test(value) == false
                && regExp1_2.test(value) == false
                && regExp1_3.test(value) == false
                && regExp1_4.test(value) == false
            ) {
                console.log(regExp0_3.test(value));
                console.log('regExp0_3 rodando....');
                value = value + '.00';
                console.log(value);
                return value = value;
            }

            if (regExp0.test(value) == false
                && regExp0_2.test(value) == false
                && regExp0_3.test(value) == false
                && regExp0_4.test(value) == true
                && regExp1.test(value) == false
                && regExp1_2.test(value) == false
                && regExp1_3.test(value) == false
                && regExp1_4.test(value) == false
            ) {
                console.log(regExp0_4.test(value));
                console.log('regExp0_4 rodando....');
                value = value + '.00';
                console.log(value);
                return value;
            }

            if (regExp0.test(value) == false
                && regExp0_2.test(value) == false
                && regExp0_3.test(value) == false
                && regExp0_4.test(value) == false
                && regExp1.test(value) == true
                && regExp1_2.test(value) == false
                && regExp1_3.test(value) == false
                && regExp1_4.test(value) == false
            ) {
                console.log(regExp1.test(value));
                console.log('regExp1 rodando....');
                value = value + '00';
                console.log(value);
                return value;
            }

            if (regExp0.test(value) == false
                && regExp0_2.test(value) == false
                && regExp0_3.test(value) == false
                && regExp0_4.test(value) == false
                && regExp1.test(value) == false
                && regExp1_2.test(value) == true
                && regExp1_3.test(value) == false
                && regExp1_4.test(value) == false
            ) {
                console.log(regExp1_2.test(value));
                console.log('regExp1_2 rodando....');
                value = value + '00';
                console.log(value);
                return value = value;
            }

            if (regExp0.test(value) == false
                && regExp0_2.test(value) == false
                && regExp0_3.test(value) == false
                && regExp0_4.test(value) == false
                && regExp1.test(value) == false
                && regExp1_2.test(value) == false
                && regExp1_3.test(value) == true
                && regExp1_4.test(value) == false
            ) {
                console.log(regExp1_3.test(value));
                console.log('regExp1_3 rodando....');
                value = value + '00';
                console.log(value);
                return value = value;
            }

            if (regExp0.test(value) == false
                && regExp0_2.test(value) == false
                && regExp0_3.test(value) == false
                && regExp0_4.test(value) == false
                && regExp1.test(value) == false
                && regExp1_2.test(value) == false
                && regExp1_3.test(value) == false
                && regExp1_4.test(value) == true
            ) {
                console.log(regExp1_4.test(value));
                console.log('regExp1_4 rodando....');
                value = value + '00';
                console.log(value);
                return value = value;
            }
        },
        adicionarProdutosNaNFCE: function () {
            console.count('Method => adicionarProdutosNaNFCE');
            this.nota.enviNFe.NFe.det.push(
                {
                    nItem: '',
                    prod: {
                        cProd: this.venda.produto[0].codigo,
                        cEAN: this.venda.produto[0].codigoBarra,
                        xProd: this.venda.produto[0].descricao,
                        NCM: this.venda.produto[0].ncm,
                        CEST: this.venda.produto[0].cest,
                        CFOP: this.venda.produto[0].cfop,
                        uCom: this.venda.produto[0].unidade,
                        qCom: this.venda.produto[0].quantidade + '.' + "0000",
                        vUnCom: this.venda.produto[0].preco + '.' + "0000",
                        vProd: this.venda.produto[0].preco + '.' + "00",
                        cEANTrib: this.venda.produto[0].codigoBarra,
                        uTrib: this.venda.produto[0].unidade,
                        qTrib: this.venda.produto[0].quantidade + '.' + "0000",
                        vUnTrib: this.venda.produto[0].preco + '.' + "0000",
                        vDesc: this.venda.produto[0].desconto,
                        indTot: '1',
                    },
                    imposto: {
                        ICMS: {
                            ICMS60: {
                                orig: '0',
                                CST: '60',
                                vBCSTRet: '0.00',
                                vICMSSTRet: '0.00',
                            }
                        },
                        PIS: {
                            PISAliq: {
                                CST: '01',
                                vBC: this.venda.produto[0].preco + '.' + "00",
                                pPIS: '0.65',
                                vPIS: ((this.venda.produto[0].preco + '.' + "00") * 0.65) / 100,
                            }
                        },
                        COFINS: {
                            COFINSAliq: {
                                CST: '01',
                                vBC: this.venda.produto[0].preco + '.' + "00",
                                pCOFINS: '3.00',
                                vCOFINS: ((this.venda.produto[0].preco + '.' + "00") * 3.00) / 100,
                            }
                        }
                    }
                });
        },
        adicionarTotalNaNotaICMSSN102: function () {
            console.count('Method => adicionarTotalNaNotaICMSSN102');
            let vProd = 0;
            let vDesc = 0;
            let vNF = 0;
            let qtd = 0;
            let imposto = 0;

            for (var x = 0; x < this.nota.enviNFe.NFe.det.length; x++) {
                qtd = this.nota.enviNFe.NFe.det[x].prod.qCom;
                vProd = vProd + (parseFloat(this.nota.enviNFe.NFe.det[x].prod.vProd) * qtd);
                vDesc = vDesc + parseFloat(this.nota.enviNFe.NFe.det[x].prod.vDesc);
                vNF = vNF + (parseFloat(this.nota.enviNFe.NFe.det[x].prod.vProd) * qtd) - parseFloat(this.nota.enviNFe.NFe.det[x].prod.vDesc);
                imposto = imposto + (parseFloat(this.nota.enviNFe.NFe.det[x].imposto.vTotTrib));

                this.nota.enviNFe.NFe.total.ICMSTot.vProd = vProd;
                this.nota.enviNFe.NFe.total.ICMSTot.vDesc = vDesc;
                this.nota.enviNFe.NFe.total.ICMSTot.vNF = vNF.toFixed(2);
                this.nota.enviNFe.NFe.total.ICMSTot.vTotTrib = imposto;
                this.nota.enviNFe.NFe.pag.vPag = vNF.toFixed(2);
            }

            let regExp0 = /^\d{1,4}\.\d$/;

            if (regExp0.test(this.nota.enviNFe.NFe.total.ICMSTot.vProd) == true) {
                this.nota.enviNFe.NFe.total.ICMSTot.vProd = this.nota.enviNFe.NFe.total.ICMSTot.vProd + '0';
            }

            if (regExp0.test(this.nota.enviNFe.NFe.pag.vPag) == true) {
                this.nota.enviNFe.NFe.pag.vPag = this.nota.enviNFe.NFe.pag.vPag + '0';
            }

            this.nota.enviNFe.NFe.total.ICMSTot.vDesc = parseFloat(this.nota.enviNFe.NFe.total.ICMSTot.vDesc);
            this.nota.enviNFe.NFe.total.ICMSTot.vNF = parseFloat(this.nota.enviNFe.NFe.total.ICMSTot.vNF);

            if (regExp0.test(this.nota.enviNFe.NFe.total.ICMSTot.vNF) == true) {
                this.nota.enviNFe.NFe.total.ICMSTot.vNF = this.nota.enviNFe.NFe.total.ICMSTot.vNF + '0';
            }
        },
        calcTotTribNot() {
            console.count('Method => calcTotTribNot');
            this.venda.totTribNot = this.nota.enviNFe.NFe.total.ICMSTot.vPIS + this.nota.enviNFe.NFe.total.ICMSTot.vCOFINS;
        },
        finishRegister: function () {
            console.count('Method => finishRegister');
            fecharModal();
            if (this.venda.listProduto !== 0) {
                if (confirm("Tem certeza que deseja finalizar a compra?") == true) {
                    this.venda.produto[0].troco = this.venda.produto[0].valorRecebido.replace(',', '.') - this.venda.totalParaLeituraShow;
                    this.pushTotal();

                    if (this.empresas[0].icmstipo == '102') { //Calcula os impostos da nota. Pode ser trocado!
                        console.log('Tipo ICMS: ', 102);
                        this.adicionarTotalNaNotaICMSSN102();
                    } else {
                        dialog.showMessageBox({
                            message: "Preecha o ICMS da Empresa!",
                        });

                        // location.reload();
                    }

                    this.calcTotTribNot();

                    if (navigator.onLine) {
                        // this.transmitOff();
                        this.transmit();
                        this.pushSalePDV(this.venda.listProduto, this.venda.total, this.venda.nota, false);
                        this.saleStoreOrUpdateTest();
                        this.genQrcode();
                    }
                    else {
                        this.transmitOff();
                        this.pushSalePDV(this.venda.listProduto, this.venda.total, this.venda.nota, true);
                        this.saleStoreOrUpdateTest();
                        this.genQrcode();
                    }
                }
                else {
                    this.cleanFields();
                }
            }
            else {
                alert('Não salvou corretamente.....');
            }

            function fecharModal() {
                $('#typePay').modal('hide');
            }
        },
        addRegister: function () {
            console.count('Method => addRegister');
            if (this.venda.produto[0].valorRecebido !== '') {
                let valorRecebido = parseFloat(this.venda.produto[0].valorRecebido.replace(',', '.'));
                let totalMaisDesconto = parseFloat(this.venda.totalParaLeituraShow);

                if (valorRecebido >= totalMaisDesconto) {
                    this.toTypePay();
                }
                else {
                    alert('Valor recebido incorreto');
                    document.getElementById("valorRecebidoInFocus").focus();
                }
            }
            else {
                document.getElementById("prodInFocus").disabled = false;
                document.getElementById("qtdeInFocus").disabled = false;
                document.getElementById("descontoInFocus").disabled = false;
                this.cleanFields();
            }
        },
        pushTotal: function () {
            console.count('Method => pushTotal');
            this.venda.total.push(
                {
                    usuario: this.rootus.user,
                    dataAno: moment().format("YYYY"),
                    dataMes: moment().format("MM"),
                    dataDia: moment().format("DD"),
                    dataFullDefault: moment().format("YYYY-MM-DD"),
                    dataFull: moment().format("DD-MM-YYYY"),
                    valorRecebido: this.venda.produto[0].valorRecebido,
                    total: this.venda.totalParaLeituraShow,
                    troco: this.venda.produto[0].troco.toFixed(2),
                    desconto: parseFloat(this.venda.totalDescontoParaLeituraShow),
                }
            );
            console.log(this.venda.total);
        },
        pushListProduct: function () {
            console.count('Method => pushListProduct');
            this.venda.listProduto.unshift(
                {
                    codigo: this.venda.produto[0].codigo,
                    codigoBarra: this.venda.produto[0].codigoBarra,
                    cean: this.venda.produto[0].cean,
                    cfop: this.venda.produto[0].cfop,
                    ncm: this.venda.produto[0].ncm,
                    cest: this.venda.produto[0].cest,
                    nome: this.venda.produto[0].nome,
                    descricao: this.venda.produto[0].descricao,
                    preco: this.venda.produto[0].preco,
                    quantidade: this.venda.produto[0].quantidade,
                    unidade: this.venda.produto[0].unidade,
                    desconto: this.venda.produto[0].desconto,
                    subtotal: this.venda.produto[0].subtotal,
                }
            );
            console.log(this.venda.listProduto);
            this.adicionarProdutosNaNFCEICMSSN102();
        },
        testPrinter: function () {
            const path = require("path")
            var printer = require("pdf-to-printer");
            printer
                .print(path.join(__dirname, "tmp", "output2.pdf"))
                .then(console.log)
                .catch(console.error);
        },
        pushSalePDV: function (listProduct, total, xml, contingencia) {
            console.count('Method => pushSalePDV');
            let numNot = 1;
            let serie = this.configs_nfce[0].geral[0].serie;

            if (this.salesPDVTest.length == 0) {
                numNot = 1;
            } else if (this.salesPDVTest[this.salesPDVTest.length - 1].num == 999999999) {
                serie = this.configs_nfce[0].geral[0].serie;
                numNot = 1;
            }
            else {
                numNot = this.salesPDVTest[this.salesPDVTest.length - 1].num + 1;
            }

            this.vendaPDV.push(
                {
                    hora: moment().format('hh:mm'),
                    dataAno: moment().format("YYYY"),
                    dataMes: moment().format("MM"),
                    dataDia: moment().format("DD"),
                    dataFullDefault: moment().format("YYYY-MM-DD"),
                    dataFull: moment().format("DD-MM-YYYY"),
                    serie: serie,
                    num: numNot,
                    listProduct: listProduct,
                    total: total,
                    xml: xml,
                    contingencia: contingencia
                }
            );
            console.log(this.vendaPDV[0]);
        },
        transmit: function () {
            console.count('Method => transmit');
            let cUF = this.nota.enviNFe.NFe.infNFe.ide.cUF;
            let dhEmi = moment().format("YYMM");
            let cnpj = this.nota.enviNFe.NFe.infNFe.emit.CNPJ;
            let mod = this.nota.enviNFe.NFe.infNFe.ide.mod;

            /**
             *----------------------------------------------------
             * Atualização da série e numeração da nota - Início
             *----------------------------------------------------
             */
            let nNF = 1;
            let serie = this.configs_nfce[0].geral[0].serie;

            if (this.salesPDVTest.length == 0) {
                nNF = 1;
            } else if (this.salesPDVTest[this.salesPDVTest.length - 1].num == 999999999) {

                this.configs_nfce[0].geral[0].serie = this.configs_nfce[0].geral[0].serie + 1;
                config_nfce.update(this.configs_nfce);
                db.save();

                serie = this.configs_nfce[0].geral[0].serie;
                nNF = 1;
            }
            else {
                nNF = this.salesPDVTest[this.salesPDVTest.length - 1].num + 1;
            }
            /**
             *----------------------------------------------------
             * Atualização da série e numeração da nota - Fim
             *----------------------------------------------------
             */

            this.nota.enviNFe.NFe.infNFe.ide.serie = serie;
            this.nota.enviNFe.NFe.infNFe.ide.nNF = nNF;

            /**
             *----------------------------------------------------
             * Formatando série e número - Início
             *----------------------------------------------------
             */
            let serieParseString = String(serie);

            if (serieParseString.length == 1) {
                serieParseString = "00" + serieParseString;
            } else if (serieParseString.length == 2) {
                serieParseString = "0" + serieParseString;
            }

            let nNFParseString = String(nNF);

            if (nNFParseString.length == 1) {
                nNFParseString = "00000000" + nNFParseString;
            } else if (nNFParseString.length == 2) {
                nNFParseString = "0000000" + nNFParseString;
            } else if (nNFParseString.length == 3) {
                nNFParseString = "000000" + nNFParseString;
            } else if (nNFParseString.length == 4) {
                nNFParseString = "00000" + nNFParseString;
            } else if (nNFParseString.length == 5) {
                nNFParseString = "0000" + nNFParseString;
            } else if (nNFParseString.length == 6) {
                nNFParseString = "000" + nNFParseString;
            } else if (nNFParseString.length == 7) {
                nNFParseString = "00" + nNFParseString;
            } else if (nNFParseString.length == 8) {
                nNFParseString = "0" + nNFParseString;
            }

            console.log(serieParseString);
            console.log(nNFParseString);
            /**
             *----------------------------------------------------
             * Formatando série e número - Fim
             *----------------------------------------------------
             */

            let tpEmis = this.nota.enviNFe.NFe.infNFe.ide.tpEmis;
            let cNF = this.nota.enviNFe.NFe.infNFe.ide.cNF;


            /**
             *----------------------------------------------------
             * Calculando digito verificador - Início
             *----------------------------------------------------
             */
            let keyPassPartOne = cUF + dhEmi + cnpj + mod + serieParseString + nNFParseString + tpEmis + cNF;
            let mult = "4329876543298765432987654329876543298765432";
            let cDV = 0;

            if (String(keyPassPartOne).length == String(mult).length) {
                let total = 0;
                for (let i = 0; i < keyPassPartOne.length; i++) {
                    total = total + keyPassPartOne[i] * mult[i];
                }

                console.log("Total:", total);
                calc1 = total / 11;
                calc2 = total % 11;

                console.log("Divisão por 11:", calc1);
                console.log("Módulo:", calc2);

                if (calc2 == 0 || calc2 == 1) {
                    cDV = 0
                } else {
                    cDV = 11 - calc2;
                }

                console.log("Dígito Verificador:", cDV);

            } else {
                console.log('Erro ao calcular dígito verificador, verifique se a quantidade de caracteres das variáveis é compátivel.');
            }
            /**
             *----------------------------------------------------
             * Calculando digito verificador - Fim
             *----------------------------------------------------
             */

            this.nota.enviNFe.NFe.infNFe.ide.cDV = cDV;
            let keyPassFinal = keyPassPartOne + cDV;
            console.log("Chave de Acesso Montada:", keyPassFinal);
            this.venda.cupomDados.chaveDeAcessoNumricaMontadaEmTransmit = keyPassFinal;
            this.venda.qrCodeDados.chaveDeAcessoNumricaMontadaEmTransmit = keyPassFinal;
            let idNota = 'NFe' + keyPassFinal;
            let nota = '<?xml version="1.0" encoding="UTF-8"?>';
            let digest = '';

            /**
             *----------------------------------------------------
             * Montando Nota - Início
             *----------------------------------------------------
             */
            for (var i = 0; i < [this.nota.enviNFe].length; i++) {
                nota = nota + '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">'
                    + '<NFe>'
                    + '<infNFe Id="' + idNota + '" versao="4.00">'
                    + '<ide>'
                    + '     <cUF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cUF'] + '</cUF>'
                    + '     <cNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cNF'] + '</cNF>'
                    + '     <natOp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['natOp'] + '</natOp>'
                    + '     <mod>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['mod'] + '</mod>'
                    + '     <serie>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['serie'] + '</serie>'
                    + '     <nNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['nNF'] + '</nNF>'
                    + '     <dhEmi>' + moment().format() + '</dhEmi>'
                    + '     <tpNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpNF'] + '</tpNF>'
                    + '     <idDest>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['idDest'] + '</idDest>'
                    + '     <cMunFG>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cMunFG'] + '</cMunFG>'
                    + '     <tpImp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpImp'] + '</tpImp>'

                if (navigator.onLine) {
                    nota = nota + '<tpEmis>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpEmis'] + '</tpEmis>'
                }
                else {
                    nota = nota + '<tpEmis>9</tpEmis>'
                }

                nota = nota
                    + '<cDV>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cDV'] + '</cDV>'
                    + '     <tpAmb>' + this.configs_nfce[0].geral[0].ambiente + '</tpAmb>'
                    + '     <finNFe>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['finNFe'] + '</finNFe>'
                    + '     <indFinal>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indFinal'] + '</indFinal>'
                    + '     <indPres>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indPres'] + '</indPres>'
                    + '     <procEmi>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['procEmi'] + '</procEmi>'
                    + '     <verProc>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['verProc'] + '</verProc>'
                    + ' </ide>'
                    + ' <emit>'
                    + ' <CNPJ>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['CNPJ'] + '</CNPJ>'
                    + ' <xNome>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['xNome'] + '</xNome>'
                    + ' <enderEmit>'
                    + '     <xLgr>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xLgr'] + '</xLgr>'
                    + '     <nro>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['nro'] + '</nro>'
                    + '     <xBairro>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xBairro'] + '</xBairro>'
                    + '     <cMun>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['cMun'] + '</cMun>'
                    + '     <xMun>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xMun'] + '</xMun>'
                    + '     <UF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['UF'] + '</UF>'
                    + '     <CEP>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['CEP'] + '</CEP>'
                    + '     <cPais>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['cPais'] + '</cPais>'
                    + '     <xPais>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xPais'] + '</xPais>'
                    + '     <fone>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['fone'] + '</fone>'
                    + ' </enderEmit>'
                    + ' <IE>' + [this.nota.enviNFe][i]['NFe']['infNFe']['IE'] + '</IE>'
                    + ' <CRT>' + [this.nota.enviNFe][i]['NFe']['infNFe']['CRT'] + '</CRT>'
                    + ' </emit>'

                for (var d = 0; d < [this.nota.enviNFe][i]['NFe']['det'].length; d++) {
                    nota = nota
                        + '<det nItem="' + (d + 1) + '">'
                        + ' <prod>'
                        + '     <cProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cProd'] + '</cProd>'
                        + '     <cEAN>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cEAN'] + '</cEAN>'
                        + '     <xProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['xProd'] + '</xProd>'
                        + '     <NCM>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['NCM'] + '</NCM>'
                        + '     <CFOP>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['CFOP'] + '</CFOP>'
                        + '     <uCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['uCom'] + '</uCom>'
                        + '     <qCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['qCom'] + '</qCom>'
                        + '     <vUnCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vUnCom'] + '</vUnCom>'
                        + '     <vProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vProd'] + '</vProd>'
                        + '     <cEANTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cEANTrib'] + '</cEANTrib>'
                        + '     <uTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['uTrib'] + '</uTrib>'
                        + '     <qTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['qTrib'] + '</qTrib>'
                        + '     <vUnTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vUnTrib'] + '</vUnTrib>'
                        + '     <indTot>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['indTot'] + '</indTot>'
                        + ' </prod>'
                        + ' <imposto>'
                        + '     <vTotTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['vTotTrib'] + '</vTotTrib>'
                        + '     <ICMS>'
                        + '         <ICMSSN102>'
                        + '             <orig>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMSSN102']['orig'] + '</orig>'
                        + '             <CSOSN>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMSSN102']['CSOSN'] + '</CSOSN>'
                        + '         </ICMSSN102>'
                        + '     </ICMS>'
                        + '     <PIS>'
                        + '         <PISNT>'
                        + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISNT']['CST'] + '</CST>'
                        + '         </PISNT>'
                        + '     </PIS>'
                        + '     <COFINS>'
                        + '         <COFINSNT>'
                        + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSNT']['CST'] + '</CST>'
                        + '         </COFINSNT>'
                        + '     </COFINS>'
                        + ' </imposto>'
                        + '</det>'
                }


                /**
                 *----------------------------------------------------
                 * Colocando Total - Início
                 *----------------------------------------------------
                 */
                nota = nota
                    + ' <total>'
                    + '    <ICMSTot>'
                    + '      <vBC>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBC'] + '</vBC>'
                    + '      <vICMS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vICMS'] + '</vICMS>'
                    + '      <vICMSDeson>0.00</vICMSDeson>'
                    + '      <vFCP>0.00</vFCP>'
                    + '      <vBCST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBCST'] + '</vBCST>'
                    + '      <vST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vST'] + '</vST>'
                    + '      <vFCPST>0.00</vFCPST>'
                    + '      <vFCPSTRet>0.00</vFCPSTRet>'
                    + '      <vProd>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vProd'] + '</vProd>'
                    + '      <vFrete>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vFrete'] + '</vFrete>'
                    + '      <vSeg>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vSeg'] + '</vSeg>'
                    + '      <vDesc>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vDesc'] + '</vDesc>'
                    + '      <vII>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vII'] + '</vII>'
                    + '      <vIPI>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vIPI'] + '</vIPI>'
                    + '      <vIPIDevol>0.00</vIPIDevol>'
                    + '      <vPIS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vPIS'] + '</vPIS>'
                    + '      <vCOFINS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vCOFINS'] + '</vCOFINS>'
                    + '      <vOutro>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vOutro'] + '</vOutro>'
                    + '      <vNF>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vNF'] + '</vNF>'
                    + '      <vTotTrib>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vTotTrib'] + '</vTotTrib>'
                    + '    </ICMSTot>'
                    + '</total>'
                    + '<transp>'
                    + '    <modFrete>' + [this.nota.enviNFe][i]['NFe']['transp']['modFrete'] + '</modFrete>'
                    + '</transp>'
                /**
                 *----------------------------------------------------
                 * Colocando Total - Início
                 *----------------------------------------------------
                 */

                /**
                 *----------------------------------------------------
                 * Colocando Forma de Pagamento - Início
                 *----------------------------------------------------
                 */
                if (this.venda.tPag == '03' || this.venda.tPag == '03') {
                    nota = nota
                        + ' <pag>'
                        + '     <detPag>'
                        + '         <tPag>' + [this.nota.enviNFe][i]['NFe']['pag']['tPag'] + '</tPag>'
                        + '         <vPag>' + [this.nota.enviNFe][i]['NFe']['pag']['vPag'] + '</vPag>'
                        + '     </detPag>'
                        + ' <card>'
                        + '    <tpIntegra>' + this.configs_nfce[0].cartao_credito[0].tpIntegra + '</tpIntegra>'
                        + ' </card>'
                        + '</pag>'
                } else {
                    nota = nota
                        + ' <pag>'
                        + '     <detPag>'
                        + '         <tPag>' + [this.nota.enviNFe][i]['NFe']['pag']['tPag'] + '</tPag>'
                        + '         <vPag>' + [this.nota.enviNFe][i]['NFe']['pag']['vPag'] + '</vPag>'
                        + '     </detPag>'
                        + '</pag>'
                }
                /**
                 *----------------------------------------------------
                 * Colocando Forma de Pagamento - Fim
                 *----------------------------------------------------
                 */

                nota = nota
                    + '</infNFe>'
                    + ' </NFe>'
                    + '</nfeProc>';

                this.venda.nota.push(
                    {
                        xml: nota
                    }
                );
            }
            /**
             *----------------------------------------------------
             * Montando Nota - Fim
             *----------------------------------------------------
             */

            console.count('Data => nota');
            console.log(this.venda.nota);

            let select = require('xml-crypto').xpath;
            let dom = require('xmldom').DOMParser;
            let SignedXml = require('xml-crypto').SignedXml;
            let FileKeyInfo = require('xml-crypto').FileKeyInfo;
            let fs = require('fs');
            let forge = require('node-forge');

            let xml = this.venda.nota[0].xml;

            function MyKeyInfo() {
                this.getKeyInfo = function (key, prefix) {
                    if (Buffer.isBuffer(key)) {
                        key = key.toString('ascii');
                    }

                    if (key == null || typeof key !== 'string') {
                        throw new Error('key must be a valid certificate in PEM format');
                    }

                    this._certificatePEM = key;

                    var keyInfoXml,
                        certBodyInB64;

                    prefix = prefix || '';
                    prefix = prefix ? prefix + ':' : prefix;

                    certBodyInB64 = forge.util.encode64(forge.pem.decode(this._certificatePEM)[0].body);
                    keyInfoXml = '<' + prefix + 'X509Data>';
                    keyInfoXml += '<' + prefix + 'X509Certificate>';
                    keyInfoXml += certBodyInB64;
                    keyInfoXml += '</' + prefix + 'X509Certificate>';
                    keyInfoXml += '</' + prefix + 'X509Data>';
                    return keyInfoXml;
                };

                this.getKey = function () {
                    return this._certificatePEM;
                };
            }

            function validateXml(xml, key) {
                var doc = new dom().parseFromString(xml)
                var signature = select(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]
                var sig = new SignedXml()
                sig.keyInfoProvider = new FileKeyInfo(key)
                sig.loadSignature(signature.toString())
                var res = sig.checkSignature(xml)
                if (!res) console.log(sig.validationErrors)
                return res;
            }

            function signXml(xml, xpath, key, dest) {
                var sig = new SignedXml()
                sig.addReference(xpath)
                console.log('Assinando Nota....');
                sig.signingKey = fs.readFileSync(key)
                sig.keyInfoProvider = new MyKeyInfo()
                sig.computeSignature(xml)
                fs.writeFileSync(dest, sig.getSignedXml())
            }

            signXml(xml,
                "//*[local-name(.)='infNFe']",
                "client.pem",
                "signed.xml");
        },
        transmitOff: function () {
            console.count('Method => transmit');
            let cUF = this.nota.enviNFe.NFe.infNFe.ide.cUF;
            let dhEmi = moment().format("YYMM");
            let cnpj = this.nota.enviNFe.NFe.infNFe.emit.CNPJ;
            let mod = this.nota.enviNFe.NFe.infNFe.ide.mod;

            /**
             *----------------------------------------------------
             * Atualização da série e numeração da nota - Início
             *----------------------------------------------------
             */
            let nNF = 1;
            let serie = this.configs_nfce[0].geral[0].serie;

            if (this.salesPDVTest.length == 0) {
                nNF = 1;
            } else if (this.salesPDVTest[this.salesPDVTest.length - 1].num == 999999999) {

                this.configs_nfce[0].geral[0].serie = this.configs_nfce[0].geral[0].serie + 1;
                config_nfce.update(this.configs_nfce);
                db.save();

                serie = this.configs_nfce[0].geral[0].serie;
                nNF = 1;
            }
            else {
                nNF = this.salesPDVTest[this.salesPDVTest.length - 1].num + 1;
            }
            /**
             *----------------------------------------------------
             * Atualização da série e numeração da nota - Fim
             *----------------------------------------------------
             */

            this.nota.enviNFe.NFe.infNFe.ide.serie = serie;
            this.nota.enviNFe.NFe.infNFe.ide.nNF = nNF;

            /**
             *----------------------------------------------------
             * Formatando série e número - Início
             *----------------------------------------------------
             */
            let serieParseString = String(serie);

            if (serieParseString.length == 1) {
                serieParseString = "00" + serieParseString;
            } else if (serieParseString.length == 2) {
                serieParseString = "0" + serieParseString;
            }

            let nNFParseString = String(nNF);

            if (nNFParseString.length == 1) {
                nNFParseString = "00000000" + nNFParseString;
            } else if (nNFParseString.length == 2) {
                nNFParseString = "0000000" + nNFParseString;
            } else if (nNFParseString.length == 3) {
                nNFParseString = "000000" + nNFParseString;
            } else if (nNFParseString.length == 4) {
                nNFParseString = "00000" + nNFParseString;
            } else if (nNFParseString.length == 5) {
                nNFParseString = "0000" + nNFParseString;
            } else if (nNFParseString.length == 6) {
                nNFParseString = "000" + nNFParseString;
            } else if (nNFParseString.length == 7) {
                nNFParseString = "00" + nNFParseString;
            } else if (nNFParseString.length == 8) {
                nNFParseString = "0" + nNFParseString;
            }

            console.log(serieParseString);
            console.log(nNFParseString);
            /**
             *----------------------------------------------------
             * Formatando série e número - Fim
             *----------------------------------------------------
             */

            let tpEmis = this.nota.enviNFe.NFe.infNFe.ide.tpEmis;
            let cNF = this.nota.enviNFe.NFe.infNFe.ide.cNF;


            /**
             *----------------------------------------------------
             * Calculando digito verificador - Início
             *----------------------------------------------------
             */
            let keyPassPartOne = cUF + dhEmi + cnpj + mod + serieParseString + nNFParseString + tpEmis + cNF;
            let mult = "4329876543298765432987654329876543298765432";
            let cDV = 0;

            if (String(keyPassPartOne).length == String(mult).length) {
                let total = 0;
                for (let i = 0; i < keyPassPartOne.length; i++) {
                    total = total + keyPassPartOne[i] * mult[i];
                }

                console.log("Total:", total);
                calc1 = total / 11;
                calc2 = total % 11;

                console.log("Divisão por 11:", calc1);
                console.log("Módulo:", calc2);

                if (calc2 == 0 || calc2 == 1) {
                    cDV = 0
                } else {
                    cDV = 11 - calc2;
                }

                console.log("Dígito Verificador:", cDV);

            } else {
                console.log('Erro ao calcular dígito verificador, verifique se a quantidade de caracteres das variáveis é compátivel.');
            }
            /**
             *----------------------------------------------------
             * Calculando digito verificador - Fim
             *----------------------------------------------------
             */

            this.nota.enviNFe.NFe.infNFe.ide.cDV = cDV;
            let keyPassFinal = keyPassPartOne + cDV;
            console.log("Chave de Acesso Montada:", keyPassFinal);
            this.venda.cupomDados.chaveDeAcessoNumricaMontadaEmTransmit = keyPassFinal;
            this.venda.qrCodeDados.chaveDeAcessoNumricaMontadaEmTransmit = keyPassFinal;
            let idNota = 'NFe' + keyPassFinal;
            let nota = '<?xml version="1.0" encoding="UTF-8"?>';

            for (var i = 0; i < [this.nota.enviNFe].length; i++) {
                nota = nota + '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">'
                    + '<NFe>'
                    + '<infNFe Id="' + idNota + '" versao="4.00">'
                    + '<ide>'
                    + '     <cUF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cUF'] + '</cUF>'
                    + '     <cNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cNF'] + '</cNF>'
                    + '     <natOp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['natOp'] + '</natOp>'
                    + '     <mod>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['mod'] + '</mod>'
                    + '     <serie>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['serie'] + '</serie>'
                    + '     <nNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['nNF'] + '</nNF>'
                    + '     <dhEmi>' + moment().format() + '</dhEmi>'
                    + '     <tpNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpNF'] + '</tpNF>'
                    + '     <idDest>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['idDest'] + '</idDest>'
                    + '     <cMunFG>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cMunFG'] + '</cMunFG>'
                    + '     <tpImp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpImp'] + '</tpImp>'

                if (navigator.onLine) {
                    nota = nota + '<tpEmis>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpEmis'] + '</tpEmis>'
                }
                else {
                    nota = nota + '<tpEmis>9</tpEmis>'
                }

                nota = nota
                    + '<cDV>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cDV'] + '</cDV>'
                    + '     <tpAmb>' + this.configs_nfce[0].geral[0].ambiente + '</tpAmb>'
                    + '     <finNFe>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['finNFe'] + '</finNFe>'
                    + '     <indFinal>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indFinal'] + '</indFinal>'
                    + '     <indPres>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indPres'] + '</indPres>'
                    + '     <procEmi>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['procEmi'] + '</procEmi>'
                    + '     <verProc>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['verProc'] + '</verProc>'
                    + ' </ide>'
                    + ' <emit>'
                    + ' <CNPJ>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['CNPJ'] + '</CNPJ>'
                    + ' <xNome>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['xNome'] + '</xNome>'
                    + ' <enderEmit>'
                    + '     <xLgr>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xLgr'] + '</xLgr>'
                    + '     <nro>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['nro'] + '</nro>'
                    + '     <xBairro>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xBairro'] + '</xBairro>'
                    + '     <cMun>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['cMun'] + '</cMun>'
                    + '     <xMun>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xMun'] + '</xMun>'
                    + '     <UF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['UF'] + '</UF>'
                    + '     <CEP>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['CEP'] + '</CEP>'
                    + '     <cPais>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['cPais'] + '</cPais>'
                    + '     <xPais>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xPais'] + '</xPais>'
                    + '     <fone>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['fone'] + '</fone>'
                    + ' </enderEmit>'
                    + ' <IE>' + [this.nota.enviNFe][i]['NFe']['infNFe']['IE'] + '</IE>'
                    + ' <CRT>' + [this.nota.enviNFe][i]['NFe']['infNFe']['CRT'] + '</CRT>'
                    + ' </emit>'

                for (var d = 0; d < [this.nota.enviNFe][i]['NFe']['det'].length; d++) {
                    nota = nota
                        + '<det nItem="' + (d + 1) + '">'
                        + ' <prod>'
                        + '     <cProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cProd'] + '</cProd>'
                        + '     <cEAN>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cEAN'] + '</cEAN>'
                        + '     <xProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['xProd'] + '</xProd>'
                        + '     <NCM>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['NCM'] + '</NCM>'
                        + '     <CFOP>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['CFOP'] + '</CFOP>'
                        + '     <uCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['uCom'] + '</uCom>'
                        + '     <qCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['qCom'] + '</qCom>'
                        + '     <vUnCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vUnCom'] + '</vUnCom>'
                        + '     <vProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vProd'] + '</vProd>'
                        + '     <cEANTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cEANTrib'] + '</cEANTrib>'
                        + '     <uTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['uTrib'] + '</uTrib>'
                        + '     <qTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['qTrib'] + '</qTrib>'
                        + '     <vUnTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vUnTrib'] + '</vUnTrib>'
                        + '     <indTot>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['indTot'] + '</indTot>'
                        + ' </prod>'
                        + ' <imposto>'
                        + '     <vTotTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['vTotTrib'] + '</vTotTrib>'
                        + '     <ICMS>'
                        + '         <ICMSSN102>'
                        + '             <orig>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMSSN102']['orig'] + '</orig>'
                        + '             <CSOSN>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMSSN102']['CSOSN'] + '</CSOSN>'
                        + '         </ICMSSN102>'
                        + '     </ICMS>'
                        + '     <PIS>'
                        + '         <PISNT>'
                        + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISNT']['CST'] + '</CST>'
                        + '         </PISNT>'
                        + '     </PIS>'
                        + '     <COFINS>'
                        + '         <COFINSNT>'
                        + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSNT']['CST'] + '</CST>'
                        + '         </COFINSNT>'
                        + '     </COFINS>'
                        + ' </imposto>'
                        + '</det>'
                }

                nota = nota
                    + ' <total>'
                    + '    <ICMSTot>'
                    + '      <vBC>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBC'] + '</vBC>'
                    + '      <vICMS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vICMS'] + '</vICMS>'
                    + '      <vICMSDeson>0.00</vICMSDeson>'
                    + '      <vFCP>0.00</vFCP>'
                    + '      <vBCST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBCST'] + '</vBCST>'
                    + '      <vST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vST'] + '</vST>'
                    + '      <vFCPST>0.00</vFCPST>'
                    + '      <vFCPSTRet>0.00</vFCPSTRet>'
                    + '      <vProd>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vProd'] + '</vProd>'
                    + '      <vFrete>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vFrete'] + '</vFrete>'
                    + '      <vSeg>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vSeg'] + '</vSeg>'
                    + '      <vDesc>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vDesc'] + '</vDesc>'
                    + '      <vII>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vII'] + '</vII>'
                    + '      <vIPI>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vIPI'] + '</vIPI>'
                    + '      <vIPIDevol>0.00</vIPIDevol>'
                    + '      <vPIS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vPIS'] + '</vPIS>'
                    + '      <vCOFINS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vCOFINS'] + '</vCOFINS>'
                    + '      <vOutro>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vOutro'] + '</vOutro>'
                    + '      <vNF>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vNF'] + '</vNF>'
                    + '      <vTotTrib>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vTotTrib'] + '</vTotTrib>'
                    + '    </ICMSTot>'
                    + '</total>'
                    + '<transp>'
                    + '    <modFrete>' + [this.nota.enviNFe][i]['NFe']['transp']['modFrete'] + '</modFrete>'
                    + '</transp>'

                if (this.venda.tPag == '03' || this.venda.tPag == '03') {
                    nota = nota
                        + ' <pag>'
                        + '     <detPag>'
                        + '         <tPag>' + [this.nota.enviNFe][i]['NFe']['pag']['tPag'] + '</tPag>'
                        + '         <vPag>' + [this.nota.enviNFe][i]['NFe']['pag']['vPag'] + '</vPag>'
                        + '     </detPag>'
                        + ' <card>'
                        + '    <tpIntegra>' + this.configs_nfce[0].cartao_credito[0].tpIntegra + '</tpIntegra>'
                        + ' </card>'
                        + '</pag>'
                } else {
                    nota = nota
                        + ' <pag>'
                        + '     <detPag>'
                        + '         <tPag>' + [this.nota.enviNFe][i]['NFe']['pag']['tPag'] + '</tPag>'
                        + '         <vPag>' + [this.nota.enviNFe][i]['NFe']['pag']['vPag'] + '</vPag>'
                        + '     </detPag>'
                        + '</pag>'
                }

                nota = nota
                    + '</infNFe>'
                    + ' </NFe>'
                    + '</nfeProc>';

                this.venda.nota.push(
                    {
                        xml: nota
                    }
                );
            }

            console.count('Data => nota');
            console.log(this.venda.nota);

            let nfce = {
                data: moment().format('DD/MM/YYYY h:mm:ss'),
                tipo: 'contingencia',
                xml: this.venda.nota
            }

            registroDeNotas.insert(nfce);
            db.save();
        },
        removeItemList: function (produto) {
            console.log(produto);
            for (let i = 0; i < this.venda.listProduto.length; i++) {
                if (this.venda.listProduto[i].codigoBarra == produto.codigoBarra) {
                    this.venda.listProduto.splice(i, 1);
                }
            }

            for (let i = 0; i < this.venda.totalParaLeitura.length; i++) {
                if (this.venda.totalParaLeitura[i].codigoBarra == produto.codigoBarra) {
                    this.venda.totalParaLeitura.splice(i, 1);
                }
            }

            if (produto.desconto > 0) {
                this.venda.totalParaLeituraShow -= (produto.preco * produto.quantidade) - produto.desconto;
            } else {
                this.venda.totalParaLeituraShow -= produto.preco * produto.quantidade;
            }

            for (let i = 0; i < this.nota.enviNFe.NFe.det.length; i++) {
                if (this.nota.enviNFe.NFe.det[i].prod.cEAN == produto.codigoBarra) {
                    this.nota.enviNFe.NFe.det.splice(i, 1);
                }
            }

            console.log(this.nota.enviNFe.NFe.det);
            this.venda.quantidadeTotalParaLeitura -= produto.quantidade;
            this.venda.totalDescontoParaLeituraShow -= produto.desconto;
            this.venda.paraExibirNatela[0].totalParaLeituraEmString = String(this.venda.totalParaLeituraShow).replace('.', ',');
        },
        cleanFields: function () {
            console.count('Method => cleanFields');
            this.venda.produto[0].nome = '';
            this.venda.produto[0].preco = '';
            this.venda.produto[0].codigoBarra = '';
            this.venda.produto[0].descricao = '';
            this.venda.produto[0].desconto = '0';
            this.venda.produto[0].quantidade = '1';
            this.venda.produto[0].total = '';
            this.venda.produto[0].subtotal = '';
            this.venda.produto[0].troco = '';
            this.search = '';
            this.focusInProductField();
        },
        genQrcode: function () {
            console.count('Method => genQrcode');
            var QRCode = require('qrcode');
            var self = this;
            let qrCode = '';

            if (navigator.onLine) {
                let hashCode = this.venda.qrCodeDados.chaveDeAcessoNumricaMontadaEmTransmit
                    + '|' + this.venda.qrCodeDados.versao
                    + '|' + this.venda.qrCodeDados.ambiente
                    + '|' + this.empresas[0].csc.substr(2);
                + '|' + this.empresas[0].csc;

                let hashSha1 = sha1(hashCode);


                console.count('Method => HashCode');
                console.count(hashCode);
                console.count('Method => HashCodeSha1');
                console.count(hashSha1);

                qrCode = 'https://appnfc.sefa.pa.gov.br/portal/view/consultas/nfce/nfceForm.seame?p='
                    + this.venda.qrCodeDados.chaveDeAcessoNumricaMontadaEmTransmit
                    + '|' + this.venda.qrCodeDados.versao
                    + '|' + this.venda.qrCodeDados.ambiente
                    + '|' + this.empresas[0].csc.substr(2)
                    + '|' + hashSha1;
            } else {
                let hashCode = this.venda.qrCodeDados.chaveDeAcessoNumricaMontadaEmTransmit
                    + '|' + this.venda.qrCodeDados.versao
                    + '|' + this.venda.qrCodeDados.ambiente
                    + '|' + String(moment().format("DD"))
                    + '|' + this.nota.enviNFe.NFe.total.ICMSTot.vNF
                    + '|' + this.venda.digest[0].xml
                    + '|' + this.empresas[0].csc.substr(2);
                + '|' + this.empresas[0].csc;

                let hashSha1 = sha1(hashCode);

                console.count('Method => HashCode');
                console.count(hashCode);
                console.count('Method => HashCodeSha1');
                console.count(hashSha1);

                qrCode = 'https://appnfc.sefa.pa.gov.br/portal/view/consultas/nfce/nfceForm.seame?p='
                    + this.venda.qrCodeDados.chaveDeAcessoNumricaMontadaEmTransmit
                    + '|' + this.venda.qrCodeDados.versao
                    + '|' + this.venda.qrCodeDados.ambiente
                    + '|' + String(moment().format("DD"))
                    + '|' + this.nota.enviNFe.NFe.total.ICMSTot.vNF
                    + '|' + this.venda.digest[0].xml
                    + '|' + this.empresas[0].csc.substr(2)
                    + '|' + hashSha1;
            }

            console.count('Method => QRCodeURL');
            console.count(qrCode);

            QRCode.toDataURL(qrCode, function (err, url) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log(url);
                    self.venda.qrcode = url;
                    if (navigator.onLine) {
                        self.mountCupom();
                        self.writeFileCupomAndPrinter();
                    }
                    else {
                        self.mountCupomContingency();
                        self.writeFileCupomAndPrinter();
                    }
                }
            });
        },
        mountCupom: function () {
            console.count('Method => mountCupom');
            let cupom = '<!DOCTYPE html>'
                + '<html lang="pt-br">'
                + '<head>'
                + '<meta charset="utf-8">'
                + '<meta http-equiv="X-UA-Compatible" content="IE=edge">'
                + '<meta name="viewport" content="width=device-width, initial-scale=1">'
                + '<style>'
                + '.text {'
                + 'text-align: center;'
                + '}'
                + '.printer-ticket {'
                + 'display: table !important;'
                + 'width: 100%;'
                + 'width: 230px;'
                + 'padding: 10px;'
                + 'font-weight: light;'
                + 'line-height: 1.3em;'
                + 'font-family: Tahoma, Geneva, sans-serif;'
                + 'font-size: 10px;'
                + '}'
                + 'th {'
                + 'font-weight: inherit;'
                + 'padding: 10px 0;'
                + 'text-align: center;'
                + 'border-bottom: 1px dashed #BCBCBC;'
                + '}'
                + '.title {'
                + 'font-size: 1.5em;'
                + 'padding: 10px*1.5 0;'
                + '}'
                + '.image{'
                + 'width: 150px;'
                + 'height: 150px;'
                + '}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<table class="printer-ticket">'
                + '<thead>'
                + '<tr>'
                + '<th colspan="6">'
                + '<p style="text-align: center; margin: 0px;">CNPJ: ' + this.empresas[0].cnpj + '<strong> ' + this.empresas[0].nome + '</strong></p>'
                + '<p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ', ' + this.empresas[0].endereco.uf + '</p>'
                + '<p style="text-align: center; margin: 0px">Documento Auxiliar de Nota Fiscal de Consumidor Eletrônica</p>'
                + '</th>'
                + '</tr>'
                + '</thead>'
                + '<tbody>'

            for (var i = 0; i < this.venda.listProduto.length; i++) {
                cupom = cupom
                    + '<tr>'
                    + '<td>CÓDIGO</td>'
                    + '<td align="center">DESCRIÇÃO</td>'
                    + '<td align="center">QTD</td>'
                    + '<td align="center">UN</td>'
                    + '<td align="center">VL.UN</td>'
                    + '<td align="right">TOTAL</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td>' + [this.venda.listProduto[i].codigo] + '</td>'
                    + '<td>' + [this.venda.listProduto[i].descricao.substr(0, 30)] + '</td>'
                    + '<td>' + [this.venda.listProduto[i].quantidade] + '</td>'
                    + '<td>' + [this.venda.listProduto[i].unidade] + '</td>'
                    + '<td>' + [this.venda.listProduto[i].preco] + '</td>'
                    + '<td align="right">' + this.venda.listProduto[i].preco * this.venda.listProduto[i].quantidade + '</td>'
                    + '</tr>'
            }

            cupom = cupom + '</tbody>'
                + '<tfoot>'
                + '<tr>'
                + '<br>'
                + '<td colspan="5">Qtde. total de itens</td>'
                + '<td align="right">' + this.venda.quantidadeTotalParaLeitura + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">Valor total R$</td>'
                + '<td align="right">' + parseFloat(this.venda.totalParaLeituraShow) + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">Desconto R$</td>'
                + '<td align="right">' + parseFloat(this.venda.totalDescontoParaLeituraShow) + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">FORMA PAGAMENTO</td>'

            if (this.venda.tPag == '03') {
                cupom = cupom + '<td align="right">Crédito</td>'
            }
            else if (this.venda.tPag == '04') {
                cupom = cupom + '<td align="right">Débito</td>'
            }
            else {
                cupom = cupom + '<td align="right">Dinheiro</td>'
            }

            cupom = cupom
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">Dinheiro R$</td>'
                + '<td align="right">' + this.venda.produto[0].valorRecebido + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">Troco R$</td>'
                + '<td align="right">' + this.venda.total[0].troco + '</td>'
                + '</tr>'
                + '<tr class="sup">'
                + '<td colspan="6" align="center">'
                + '<p style="text-align: center; margin: 0px">Consulte pela Chave de Acesso em:</p>'
                + '<p style="text-align: center; margin: 0px">https://appnfe.sefa.pa.gov.br/portal/view/consulta</p>'
                + '<p style="text-align: center; margin: 0px">Chave de Acesso</p>'
                + '<p style="text-align: center; margin: 0px">' + this.venda.qrCodeDados.chaveDeAcessoNumricaMontadaEmTransmit + '</p>'
                + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="2">'
                + '<img class="image" src="' + this.venda.qrcode + '" />'
                + '</td>'
                + '<td colspan="4">'
                + '<br>'
                + '<p style="text-align: left; margin: 0px"><strong>CONSUMIDOR NÃO IDENTIFICADO</strong></p>'
                + '<br>'
                + '<p style="text-align: left; margin: 0px"><strong>NFC-e nº</strong> ' + this.venda.cupomDados.chaveDeAcessoNumricaMontadaEmTransmit.substr(0, 30) + '</p>'
                + '<p style="text-align: left; margin: 0px">' + this.venda.cupomDados.chaveDeAcessoNumricaMontadaEmTransmit.substr(30) + '</p>'
                + '<p style="text-align: left; margin: 0px"><strong>Série</strong> 001</p>'
                + '<p style="text-align: left; margin: 0px"><strong>Data de Emissão</strong> ' + moment().format('DD/MM/YYYY h:mm:ss') + '</p>'
                + '<p style="text-align: left; margin: 0px"><strong>Via do consumidor</strong></p>'
                + '<br>'
                + '<p style="text-align: left; margin: 0px"><strong>Protocolo de autorização</strong> ' + 'A definir' + '</p>'
                + '<p style="text-align: left; margin: 0px"><strong>Data de autorização</strong> ' + moment().format('DD/MM/YYYY h:mm:ss') + '</p>'
                + '</br>'
                + '</tr>'
                + '<tr class="sup">'
                + '<td colspan="6" align="center">'
                + '<br>'
                + '<p>Tributos Totais Incidentes (Lei federal 12.741/2012): R$ ' + this.venda.totTribNot + '</p>'
                + '</td>'
                + '</tr>'
                + '</tfoot>'
                + '</table>'
                + '</body>'
                + '</html>'

            this.venda.cupom = cupom;
        },
        writeFileCupomAndPrinter: function () {
            console.count('Method => writeFileCupomAndPrinter');
            const path = require("path")
            let fs = require('fs');
            let pathTo = path.join(__dirname, '/cupomGenerated.html')
            self = this;
            fs.writeFile(pathTo, this.venda.cupom, function (err) {
                if (err) {
                    alert('write pdf file error', err);
                } else {
                    const run = async () => {
                        const path = require("path");
                        var fs = require('fs');
                        var pdf = require('html-pdf');
                        var html = fs.readFileSync(path.join(__dirname, "cupomGenerated.html"), 'utf8');
                        var options = {
                            "width": "80mm",
                            // "height": "200mm",
                        };

                        pdf.create(html, options).toFile(path.join(__dirname, "tmp", "output2.pdf"), function (err, res) {
                            if (err) {
                                return console.log(err);
                            } else {
                                console.log(res);
                                if (self.printer.printer == true) {
                                    self.testPrinter();
                                }
                                else {
                                    console.log('Impressão desabilitada, para habilitar acesse o menu de configurações.');
                                    location.reload();
                                }
                            }
                        });
                    }
                    run();
                }
            })
        },
        mountCupomContingency: function () {
            console.count('Method => mountCupomContingency');
            let cupom = '<!DOCTYPE html>'
                + '<html lang="pt-br">'
                + '<head>'
                + '<meta charset="utf-8">'
                + '<meta http-equiv="X-UA-Compatible" content="IE=edge">'
                + '<meta name="viewport" content="width=device-width, initial-scale=1">'
                + '<style>'
                + '.text {'
                + 'text-align: center;'
                + '}'
                + '.printer-ticket {'
                + 'display: table !important;'
                + 'width: 100%;'
                + 'width: 230px;'
                + 'padding: 10px;'
                + 'font-weight: light;'
                + 'line-height: 1.3em;'
                + 'font-family: Tahoma, Geneva, sans-serif;'
                + 'font-size: 10px;'
                + '}'
                + 'th {'
                + 'font-weight: inherit;'
                + 'padding: 10px 0;'
                + 'text-align: center;'
                + 'border-bottom: 1px dashed #BCBCBC;'
                + '}'
                + '.title {'
                + 'font-size: 1.5em;'
                + 'padding: 10px*1.5 0;'
                + '}'
                + '.image{'
                + 'width: 150px;'
                + 'height: 150px;'
                + '}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<table class="printer-ticket">'
                + '<thead>'
                + '<tr>'
                + '<th colspan="6">'
                + '<p style="text-align: center; margin: 0px;">CNPJ: ' + this.empresas[0].cnpj + '<strong> ' + this.empresas[0].nome + '</strong></p>'
                + '<p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ', ' + this.empresas[0].endereco.uf + '</p>'
                + '<p style="text-align: center; margin: 0px">Documento Auxiliar de Nota Fiscal de Consumidor Eletrônica</p>'
                + '<br>'
                + '<h3 style="text-align: center; margin: 0px"><b>EMITIDA EM CONTINGÊNCIA</b></h3>'
                + '<p style="text-align: center; margin: 0px"><b>Pendente de Autorização</b></p>'
                + '</th>'
                + '</tr>'
                + '</thead>'
                + '<tbody>'

            for (var i = 0; i < this.venda.listProduto.length; i++) {
                cupom = cupom
                    + '<tr>'
                    + '<td>CÓDIGO</td>'
                    + '<td align="center">DESCRIÇÃO</td>'
                    + '<td align="center">QTD</td>'
                    + '<td align="center">UN</td>'
                    + '<td align="center">VL.UN</td>'
                    + '<td align="right">TOTAL</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td>' + [this.venda.listProduto[i].codigo] + '</td>'
                    + '<td>' + [this.venda.listProduto[i].descricao.substr(0, 30)] + '</td>'
                    + '<td>' + [this.venda.listProduto[i].quantidade] + '</td>'
                    + '<td>' + [this.venda.listProduto[i].unidade] + '</td>'
                    + '<td>' + [this.venda.listProduto[i].preco] + '</td>'
                    + '<td align="right">' + this.venda.listProduto[i].preco * this.venda.listProduto[i].quantidade + '</td>'
                    + '</tr>'
            }

            cupom = cupom + '</tbody>'
                + '<tfoot>'
                + '<tr>'
                + '<br>'
                + '<td colspan="5">Qtde. total de itens</td>'
                + '<td align="right">' + this.venda.quantidadeTotalParaLeitura + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">Valor total R$</td>'
                + '<td align="right">' + parseFloat(this.venda.totalParaLeituraShow) + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">Desconto R$</td>'
                + '<td align="right">' + parseFloat(this.venda.totalDescontoParaLeituraShow) + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">FORMA PAGAMENTO</td>'

            if (this.venda.tPag == '03') {
                cupom = cupom + '<td align="right">Crédito</td>'
            }
            else if (this.venda.tPag == '04') {
                cupom = cupom + '<td align="right">Débito</td>'
            }
            else {
                cupom = cupom + '<td align="right">Dinheiro</td>'
            }

            cupom = cupom

                + '</tr>'
                + '<tr>'
                + '<td colspan="5">Dinheiro R$</td>'
                + '<td align="right">' + this.venda.produto[0].valorRecebido + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="5">Troco R$</td>'
                + '<td align="right">' + this.venda.total[0].troco + '</td>'
                + '</tr>'
                + '<tr class="sup">'
                + '<td colspan="6" align="center">'
                + '<p style="text-align: center; margin: 0px">Consulte pela Chave de Acesso em:</p>'
                + '<p style="text-align: center; margin: 0px">https://appnfe.sefa.pa.gov.br/portal/view/consulta</p>'
                + '<p style="text-align: center; margin: 0px">Chave de Acesso</p>'
                + '<p style="text-align: center; margin: 0px">' + this.venda.qrCodeDados.chaveDeAcessoNumricaMontadaEmTransmit + '</p>'
                + '</td>'
                + '</tr>'
                + '<tr>'
                + '<td colspan="2">'
                + '<img class="image" src="' + this.venda.qrcode + '" />'
                + '</td>'
                + '<td colspan="4">'
                + '<br>'
                + '<p style="text-align: left; margin: 0px"><strong>CONSUMIDOR NÃO IDENTIFICADO</strong></p>'
                + '<br>'
                + '<p style="text-align: left; margin: 0px"><strong>NFC-e nº</strong> ' + this.venda.cupomDados.chaveDeAcessoNumricaMontadaEmTransmit.substr(0, 30) + '</p>'
                + '<p style="text-align: left; margin: 0px">' + this.venda.cupomDados.chaveDeAcessoNumricaMontadaEmTransmit.substr(30) + '</p>'
                + '<p style="text-align: left; margin: 0px"><strong>Série</strong> 001</p>'
                + '<p style="text-align: left; margin: 0px"><strong>Data de Emissão</strong> ' + moment().format('DD/MM/YYYY h:mm:ss') + '</p>'
                + '<p style="text-align: left; margin: 0px"><strong>Via do consumidor</strong></p>'
                + '<br>'
                + '<h3 style="text-align: left; margin: 0px"><strong>EMITIDA EM CONTINGÊNCIA:</strong></h3>'
                + '<p style="text-align: left; margin: 0px">Pendente de autorização</p>'
                + '</br>'
                + '</tr>'
                + '<tr class="sup">'
                + '<td colspan="6" align="center">'
                + '<br>'
                + '<p>Tributos Totais Incidentes (Lei federal 12.741/2012): R$ ' + this.venda.totTribNot + '</p>'
                + '</td>'
                + '</tr>'
                + '</tfoot>'
                + '</table>'
                + '</body>'
                + '</html>'

            this.venda.cupom = cupom;
        },
        toQtde: function () {
            console.count('Method => toQtde');
            document.getElementById("qtdeInFocus").disabled = false;

            if (this.search == '') {
                dialog.showMessageBox({
                    message: 'Por favor insira um dado para começar a pesquisa de produto!',
                });
                this.focusInProductField();
            }
            else {
                document.getElementById("qtdeInFocus").focus();
                document.getElementById("prodInFocus").disabled = true;
            }
        },
        toDiscount: function () {
            console.count('Method => toDiscount');
            document.getElementById("descontoInFocus").disabled = false;
            if (this.venda.produto[0].quantidade == '') {
                this.venda.produto[0].quantidade = 1;
                document.getElementById("qtdeInFocus").focus();
            }
            else if (this.venda.produto[0].quantidade == 0 || this.venda.produto[0].quantidade < 0) {
                this.venda.produto[0].quantidade = 1;
                document.getElementById("qtdeInFocus").focus();
            }
            else {
                document.getElementById("descontoInFocus").focus();
                document.getElementById("qtdeInFocus").disabled = true;
            }
        },
        toTypePay: function () {
            console.count('Method => toTypePay');
            $('#typePay').modal();
        },
        toValueReceived: function () {
            console.count('Method => toValueReceived');
            this.venda.listViewSale.nameProdStealth = '';
            this.venda.listViewSale.qtdProdStealth = '';
            this.venda.listViewSale.priceProdStealth = '';
            this.venda.listViewSale.valueSaleStealth = '';
            document.getElementById("valorRecebidoInFocus").disabled = false;

            if (this.venda.produto[0].desconto == '' || this.venda.produto[0].desconto < 0) { //Verificação do campo desconto.
                this.venda.produto[0].desconto = 0;
                let preco = parseFloat(this.venda.produto[0].preco);
                let quantidade = parseFloat(this.venda.produto[0].quantidade);
                let desconto = parseFloat(this.venda.produto[0].desconto);
                let resultado = (preco * quantidade) - desconto;
                console.log('Preço:', preco);
                console.log('Desconto:', desconto);
                console.log('Quantidade:', quantidade);
                console.log('Preço - Desconto:', resultado.toFixed(2));

                console.info('Preço | Desconto | Quantidade | Preço - Desconto:', {'Preco':preco});
alert('Erro');
                this.venda.produto[0].subtotal = (preco * quantidade) - desconto;
                this.venda.produto[0].total += resultado.toFixed(2);

                this.venda.totalParaLeitura.push(
                    {
                        codigoBarra: this.venda.produto[0].codigoBarra,
                        totalParaLeitura: this.venda.produto[0].total,
                        descontoParaLeitura: desconto,
                        quantidadeParaLeitura: quantidade,
                    }
                );

                console.log(this.venda.totalParaLeitura);

                /**
                 *-------------------------------------------------
                 * Prepara para exibir no front o total dos itens.
                 *-------------------------------------------------
                 */
                let totalParaLeitura = 0;
                let descontoParaLeitura = 0;
                let quantidadeParaLeitura = 0;

                for (i = 0; i < this.venda.totalParaLeitura.length; i++) {
                    totalParaLeitura += parseFloat(this.venda.totalParaLeitura[i].totalParaLeitura);
                    descontoParaLeitura += parseFloat(this.venda.totalParaLeitura[i].descontoParaLeitura);
                    quantidadeParaLeitura += parseFloat(this.venda.totalParaLeitura[i].quantidadeParaLeitura);
                    this.venda.totalParaLeituraShow = totalParaLeitura;
                    this.venda.totalDescontoParaLeituraShow = descontoParaLeitura;
                    this.venda.quantidadeTotalParaLeitura = quantidadeParaLeitura;
                }

                this.venda.paraExibirNatela[0].totalParaLeituraEmString = String(this.venda.totalParaLeituraShow).replace('.', ',');
                console.log(this.venda.totalParaLeituraShow);
                console.log(this.venda.paraExibirNatela[0].totalParaLeituraEmString);
                this.pushListProduct();
                document.getElementById("valorRecebidoInFocus").focus();
                document.getElementById("descontoInFocus").disabled = true;
            }
            else {
                let preco = parseFloat(this.venda.produto[0].preco);
                let quantidade = parseFloat(this.venda.produto[0].quantidade);
                let desconto = parseFloat(this.venda.produto[0].desconto.replace(',', '.'));
                let resultado = (preco * quantidade) - desconto;
                console.log('Preço:', preco);
                console.log('Desconto:', desconto);
                console.log('Quantidade:', quantidade);
                console.log('Preço - Desconto:', resultado.toFixed(2));
                this.venda.produto[0].subtotal = (preco * quantidade) - desconto;
                this.venda.produto[0].total += resultado.toFixed(2);

                /**
                 *----------------------------------------------
                 * Coloca no data.
                 *----------------------------------------------
                 */
                this.venda.totalParaLeitura.push(
                    {
                        codigoBarra: this.venda.produto[0].codigoBarra,
                        totalParaLeitura: this.venda.produto[0].total,
                        descontoParaLeitura: desconto,
                        quantidadeParaLeitura: quantidade,
                    }
                );

                console.log(this.venda.totalParaLeitura);

                /**
                 *-------------------------------------------------
                 * Prepara para exibir no front o total dos itens.
                 *-------------------------------------------------
                 */
                let totalParaLeitura = 0;
                let descontoParaLeitura = 0;
                let quantidadeParaLeitura = 0;

                for (i = 0; i < this.venda.totalParaLeitura.length; i++) {
                    totalParaLeitura += parseFloat(this.venda.totalParaLeitura[i].totalParaLeitura);
                    descontoParaLeitura += parseFloat(this.venda.totalParaLeitura[i].descontoParaLeitura);
                    quantidadeParaLeitura += parseFloat(this.venda.totalParaLeitura[i].quantidadeParaLeitura);
                    this.venda.totalParaLeituraShow = totalParaLeitura;
                    this.venda.totalDescontoParaLeituraShow = descontoParaLeitura;
                    this.venda.quantidadeTotalParaLeitura = quantidadeParaLeitura;
                }

                this.venda.paraExibirNatela[0].totalParaLeituraEmString = String(this.venda.totalParaLeituraShow).replace('.', ',');
                console.log('Show Total');
                console.log(this.venda.totalParaLeituraShow);
                console.log(this.venda.paraExibirNatela[0].totalParaLeituraEmString);
                this.pushListProduct();
                document.getElementById("valorRecebidoInFocus").focus();
                document.getElementById("descontoInFocus").disabled = true;
            }
        },
        focusInProductField: function () {
            console.count('Method => focusInProductField');
            document.getElementById("prodInFocus").focus();//Search Products
            document.getElementById("qtdeInFocus").disabled = true;//Quantity
            document.getElementById("descontoInFocus").disabled = true;//Discount
            document.getElementById("valorRecebidoInFocus").disabled = true;//ValueReceive
            document.getElementById("total").disabled = true;//Total
        },
        editProduct: function (product) {
            this.openModal = true;
            this.produto = product
        },
        saleStoreOrUpdate: function (sale) {
            if (typeof this.vendaPDV.$loki !== 'undefined') {
                vendaPDV.update(this.vendaPDV);
            } else {
                vendaPDV.insert(this.vendaPDV);
            }
            db.save();
        },
        saleStoreOrUpdateTest: function () {
            console.count('Method => saleStoreOrUpdateTest');
            if (typeof this.vendaPDV.$loki !== 'undefined') {
                salesPDVTest.update(this.vendaPDV);
            } else {
                for (let i = 0; i < this.vendaPDV[0].listProduct.length; i++) {
                    let produto = produtos.find({ 'codigo_barras': this.vendaPDV[0].listProduct[i].codigoBarra });
                    this.produtosEstoque = produto;
                    this.produtosEstoque[0].quantidade = this.produtosEstoque[0].quantidade - this.vendaPDV[0].listProduct[i].quantidade;
                    produtos.update(this.produtosEstoque);
                    db.save();
                }
                salesPDVTest.insert(this.vendaPDV);
            }
            db.save();
        },
    },
    computed: {
        productFilter: function () {
            console.count('Method => productFilter');
            var self = this
            self.produto = self.produtos.filter(produto => {
                let searchRegex = new RegExp(self.search, 'i');
                return searchRegex.test(produto.nome) ||
                    searchRegex.test(produto.codigo_barras);
            });

            if (self.search !== '') {
                self.venda.produto[0].codigo = self.produto[0].codigo;
                self.venda.produto[0].codigoBarra = self.produto[0].codigo_barras;
                self.venda.produto[0].cean = self.produto[0].codigoBarra;
                self.venda.produto[0].cfop = self.produto[0].cfopSaida.codigocfop;
                self.venda.produto[0].ncm = self.produto[0].ncm.codigo;
                self.venda.produto[0].cest = self.produto[0].cest.cest;
                self.venda.produto[0].nome = self.produto[0].nome;
                self.venda.produto[0].descricao = self.produto[0].descricao;
                self.venda.produto[0].preco = self.produto[0].preco_compra;
                self.venda.produto[0].unidade = self.produto[0].unidade.nome;

                if (self.empresas[0].crt == "1") {
                    self.venda.produto[0].imposto = "0.00";
                } else {
                    self.venda.produto[0].imposto = parseFloat(self.produto[0].ncm.aliquota_estadual) + parseFloat(self.produto[0].ncm.aliquota_municipal);
                }

                self.venda.listViewSale.nameProdStealth = self.venda.produto[0].nome;
                self.venda.listViewSale.qtdProdStealth = self.venda.produto[0].quantidade;
                self.venda.listViewSale.priceProdStealth = String(self.venda.produto[0].preco).replace('.', ',');
                self.venda.listViewSale.valueSaleStealth = self.venda.produto[0].preco * self.venda.produto[0].quantidade;
                self.venda.listViewSale.redux.nameProdStealthRedux = self.venda.produto[0].nome.substr(0, 20);
            }
            return self.produto;
        }
    }
});