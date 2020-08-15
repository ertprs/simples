const path = require("path");
let loki = require("lokijs");
let db = new loki(path.join(__dirname, "./loki/loki.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let moment = require('moment');
const { ipcRenderer, remote } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');

let salesPDVTest = db.getCollection('salesPDVTest');
let rootus = db.getCollection('rootus');
let debug = db.getCollection('debug');
let empresas = db.getCollection('empresas');
let fiscal = db.getCollection('fiscal');
let clientes = db.getCollection('clientes');
let fornecedores = db.getCollection('fornecedoresV2');
let fabricantes = db.getCollection('fabricantesV2');
let produtosV2 = db.getCollection('produtosV2');

new Vue({
    el: 'body',
    data: {
        debug: [],
        rootus: [],
        fiscal: [],
        loading: true,
        clientes: [],
        salesPDVTest: [],
        empresas: [],
        produtos: [],
        fornecedores: [],
        fabricantes: [],
        forms: {
            sales: {
                data: ''
            },
            clients: {
                data: ''
            },
            products: {
                data: ''
            },
            outfiters: {
                data: ''
            },
            producers: {
                data: ''
            }
        }
    },

    ready: function () {
        this.loadingShow();
        this.rootus = rootus.data[0];
        this.debug = debug;
        this.salesPDVTest = salesPDVTest.data;
        this.empresas = empresas.data;
        this.clientes = clientes.data;
        this.produtos = produtosV2.data;
        this.fornecedores = fornecedores.data;
        this.fabricantes = fabricantes.data;
        this.fiscal = fiscal;
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
        loadingShow: function () {
            setTimeout(() => {
                this.loading = false;
            }, 1200);
        },
        generateSalesReport: function () {
            let dados = salesPDVTest.find({ 'dataFull': this.forms.sales.data });

            if (this.forms.sales.data !== '') {
                let tabelahtml = '';

                for (let i = 0; i < dados.length; i++) {
                    let produtos = '';
                    let preco = '';
                    let quantidade = '';
                    tabelahtml = tabelahtml
                        + '<tr><td>'

                    for (let k = 0; k < dados[i].listProduct.length; k++) {
                        produtos = produtos
                            + '<p>' + dados[i].listProduct[k].nome + '</p>'
                    }

                    tabelahtml = tabelahtml
                        + produtos
                        + '</td>'
                        + '<td>'

                    for (let k = 0; k < dados[i].listProduct.length; k++) {
                        preco = preco
                            + '<p>' + dados[i].listProduct[k].preco + '</p>'
                    }

                    tabelahtml = tabelahtml
                        + preco
                        + '</td>'
                        + '<td>'

                    for (let k = 0; k < dados[i].listProduct.length; k++) {
                        quantidade = quantidade
                            + '<p>' + dados[i].listProduct[k].quantidade + '</p>'
                    }

                    tabelahtml = tabelahtml
                        + quantidade
                        + '</td>'
                        + '<td>' + dados[i].total[0].total + '</td>'

                    tabelahtml = tabelahtml + '</tr>'
                }

                let html = '<!DOCTYPE html>'
                    + '<html lang="pt-br">'
                    + '<head>'
                    + '  <meta charset="utf-8">'
                    + '  <meta http-equiv="X-UA-Compatible" content="IE=edge">'
                    + '  <meta name="viewport" content="width=device-width, initial-scale=1">'
                    + '  <style>'
                    + '      .text {'
                    + '          text-align: center;'
                    + '            }'
                    + '      .printer-ticket {'
                    + '          display: table !important;'
                    + '          width: 100%;'
                    + '          padding: 10px;'
                    + '          font-weight: light;'
                    + '          line-height: 1.3em;'
                    + '          font-family: Tahoma, Geneva, sans-serif;'
                    + '          font-size: 10px;'
                    + '      }'
                    + '      th {'
                    + '         font-weight: inherit;'
                    + '         padding: 10px 0;'
                    + '         text-align: center;'
                    + '         border-bottom: 1px dashed #BCBCBC;'
                    + '      }'
                    + '      .title {'
                    + '        font-size: 1.5em;'
                    + '        padding: 10px*1.5 0;'
                    + '      }'
                    + '     .image {'
                    + '          width: 150px;'
                    + '          height: 150px;'
                    + '      }'
                    + '  </style>'
                    + '</head>'
                    + '<body style="padding:0px">'
                    + '<table class="printer-ticket">'
                    + '<thead>'
                    + '   <tr>'
                    + '    <th colspan="6">'
                    + '      <h1 style="text-align: center; margin: 0px;"><strong>Relatório de Vendas</strong></h1>'
                    + '      <br>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].nome + '</p>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ','
                    + '      PA</p>'
                    + '      <p style="text-align: center; margin: 0px">' + this.forms.data + '</p>'
                    + '   </th>'
                    + '  </tr>'
                    + ' </thead>'
                    + '<tbody>'
                    + '     <tr>'
                    + '         <td>Produtos</td>'
                    + '         <td>Preço</td>'
                    + '         <td>QTD</td>'
                    + '         <td>Total</td>'
                    + '     </tr>'
                    + tabelahtml
                    + '</tbody>'
                    + '</table>'
                    + '</body>'
                    + '</html>'

                const path = require("path");
                let fs = require('fs');
                let pathTo = path.join(__dirname, '/relatorioGerado.html');
                self = this;
                fs.writeFile(pathTo, html, function (err) {
                    if (err) {
                        alert('write pdf file error', err);
                    } else {
                        const run = async () => {
                            const path = require("path");
                            var fs = require('fs');
                            var pdf = require('html-pdf');
                            var html = fs.readFileSync(path.join(__dirname, "relatorioGerado.html"), 'utf8');
                            var options = {
                                "border": {
                                    "top": "2cm",
                                    "right": "2cm",
                                    "bottom": "2cm",
                                    "left": "2cm"
                                },
                            };

                            pdf.create(
                                html,
                                options
                            ).toFile(path.join(__dirname, "tmp", "relatorio.pdf"), function (err, res) {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    const { BrowserWindow } = require('electron').remote;
                                    const PDFWindow = require('electron-pdf-window');
                                    const win = new BrowserWindow(
                                        {
                                            width: 1400,
                                            height: 800,
                                            icon: path.join(__dirname, "../assets/ico.ico"),
                                        });
                                    win.setMenu(null);
                                    PDFWindow.addSupport(win);
                                    let pathTo = path.join(__dirname, "tmp/relatorio.pdf");
                                    win.loadURL(pathTo);
                                }
                            });
                        }
                        run();
                    }
                });
            } else {
                dialog.showMessageBox({
                    message: 'Você deve preencher a data!',
                });
            }
        },
        generateClientsReport: function () {
            let dados = clientes.find({ 'dataRegistro': this.forms.clients.data });

            if (this.forms.clients.data !== '') {
                let tabelahtml = '';

                for (let i = 0; i < dados.length; i++) {
                    let nome = dados[i].nome;
                    let endereco = dados[i].endereco;
                    let bairro = dados[i].bairro;
                    let numero = dados[i].numero;

                    tabelahtml = tabelahtml
                        + '<tr>'
                        + '<td>'
                        + nome
                        + '</td>'
                        + '<td>'
                        + endereco
                        + '</td>'
                        + '<td>'
                        + bairro
                        + '</td>'
                        + '<td>'
                        + numero
                        + '</td>'
                }

                tabelahtml = tabelahtml + '</tr>'

                let html = '<!DOCTYPE html>'
                    + '<html lang="pt-br">'
                    + '<head>'
                    + '  <meta charset="utf-8">'
                    + '  <meta http-equiv="X-UA-Compatible" content="IE=edge">'
                    + '  <meta name="viewport" content="width=device-width, initial-scale=1">'
                    + '  <style>'
                    + '      .text {'
                    + '          text-align: center;'
                    + '            }'
                    + '      .printer-ticket {'
                    + '          display: table !important;'
                    + '          width: 100%;'
                    + '          padding: 10px;'
                    + '          font-weight: light;'
                    + '          line-height: 1.3em;'
                    + '          font-family: Tahoma, Geneva, sans-serif;'
                    + '          font-size: 10px;'
                    + '      }'
                    + '      th {'
                    + '         font-weight: inherit;'
                    + '         padding: 10px 0;'
                    + '         text-align: center;'
                    + '         border-bottom: 1px dashed #BCBCBC;'
                    + '      }'
                    + '      .title {'
                    + '        font-size: 1.5em;'
                    + '        padding: 10px*1.5 0;'
                    + '      }'
                    + '     .image {'
                    + '          width: 150px;'
                    + '          height: 150px;'
                    + '      }'
                    + '  </style>'
                    + '</head>'
                    + '<body style="padding:0px">'
                    + '<table class="printer-ticket">'
                    + '<thead>'
                    + '   <tr>'
                    + '    <th colspan="6">'
                    + '      <h1 style="text-align: center; margin: 0px;"><strong>Relatório de Vendas</strong></h1>'
                    + '      <br>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].nome + '</p>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ','
                    + '      PA</p>'
                    + '      <p style="text-align: center; margin: 0px">' + this.forms.clients.data + '</p>'
                    + '   </th>'
                    + '  </tr>'
                    + ' </thead>'
                    + '<tbody>'
                    + '     <tr>'
                    + '         <td>Nome</td>'
                    + '         <td>Endereço</td>'
                    + '         <td>Bairro</td>'
                    + '         <td>Número</td>'
                    + '     </tr>'
                    + tabelahtml
                    + '</tbody>'
                    + '</table>'
                    + '</body>'
                    + '</html>'

                const path = require("path");
                let fs = require('fs');
                let pathTo = path.join(__dirname, '/relatorioGerado.html');
                self = this;
                fs.writeFile(pathTo, html, function (err) {
                    if (err) {
                        alert('write pdf file error', err);
                    } else {
                        const run = async () => {
                            const path = require("path");
                            var fs = require('fs');
                            var pdf = require('html-pdf');
                            var html = fs.readFileSync(path.join(__dirname, "relatorioGerado.html"), 'utf8');
                            var options = {
                                "border": {
                                    "top": "2cm",
                                    "right": "2cm",
                                    "bottom": "2cm",
                                    "left": "2cm"
                                },
                            };

                            pdf.create(
                                html,
                                options
                            ).toFile(path.join(__dirname, "tmp", "relatorio.pdf"), function (err, res) {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    const { BrowserWindow } = require('electron').remote;
                                    const PDFWindow = require('electron-pdf-window');
                                    const win = new BrowserWindow(
                                        {
                                            width: 1400,
                                            height: 800,
                                            icon: path.join(__dirname, "../assets/ico.ico"),
                                        });
                                    win.setMenu(null);
                                    PDFWindow.addSupport(win);
                                    let pathTo = path.join(__dirname, "tmp/relatorio.pdf");
                                    win.loadURL(pathTo);
                                }
                            });
                        }
                        run();
                    }
                });
            } else {
                dialog.showMessageBox({
                    message: 'Você deve preencher a data!',
                });
            }
        },
        generateProductsReport: function () {
            let dados = produtosV2.find({ 'dataRegistro': this.forms.products.data });

            if (this.forms.products.data !== '') {
                let tabelahtml = '';

                for (let i = 0; i < dados.length; i++) {
                    let nome = dados[i].nome;
                    let preco_venda = dados[i].preco_venda;

                    tabelahtml = tabelahtml
                        + '<tr>'
                        + '<td>'
                        + nome
                        + '</td>'
                        + '<td>'
                        + preco_venda
                        + '</td>'
                }

                tabelahtml = tabelahtml + '</tr>'

                let html = '<!DOCTYPE html>'
                    + '<html lang="pt-br">'
                    + '<head>'
                    + '  <meta charset="utf-8">'
                    + '  <meta http-equiv="X-UA-Compatible" content="IE=edge">'
                    + '  <meta name="viewport" content="width=device-width, initial-scale=1">'
                    + '  <style>'
                    + '      .text {'
                    + '          text-align: center;'
                    + '            }'
                    + '      .printer-ticket {'
                    + '          display: table !important;'
                    + '          width: 100%;'
                    + '          padding: 10px;'
                    + '          font-weight: light;'
                    + '          line-height: 1.3em;'
                    + '          font-family: Tahoma, Geneva, sans-serif;'
                    + '          font-size: 10px;'
                    + '      }'
                    + '      th {'
                    + '         font-weight: inherit;'
                    + '         padding: 10px 0;'
                    + '         text-align: center;'
                    + '         border-bottom: 1px dashed #BCBCBC;'
                    + '      }'
                    + '      .title {'
                    + '        font-size: 1.5em;'
                    + '        padding: 10px*1.5 0;'
                    + '      }'
                    + '     .image {'
                    + '          width: 150px;'
                    + '          height: 150px;'
                    + '      }'
                    + '  </style>'
                    + '</head>'
                    + '<body style="padding:0px">'
                    + '<table class="printer-ticket">'
                    + '<thead>'
                    + '   <tr>'
                    + '    <th colspan="6">'
                    + '      <h1 style="text-align: center; margin: 0px;"><strong>Relatório de Produtos</strong></h1>'
                    + '      <br>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].nome + '</p>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ','
                    + '      PA</p>'
                    + '      <p style="text-align: center; margin: 0px">' + this.forms.products.data + '</p>'
                    + '   </th>'
                    + '  </tr>'
                    + ' </thead>'
                    + '<tbody>'
                    + '     <tr>'
                    + '         <td>Nome</td>'
                    + '         <td>Preço de Venda</td>'
                    + '     </tr>'
                    + tabelahtml
                    + '</tbody>'
                    + '</table>'
                    + '</body>'
                    + '</html>'

                const path = require("path");
                let fs = require('fs');
                let pathTo = path.join(__dirname, '/relatorioGerado.html');
                self = this;
                fs.writeFile(pathTo, html, function (err) {
                    if (err) {
                        alert('write pdf file error', err);
                    } else {
                        const run = async () => {
                            const path = require("path");
                            var fs = require('fs');
                            var pdf = require('html-pdf');
                            var html = fs.readFileSync(path.join(__dirname, "relatorioGerado.html"), 'utf8');
                            var options = {
                                "border": {
                                    "top": "2cm",
                                    "right": "2cm",
                                    "bottom": "2cm",
                                    "left": "2cm"
                                },
                            };

                            pdf.create(
                                html,
                                options
                            ).toFile(path.join(__dirname, "tmp", "relatorio.pdf"), function (err, res) {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    const { BrowserWindow } = require('electron').remote;
                                    const PDFWindow = require('electron-pdf-window');
                                    const win = new BrowserWindow(
                                        {
                                            width: 1400,
                                            height: 800,
                                            icon: path.join(__dirname, "../assets/ico.ico"),
                                        });
                                    win.setMenu(null);
                                    PDFWindow.addSupport(win);
                                    let pathTo = path.join(__dirname, "tmp/relatorio.pdf");
                                    win.loadURL(pathTo);
                                }
                            });
                        }
                        run();
                    }
                });
            } else {
                dialog.showMessageBox({
                    message: 'Você deve preencher a data!',
                });
            }
        },
        generateOutfitersReport: function () {
            let dados = fornecedores.find({ 'dataRegistro': this.forms.outfiters.data });
            
            if (this.forms.outfiters.data !== '') {
                let tabelahtml = '';

                for (let i = 0; i < dados.length; i++) {
                    let nome = dados[i].nome;
                    let endereco = dados[i].endereco;
                    let bairro = dados[i].bairro;
                    let numero = dados[i].numero;
                    let cnpj_cpf = dados[i].cnpj_cpf;

                    tabelahtml = tabelahtml
                        + '<tr>'
                        + '<td>'
                        + nome
                        + '</td>'
                        + '<td>'
                        + endereco
                        + '</td>'
                        + '<td>'
                        + bairro
                        + '</td>'
                        + '<td>'
                        + numero
                        + '</td>'
                        + '<td>'
                        + cnpj_cpf
                        + '</td>'                        
                }

                tabelahtml = tabelahtml + '</tr>'

                let html = '<!DOCTYPE html>'
                    + '<html lang="pt-br">'
                    + '<head>'
                    + '  <meta charset="utf-8">'
                    + '  <meta http-equiv="X-UA-Compatible" content="IE=edge">'
                    + '  <meta name="viewport" content="width=device-width, initial-scale=1">'
                    + '  <style>'
                    + '      .text {'
                    + '          text-align: center;'
                    + '            }'
                    + '      .printer-ticket {'
                    + '          display: table !important;'
                    + '          width: 100%;'
                    + '          padding: 10px;'
                    + '          font-weight: light;'
                    + '          line-height: 1.3em;'
                    + '          font-family: Tahoma, Geneva, sans-serif;'
                    + '          font-size: 10px;'
                    + '      }'
                    + '      th {'
                    + '         font-weight: inherit;'
                    + '         padding: 10px 0;'
                    + '         text-align: center;'
                    + '         border-bottom: 1px dashed #BCBCBC;'
                    + '      }'
                    + '      .title {'
                    + '        font-size: 1.5em;'
                    + '        padding: 10px*1.5 0;'
                    + '      }'
                    + '     .image {'
                    + '          width: 150px;'
                    + '          height: 150px;'
                    + '      }'
                    + '  </style>'
                    + '</head>'
                    + '<body style="padding:0px">'
                    + '<table class="printer-ticket">'
                    + '<thead>'
                    + '   <tr>'
                    + '    <th colspan="6">'
                    + '      <h1 style="text-align: center; margin: 0px;"><strong>Relatório de Fornecedores</strong></h1>'
                    + '      <br>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].nome + '</p>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ','
                    + '      PA</p>'
                    + '      <p style="text-align: center; margin: 0px">' + this.forms.outfiters.data + '</p>'
                    + '   </th>'
                    + '  </tr>'
                    + ' </thead>'
                    + '<tbody>'
                    + '     <tr>'
                    + '         <td>Nome</td>'
                    + '         <td>Endereço</td>'
                    + '         <td>Bairro</td>'
                    + '         <td>Número</td>'
                    + '         <td>CNPJ/CPF</td>'
                    + '     </tr>'
                    + tabelahtml
                    + '</tbody>'
                    + '</table>'
                    + '</body>'
                    + '</html>'

                const path = require("path");
                let fs = require('fs');
                let pathTo = path.join(__dirname, '/relatorioGerado.html');
                self = this;
                fs.writeFile(pathTo, html, function (err) {
                    if (err) {
                        alert('write pdf file error', err);
                    } else {
                        const run = async () => {
                            const path = require("path");
                            var fs = require('fs');
                            var pdf = require('html-pdf');
                            var html = fs.readFileSync(path.join(__dirname, "relatorioGerado.html"), 'utf8');
                            var options = {
                                "border": {
                                    "top": "2cm",
                                    "right": "2cm",
                                    "bottom": "2cm",
                                    "left": "2cm"
                                },
                            };

                            pdf.create(
                                html,
                                options
                            ).toFile(path.join(__dirname, "tmp", "relatorio.pdf"), function (err, res) {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    const { BrowserWindow } = require('electron').remote;
                                    const PDFWindow = require('electron-pdf-window');
                                    const win = new BrowserWindow(
                                        {
                                            width: 1400,
                                            height: 800,
                                            icon: path.join(__dirname, "../assets/ico.ico"),
                                        });
                                    win.setMenu(null);
                                    PDFWindow.addSupport(win);
                                    let pathTo = path.join(__dirname, "tmp/relatorio.pdf");
                                    win.loadURL(pathTo);
                                }
                            });
                        }
                        run();
                    }
                });
            } else {
                dialog.showMessageBox({
                    message: 'Você deve preencher a data!',
                });
            }
        },
        generateProducersReport: function () {
            let dados = fabricantes.find({ 'dataRegistro': this.forms.producers.data });

            console.log(dados);

            if (this.forms.producers.data !== '') {
                let tabelahtml = '';

                for (let i = 0; i < dados.length; i++) {
                    let nome = dados[i].nome;

                    tabelahtml = tabelahtml
                        + '<tr>'
                        + '<td>'
                        + nome
                        + '</td>';
                }

                tabelahtml = tabelahtml + '</tr>'

                let html = '<!DOCTYPE html>'
                    + '<html lang="pt-br">'
                    + '<head>'
                    + '  <meta charset="utf-8">'
                    + '  <meta http-equiv="X-UA-Compatible" content="IE=edge">'
                    + '  <meta name="viewport" content="width=device-width, initial-scale=1">'
                    + '  <style>'
                    + '      .text {'
                    + '          text-align: center;'
                    + '            }'
                    + '      .printer-ticket {'
                    + '          display: table !important;'
                    + '          width: 100%;'
                    + '          padding: 10px;'
                    + '          font-weight: light;'
                    + '          line-height: 1.3em;'
                    + '          font-family: Tahoma, Geneva, sans-serif;'
                    + '          font-size: 10px;'
                    + '      }'
                    + '      th {'
                    + '         font-weight: inherit;'
                    + '         padding: 10px 0;'
                    + '         text-align: center;'
                    + '         border-bottom: 1px dashed #BCBCBC;'
                    + '      }'
                    + '      .title {'
                    + '        font-size: 1.5em;'
                    + '        padding: 10px*1.5 0;'
                    + '      }'
                    + '     .image {'
                    + '          width: 150px;'
                    + '          height: 150px;'
                    + '      }'
                    + '  </style>'
                    + '</head>'
                    + '<body style="padding:0px">'
                    + '<table class="printer-ticket">'
                    + '<thead>'
                    + '   <tr>'
                    + '    <th colspan="6">'
                    + '      <h1 style="text-align: center; margin: 0px;"><strong>Relatório de Fabricantes</strong></h1>'
                    + '      <br>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].nome + '</p>'
                    + '      <p style="text-align: center; margin: 0px;">' + this.empresas[0].endereco.endereco + ', ' + this.empresas[0].endereco.numero + ', ' + this.empresas[0].endereco.bairro + ', ' + this.empresas[0].endereco.municipio + ','
                    + '      PA</p>'
                    + '      <p style="text-align: center; margin: 0px">' + this.forms.producers.data + '</p>'
                    + '   </th>'
                    + '  </tr>'
                    + ' </thead>'
                    + '<tbody>'
                    + '     <tr>'
                    + '         <td>Nome</td>'
                    + '     </tr>'
                    + tabelahtml
                    + '</tbody>'
                    + '</table>'
                    + '</body>'
                    + '</html>'

                const path = require("path");
                let fs = require('fs');
                let pathTo = path.join(__dirname, '/relatorioGerado.html');
                self = this;
                fs.writeFile(pathTo, html, function (err) {
                    if (err) {
                        alert('write pdf file error', err);
                    } else {
                        const run = async () => {
                            const path = require("path");
                            var fs = require('fs');
                            var pdf = require('html-pdf');
                            var html = fs.readFileSync(path.join(__dirname, "relatorioGerado.html"), 'utf8');
                            var options = {
                                "border": {
                                    "top": "2cm",
                                    "right": "2cm",
                                    "bottom": "2cm",
                                    "left": "2cm"
                                },
                            };

                            pdf.create(
                                html,
                                options
                            ).toFile(path.join(__dirname, "tmp", "relatorio.pdf"), function (err, res) {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    const { BrowserWindow } = require('electron').remote;
                                    const PDFWindow = require('electron-pdf-window');
                                    const win = new BrowserWindow(
                                        {
                                            width: 1400,
                                            height: 800,
                                            icon: path.join(__dirname, "../assets/ico.ico"),
                                        });
                                    win.setMenu(null);
                                    PDFWindow.addSupport(win);
                                    let pathTo = path.join(__dirname, "tmp/relatorio.pdf");
                                    win.loadURL(pathTo);
                                }
                            });
                        }
                        run();
                    }
                });
            } else {
                dialog.showMessageBox({
                    message: 'Você deve preencher a data!',
                });
            }
        },
    }
});