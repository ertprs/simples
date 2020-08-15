// var axios = require("axios");
var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');
const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');
managementData(dataAtualFormatada());

// axios.get('http://192.168.254.2/colibrierpapi/Cfops.json')
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

function managementData(date) {
    if (!(db.getCollection('produtos'))) {
        alert('A base de dados de produtos não está presente...');
        if (!(db.getCollection('clientes'))) {
            alert('A base de dados de clientes não está presente...');
            if (!(db.getCollection('vendas'))) {
                alert('A base de dados de vendas não está presente...');
                if (!(db.getCollection('empresas'))) {
                    alert('A base de dados de empresas não está presente...');
                }
            }
        }
    } else {
        var produtos = db.getCollection('produtos');
        var clientes = db.getCollection('clientes');
        var vendas = db.getCollection('vendas');
        var notas = db.getCollection('notas');
        var empresas = db.getCollection('empresas');
        var cidadesestados = db.getCollection('cidadesestados');

        new Vue({
            el: 'body',
            data: {
                debug: false,
                produtos: [],
                cidadesestados: [],
                clientes: [],
                cliente: [],
                produto: [],
                prodForm: {
                    codigoProduto: '',
                    cean: '',
                    descricao: '',
                    valorUnitario: '',
                    qtd: '',
                    ncm: '',
                    cfop: '',
                    frete: '',
                    desconto: ''
                },
                vendas: [],
                empresas: [],
                notas: [],
                selectedItemClientes: '',
                selectedItemProdutos: '',
                showClient: false,
                nota: {
                    nfeProc: {
                        NFe: {
                            infNFe: { //Informações da Nota Fiscal eletrônica.
                                ide: { //Identificação da NF-e.
                                    cUF: 'PA', //Código da UF do emitente do Documento Fiscal. Utilizar a Tabela do IBGE.
                                    cNF: '', //Código numérico que compõe a Chave de Acesso. Número aleatório gerado pelo emitente para cada NF-e.
                                    natOp: '', //Descrição da Natureza da Operação. Mínimo 1 e máximo 60.
                                    indPag: '', //Indicador da forma de pagamento:
                                    // 0 – pagamento à vista;
                                    // 1 – pagamento à prazo;
                                    // 2 – outros.
                                    mod: '65', //Código do modelo do Documento Fiscal. 55 = NF-e; 65 = NFC-e.
                                    serie: '2', //Série do Documento Fiscal.
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
                let codigoNota = Math.floor(Math.random() * 1000000000 + 1);
                let numNota = Math.floor(Math.random() * 1000000000 + 10);
                this.date = date;
                this.produtos = produtos.data;
                this.clientes = clientes.data;
                this.vendas = vendas.data;
                this.empresas = empresas.data;
                this.notas = notas.data;
                this.cidadesestados = cidadesestados.data[0].cidades;

                //Dados ide
                this.nota.nfeProc.NFe.infNFe.ide.cNF = codigoNota;
                this.nota.nfeProc.NFe.infNFe.ide.nNF = numNota;
                this.nota.nfeProc.NFe.infNFe.ide.cMunFG = this.empresas[0].endereco.codigoMunicipio;
                //Dados do emit
                this.nota.nfeProc.NFe.infNFe.emit.CNPJ = this.empresas[0].cnpj;
                this.nota.nfeProc.NFe.infNFe.emit.xNome = this.empresas[0].nome;
                this.nota.nfeProc.NFe.infNFe.emit.xFant = this.empresas[0].nome;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.xLgr = this.empresas[0].endereco.endereco;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.nro = this.empresas[0].endereco.numero;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.xCpl = this.empresas[0].endereco.complemento;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.xBairro = this.empresas[0].endereco.bairro;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.cMun = this.empresas[0].endereco.codigoMunicipio;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.xMun = this.empresas[0].endereco.municipio;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.UF = this.empresas[0].endereco.uf;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.CEP = this.empresas[0].endereco.cep;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.cPais = this.empresas[0].endereco.codigoPais;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.xPais = this.empresas[0].endereco.pais;
                this.nota.nfeProc.NFe.infNFe.emit.enderEmit.fone = this.empresas[0].endereco.fone;
                console.log('{');
                console.log('Produtos registrados: ' + this.produtos.length);
                console.log('Clientes registrados: ' + this.clientes.length);
                console.log('Vendas registradas: ' + this.vendas.length);
                console.log('Empresas registradas: ' + this.empresas.length);
                console.log('Notas registradas: ' + this.notas.length);
                console.log('}');
                // console.log(Math.floor(Math.random() * 10000000 + 1));
            },
            methods: {
                makeDebug: function () {
                    if (this.debug == false) {
                        this.debug = true;
                    } else {
                        this.debug = false;
                    }
                },
                manualChangeProdutos: function () {
                    /**
                     * Captura os dados do produto                     *  
                     */
                    this.produto = produtos.find({ nome: this.selectedItemProdutos });

                    /**
                     * Coloca os dados do produto na tela
                     */
                    this.prodForm.codigoProduto = produtos.find({ nome: this.selectedItemProdutos })[0].codigo;
                    this.prodForm.cean = produtos.find({ nome: this.selectedItemProdutos })[0].codigoBarra;
                    this.prodForm.descricao = produtos.find({ nome: this.selectedItemProdutos })[0].descricao;
                    this.prodForm.valorUnitario = produtos.find({ nome: this.selectedItemProdutos })[0].preco;
                    this.prodForm.ncm = produtos.find({ nome: this.selectedItemProdutos })[0].ncm;
                    this.prodForm.cfop = produtos.find({ nome: this.selectedItemProdutos })[0].cfop;
                },
                manualChangeClientes: function () {
                    this.showClient = true;
                    this.cliente = clientes.find({ nome: this.selectedItemClientes });

                    for (var c = 0; c < this.cidadesestados.length; c++) {
                        if (clientes.find({ nome: this.selectedItemClientes })[0].municipio == this.cidadesestados[c].nome_cidade) {
                            this.nota.nfeProc.NFe.dest.enderDest.cMun = this.cidadesestados[c].ibge_cidade;
                        }
                    }
                    //Adicionando destinatário
                    this.nota.nfeProc.NFe.dest.CPF = clientes.find({ nome: this.selectedItemClientes })[0].cpf;
                    this.nota.nfeProc.NFe.dest.xNome = clientes.find({ nome: this.selectedItemClientes })[0].nome;
                    this.nota.nfeProc.NFe.dest.enderDest.xLgr = clientes.find({ nome: this.selectedItemClientes })[0].endereco;
                    this.nota.nfeProc.NFe.dest.enderDest.nro = clientes.find({ nome: this.selectedItemClientes })[0].numero;
                    this.nota.nfeProc.NFe.dest.enderDest.xCpl = clientes.find({ nome: this.selectedItemClientes })[0].complemento;
                    this.nota.nfeProc.NFe.dest.enderDest.xBairro = clientes.find({ nome: this.selectedItemClientes })[0].bairro;
                    this.nota.nfeProc.NFe.dest.enderDest.xMun = clientes.find({ nome: this.selectedItemClientes })[0].municipio;
                    this.nota.nfeProc.NFe.dest.enderDest.UF = clientes.find({ nome: this.selectedItemClientes })[0].uf;
                    this.nota.nfeProc.NFe.dest.enderDest.CEP = clientes.find({ nome: this.selectedItemClientes })[0].cep;
                    this.nota.nfeProc.NFe.dest.enderDest.fone = clientes.find({ nome: this.selectedItemClientes })[0].telefone;

                },
                edit: function (product) {
                },
                totalClientes: function () {
                    return this.clientes.length;
                },
                totalProdutos: function () {
                    return this.produtos.length;
                },
                searchProducts: function () {
                    console.log(produtos.find({ nome: this.searchProductsQuery })[0]);
                },
                searchClientes: function () {
                    console.log(this.searchClientesQuery);
                    console.log(clientes.find({ nome: this.searchClientesQuery })[0]);
                },
                addProduct: function () {
                    for (var qtd = 1; qtd <= this.prodForm.qtd; qtd++) {//Verifica a quantidade de produtos da nota.
                        this.nota.nfeProc.NFe.det.push(
                            {
                                nItem: '', //Preenchimento automático na hora de gerar o XML.
                                prod: {
                                    cProd: this.prodForm.codigoProduto,
                                    cEAN: this.prodForm.cean,
                                    xProd: this.prodForm.descricao,
                                    NCM: this.prodForm.ncm,
                                    CFOP: this.prodForm.cfop,
                                    uCom: 'UN',
                                    qCom: this.prodForm.qtd + '.' + "0000",
                                    vUnCom: this.prodForm.valorUnitario + '.' + "0000",
                                    vProd: this.prodForm.valorUnitario + '.' + "00",
                                    cEANTrib: this.prodForm.cean,
                                    uTrib: 'UN',
                                    qTrib: this.prodForm.qtd + '.' + "0000",
                                    vUnTrib: this.prodForm.valorUnitario + '.' + "0000",
                                    vDesc: this.prodForm.desconto,
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
                                            vBC: this.prodForm.valorUnitario + '.' + "00",
                                            pPIS: '0.65',
                                            vPIS: ((this.prodForm.valorUnitario + '.' + "00") * 0.65) / 100,
                                        }
                                    },
                                    COFINS: {
                                        COFINSAliq: {
                                            CST: '01',
                                            vBC: this.prodForm.valorUnitario + '.' + "00",
                                            pCOFINS: '3.00',
                                            vCOFINS: ((this.prodForm.valorUnitario + '.' + "00") * 3.00) / 100,
                                        }
                                    }
                                }
                            });

                        //Adição dos dados no item {total}.
                        let vProdParse = 0;
                        let vDescParse = 0;
                        let vPISParse = 0;
                        let vCOFINSParse = 0;
                        let vNFParse = 0;

                        for (var x = 0; x < this.nota.nfeProc.NFe.det.length; x++) {
                            vProdParse = vProdParse + parseFloat(this.nota.nfeProc.NFe.det[x].prod.vProd);
                            vDescParse = vDescParse + parseFloat(this.nota.nfeProc.NFe.det[x].prod.vDesc);
                            vPISParse = vPISParse + parseFloat(this.nota.nfeProc.NFe.det[x].imposto.PIS.PISAliq.vPIS);
                            vCOFINSParse = vCOFINSParse + parseFloat(this.nota.nfeProc.NFe.det[x].imposto.COFINS.COFINSAliq.vCOFINS);
                            vNFParse = vNFParse + parseFloat(this.nota.nfeProc.NFe.det[x].prod.vProd) - parseFloat(this.nota.nfeProc.NFe.det[x].prod.vDesc);
                            this.nota.nfeProc.NFe.total.ICMSTot.vProd = vProdParse;
                            this.nota.nfeProc.NFe.total.ICMSTot.vDesc = vDescParse;
                            this.nota.nfeProc.NFe.total.ICMSTot.vPIS = vPISParse;
                            this.nota.nfeProc.NFe.total.ICMSTot.vCOFINS = vCOFINSParse;
                            this.nota.nfeProc.NFe.total.ICMSTot.vNF = vNFParse;
                            this.nota.nfeProc.NFe.pag.vPag = vNFParse;
                        }
                    }
                },
                transmit: function () {
                    // console.log(this.nota);
                    let idNota = 'Teste';
                    let nota = '<?xml version="1.0" encoding="UTF-8"?>';
                    for (var i = 0; i < [this.nota.nfeProc].length; i++) {
                        nota = nota + '<enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">' //ok
                            + '<idLote>30610505</idLote>' //ok
                            + '<indSinc>1</indSinc>' //ok - As empresas devem solicitar o Pedido de Resposta Síncrono (indSinc=1) para os Lotes com somente 1 (uma) NFC-e (caso normal).
                            + '<NFe>' //ok
                            + '<infNFe Id="NFe' + idNota + '" versao="4.00">'//ok

                            // Identificação
                            + '<ide>'
                            + '     <cUF>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['cUF'] + '</cUF>' //ok
                            + '     <cNF>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['cNF'] + '</cNF>' //ok
                            + '     <natOp>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['natOp'] + '</natOp>' //ok
                            + '     <indPag>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['indPag'] + '</indPag>' //ok - Trocar para revenda de mercadoria
                            + '     <mod>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['mod'] + '</mod>' //ok
                            + '     <serie>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['serie'] + '</serie>' //ok
                            + '     <nNF>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['nNF'] + '</nNF>' //ok
                            + '     <dhEmi>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['dhEmi'] + '</dhEmi>' //ok
                            + '     <tpNF>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['tpNF'] + '</tpNF>' //ok
                            + '     <idDest>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['idDest'] + '</idDest>' //ok
                            + '     <cMunFG>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['cMunFG'] + '</cMunFG>' //ok
                            + '     <tpImp>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['tpImp'] + '</tpImp>'  //ok
                            + '     <tpEmis>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['tpEmis'] + '</tpEmis>' //ok
                            // + '     <cDV>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['cDV'] + '</cDV>'
                            + '     <tpAmb>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['tpAmb'] + '</tpAmb>' //ok
                            + '     <finNFe>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['finNFe'] + '</finNFe>' //ok
                            + '     <indFinal>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['indFinal'] + '</indFinal>' //ok
                            + '     <indPres>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['indPres'] + '</indPres>' //ok
                            + '     <procEmi>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['procEmi'] + '</procEmi>' //ok
                            + '     <verProc>' + [this.nota.nfeProc][i]['NFe']['infNFe']['ide']['verProc'] + '</verProc>' //ok
                            + '</ide>'

                            // Emitente
                            + ' <emit>'
                            + ' <CNPJ>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['CNPJ'] + '</CNPJ>' //ok
                            + ' <xNome>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['xNome'] + '</xNome>' //ok
                            + ' <enderEmit>'
                            + '     <xLgr>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['xLgr'] + '</xLgr>' //ok
                            + '     <nro>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['nro'] + '</nro>' //ok
                            // + '     <xCpl>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['xCpl'] + '</xCpl>'
                            + '     <xBairro>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['xBairro'] + '</xBairro>' //ok
                            + '     <cMun>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['cMun'] + '</cMun>' //ok
                            + '     <xMun>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['xMun'] + '</xMun>' //ok
                            + '     <UF>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['UF'] + '</UF>' //ok
                            + '     <CEP>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['CEP'] + '</CEP>' //ok
                            + '     <cPais>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['cPais'] + '</cPais>' //ok
                            + '     <xPais>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['xPais'] + '</xPais>' //ok
                            + '     <fone>' + [this.nota.nfeProc][i]['NFe']['infNFe']['emit']['enderEmit']['fone'] + '</fone>' //ok
                            + ' </enderEmit>'
                            + ' <IE>' + [this.nota.nfeProc][i]['NFe']['infNFe']['IE'] + '</IE>' //ok
                            + ' <CRT>' + [this.nota.nfeProc][i]['NFe']['infNFe']['CRT'] + '</CRT>' //ok
                            + '</emit>'

                            /**
                             * -------------------
                             * Destinatário
                             * -------------------
                             **/
                            + ' <dest>'
                            + ' <CPF>' + [this.nota.nfeProc][i]['NFe']['dest']['CPF'] + '</CPF>' //ok
                            + ' <xNome>' + [this.nota.nfeProc][i]['NFe']['dest']['xNome'] + '</xNome>' //ok
                            + ' <enderDest>'
                            + '     <xLgr>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['xLgr'] + '</xLgr>' //ok
                            + '     <nro>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['nro'] + '</nro>' //ok
                            // + '     <xCpl>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['xCpl'] + '</xCpl>'
                            + '     <xBairro>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['xBairro'] + '</xBairro>' //ok
                            + '     <cMun>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['cMun'] + '</cMun>' //ok
                            + '     <xMun>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['xMun'] + '</xMun>' //ok
                            + '     <UF>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['UF'] + '</UF>'  //ok
                            + '     <CEP>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['CEP'] + '</CEP>' //ok
                            + '     <cPais>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['cPais'] + '</cPais>' //ok
                            + '     <xPais>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['xPais'] + '</xPais>' //ok
                            + '     <fone>' + [this.nota.nfeProc][i]['NFe']['dest']['enderDest']['fone'] + '</fone>' //ok
                            + ' </enderDest>'
                            + '<indIEDest>9</indIEDest>' //ok - 9=Não Contribuinte, que pode ou não possuir Inscrição Estadual no Cadastro de Contribuintes do ICMS.
                            + '</dest>'

                        for (var d = 0; d < [this.nota.nfeProc][i]['NFe']['det'].length; d++) {

                            /**
                             * -----------------
                             * Itens da Nota
                             * -----------------
                             */
                            nota = nota
                                + '<det nItem="' + d + '">'
                                + ' <prod>'
                                + '     <cProd>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['cProd'] + '</cProd>' //ok
                                + '     <cEAN>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['cEAN'] + '</cEAN>' //ok
                                + '     <xProd>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['xProd'] + '</xProd>' //ok
                                + '     <NCM>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['NCM'] + '</NCM>' //ok
                                + '     <CFOP>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['CFOP'] + '</CFOP>' //ok
                                + '     <uCom>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['uCom'] + '</uCom>'//ok
                                + '     <qCom>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['qCom'] + '</qCom>' //ok
                                + '     <vUnCom>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['vUnCom'] + '</vUnCom>' //ok
                                + '     <vProd>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['vProd'] + '</vProd>' //ok
                                + '     <cEANTrib>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['cEANTrib'] + '</cEANTrib>' //ok
                                + '     <uTrib>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['uTrib'] + '</uTrib>' //ok
                                + '     <qTrib>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['qTrib'] + '</qTrib>' //ok
                                + '     <vUnTrib>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['vUnTrib'] + '</vUnTrib>' //ok
                                + '     <indTot>' + [this.nota.nfeProc][i]['NFe']['det'][d]['prod']['indTot'] + '</indTot>' //ok
                                + ' </prod>'

                                /**
                                 * ----------------------------------
                                 * Impostos | Bloco mais importante |
                                 * ----------------------------------
                                 */
                                + ' <imposto>'
                                + '     <ICMS>'
                                + '         <ICMS60>'
                                + '             <orig>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['orig'] + '</orig>'
                                + '             <CST>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['CST'] + '</CST>'
                                + '             <vBCSTRet>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['vBCSTRet'] + '</vBCSTRet>'
                                + '             <vICMSSTRet>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['ICMS']['ICMS60']['vICMSSTRet'] + '</vICMSSTRet>'
                                + '         </ICMS60>'
                                + '     </ICMS>'
                                + '     <PIS>'
                                + '         <PISAliq>'
                                + '             <CST>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['CST'] + '</CST>' //ok
                                + '             <vBC>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['vBC'] + '</vBC>' //ok
                                + '             <pPIS>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['pPIS'] + '</pPIS>' //ok
                                + '             <vPIS>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['PIS']['PISAliq']['vPIS'] + '</vPIS>' //ok
                                + '         </PISAliq>'
                                + '     </PIS>'
                                + '     <COFINS>'
                                + '         <COFINSAliq>'
                                + '             <CST>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['CST'] + '</CST>' //ok
                                + '             <vBC>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['vBC'] + '</vBC>' //ok
                                + '             <pCOFINS>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['pCOFINS'] + '</pCOFINS>' //ok
                                + '             <vCOFINS>' + [this.nota.nfeProc][i]['NFe']['det'][d]['imposto']['COFINS']['COFINSAliq']['vCOFINS'] + '</vCOFINS>' //ok
                                + '         </COFINSAliq>'
                                + '     </COFINS>'
                                + ' </imposto>'
                                + '</det>'
                        }

                        /**
                         * --------------------
                         * Total | Importante |
                         * --------------------
                         */
                        nota = nota
                            + ' <total>'
                            + '    <ICMSTot>'
                            + '      <vBC>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vBC'] + '</vBC>' //ok
                            + '      <vICMS>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vICMS'] + '</vICMS>' //ok
                            // + '   <vICMSDeson></vICMSDeson>'
                            // + '   <vFCP></vFCP>'
                            + '      <vBCST>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vBCST'] + '</vBCST>' //ok
                            + '      <vST>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vST'] + '</vST>' //ok
                            // + '   <vFCPST></vFCPST>'
                            // + '   <vFCPSTRet></vFCPSTRet>'
                            + '      <vProd>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vProd'] + '</vProd>' //ok
                            + '      <vFrete>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vFrete'] + '</vFrete>' //ok
                            + '      <vSeg>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vSeg'] + '</vSeg>' //ok
                            + '      <vDesc>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vDesc'] + '</vDesc>' //ok
                            + '      <vII>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vII'] + '</vII>' //ok
                            + '      <vIPI>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vIPI'] + '</vIPI>' //ok
                            + '      <vPIS>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vPIS'] + '</vPIS>' //ok
                            + '      <vCOFINS>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vCOFINS'] + '</vCOFINS>' //ok
                            + '      <vOutro>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vOutro'] + '</vOutro>' //ok
                            + '      <vNF>' + [this.nota.nfeProc][i]['NFe']['total']['ICMSTot']['vNF'] + '</vNF>' //ok
                            + '    </ICMSTot>'
                            + '</total>'

                            // Trasnporte
                            + '<transp>'
                            + '    <modFrete>' + [this.nota.nfeProc][i]['NFe']['transp']['modFrete'] + '</modFrete>' //ok
                            + '</transp>'

                            /**
                             * ------------------
                             * Pagamento | Mudou
                             * ------------------
                             */
                            + ' <pag>'
                            + '     <detPag>'
                            + '         <tPag>' + [this.nota.nfeProc][i]['NFe']['pag']['tPag'] + '</tPag>' //ok
                            + '         <vPag>' + [this.nota.nfeProc][i]['NFe']['pag']['vPag'] + '</vPag>' //ok
                            + '     </detPag>'
                            // + '    <card>'
                            // + '       <CNPJ>' + [this.nota.nfeProc][i]['NFe']['pag']['card']['CNPJ'] + '</CNPJ>'
                            // + '       <tBand>' + [this.nota.nfeProc][i]['NFe']['pag']['card']['tBand'] + '</tBand>'
                            // + '       <cAut>' + [this.nota.nfeProc][i]['NFe']['pag']['card']['cAut'] + '</cAut>'
                            // + '    </card>'
                            + '</pag>'

                            // Informação Adicional
                            // + '<infAdic/>'
                            + '</infNFe>'

                            // Assinatura digital
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
                            + '     <SignatureValue>' + [this.nota.nfeProc][i]['NFe']['Signature']['SignatureValue']['SignatureValue'] + '</SignatureValue>'
                            + '     <KeyInfo>'
                            + '         <X509Data>'
                            + '             <X509Certificate>' + [this.nota.nfeProc][i]['NFe']['Signature']['keyInfo']['X509Data']['X509Certificate'] + '</X509Certificate>'
                            + '         </X509Data>'
                            + '     </KeyInfo>'
                            + ' </Signature>'

                            // Proteção da Nota
                            + ' </NFe>'
                            + '     <protNFe versao="3.00">'
                            + '         <infProt>'
                            + '             <tpAmb>' + [this.nota.nfeProc][i]['protNFe']['infProt']['tpAmb'] + '</tpAmb>'
                            + '             <verAplic>' + [this.nota.nfeProc][i]['protNFe']['infProt']['verAplic'] + '</verAplic>'
                            + '             <chNFe>' + [this.nota.nfeProc][i]['protNFe']['infProt']['chNFe'] + '</chNFe>'
                            + '             <dhRecbto>' + [this.nota.nfeProc][i]['protNFe']['infProt']['dhRecbto'] + '</dhRecbto>'
                            + '             <nProt>' + [this.nota.nfeProc][i]['protNFe']['infProt']['nProt'] + '</nProt>'
                            + '             <digVal>' + [this.nota.nfeProc][i]['protNFe']['infProt']['digVal'] + '</digVal>'
                            + '             <cStat>' + [this.nota.nfeProc][i]['protNFe']['infProt']['cStat'] + '</cStat>'
                            + '             <xMotivo>' + [this.nota.nfeProc][i]['protNFe']['infProt']['xMotivo'] + '</xMotivo>'
                            + '         </infProt>'
                            + '     </protNFe>'
                            + ' </enviNFe>';

                        console.log(nota);
                    }
                }
            },

            computed: {
                todaInfomacaoFront: function () {
                    return this.nota.nfeProc.NFe.infNFe.ide.cNF
                        && this.nota.nfeProc.NFe.infNFe.ide.dhEmi
                        && this.nota.nfeProc.NFe.infNFe.ide.natOp
                        && this.nota.nfeProc.NFe.infNFe.ide.finNFe
                        && this.nota.nfeProc.NFe.infNFe.ide.indPag
                        && this.selectedItemClientes
                        && this.selectedItemProdutos
                        && this.prodForm.codigoProduto
                        && this.prodForm.descricao
                        && this.prodForm.valorUnitario
                        && this.prodForm.qtd
                        && this.prodForm.valorUnitario
                        && this.prodForm.ncm
                        && this.prodForm.desconto;
                }
            }
        });
    }
}

function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    hora = data.getHours();
    minuto = data.getMinutes();
    segundo = data.getSeconds();
    return anoF + "-" + mesF + "-" + diaF + "T" + hora + ":" + minuto + ":" + segundo;
}