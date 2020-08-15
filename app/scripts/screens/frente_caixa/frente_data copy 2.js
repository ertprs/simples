var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');
var moment = require('moment');
var Mousetrap = require('mousetrap');
var sha1 = require('sha1');
var sha1Hex = require('sha1-hex');

const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');

startPDV(dateFormat());

function startPDV(date) {
    if (db.getCollection('vendasPDV') == null) {
        db.addCollection('vendasPDV');
        db.save();
        alert('Coleção de vendas do PDV criada com sucesso...');
    }

    if (db.getCollection('salesPDVTest') == null) {
        db.addCollection('salesPDVTest');
        db.save();
        alert('Coleção de vendas teste do PDV criada com sucesso...');
    }

    if (!(db.getCollection('produtos'))) {
        alert('A base de dados de produtos não está presente...');
    }

    if (!(db.getCollection('clientes'))) {
        alert('A base de dados de clientes não está presente...');
    }

    var vendasPDV = db.getCollection('vendasPDV');
    var salesPDVTest = db.getCollection('salesPDVTest');
    var produtos = db.getCollection('produtosV2');
    var clientes = db.getCollection('clientes');
    var empresas = db.getCollection('empresas');
    var debug = db.getCollection('debug');
    var config_nfce = db.getCollection('config_nfce');
    var printer = db.getCollection('printer');

    new Vue({
        el: 'body',
        data: {
            configs_nfce: [],
            search: '',
            openRemoveProd: '',
            date: '',
            debug: [],
            printer: [],
            empresas: [],
            vendasPDV: [],
            salesPDVTest: [],
            produtos: [],
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
                totalDescontoParaLeituraShow: null,
                totTribNot: null,
                preco_unitario: 0,
                quantidade: '',
                descontoTotal: '0',
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
                    idLote: '', //Identificador de controle do envio do lote. Número sequencial autoincremental, de controle correspondente ao identificador único do lote enviado. A responsabilidade de gerar e controlar esse número é exclusiva do contribuinte.
                    // 0=Não.
                    // 1=Empresa solicita processamento síncrono do
                    // Lote de NF-e (sem a geração de Recibo para
                    // consulta futura);
                    // Nota: O processamento síncrono do Lote
                    // corresponde a entrega da resposta do
                    // processamento das NF-e do Lote, sem a geração
                    // de um Recibo de Lote para consulta futura. A
                    // resposta de forma síncrona pela SEFAZ
                    // Autorizadora só ocorrerá se:
                    // - a empresa solicitar e constar unicamente uma NFe no Lote;
                    // - a SEFAZ Autorizadora implementar o
                    // processamento síncrono para a resposta do Lote de
                    // NF-e.
                    indSinc: '1',
                    NFe: {
                        infNFe: { //Informações da Nota Fiscal eletrônica.
                            ide: { //Identificação da NF-e.
                                cUF: '15', //Código da UF do emitente do Documento Fiscal. Utilizar a Tabela do IBGE.
                                cNF: '', //Código numérico que compõe a Chave de Acesso. Número aleatório gerado pelo emitente para cada NF-e.
                                natOp: 'REVENDA DE MERCADORIAS SIMPLES NACIONAL', //Descrição da Natureza da Operação. Mínimo 1 e máximo 60.
                                indPag: '0', //Indicador da forma de pagamento:
                                // 0 – pagamento à vista;
                                // 1 – pagamento à prazo;
                                // 2 – outros.
                                mod: '65', //Código do modelo do Documento Fiscal. 55 = NF-e; 65 = NFC-e.
                                serie: '001', //Série do Documento Fiscal.
                                // série normal 0-889
                                // Avulsa Fisco 890-899
                                // SCAN 900-999
                                nNF: '', //Número do Documento Fiscal.
                                dhEmi: '', //Data e Hora de emissão do Documento Fiscal (AAAA-MM-DDThh:mm:ssTZD) ex.: 2012-09-01T13:00:00-03:00.
                                // dhSaiEnt: '', //Data e Hora da saída ou de entrada da mercadoria / produto (AAAA-MM-DDTHH:mm:ssTZD).
                                tpNF: '1', //Tipo do Documento Fiscal (0 - entrada; 1 - saída)
                                idDest: '1', //Identificador de Local de destino da operação (1-Interna;2-Interestadual;3-Exterior).
                                cMunFG: '', //Código do Município de Ocorrência do Fato Gerador (utilizar a tabela do IBGE).
                                tpImp: '4', //Formato de impressão do DANFE (0-sem DANFE;1-DANFe Retrato; 2-DANFe Paisagem;3-DANFe Simplificado; 4-DANFe NFC-e;5-DANFe NFC-e em mensagem eletrônica).
                                tpEmis: '1', //Forma de emissão da NF-e.
                                // 1 - Normal;
                                // 2 - Contingência FS;
                                // 3 - Contingência SCAN;
                                // 4 - Contingência DPEC;
                                // 5 - Contingência FSDA;
                                // 6 - Contingência SVC - AN;
                                // 7 - Contingência SVC - RS;
                                // 9 - Contingência off-line NFC-e.
                                cDV: 'Ver na hora que for começar os testes de transmissão online.', //Digito Verificador da Chave de Acesso da NF-e.
                                tpAmb: '', //Identificação do Ambiente:
                                // 1 - Produção,
                                // 2 - Homologação.
                                finNFe: '1', //Finalidade da emissão da NF-e:
                                // 1 - NFe normal
                                // 2 - NFe complementar
                                // 3 - NFe de ajuste
                                // 4 - Devolução/Retorno
                                indFinal: '1', //Indica operação com consumidor final (0-Não;1-Consumidor Final).
                                indPres: '1', //Indicador de presença do comprador no estabelecimento comercial no momento da oepração(0-Não se aplica (ex.: Nota Fiscal complementar ou de ajuste;1-Operação presencial;2-Não presencial, internet;3-Não presencial, teleatendimento;4-NFC-e entrega em domicílio;9-Não presencial, outros).
                                procEmi: '0', //Processo de emissão utilizado com a seguinte codificação:
                                // 0 - emissão de NF-e com aplicativo do contribuinte;
                                // 1 - emissão de NF-e avulsa pelo Fisco;
                                // 2 - emissão de NF-e avulsa, pelo contribuinte com seu certificado digital, através do site do Fisco;
                                // 3 - emissão de NF-e pelo contribuinte com aplicativo fornecido pelo Fisco.
                                verProc: '1', //versão do aplicativo utilizado no processo de emissão. De 1 a 20.
                                //minOccurs: '', //Informar apenas para tpEmis diferente de 1. =================================>>>> Não estou usando!!
                            },
                            emit: { //Identificação do emitente
                                CNPJ: '',
                                xNome: '', //Razão Social ou Nome do emitente.
                                xFant: '', //Nome fantasia. =================================>>>> Não estou usando!!
                                enderEmit: {
                                    xLgr: '', //Logradouro.
                                    nro: '',
                                    xCpl: '', //Complemento
                                    xBairro: '', //Bairro
                                    cMun: '', //Código do Município de Incidência do Imposto.
                                    xMun: '', //Nome do munícipio.
                                    UF: '',
                                    CEP: '',
                                    cPais: '', //Código de Pais
                                    xPais: '', //Nome do país
                                    fone: '', //Telefone, preencher com Código DDD + número do telefone , nas operações com exterior é permtido informar o código do país + código da localidade + número do telefone.
                                }
                            },
                            IE: '', //Inscrição Estadual do Emitente.
                            CRT: '' //Código de Regime Tributário. Este campo será obrigatoriamente preenchido com:
                            // 1 – Simples Nacional;
                            // 2 – Simples Nacional – excesso de sublimite de receita bruta;
                            // 3 – Regime Normal.
                        },
                        dest: { //Identificação do Destinatário.
                            CPF: '',
                            xNome: '', //Razão Social ou nome do destinatário.
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
                        det: [ //Dados dos detalhes da NF-e
                        ],
                        total: { //Dados dos totais da NF-e.
                            ICMSTot: { //Totais referentes ao ICMS.
                                vBC: '0.00', //BC do ICMS.
                                vICMS: '0.00', //Valor Total do ICMS.
                                vBCST: '0.00', //BC do ICMS ST.
                                vST: '0.00', //Valor Total do ICMS ST
                                vProd: '', //Valor Total dos produtos e serviços.
                                vFrete: '0.00', //Valor Total do Frete. ===================>>>> Não usar.
                                vSeg: '0.00', //Valor Total do Seguro.
                                vDesc: '', //Valor Total do Desconto.
                                vII: '0.00', //Valor Total do II.
                                vIPI: '0.00', //Valor Total do IPI.
                                vPIS: '',
                                vCOFINS: '', //Valor do COFINS.
                                vOutro: '0.00', //Outras Despesas acessórias.
                                vNF: '', //Valor Total da NF-e.
                            }
                        },
                        transp: { //Dados dos transportes da NF-e
                            modFrete: '9' //Modalidade do frete.
                            // 0- Por conta do emitente;
                            // 1- Por conta do destinatário/remetente;
                            // 2- Por conta de terceiros;
                            // 9- Sem frete (v2.0).
                        },
                        pag: { //Dados de Pagamento. Obrigatório apenas para (NFC-e) NT 2012/004.
                            tPag: '01', //Forma de Pagamento:01-Dinheiro;02-Cheque;03-Cartão de Crédito;04-Cartão de Débito;05-Crédito Loja;10-Vale Alimentação;11-Vale Refeição;12-Vale Presente;13-Vale Combustível;99 - Outros.
                            vPag: '', //Valor do Pagamento.
                            card: { //Grupo de Cartões.
                                tpIntegra: '2', //1=Pagamento integrado com o sistema de automação da empresa Ex. equipamento TEF , Comercio Eletronico 2=Pagamento não integrado com o sistema de automação da empresa Ex: equipamento POS.
                                CNPJ: '', //CNPJ da credenciadora de cartão de crédito/débito.
                                tBand: '', //Bandeira da operadora de cartão de crédito/débito:01–Visa; 02–Mastercard; 03–American Express; 04–Sorocred; 99–Outros.
                                cAut: '' //Número de autorização da operação cartão de crédito/débito
                            }
                        },
                        infAdic: {
                        },
                        Signature: {
                            SignedInfo: {
                                CanonicalizationMethod: '',
                                SignatureMethod: '',
                                Reference: {
                                    Transforms: {
                                        transform: ''
                                    },
                                    DigestMethod: '',
                                    DigestValue: '',
                                }
                            },
                            SignatureValue: '',
                            keyInfo: {
                                X509Data: {
                                    X509Certificate: ''
                                }
                            }
                        }
                    },
                    protNFe: { //Protocolo de status resultado do processamento sincrono da NFC-e.
                        infProt: { //Dados do protocolo de status.
                            tpAmb: '', //Identificação do Ambiente:
                            //1 - Produção,
                            //2 - Homologação.
                            verAplic: '1', //Versão do Aplicativo que processou a NF-e.
                            chNFe: '', //Chaves de acesso da NF-e, compostas por: UF do emitente, AAMM da emissão da NFe, CNPJ do emitente, modelo, série e número da NF-e e código numérico+DV.
                            dhRecbto: '', //Data e hora de processamento, no formato AAAA-MM-DDTHH:MM:SSTZD. Deve ser preenchida com data e hora da gravação no Banco em caso de Confirmação. Em caso de Rejeição, com data e hora do recebimento do Lote de NF-e enviado.
                            nProt: '', //Número do Protocolo de Status da NF-e. 1 posição (1 – Secretaria de Fazenda Estadual 2 – Receita Federal); 2 - códiga da UF - 2 posições ano; 10 seqüencial no ano.
                            digVal: '', //Digest Value da NF-e processada. Utilizado para conferir a integridade da NF-e original.
                            cStat: '100', //Código do status da mensagem enviada.
                            xMotivo: 'Autorizado o uso da NF-e', //Descrição literal do status do serviço solicitado.
                        }
                    }
                },
            },
        },
        ready: function () {
            Mousetrap.bind('*', function () {
                document.getElementById("qtdeInFocus").focus();
                console.log('*');
            }, 'keyup');

            this.loadConfig();
            this.loadDataPattern();
            this.fillPatternNote();
            this.focusInProductField();
        },
        methods: {
            loadConfig: function () {
                console.count('Method => loadConfig');
                this.configs_nfce = config_nfce.data;
                this.date = date;
                this.debug = debug.data[0];
                this.printer = printer.data[0];
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
                                    orig: '0', //0 para nacional.
                                    CST: '60', //Tributação pelo ICMS 60 - ICMS cobrado anteriormente por substituição tributária.
                                    vBCSTRet: '0.00', //Valor da BC do ICMS ST retido anteriormente.
                                    vICMSSTRet: '0.00', //Valor do ICMS ST retido anteriormente.
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
            adicionarTotalNaNota: function () {
                console.count('Method => adicionarTotalNaNota');
                let vProd = 0;
                let vDesc = 0;
                let vPIS = 0;
                let vCOFINS = 0;
                let vNF = 0;
                let qtdProd = 0;

                for (var x = 0; x < this.nota.enviNFe.NFe.det.length; x++) {
                    qtd = this.nota.enviNFe.NFe.det[x].prod.qCom;
                    vProd = vProd + (parseFloat(this.nota.enviNFe.NFe.det[x].prod.vProd) * qtd);
                    vDesc = vDesc + parseFloat(this.nota.enviNFe.NFe.det[x].prod.vDesc);
                    vPIS = vPIS + (parseFloat(this.nota.enviNFe.NFe.det[x].imposto.PIS.PISAliq.vPIS) * qtd);
                    vCOFINS = vCOFINS + (parseFloat(this.nota.enviNFe.NFe.det[x].imposto.COFINS.COFINSAliq.vCOFINS) * qtd);
                    vNF = vNF + (parseFloat(this.nota.enviNFe.NFe.det[x].prod.vProd) * qtd) - parseFloat(this.nota.enviNFe.NFe.det[x].prod.vDesc);
                    this.nota.enviNFe.NFe.total.ICMSTot.vProd = vProd;
                    this.nota.enviNFe.NFe.total.ICMSTot.vDesc = vDesc;
                    this.nota.enviNFe.NFe.total.ICMSTot.vPIS = vPIS;
                    this.nota.enviNFe.NFe.total.ICMSTot.vCOFINS = vCOFINS;
                    this.nota.enviNFe.NFe.total.ICMSTot.vNF = vNF;
                    this.nota.enviNFe.NFe.pag.vPag = vNF;
                }

                this.nota.enviNFe.NFe.total.ICMSTot.vDesc = parseFloat(this.nota.enviNFe.NFe.total.ICMSTot.vDesc) + parseFloat(this.venda.descontoTotal);
                this.nota.enviNFe.NFe.total.ICMSTot.vNF = parseFloat(this.nota.enviNFe.NFe.total.ICMSTot.vNF) - parseFloat(this.venda.descontoTotal);
            },
            calcTotTribNot() {
                console.count('Method => calcTotTribNot');
                this.venda.totTribNot = this.nota.enviNFe.NFe.total.ICMSTot.vPIS + this.nota.enviNFe.NFe.total.ICMSTot.vCOFINS;
            },
            finishRegister: function () {
                console.count('Method => finishRegister');
                $('#typePay').modal('hide');
                if (this.venda.listProduto !== 0) {
                    if (confirm("Tem certeza que deseja finalizar a compra?") == true) {
                        this.venda.produto[0].troco = this.venda.produto[0].valorRecebido - this.venda.totalParaLeituraShow;

                        this.pushTotal();
                        this.adicionarTotalNaNota();
                        this.calcTotTribNot();

                        if (navigator.onLine) {
                            this.transmit();
                            this.pushSalePDV(this.venda.listProduto, this.venda.total, this.venda.nota, false);
                            this.saleStoreOrUpdateTest();
                            this.genQrcode();
                        }
                        else {
                            this.transmit();
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
            },
            addRegister: function () {
                console.count('Method => addRegister');
                if (this.venda.produto[0].valorRecebido !== '') {
                    let valorRecebido = parseInt(this.venda.produto[0].valorRecebido);
                    let totalMaisDesconto = parseInt(this.venda.totalParaLeituraShow);

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
                        valorRecebido: this.venda.produto[0].valorRecebido,
                        total: this.venda.totalParaLeituraShow,
                        troco: this.venda.produto[0].troco,
                        desconto: parseFloat(this.venda.totalDescontoParaLeituraShow) + parseFloat(this.venda.descontoTotal),
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
                this.adicionarProdutosNaNFCE();
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

                    // this.configs_nfce[0].geral[0].serie = this.configs_nfce[0].geral[0].serie + 1;
                    // config_nfce.update(this.configs_nfce);
                    // db.save();
                    serie = this.configs_nfce[0].geral[0].serie;
                    numNot = 1;
                }
                else {
                    numNot = this.salesPDVTest[this.salesPDVTest.length - 1].num + 1;
                }

                this.vendaPDV.push(
                    {
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

                for (var i = 0; i < [this.nota.enviNFe].length; i++) {
                    digest = digest + '<infNFe Id="' + idNota + '" versao="4.00">'
                        + '<ide>'
                        + '     <cUF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cUF'] + '</cUF>'
                        + '     <cNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cNF'] + '</cNF>'
                        + '     <natOp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['natOp'] + '</natOp>'
                        + '     <indPag>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indPag'] + '</indPag>'
                        + '     <mod>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['mod'] + '</mod>'
                        + '     <serie>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['serie'] + '</serie>'
                        + '     <nNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['nNF'] + '</nNF>'
                        + '     <dhEmi>' + moment().format() + '</dhEmi>'
                        + '     <tpNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpNF'] + '</tpNF>'
                        + '     <idDest>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['idDest'] + '</idDest>'
                        + '     <cMunFG>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cMunFG'] + '</cMunFG>'
                        + '     <tpImp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpImp'] + '</tpImp>'

                    if (navigator.onLine) {
                        digest = digest + '<tpEmis>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpEmis'] + '</tpEmis>'
                    }
                    else {
                        digest = digest + '<tpEmis>9</tpEmis>'
                    }

                    digest = digest
                        + '     <tpAmb>' + this.configs_nfce[0].geral[0].ambiente + '</tpAmb>'
                        + '     <finNFe>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['finNFe'] + '</finNFe>'
                        + '     <indFinal>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indFinal'] + '</indFinal>'
                        + '     <indPres>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indPres'] + '</indPres>'
                        + '     <procEmi>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['procEmi'] + '</procEmi>'
                        + '     <verProc>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['verProc'] + '</verProc>'
                        + '</ide>'
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
                        + '</emit>'

                    for (var d = 0; d < [this.nota.enviNFe][i]['NFe']['det'].length; d++) {
                        digest = digest
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
                            + '     <ICMS>'
                            + '         <ICMS60>'
                            + '             <orig>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['orig'] + '</orig>'
                            + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['CST'] + '</CST>'
                            + '             <vBCSTRet>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['vBCSTRet'] + '</vBCSTRet>'
                            + '             <vICMSSTRet>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['vICMSSTRet'] + '</vICMSSTRet>'
                            + '         </ICMS60>'
                            + '     </ICMS>'
                            + '     <PIS>'
                            + '         <PISAliq>'
                            + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['CST'] + '</CST>'
                            + '             <vBC>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['vBC'] + '</vBC>'
                            + '             <pPIS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['pPIS'] + '</pPIS>'
                            + '             <vPIS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['vPIS'] + '</vPIS>'
                            + '         </PISAliq>'
                            + '     </PIS>'
                            + '     <COFINS>'
                            + '         <COFINSAliq>'
                            + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['CST'] + '</CST>'
                            + '             <vBC>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['vBC'] + '</vBC>'
                            + '             <pCOFINS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['pCOFINS'] + '</pCOFINS>'
                            + '             <vCOFINS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['vCOFINS'] + '</vCOFINS>'
                            + '         </COFINSAliq>'
                            + '     </COFINS>'
                            + ' </imposto>'
                            + '</det>'
                    }

                    digest = digest
                        + ' <total>'
                        + '    <ICMSTot>'
                        + '      <vBC>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBC'] + '</vBC>'
                        + '      <vICMS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vICMS'] + '</vICMS>'
                        + '      <vBCST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBCST'] + '</vBCST>'
                        + '      <vST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vST'] + '</vST>'
                        + '      <vProd>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vProd'] + '</vProd>'
                        + '      <vFrete>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vFrete'] + '</vFrete>'
                        + '      <vSeg>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vSeg'] + '</vSeg>'
                        + '      <vDesc>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vDesc'] + '</vDesc>'
                        + '      <vII>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vII'] + '</vII>'
                        + '      <vIPI>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vIPI'] + '</vIPI>'
                        + '      <vPIS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vPIS'] + '</vPIS>'
                        + '      <vCOFINS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vCOFINS'] + '</vCOFINS>'
                        + '      <vOutro>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vOutro'] + '</vOutro>'
                        + '      <vNF>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vNF'] + '</vNF>'
                        + '    </ICMSTot>'
                        + '</total>'
                        + '<transp>'
                        + '    <modFrete>' + [this.nota.enviNFe][i]['NFe']['transp']['modFrete'] + '</modFrete>'
                        + '</transp>'

                    if (this.venda.tPag == '03' || this.venda.tPag == '04') {
                        digest = digest
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
                        digest = digest
                            + ' <pag>'
                            + '     <detPag>'
                            + '         <tPag>' + [this.nota.enviNFe][i]['NFe']['pag']['tPag'] + '</tPag>'
                            + '         <vPag>' + [this.nota.enviNFe][i]['NFe']['pag']['vPag'] + '</vPag>'
                            + '     </detPag>'
                            + '</pag>'
                    }

                    digest = digest
                        + '</infNFe>';

                    let digestSha1 = sha1(digest);

                    this.venda.digest.push(
                        {
                            xml: digestSha1
                        }
                    );

                    console.count('Data => digest');
                    console.count(this.venda.digest[0].xml);
                }

                for (var i = 0; i < [this.nota.enviNFe].length; i++) {
                    nota = nota + '<enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">'
                        + '<idLote>' + this.nota.enviNFe.idLote + '</idLote>'
                        + '<indSinc>1</indSinc>'
                        + '<NFe>'
                        + '<infNFe Id="' + idNota + '" versao="4.00">'
                        + '<ide>'
                        + '     <cUF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cUF'] + '</cUF>'
                        + '     <cNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cNF'] + '</cNF>'
                        + '     <natOp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['natOp'] + '</natOp>'
                        + '     <indPag>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indPag'] + '</indPag>'
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
                        + '</ide>'
                        + ' <emit>'
                        + ' <CNPJ>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['CNPJ'] + '</CNPJ>'
                        + ' <xNome>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['xNome'] + '</xNome>'
                        + ' <enderEmit>'
                        + '     <xLgr>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xLgr'] + '</xLgr>'
                        + '     <nro>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['nro'] + '</nro>'
                        // + ' <xCpl>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xCpl'] + '</xCpl>'
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
                        + '</emit>'

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
                            + '     <ICMS>'
                            + '         <ICMS60>'
                            + '             <orig>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['orig'] + '</orig>'
                            + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['CST'] + '</CST>'
                            + '             <vBCSTRet>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['vBCSTRet'] + '</vBCSTRet>'
                            + '             <vICMSSTRet>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['vICMSSTRet'] + '</vICMSSTRet>'
                            + '         </ICMS60>'
                            + '     </ICMS>'
                            + '     <PIS>'
                            + '         <PISAliq>'
                            + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['CST'] + '</CST>'
                            + '             <vBC>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['vBC'] + '</vBC>'
                            + '             <pPIS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['pPIS'] + '</pPIS>'
                            + '             <vPIS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['vPIS'] + '</vPIS>'
                            + '         </PISAliq>'
                            + '     </PIS>'
                            + '     <COFINS>'
                            + '         <COFINSAliq>'
                            + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['CST'] + '</CST>'
                            + '             <vBC>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['vBC'] + '</vBC>'
                            + '             <pCOFINS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['pCOFINS'] + '</pCOFINS>'
                            + '             <vCOFINS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['vCOFINS'] + '</vCOFINS>'
                            + '         </COFINSAliq>'
                            + '     </COFINS>'
                            + ' </imposto>'
                            + '</det>'
                    }

                    nota = nota
                        + ' <total>'
                        + '    <ICMSTot>'
                        + '      <vBC>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBC'] + '</vBC>'
                        + '      <vICMS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vICMS'] + '</vICMS>'
                        // + ' <vICMSDeson></vICMSDeson>'
                        // + ' <vFCP></vFCP>'
                        + '      <vBCST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBCST'] + '</vBCST>'
                        + '      <vST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vST'] + '</vST>'
                        // + ' <vFCPST></vFCPST>'
                        // + ' <vFCPSTRet></vFCPSTRet>'
                        + '      <vProd>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vProd'] + '</vProd>'
                        + '      <vFrete>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vFrete'] + '</vFrete>'
                        + '      <vSeg>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vSeg'] + '</vSeg>'
                        + '      <vDesc>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vDesc'] + '</vDesc>'
                        + '      <vII>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vII'] + '</vII>'
                        + '      <vIPI>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vIPI'] + '</vIPI>'
                        + '      <vPIS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vPIS'] + '</vPIS>'
                        + '      <vCOFINS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vCOFINS'] + '</vCOFINS>'
                        + '      <vOutro>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vOutro'] + '</vOutro>'
                        + '      <vNF>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vNF'] + '</vNF>'
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
                            // + '    <CNPJ>' + [this.nota.enviNFe][i]['NFe']['pag']['card']['CNPJ'] + '</CNPJ>'
                            // + '    <tBand>' + [this.nota.enviNFe][i]['NFe']['pag']['card']['tBand'] + '</tBand>'
                            // + '    <cAut>' + [this.nota.enviNFe][i]['NFe']['pag']['card']['cAut'] + '</cAut>'
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
                        // + '<infAdic/>'
                        + '</infNFe>'
                        + ' <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'
                        + '     <SignedInfo>'
                        + '        <CanonicalizationMethod Algorithm="' + this.configs_nfce[0].signature[0].CanonicalizationMethod + '"/>'
                        + '        <SignatureMethod Algorithm="' + this.configs_nfce[0].signature[0].SignatureMethod + '"/>'
                        + '        <Reference URI="#NFe13130604501136000136650020000136261010222458">'
                        + '             <Transforms>'
                        + '                 <Transform Algorithm="' + this.configs_nfce[0].signature[0].Transform1 + '"/>'
                        + '                 <Transform Algorithm="' + this.configs_nfce[0].signature[0].Transform2 + '"/>'
                        + '             </Transforms>'
                        + '             <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>'
                        + '             <DigestValue>' + this.venda.digest[0].xml + '</DigestValue>'
                        + '        </Reference>'
                        + '     </SignedInfo>'
                        + '     <SignatureValue>' + this.configs_nfce[0].signature[0].SignatureValue + '</SignatureValue>'
                        + '     <KeyInfo>'
                        + '         <X509Data>'
                        + '             <X509Certificate>' + this.configs_nfce[0].signature[0].X509Certificate + '</X509Certificate>'
                        + '         </X509Data>'
                        + '     </KeyInfo>'
                        + ' </Signature>'
                        + ' </NFe>'
                        + ' </enviNFe>';

                    this.venda.nota.push(
                        {
                            xml: nota
                        }
                    );
                }

                console.count('Data => nota');
                console.log(this.venda.nota);
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
            },
            cleanFields: function () {
                console.count('Method => cleanFields');
                this.venda.produto[0].nome = '';
                this.venda.produto[0].preco = '';
                this.venda.produto[0].codigoBarra = '';
                this.venda.produto[0].descricao = '';
                // this.venda.produto[0].desconto = '';
                // this.venda.produto[0].quantidade = '';
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
                    // + 'th:nth-child(2),'
                    // + 'td:nth-child(2) {'
                    // + 'width: 90px;'
                    // + '}'
                    // + 'th:nth-child(3),'
                    // + 'td:nth-child(3) {'
                    // + 'width: 90px;'
                    // + 'text-align: right;'
                    // + '}'
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
                    // + '<br>'
                    // + '<h3 style="text-align: center; margin: 0px"><b>EMITIDA EM CONTINGÊNCIA</b></h3>'
                    // + '<p style="text-align: center; margin: 0px"><b>Pendente de Autorização</b></p>'
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
                    + '<td align="right">' + (parseFloat(this.venda.totalParaLeituraShow) - parseFloat(this.venda.descontoTotal)) + '</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td colspan="5">Desconto R$</td>'
                    + '<td align="right">' + (parseFloat(this.venda.totalDescontoParaLeituraShow) + parseFloat(this.venda.descontoTotal)) + '</td>'
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
                var fs = require('fs');
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
                                        // location.reload();
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
                    // + 'th:nth-child(2),'
                    // + 'td:nth-child(2) {'
                    // + 'width: 90px;'
                    // + '}'
                    // + 'th:nth-child(3),'
                    // + 'td:nth-child(3) {'
                    // + 'width: 90px;'
                    // + 'text-align: right;'
                    // + '}'
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
                    + '<td align="right">' + (parseFloat(this.venda.totalParaLeituraShow) - parseFloat(this.venda.descontoTotal)) + '</td>'
                    + '</tr>'
                    + '<tr>'
                    + '<td colspan="5">Desconto R$</td>'
                    + '<td align="right">' + (parseFloat(this.venda.totalDescontoParaLeituraShow) + parseFloat(this.venda.descontoTotal)) + '</td>'
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
                    alert('Por favor insira um dado para começar a pesquisa de produto!');
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
                    alert('Por favor insira uma quantidade!');
                    document.getElementById("qtdeInFocus").focus();
                }
                else if (this.venda.produto[0].quantidade == 0 || this.venda.produto[0].quantidade < 0) {
                    alert('Este campo não pode ser preenchido com valores menores que zero ou iguais a zero!');
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
                document.getElementById("discountTotal").focus();
                // document.getElementById("pay").focus();
            },
            toValueReceived: function () {
                console.count('Method => toValueReceived');
                this.venda.listViewSale.nameProdStealth = '';
                this.venda.listViewSale.qtdProdStealth = '';
                this.venda.listViewSale.priceProdStealth = '';
                this.venda.listViewSale.valueSaleStealth = '';
                document.getElementById("valorRecebidoInFocus").disabled = false;
                if (this.venda.produto[0].desconto == '' || this.venda.produto[0].desconto < 0) {
                    alert('Este campo não pode ser preenchido com valores menores que zero!');
                    document.getElementById("descontoInFocus").focus();
                }
                else {
                    let preco = parseInt(this.venda.produto[0].preco);
                    let quantidade = parseInt(this.venda.produto[0].quantidade);
                    let desconto = parseInt(this.venda.produto[0].desconto);
                    this.venda.produto[0].subtotal = (preco * quantidade) - desconto;
                    this.venda.produto[0].total += (preco * quantidade) - desconto;

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

                    /**
                     *-------------------------------------------------
                     * Prepara para exibir no front o total dos itens.
                     *-------------------------------------------------
                     */
                    let totalParaLeitura = 0;
                    let descontoParaLeitura = 0;
                    let quantidadeParaLeitura = 0;

                    for (i = 0; i < this.venda.totalParaLeitura.length; i++) {
                        totalParaLeitura += parseInt(this.venda.totalParaLeitura[i].totalParaLeitura);
                        descontoParaLeitura += parseInt(this.venda.totalParaLeitura[i].descontoParaLeitura);
                        quantidadeParaLeitura += parseInt(this.venda.totalParaLeitura[i].quantidadeParaLeitura);
                        this.venda.totalParaLeituraShow = totalParaLeitura;
                        this.venda.totalDescontoParaLeituraShow = descontoParaLeitura;
                        this.venda.totalDescontoParaLeituraShow = descontoParaLeitura;
                        this.venda.quantidadeTotalParaLeitura = quantidadeParaLeitura;
                    }

                    this.pushListProduct();
                    document.getElementById("valorRecebidoInFocus").focus();
                    document.getElementById("descontoInFocus").disabled = true;
                }
            },

            focusInProductField: function () {
                console.count('Method => focusInProductField');
                document.getElementById("prodInFocus").focus();
                document.getElementById("qtdeInFocus").disabled = false;
                document.getElementById("descontoInFocus").disabled = true;
                document.getElementById("valorRecebidoInFocus").disabled = true;
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
                    self.venda.produto[0].codigo = self.produto[0].id;
                    self.venda.produto[0].codigoBarra = self.produto[0].codigo_barras;
                    self.venda.produto[0].cean = self.produto[0].codigoBarra;
                    self.venda.produto[0].cfop = self.produto[0].cfop.codigocfop;
                    self.venda.produto[0].ncm = self.produto[0].ncm.codigo;
                    self.venda.produto[0].cest = self.produto[0].cest.cest;
                    self.venda.produto[0].nome = self.produto[0].nome;
                    self.venda.produto[0].descricao = self.produto[0].descricao;
                    self.venda.produto[0].preco = self.produto[0].preco_venda;
                    self.venda.produto[0].unidade = self.produto[0].unidade.descricao;

                    self.venda.listViewSale.nameProdStealth = self.venda.produto[0].nome;
                    self.venda.listViewSale.qtdProdStealth = self.venda.produto[0].quantidade;
                    self.venda.listViewSale.priceProdStealth = self.venda.produto[0].preco;
                    self.venda.listViewSale.valueSaleStealth = self.venda.produto[0].preco * self.venda.produto[0].quantidade;

                    self.venda.listViewSale.redux.nameProdStealthRedux = self.venda.produto[0].nome.substr(0, 20);
                }
                return self.produto;
            }
        }
    });
}

function dateFormat() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(),
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    hour = data.getHours();
    return diaF + "-" + mesF + "-" + anoF;
}