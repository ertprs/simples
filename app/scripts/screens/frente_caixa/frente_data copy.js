var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');

const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');
managementData(dataAtualFormatada());

function managementData(date) {
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

        if (!(db.getCollection('clientes'))) {
            alert('A base de dados de clientes não está presente...');

        }

    }
    else {
        var vendasPDV = db.getCollection('vendasPDV');
        var salesPDVTest = db.getCollection('salesPDVTest');
        var produtos = db.getCollection('produtos');
        var clientes = db.getCollection('clientes');
        var empresas = db.getCollection('empresas');

        new Vue({
            el: 'body',
            data: {
                search: "",
                date: '',
                empresas: [],
                vendasPDV: [],
                salesPDVTest: [],
                produtos: [],
                clientes: [],
                venda: {
                    produto: [
                        {
                            codigo: '',
                            codigoBarra: '',
                            cean: '',
                            cfop: '',
                            ncm: '',
                            nome: '',
                            descricao: '',
                            preco: '',
                            quantidade: '',
                            desconto: 0,
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
                    preco_unitario: 0,
                    quantidade: 0,
                    quantidadeTotalParaLeitura: 0,
                    qrcode: ''
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
                                    tpAmb: '2', //Identificação do Ambiente:
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
                                CRT: '3' //Código de Regime Tributário. Este campo será obrigatoriamente preenchido com:
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
                                tpAmb: '2', //Identificação do Ambiente:
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
                this.date = date;
                this.produtos = produtos.data;
                this.clientes = clientes.data;
                this.empresas = empresas.data;
                this.patternFillNote();
                this.formfocus();
            },
            methods: {
                patternFillNote: function () {
                    let codigoNota = Math.floor(Math.random() * 1000000000 + 1);
                    let numNota = Math.floor(Math.random() * 1000000000 + 10);
                    let idDoLote = Math.floor(Math.random() * 1000000000 + 7);
                    this.nota.enviNFe.idLote = idDoLote;
                    this.nota.enviNFe.NFe.infNFe.ide.cNF = codigoNota;
                    this.nota.enviNFe.NFe.infNFe.ide.nNF = numNota;
                    this.nota.enviNFe.NFe.infNFe.ide.cMunFG = this.empresas[0].endereco.codigoMunicipio;
                    this.nota.enviNFe.NFe.infNFe.emit.CNPJ = this.empresas[0].cnpj;
                    this.nota.enviNFe.NFe.infNFe.emit.xNome = this.empresas[0].nome;
                    this.nota.enviNFe.NFe.infNFe.emit.xFant = this.empresas[0].nome;
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
                    this.nota.enviNFe.NFe.det.push(
                        {
                            nItem: '',
                            prod: {
                                cProd: this.venda.produto[0].codigo,
                                cEAN: this.venda.produto[0].cean,
                                xProd: this.venda.produto[0].descricao,
                                NCM: this.venda.produto[0].ncm,
                                CFOP: this.venda.produto[0].cfop,
                                uCom: 'UN',
                                qCom: this.venda.produto[0].quantidade + '.' + "0000",
                                vUnCom: this.venda.produto[0].preco + '.' + "0000",
                                vProd: this.venda.produto[0].preco + '.' + "00",
                                cEANTrib: this.venda.produto[0].cean,
                                uTrib: 'UN',
                                qTrib: this.venda.produto[0].quantidade + '.' + "0000",
                                vUnTrib: this.venda.produto[0].preco + '.' + "0000",
                                vDesc: this.venda.produto[0].desconto,
                                indTot: 'Preenchido na hora da geração do XML',
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
                },
                testShortcut: function () {
                    console.log('Teste de atalho');
                },
                addRegister: function () {
                    let troco = this.venda.produto[0].valorRecebido - this.venda.produto[0].total;
                    this.venda.produto[0].troco = troco;
                    this.venda.quantidadeTotalParaLeitura += parseInt(this.venda.produto[0].quantidade);
                    this.pushListProduct();

                    if (this.venda.produto[0].valorRecebido !== '') {
                        let valorRecebido = parseInt(this.venda.produto[0].valorRecebido);
                        let totalMaisDesconto = parseInt(this.venda.totalParaLeituraShow) + parseInt(this.venda.totalDescontoParaLeituraShow);

                        if (valorRecebido > totalMaisDesconto) {
                            if (this.venda.listProduto !== 0) {
                                if (confirm("Tem certeza que deseja finalizar a compra?") == true) {
                                    this.pushTotal();
                                    this.adicionarTotalNaNota();

                                    /**
                                     *----------------------------------------------
                                     * Verifica se existe uma conexão disponível
                                     *----------------------------------------------
                                     */
                                    if (!navigator.onLine) {
                                        this.transmit();
                                        this.pushSalePDV(this.venda.listProduto, this.venda.total, this.venda.nota, false);
                                        this.saleStoreOrUpdateTest();
                                        this.genQrcode();
                                        // this.testPrinter();
                                    }
                                    else {
                                        this.transmit();
                                        this.pushSalePDV(this.venda.listProduto, this.venda.total, this.venda.nota, true);
                                        this.saleStoreOrUpdateTest();
                                        this.genQrcode();
                                        // this.testPrinter();
                                    }
                                }
                                else {
                                    this.cleanFields();
                                }
                            }
                            else {
                                alert('Não salvou corretamente.....');
                            }
                        }
                        else {
                            alert('Valor recebido incorreto');
                        }
                    }
                    else {
                        this.cleanFields();
                    }
                },
                pushTotal: function () {
                    this.venda.total.push(
                        {
                            valorRecebido: this.venda.produto[0].valorRecebido,
                            total: this.venda.totalParaLeituraShow,
                            troco: this.venda.produto[0].valorRecebido - this.venda.totalParaLeituraShow - this.venda.totalDescontoParaLeituraShow,
                            desconto: this.venda.totalDescontoParaLeituraShow,
                        }
                    );
                },
                /**
                 *----------------------------------------------
                 * Terceira adição(3)
                 *----------------------------------------------
                 */
                pushListProduct: function () {
                    console.log('||||||||||||||||||||||||||||||||');
                    console.log('Function -> pushListProduct');
                    console.log('Produto: ');
                    console.log(this.venda.produto[0]);
                    console.log('||||||||||||||||||||||||||||||||');
                    this.venda.listProduto.unshift(
                        {
                            codigo: this.venda.produto[0].codigo,
                            codigoBarra: this.venda.produto[0].codigoBarra,
                            cean: this.venda.produto[0].cean,
                            cfop: this.venda.produto[0].cfop,
                            ncm: this.venda.produto[0].ncm,
                            nome: this.venda.produto[0].nome,
                            descricao: this.venda.produto[0].descricao,
                            preco: this.venda.produto[0].preco,
                            quantidade: this.venda.produto[0].quantidade,
                            desconto: this.venda.produto[0].desconto,
                            subtotal: this.venda.produto[0].subtotal,
                        }
                    );
                    this.adicionarProdutosNaNFCE();
                },
                testPrinter: function () {
                    // console.log('Teste de impressão');
                    // var printer = require("printer");

                    // printer.printDirect({
                    //     data: "print from Node.JS buffer" // or simple String: "some text"
                    //     , type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
                    //     , success: function (jobID) {
                    //         console.log("sent to printer with ID: " + jobID);
                    //     }
                    //     , error: function (err) { console.log(err); }
                    // });

                    const path = require("path")
                    var printer = require("pdf-to-printer");

                    // path.join(__dirname, "tmp", "output.pdf")
                    printer
                        .print(path.join(__dirname, "tmp", "output2.pdf"))
                        .then(console.log)
                        .catch(console.error);
                },
                pushSalePDV: function (listProduct, total, xml, contingencia) {
                    this.vendaPDV.push(
                        {
                            listProduct: listProduct,
                            total: total,
                            xml: xml,
                            contingencia: contingencia
                        }
                    );                    
                    console.log('||||||||||||||||||||||||||||||||');
                    console.log('Function -> pushSalePDV');
                    console.log('vendaPDV: ');
                    console.log(this.vendaPDV[0]);
                    console.log('||||||||||||||||||||||||||||||||');
                    
                },
                transmit: function () {
                    let idNota = 'Teste';
                    let nota = '<?xml version="1.0" encoding="UTF-8"?>';
                    for (var i = 0; i < [this.nota.enviNFe].length; i++) {
                        nota = nota + '<enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">' //ok
                            + '<idLote>30610505</idLote>' //ok
                            + '<indSinc>1</indSinc>' //ok - As empresas devem solicitar o Pedido de Resposta Síncrono (indSinc=1) para os Lotes com somente 1 (uma) NFC-e (caso normal).
                            + '<NFe>' //ok
                            + '<infNFe Id="NFe' + idNota + '" versao="4.00">'//ok

                            /**
                             *----------------------------------------------
                             * Identificação
                             *----------------------------------------------
                             */
                            + '<ide>'
                            + '     <cUF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cUF'] + '</cUF>' //ok
                            + '     <cNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cNF'] + '</cNF>' //ok
                            + '     <natOp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['natOp'] + '</natOp>' //ok
                            + '     <indPag>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indPag'] + '</indPag>' //ok - Trocar para revenda de mercadoria
                            + '     <mod>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['mod'] + '</mod>' //ok
                            + '     <serie>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['serie'] + '</serie>' //ok
                            + '     <nNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['nNF'] + '</nNF>' //ok
                            + '     <dhEmi>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['dhEmi'] + '</dhEmi>' //ok
                            + '     <tpNF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpNF'] + '</tpNF>' //ok
                            + '     <idDest>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['idDest'] + '</idDest>' //ok
                            + '     <cMunFG>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cMunFG'] + '</cMunFG>' //ok
                            + '     <tpImp>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpImp'] + '</tpImp>'  //ok
                            
                            if (navigator.onLine) {
                                + '<tpEmis>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpEmis'] + '</tpEmis>' //ok
                            }
                            else
                            {
                                + '<tpEmis>9</tpEmis>' //ok
                            }
                            
                            // + '<cDV>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['cDV'] + '</cDV>'
                            + '     <tpAmb>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['tpAmb'] + '</tpAmb>' //ok
                            + '     <finNFe>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['finNFe'] + '</finNFe>' //ok
                            + '     <indFinal>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indFinal'] + '</indFinal>' //ok
                            + '     <indPres>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['indPres'] + '</indPres>' //ok
                            + '     <procEmi>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['procEmi'] + '</procEmi>' //ok
                            + '     <verProc>' + [this.nota.enviNFe][i]['NFe']['infNFe']['ide']['verProc'] + '</verProc>' //ok
                            + '</ide>'

                            /**
                             *----------------------------------------------
                             * Emitente
                             *----------------------------------------------
                             */
                            + ' <emit>'
                            + ' <CNPJ>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['CNPJ'] + '</CNPJ>' //ok
                            + ' <xNome>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['xNome'] + '</xNome>' //ok
                            + ' <enderEmit>'
                            + '     <xLgr>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xLgr'] + '</xLgr>' //ok
                            + '     <nro>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['nro'] + '</nro>' //ok
                            // + ' <xCpl>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xCpl'] + '</xCpl>'
                            + '     <xBairro>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xBairro'] + '</xBairro>' //ok
                            + '     <cMun>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['cMun'] + '</cMun>' //ok
                            + '     <xMun>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xMun'] + '</xMun>' //ok
                            + '     <UF>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['UF'] + '</UF>' //ok
                            + '     <CEP>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['CEP'] + '</CEP>' //ok
                            + '     <cPais>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['cPais'] + '</cPais>' //ok
                            + '     <xPais>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['xPais'] + '</xPais>' //ok
                            + '     <fone>' + [this.nota.enviNFe][i]['NFe']['infNFe']['emit']['enderEmit']['fone'] + '</fone>' //ok
                            + ' </enderEmit>'
                            + ' <IE>' + [this.nota.enviNFe][i]['NFe']['infNFe']['IE'] + '</IE>' //ok
                            + ' <CRT>' + [this.nota.enviNFe][i]['NFe']['infNFe']['CRT'] + '</CRT>' //ok
                            + '</emit>'

                            /**
                             *----------------------------------------------
                             * Destinatário
                             *----------------------------------------------
                             **/
                            + ' <dest>'
                            + ' <CPF>' + [this.nota.enviNFe][i]['NFe']['dest']['CPF'] + '</CPF>' //ok
                            + ' <xNome>' + [this.nota.enviNFe][i]['NFe']['dest']['xNome'] + '</xNome>' //ok
                            + ' <enderDest>'
                            + '     <xLgr>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['xLgr'] + '</xLgr>' //ok
                            + '     <nro>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['nro'] + '</nro>' //ok
                            // + ' <xCpl>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['xCpl'] + '</xCpl>'
                            + '     <xBairro>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['xBairro'] + '</xBairro>' //ok
                            + '     <cMun>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['cMun'] + '</cMun>' //ok
                            + '     <xMun>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['xMun'] + '</xMun>' //ok
                            + '     <UF>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['UF'] + '</UF>'  //ok
                            + '     <CEP>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['CEP'] + '</CEP>' //ok
                            + '     <cPais>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['cPais'] + '</cPais>' //ok
                            + '     <xPais>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['xPais'] + '</xPais>' //ok
                            + '     <fone>' + [this.nota.enviNFe][i]['NFe']['dest']['enderDest']['fone'] + '</fone>' //ok
                            + ' </enderDest>'
                            + '<indIEDest>9</indIEDest>' //ok - 9=Não Contribuinte, que pode ou não possuir Inscrição Estadual no Cadastro de Contribuintes do ICMS.
                            + '</dest>'

                        for (var d = 0; d < [this.nota.enviNFe][i]['NFe']['det'].length; d++) {

                            /**
                             *----------------------------------------------
                             * Itens da Nota
                             *----------------------------------------------
                             */
                            nota = nota
                                + '<det nItem="' + (d + 1) + '">'
                                + ' <prod>'
                                + '     <cProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cProd'] + '</cProd>' //ok
                                + '     <cEAN>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cEAN'] + '</cEAN>' //ok
                                + '     <xProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['xProd'] + '</xProd>' //ok
                                + '     <NCM>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['NCM'] + '</NCM>' //ok
                                + '     <CFOP>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['CFOP'] + '</CFOP>' //ok
                                + '     <uCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['uCom'] + '</uCom>'//ok
                                + '     <qCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['qCom'] + '</qCom>' //ok
                                + '     <vUnCom>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vUnCom'] + '</vUnCom>' //ok
                                + '     <vProd>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vProd'] + '</vProd>' //ok
                                + '     <cEANTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['cEANTrib'] + '</cEANTrib>' //ok
                                + '     <uTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['uTrib'] + '</uTrib>' //ok
                                + '     <qTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['qTrib'] + '</qTrib>' //ok
                                + '     <vUnTrib>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['vUnTrib'] + '</vUnTrib>' //ok
                                + '     <indTot>' + [this.nota.enviNFe][i]['NFe']['det'][d]['prod']['indTot'] + '</indTot>' //ok
                                + ' </prod>'

                                /**
                                 *----------------------------------------------
                                 * Impostos | Bloco mais importante |
                                 *----------------------------------------------
                                 */
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
                                + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['CST'] + '</CST>' //ok
                                + '             <vBC>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['vBC'] + '</vBC>' //ok
                                + '             <pPIS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['pPIS'] + '</pPIS>' //ok
                                + '             <vPIS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['vPIS'] + '</vPIS>' //ok
                                + '         </PISAliq>'
                                + '     </PIS>'
                                + '     <COFINS>'
                                + '         <COFINSAliq>'
                                + '             <CST>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['CST'] + '</CST>' //ok
                                + '             <vBC>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['vBC'] + '</vBC>' //ok
                                + '             <pCOFINS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['pCOFINS'] + '</pCOFINS>' //ok
                                + '             <vCOFINS>' + [this.nota.enviNFe][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['vCOFINS'] + '</vCOFINS>' //ok
                                + '         </COFINSAliq>'
                                + '     </COFINS>'
                                + ' </imposto>'
                                + '</det>'
                        }

                        /**
                         *----------------------------------------------
                         * Total | Importante |
                         *----------------------------------------------
                         */
                        nota = nota
                            + ' <total>'
                            + '    <ICMSTot>'
                            + '      <vBC>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBC'] + '</vBC>' //ok
                            + '      <vICMS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vICMS'] + '</vICMS>' //ok
                            // + ' <vICMSDeson></vICMSDeson>'
                            // + ' <vFCP></vFCP>'
                            + '      <vBCST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vBCST'] + '</vBCST>' //ok
                            + '      <vST>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vST'] + '</vST>' //ok
                            // + ' <vFCPST></vFCPST>'
                            // + ' <vFCPSTRet></vFCPSTRet>'
                            + '      <vProd>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vProd'] + '</vProd>' //ok
                            + '      <vFrete>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vFrete'] + '</vFrete>' //ok
                            + '      <vSeg>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vSeg'] + '</vSeg>' //ok
                            + '      <vDesc>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vDesc'] + '</vDesc>' //ok
                            + '      <vII>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vII'] + '</vII>' //ok
                            + '      <vIPI>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vIPI'] + '</vIPI>' //ok
                            + '      <vPIS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vPIS'] + '</vPIS>' //ok
                            + '      <vCOFINS>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vCOFINS'] + '</vCOFINS>' //ok
                            + '      <vOutro>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vOutro'] + '</vOutro>' //ok
                            + '      <vNF>' + [this.nota.enviNFe][i]['NFe']['total']['ICMSTot']['vNF'] + '</vNF>' //ok
                            + '    </ICMSTot>'
                            + '</total>'

                            /**
                             *----------------------------------------------
                             * Trasnporte
                             *----------------------------------------------
                             */
                            + '<transp>'
                            + '    <modFrete>' + [this.nota.enviNFe][i]['NFe']['transp']['modFrete'] + '</modFrete>' //ok
                            + '</transp>'

                            /**
                             *----------------------------------------------
                             * Pagamento | Mudou
                             *----------------------------------------------
                             */
                            + ' <pag>'
                            + '     <detPag>'
                            + '         <tPag>' + [this.nota.enviNFe][i]['NFe']['pag']['tPag'] + '</tPag>' //ok
                            + '         <vPag>' + [this.nota.enviNFe][i]['NFe']['pag']['vPag'] + '</vPag>' //ok
                            + '     </detPag>'
                            // + ' <card>'
                            // + '    <CNPJ>' + [this.nota.enviNFe][i]['NFe']['pag']['card']['CNPJ'] + '</CNPJ>'
                            // + '    <tBand>' + [this.nota.enviNFe][i]['NFe']['pag']['card']['tBand'] + '</tBand>'
                            // + '    <cAut>' + [this.nota.enviNFe][i]['NFe']['pag']['card']['cAut'] + '</cAut>'
                            // + ' </card>'
                            + '</pag>'

                            /**
                             *----------------------------------------------
                             * Informação Adicional
                             *----------------------------------------------
                             */
                            // + '<infAdic/>'
                            + '</infNFe>'


                            /**
                             *----------------------------------------------
                             * Assinatura digital
                             *----------------------------------------------
                             */
                            + ' <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">'
                            + '     <SignedInfo>'
                            + '        <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'
                            + '        <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>'
                            + '        <Reference URI="#NFe13130604501136000136650020000136261010222458">'
                            + '             <Transforms>'
                            + '                 <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>'
                            + '                 <Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'
                            + '             </Transforms>'
                            + '             <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>'
                            + '             <DigestValue>a3XXXoUSXXBBWl234FNRdA1673U=</DigestValue>'
                            + '        </Reference>'
                            + '     </SignedInfo>'
                            + '     <SignatureValue>' + [this.nota.enviNFe][i]['NFe']['Signature']['SignatureValue']['SignatureValue'] + '</SignatureValue>'
                            + '     <KeyInfo>'
                            + '         <X509Data>'
                            + '             <X509Certificate>' + [this.nota.enviNFe][i]['NFe']['Signature']['keyInfo']['X509Data']['X509Certificate'] + '</X509Certificate>'
                            + '         </X509Data>'
                            + '     </KeyInfo>'
                            + ' </Signature>'

                            /**
                             *----------------------------------------------
                             * Proteção da Nota
                             *----------------------------------------------
                             */
                            + ' </NFe>'
                            + '     <protNFe versao="3.00">'
                            + '         <infProt>'
                            + '             <tpAmb>' + [this.nota.enviNFe][i]['protNFe']['infProt']['tpAmb'] + '</tpAmb>'
                            + '             <verAplic>' + [this.nota.enviNFe][i]['protNFe']['infProt']['verAplic'] + '</verAplic>'
                            + '             <chNFe>' + [this.nota.enviNFe][i]['protNFe']['infProt']['chNFe'] + '</chNFe>'
                            + '             <dhRecbto>' + [this.nota.enviNFe][i]['protNFe']['infProt']['dhRecbto'] + '</dhRecbto>'
                            + '             <nProt>' + [this.nota.enviNFe][i]['protNFe']['infProt']['nProt'] + '</nProt>'
                            + '             <digVal>' + [this.nota.enviNFe][i]['protNFe']['infProt']['digVal'] + '</digVal>'
                            + '             <cStat>' + [this.nota.enviNFe][i]['protNFe']['infProt']['cStat'] + '</cStat>'
                            + '             <xMotivo>' + [this.nota.enviNFe][i]['protNFe']['infProt']['xMotivo'] + '</xMotivo>'
                            + '         </infProt>'
                            + '     </protNFe>'
                            + ' </enviNFe>';

                        this.venda.nota.push(
                            {
                                xml: nota
                            }
                        );

                        console.log('||||||||||||||||||||||||||||||||');
                        console.log('Function -> transmit');
                        console.log('Nota: ');
                        console.log(this.venda.nota[0].xml);
                        console.log('||||||||||||||||||||||||||||||||');
                    }
                },
                cleanFields: function () {
                    this.venda.produto[0].nome = '';
                    this.venda.produto[0].preco = '';
                    this.venda.produto[0].codigoBarra = '';
                    this.venda.produto[0].descricao = '';
                    this.venda.produto[0].quantidade = '';
                    this.venda.produto[0].total = '';
                    this.venda.produto[0].subtotal = '';
                    this.venda.produto[0].troco = '';
                    this.search = '';
                    this.formfocus();
                },
                genQrcode: function () {
                    var QRCode = require('qrcode');
                    var self = this;
                    QRCode.toDataURL("http://google.com", function (err, url) {
                        self.venda.qrcode = url;
                        console.log(url);
                        if (!navigator.onLine) 
                        {
                            self.mountCupom();
                        }
                        else
                        {
                            self.mountCupomContingency();
                        }
                    });
                },
                mountCupom: function () {
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
                        + 'max-width: 400px;'
                        + 'font-weight: light;'
                        + 'line-height: 1.3em;'
                        + 'font-family: Tahoma, Geneva, sans-serif;'
                        + 'font-size: 10px;'
                        + '}'
                        + 'th:nth-child(2),'
                        + 'td:nth-child(2) {'
                        + 'width: 50px;'
                        + '}'
                        + 'th:nth-child(3),'
                        + 'td:nth-child(3) {'
                        + 'width: 90px;'
                        + 'text-align: right;'
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
                        + '</style>'
                        + '</head>'
                        + '<body>'
                        + '<table class="printer-ticket">'
                        + '<thead>'
                        + '<tr>'
                        + '<th colspan="3">'
                        + '<p style="text-align: center; margin: 0px;">CNPJ: ' + this.empresas[0].cnpj + '<strong> ' + this.empresas[0].nome + '</strong></p>'
                        + '<p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ', ' + this.empresas[0].endereco.uf + '</p>'
                        + '<p style="text-align: center; margin: 0px">Documento Auxiliar de Nota Fiscal de Consumidor Eletrônica</p>'
                        + '</th>'
                        + '</tr>'
                        + '</thead>'
                        + '<tbody>'

                    for (var i = 0; i < this.venda.listProduto.length; i++) {
                        cupom = cupom + '<tr>'
                            + '<td colspan="3">' + [this.venda.listProduto[i].nome] + '</td>'
                            + '</tr>'
                            + '<tr>'
                            + '<td>' + [this.venda.listProduto[i].quantidade] + '</td>'
                            + '<td>' + [this.venda.listProduto[i].preco] + '</td>'
                            + '<td>' + this.venda.listProduto[i].preco * this.venda.listProduto[i].quantidade + '</td>'
                            + '</tr>'
                    }

                    cupom = cupom + '</tbody>'
                        + '<tfoot>'
                        + '<tr>'
                        + '<td colspan="2">Qtde. total de itens</td>'
                        + '<td align="right">' + this.venda.quantidadeTotalParaLeitura + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">Valor total R$</td>'
                        + '<td align="right">' + this.venda.totalParaLeituraShow + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">Desconto R$</td>'
                        + '<td align="right">' + this.venda.totalDescontoParaLeituraShow + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">FORMA PAGAMENTO</td>'
                        + '<td align="right">R$45,56</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">Dinheiro R$</td>'
                        + '<td align="right">' + this.venda.produto[0].valorRecebido + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">Troco R$</td>'
                        + '<td align="right">' + this.venda.total[0].troco + '</td>'
                        + '</tr>'
                        + '<tr class="sup">'
                        + '<td colspan="3" align="center">'
                        + '<p style="text-align: center; margin: 0px">Consulte pela Chave de Acesso em:</p>'
                        + '<p style="text-align: center; margin: 0px">https://appnfe.sefa.pa.gov.br/portal/view/consulta</p>'
                        + '<p style="text-align: center; margin: 0px">Chave de Acesso</p>'
                        + '<p style="text-align: center; margin: 0px">A definir</p>'
                        + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">'
                        + '<img src="' + this.venda.qrcode + '" />'
                        + '</td>'
                        + '<td>'
                        + '<p style="text-align: left; margin: 0px">CONSUMIDOR NÃO IDENTIFICADO</p>'
                        + '<p style="text-align: left; margin: 0px"><strong>NFC-e nº</strong> A definir <strong>Série</strong> A definir <strong>Data de Emissão</strong> A definir</p>'
                        +
                        +                    '<p style="text-align: left; margin: 0px"><strong>Protocolo de autorização:</strong>A definir</p>'
                        + '</td>'
                        + '</tr>'
                        + '<tr class="sup">'
                        + '<td colspan="3" align="center">'
                        + '<br>'
                        + '<p>Tributos Totais Incidentes (Lei federal 12.741/2012): R$65,63</p>'
                        + '</td>'
                        + '</tr>'
                        + '</tfoot>'
                        + '</table>'
                        + '</body>'
                        + '</html>'

                    console.log("CUPOM: ");
                    console.log(cupom);

                    const path = require("path")
                    var fs = require('fs');
                    let pathTo = path.join(__dirname, '/cupomGenerated.html')
                    fs.writeFile(pathTo, cupom, function (err) {
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
                                    if (err) return console.log(err);
                                    console.log(res);//{filename: '/app/businesscard.pdf'}
                                });
                            }
                            run();
                        }
                    })
                },
                mountCupomContingency: function () {
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
                        + 'max-width: 400px;'
                        + 'font-weight: light;'
                        + 'line-height: 1.3em;'
                        + 'font-family: Tahoma, Geneva, sans-serif;'
                        + 'font-size: 10px;'
                        + '}'
                        + 'th:nth-child(2),'
                        + 'td:nth-child(2) {'
                        + 'width: 50px;'
                        + '}'
                        + 'th:nth-child(3),'
                        + 'td:nth-child(3) {'
                        + 'width: 90px;'
                        + 'text-align: right;'
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
                        + '</style>'
                        + '</head>'
                        + '<body>'
                        + '<table class="printer-ticket">'
                        + '<thead>'
                        + '<tr>'
                        + '<th colspan="3">'
                        + '<p style="text-align: center; margin: 0px;">CNPJ: ' + this.empresas[0].cnpj + '<strong> ' + this.empresas[0].nome + '</strong></p>'
                        + '<p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ', ' + this.empresas[0].endereco.uf + '</p>'
                        + '<p style="text-align: center; margin: 0px">Documento Auxiliar de Nota Fiscal de Consumidor Eletrônica</p>'
                        + '<p style="text-align: center; margin: 0px"><b>Emitida em Contingência</b></p>'
                        + '</th>'
                        + '</tr>'
                        + '</thead>'
                        + '<tbody>'

                    for (var i = 0; i < this.venda.listProduto.length; i++) {
                        cupom = cupom + '<tr>'
                            + '<td colspan="3">' + [this.venda.listProduto[i].nome] + '</td>'
                            + '</tr>'
                            + '<tr>'
                            + '<td>' + [this.venda.listProduto[i].quantidade] + '</td>'
                            + '<td>' + [this.venda.listProduto[i].preco] + '</td>'
                            + '<td>' + this.venda.listProduto[i].preco * this.venda.listProduto[i].quantidade + '</td>'
                            + '</tr>'
                    }

                    cupom = cupom + '</tbody>'
                        + '<tfoot>'
                        + '<tr>'
                        + '<td colspan="2">Qtde. total de itens</td>'
                        + '<td align="right">' + this.venda.quantidadeTotalParaLeitura + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">Valor total R$</td>'
                        + '<td align="right">' + this.venda.totalParaLeituraShow + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">Desconto R$</td>'
                        + '<td align="right">' + this.venda.totalDescontoParaLeituraShow + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">FORMA PAGAMENTO</td>'
                        + '<td align="right">R$45,56</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">Dinheiro R$</td>'
                        + '<td align="right">' + this.venda.produto[0].valorRecebido + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">Troco R$</td>'
                        + '<td align="right">' + this.venda.total[0].troco + '</td>'
                        + '</tr>'
                        + '<tr class="sup">'
                        + '<td colspan="3" align="center">'
                        + '<p style="text-align: center; margin: 0px">Consulte pela Chave de Acesso em:</p>'
                        + '<p style="text-align: center; margin: 0px">https://appnfe.sefa.pa.gov.br/portal/view/consulta</p>'
                        + '<p style="text-align: center; margin: 0px">Chave de Acesso</p>'
                        + '<p style="text-align: center; margin: 0px">A definir</p>'
                        + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td colspan="2">'
                        + '<img src="' + this.venda.qrcode + '" />'
                        + '</td>'
                        + '<td>'
                        + '<p style="text-align: left; margin: 0px">CONSUMIDOR NÃO IDENTIFICADO</p>'
                        + '<p style="text-align: left; margin: 0px"><strong>NFC-e nº</strong> A definir <strong>Série</strong> A definir <strong>Data de Emissão</strong> A definir</p>'
                        +
                        +                    '<p style="text-align: left; margin: 0px"><strong>Protocolo de autorização:</strong>A definir</p>'
                        + '</td>'
                        + '</tr>'
                        + '<tr class="sup">'
                        + '<td colspan="3" align="center">'
                        + '<br>'
                        + '<p>Tributos Totais Incidentes (Lei federal 12.741/2012): R$65,63</p>'
                        + '</td>'
                        + '</tr>'
                        + '</tfoot>'
                        + '</table>'
                        + '</body>'
                        + '</html>'

                    console.log("CUPOM: ");
                    console.log(cupom);

                    const path = require("path")
                    var fs = require('fs');
                    let pathTo = path.join(__dirname, '/cupomGenerated.html')
                    fs.writeFile(pathTo, cupom, function (err) {
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
                                    if (err) return console.log(err);
                                    console.log(res);//{filename: '/app/businesscard.pdf'}
                                });
                            }
                            run();
                        }
                    })
                },
                toQtde: function () {
                    document.getElementById("qtdeInFocus").focus();
                },
                toDesconto: function () {
                    document.getElementById("descontoInFocus").focus();
                },
                /**
                 *----------------------------------------------
                 * Segunda adição acontece aqui(2)
                 *----------------------------------------------
                 */
                toValorRecebido: function () {
                    let preco = parseInt(this.venda.produto[0].preco);
                    let quantidade = parseInt(this.venda.produto[0].quantidade);
                    let desconto = parseInt(this.venda.produto[0].desconto);
                    this.venda.produto[0].subtotal = (preco * quantidade) - desconto;
                    this.venda.produto[0].total += (preco * quantidade) - desconto;

                    this.venda.totalParaLeitura.push(
                        {
                            totalParaLeitura: this.venda.produto[0].total,
                            descontoParaLeitura: desconto
                        }
                    );


                    let totalParaLeitura = 0;
                    let descontoParaLeitura = 0;

                    for (i = 0; i < this.venda.totalParaLeitura.length; i++) {
                        totalParaLeitura += parseInt(this.venda.totalParaLeitura[i].totalParaLeitura);
                        descontoParaLeitura += parseInt(this.venda.totalParaLeitura[i].descontoParaLeitura);
                        this.venda.totalParaLeituraShow = totalParaLeitura;
                        this.venda.totalDescontoParaLeituraShow = descontoParaLeitura;
                    }

                    document.getElementById("valorRecebidoInFocus").focus();
                },
                formfocus() {
                    document.getElementById("prodInFocus").focus();
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
                    if (typeof this.vendaPDV.$loki !== 'undefined') {
                        salesPDVTest.update(this.vendaPDV);
                    } else {
                        salesPDVTest.insert(this.vendaPDV);
                    }
                    db.save();
                },
            },
            computed: {
                produtosFiltrados2: function () {
                    var self = this
                    self.produto = self.produtos.filter(produto => {
                        let searchRegex = new RegExp(self.search, 'i');
                        return searchRegex.test(produto.nome) ||
                            searchRegex.test(produto.codigoBarra);
                    });

                    /**
                     *----------------------------------------------
                     * Primeira adição acontece aqui(1)
                     *----------------------------------------------
                     */
                    if (self.search !== '') {
                        self.venda.produto[0].codigo = self.produto[0].codigo;
                        self.venda.produto[0].codigoBarra = self.produto[0].codigoBarra;
                        self.venda.produto[0].cean = self.produto[0].codigoBarra;
                        self.venda.produto[0].cfop = self.produto[0].cfop;
                        self.venda.produto[0].ncm = self.produto[0].ncm;
                        self.venda.produto[0].nome = self.produto[0].nome;
                        self.venda.produto[0].descricao = self.produto[0].descricao;
                        self.venda.produto[0].preco = self.produto[0].preco;
                    }

                    return self.produto;
                }
            }
        });
    }
}

function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(),
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}