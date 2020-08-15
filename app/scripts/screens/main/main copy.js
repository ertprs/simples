const path = require("path"),
    { ipcRenderer, remote } = require('electron'),
    { dialog } = require('electron').remote,
    image2base64 = require('image-to-base64');

let loki = require("lokijs"),
    db = new loki(path.join(__dirname, "./loki/loki.json")),
    read = require('read-file-utf8'),
    moment = require('moment'),
    data = read(path.join(__dirname, "./loki/loki.json")),
    fileExists = require('file-exists'),
    fs = require('fs'),
    axios = require("axios");

db.loadJSON(data);

let rootus = db.getCollection('rootus'),
    fiscal = db.getCollection('fiscal').data[0],
    notas = db.getCollection('notas'),
    produtosV2 = db.getCollection('produtosV2'),
    debug = db.getCollection('debug'),
    printer = db.getCollection('printer'),
    empresas = db.getCollection('empresas'),
    salesPDVTest = db.getCollection('salesPDVTest'),
    clientes = db.getCollection('clientes'),
    fornecedores = db.getCollection('fornecedoresV2'),
    fabricantes = db.getCollection('fabricantesV2');

Vue.component('manual', {
    template: `
    <template>
        <div class="pane-group">
            <div class="pane-sm sidebar">
                <nav class="nav-group">
                    <h5 class="nav-group-title">Menu</h5>
                    <a class="nav-group-item active">
                        <span class="icon icon-menu"></span>Básico
                    </a>
                </nav>
            </div>
            <div class="pane pane-spanded">
                <h3 class="title-h3">Seja bem vindo ao Colibri!</h3>
                <p class="text">Colibri é o seu amigo de todas as horas na gestão de sua empresa, para um bom
                    funcionamento sugerimos as seguintes diretrizes.</p>
                <ul>
                    <li>O primeiro e mais fundamental de tudo é verificar se o cadastro da sua empresa está
                        feito de forma correta;
                    </li>
                    <li>Verificar se sua internet está funcionando corretamente, para que suas notas sejam
                        emitidas com sucesso(recurso sendo atualizado);</li>
                    <li>Realizar todos os cadastros básicos antes de começar suas operações de venda;</li>
                    <li>Entrar em contato com o suporte sempre que encontrar dificuldade na realização de alguma
                        tarefa.
                    </li>
                </ul>
            </div>
        </div>
    </template`,
});

Vue.component('shortcut', {
    template: `
    <template>
        <div class="pane-group">
            <div class="pane-sm sidebar">
                <nav class="nav-group">
                    <h5 class="nav-group-title">Menu</h5>
                    <a class="nav-group-item active">
                    <span class="icon icon-menu"></span>
                        Registrados
                    </a>
                </nav>
            </div>
            <div class="pane" style="padding: 10px;">
                <ul>
                    <li>F1 - PDV</li>
                    <li>F2 - Menu</li>
                </ul>
            </div>
        </div>
    </template`,
});

Vue.component('reports', {
    template: `
    <template>
        <div class="pane-group">
            <div class="pane">
                <div class="form-group" style="padding:10px; width: 250px;">
                    <p style="margin-top: 0px"><b>Relatório de Vendas</b></p>
                    <input type="text" class="form-control" v-model="forms.sales.data" placeholder="DD-MM-YYYY">
                    <button class="btn btn-default btn-block" @click="generateSalesReport()"
                        style="margin-top: 10px;">Gerar
                        Relatório</button>
                </div>
                <div class="form-group" style="padding:10px; width: 250px;">
                    <p style="margin-top: 0px;"><b>Relatório de Clientes</b></p>
                    <input type="text" class="form-control" v-model="forms.clients.data" placeholder="DD-MM-YYYY">
                    <button class="btn btn-default btn-block" @click="generateClientsReport()"
                        style="margin-top: 10px;">Gerar
                        Relatório</button>
                </div>
                <div class="form-group" style="padding:10px; width: 250px;">
                    <p style="margin-top: 0px;"><b>Relatório de Produtos</b></p>
                    <input type="text" class="form-control" v-model="forms.products.data" placeholder="DD-MM-YYYY">
                    <button class="btn btn-default btn-block" @click="generateProductsReport()"
                        style="margin-top: 10px;">Gerar
                        Relatório</button>
                </div>
                <div class="form-group" style="padding:10px; width: 250px;">
                    <p style="margin-top: 0px;"><b>Relatório de Fornecedores</b></p>
                    <input type="text" class="form-control" v-model="forms.outfiters.data" placeholder="DD-MM-YYYY">
                    <button class="btn btn-default btn-block" @click="generateOutfitersReport()"
                        style="margin-top: 10px;">Gerar
                        Relatório</button>
                </div>
            </div>
            <div class="pane">
                <div class="form-group" style="padding:10px; width: 250px;">
                    <p style="margin-top: 0px;"><b>Relatório de Fabricantes</b></p>
                    <input type="text" class="form-control" v-model="forms.producers.data" placeholder="DD-MM-YYYY">
                    <button class="btn btn-default btn-block" @click="generateProducersReport()"
                        style="margin-top: 10px;">Gerar
                        Relatório</button>
                </div>
            </div>
            <div class="pane">
            </div>
            <div class="pane">
            </div>
        </div>
    </template>`,
    data: function () {
        return {
            debug: [],
            rootus: [],
            fiscal: [],
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
        }
    },
    mounted: function () {
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

Vue.component('mainregisters', {
    template: `
    <template>
        <div class="pane-group">
            <div class="pane">
            <span class="nav-group-item" style="padding-top: 20px;">
                <span class="icon icon-users"></span>
                <a style="text-decoration: none; color: black" @click="openClients">
                Clientes
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-users"></span>
                <a style="text-decoration: none; color: black" @click="openOutfitters">
                Fornecedores
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-basket"></span>
                <a style="text-decoration: none; color: black" @click="openProducts">
                Produtos
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-users"></span>
                <a style="text-decoration: none; color: black" @click="openProducers">
                Fabricantes
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-archive"></span>
                <a style="text-decoration: none; color: black" @click="openSales">
                Vendas
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-suitcase"></span>
                <a style="text-decoration: none; color: black" @click="openCompany">
                Empresa
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-book-open"></span>
                <a style="text-decoration: none; color: black" @click="openFiscals">
                Fiscal
                </a>
            </span>
            </div>
        </div>
    </template`,
    data: function () {
        return {
            rootus: []
        }
    },
    mounted: function () {
        this.rootus = rootus.data[0];
    },
    methods: {
        openProducts: function () {
            ipcRenderer.send("show-productsWindow");
        },
        openFiscals: function () {
            ipcRenderer.send("show-fiscalsWindow");
        },
        openSales: function () {
            ipcRenderer.send("show-salesWindow");
        },
        openClients: function () {
            ipcRenderer.send("show-clientsWindow");
        },
        openProducers: function () {
            ipcRenderer.send("show-producersWindow");
        },
        openOutfitters: function () {
            ipcRenderer.send("show-outfittersWindow");
        },
        openCompany: function () {
            ipcRenderer.send("show-companyWindow");
        },
        openFiscal: function () {
            ipcRenderer.send("show-companyWindow");
        }
    }
});

Vue.component('support', {
    template: `
        <div class="pane-group">
            <div class="pane space">
                <span class="nav-group-item">
                    <span class="icon icon-chat"></span>
                    (91)98158-4216 - Rômulo Melo
                </span>
                <span class="nav-group-item">
                    <span class="icon icon-chat"></span>
                    (91)98562-3958 - Rômulo Melo
                </span>
                <span class="nav-group-item">
                    <span class="icon icon-paper-plane"></span>
                    contatoromulom@gmail.com
                </span>             
            </div>
        </div>`,
});

Vue.component('settings', {
    template: `
    <template>
        <div class="pane-group">
            <div class="pane">
            <span class="nav-group-item" style="padding-top: 20px;">
                <span class="icon icon-print"></span>
                <a style="text-decoration: none; color: black" @click="testPrinter()">
                Testar Impressão
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-flashlight"></span>
                <a style="text-decoration: none; color: black" @click="updateDebug(debug)">
                Debug {{debug.debug}}
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-print"></span>
                <a style="text-decoration: none; color: black" @click="updatePrinter(printer)">
                Printer {{printer.printer}}
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-camera"></span>
                <a style="text-decoration: none; color: black" @click="updateLogoFile">
                Escolher/Alterar Logomarca
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-newspaper"></span>
                <a style="text-decoration: none; color: black" @click="testEnginePython">
                Testar Engine Python
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-download"></span>
                <a style="text-decoration: none; color: black" @click="updateFileCertificate">
                Importar Certificado
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-download"></span>
                <a style="text-decoration: none; color: black" @click="updateFileCertificatePublic">
                Importar Chave Pública
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-flash"></span>
                <a style="text-decoration: none; color: black" @click="exportDbProducts">
                Exportar Banco de Dados de Produtos
                </a>
            </span>
            <span class="nav-group-item">
                <span class="icon icon-flash"></span>
                <a style="text-decoration: none; color: black" @click="verifyServiceSefaz">
                Verificar Status do Serviço
                </a>
            </span>
            </div>
        </div>
    </template`,
    data: function () {
        return {
            rootus: [],
            cidadesestados: [],
            produtos: [],
            debug: [],
            printer: [],
            fiscal: [],
            link: true,
        }
    },
    mounted: function () {
        this.debug = debug.data[0];
        this.printer = printer.data[0];
        this.fiscal = fiscal;
        this.rootus = rootus.data[0];
        this.produtos = produtosV2.data;
        console.info('Mounted:',
            {
                Produtos: this.produtos,
                Usuário: this.rootus
            });
    },
    methods: {
        exportDbProducts: function () {
            for (let c = 0; c < this.produtos.length; c++) {
                var data = new Date(),
                    dia = data.getDate().toString(),
                    diaF = (dia.length == 1) ? '0' + dia : dia,
                    mes = (data.getMonth() + 1).toString(),
                    mesF = (mes.length == 1) ? '0' + mes : mes,
                    anoF = data.getFullYear();

                var hora = data.getHours();
                var minuto = data.getMinutes();
                var segundo = data.getSeconds();

                let produto = {
                    title: this.produtos[c].nome,
                    price: this.produtos[c].preco_compra,
                    clients_id: this.rootus.id,
                    created: anoF + "-" + mesF + "-" + diaF + "T" + hora + ":" + minuto + ":" + segundo,
                    modified: anoF + "-" + mesF + "-" + diaF + "T" + hora + ":" + minuto + ":" + segundo
                };

                axios.post('http://apiv1.focux.me/Products/addOr.json', produto)
                    .then(function (response) {
                        console.info('exportDbProducts:',
                            {
                                Resultado: response,
                                Produto: produto
                            });
                    })
                    .catch(function (error) {
                        console.info('exportDbProducts:',
                            {
                                Resultado: error,
                            });
                    });
            }

        },
        minimize: function () {
            remote.getCurrentWindow().minimize();
        },
        verifyServiceSefaz: function () {
            axios.get('https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx')
                .then(function (response) {
                    if (response.status == 200) {
                        dialog.showMessageBox({
                            message: 'Sucesso',
                        });
                    } else {
                        dialog.showMessageBox({
                            message: 'Erro',
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        maximize: function () {
            let window = remote.getCurrentWindow().maximize();
            if (window.isMaximized()) {
                window.restore();
            } else {
                window.maximize();
            }
        },
        closeApp: function () {
            ipcRenderer.send("close-app");
        },
        openProducts: function () {
            ipcRenderer.send("show-productsWindow");
        },
        openSales: function () {
            ipcRenderer.send("show-salesWindow");
        },
        testPrinter: function () {
            const path = require("path")
            let printer = require("pdf-to-printer");
            printer
                .print(path.join(__dirname, "tmp", "output2.pdf"))
                .then(console.log)
                .catch(console.error);
        },
        updateDebug: function (debugUpdate) {
            this.debug = debugUpdate;
            if (this.debug.debug == false) {
                this.debug.debug = true;
            } else {
                this.debug.debug = false;
            }

            if (typeof this.debug.$loki !== 'undefined') {
                debug.update(this.debug);
            } else {
                debug.insert(this.debug);
            }

            dialog.showMessageBox({
                message: 'Sucesso!',
            });
            db.save();
        },
        updateFiscal: function (fiscalRecebido) {
            this.fiscal = fiscalRecebido;

            if (this.fiscal.fiscal == false) {
                this.fiscal.fiscal = true;
            } else {
                this.fiscal.fiscal = false;
            }

            if (typeof this.fiscal.$loki !== 'undefined') {
                fiscal.update(this.fiscal);
            } else {
                fiscal.insert(this.fiscal);
            }

            dialog.showMessageBox({
                message: 'Sucesso!',
            });
            db.save();
        },
        updateLogoFile() {
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

                                fs.writeFile(filePath, base64, (err) => {
                                    if (err) {
                                        dialog.showErrorBox("Erro ao criar arquivo!");
                                    }
                                    dialog.showMessageBox({
                                        message: 'Arquivo salvo com sucesso!',
                                    });
                                });
                            }
                        )
                        .catch(
                            (error) => {
                                dialog.showErrorBox("Erro ao criar arquivo!");
                            }
                        );
                });
            });
        },
        updatePrinter: function (printerUpdate) {
            this.printer = printerUpdate;

            if (this.printer.printer == false) {
                this.printer.printer = true;
            } else {
                this.printer.printer = false;
            }

            if (typeof this.printer.$loki !== 'undefined') {
                printer.update(this.printer);
            } else {
                printer.insert(this.printer);
            }

            dialog.showMessageBox({
                message: 'Sucesso!',
            });
            db.save();
        },
        testEnginePython: function () {
            let { PythonShell } = require('python-shell')
            let path = require('path')

            let opcoes = {
                scriptPath: path.join(__dirname, 'engines'),
                args: [1, 2]
            }

            let test = new PythonShell('testPython.py', opcoes)

            dialog.showMessageBox({
                message: test,
            }, (response, checkboxChecked) => {
            });
        },
        updateFileCertificate: function () {
            dialog.showOpenDialog((fileNames) => {
                if (fileNames === undefined) {
                    console.log("No file selected");
                    return;
                }

                let content = fs.readFileSync(fileNames[0]);

                fs.writeFile(path.join(__dirname, "../client.pem"), content, (err) => {
                    if (err) {
                        dialog.showMessageBox({
                            message: "Ocorreu um erro ao importar o arquivo " + err.message
                        });
                    } else {
                        dialog.showMessageBox({
                            message: "Arquivo importado com sucesso!"
                        });
                    }
                });
            });
        },
        updateFileCertificatePublic: function () {
            dialog.showOpenDialog((fileNames) => {
                if (fileNames === undefined) {
                    return;
                }

                let content = fs.readFileSync(fileNames[0]);

                fs.writeFile(path.join(__dirname, "../client_public.pem"), content, (err) => {
                    if (err) {
                        dialog.showMessageBox({
                            message: "Ocorreu um erro ao importar o arquivo " + err.message
                        });
                    } else {
                        dialog.showMessageBox({
                            message: "Arquivo importado com sucesso!"
                        });
                    }
                });
            });
        }
    }
});

Vue.component('mainnotes', {
    template: `
    <template>
        <div class="pane-group">
            <div class="pane">
                <span class="nav-group-item" style="padding-top: 20px;">
                    <span class="icon icon-docs"></span>
                    <a style="text-decoration: none; color: black" @click="importNotes">
                        Importação de Notas
                    </a>
                </span>
                <span class="nav-group-item">
                    <span class="icon icon-docs"></span>
                    <a style="text-decoration: none; color: black" @click="emissionNfces">
                        Notas Emitidas
                    </a>
                </span>
                <span class="nav-group-item">
                    <span class="icon icon-docs"></span>
                    <a style="text-decoration: none; color: black" @click="emissionNfe">
                        Emitir NF-e
                    </a>
                </span>
            </div>
        </div>
    </template`,
    data: function () {
        return {
            rootus: [],
            notas: [],
            produtosV2: [],
            produtoV2: "",
            link: true,
            nota: {
                data: '',
                importado: '',
                nota: ''
            }
        }
    },
    mounted: function () {
        this.rootus = rootus.data[0];
        this.notas = notas.data;
        this.produtosV2 = produtosV2.data;

        console.log();
    },
    methods: {
        emissionNfces: function () {
            ipcRenderer.send("show-nfcesWindow");
        },
        emissionNfe: function () {
            ipcRenderer.send("show-nfeWindow");
        },
        importNotes: function () {
            ipcRenderer.send("show-notesWindow");
        }
    }
});

Vue.component('foot', {
    template: `
    <footer class="toolbar toolbar-footer">
        <div class="toolbar-actions">
            <span>SEMPRE EVOLUINDO!</span>
            <span>SEMPRE EVOLUINDO!</span>
        </div>
    </footer>`,
});

Vue.component('register', {
    template: `
    <div class="pane-group">
        <div class="pane space form">
            <div class="form">
                <div class="form-group">
                    <input type="text"  v-model="serial" class="form-control" placeholder="Serial">
                    </div>
                <div class="form-actions">
                    <button @click="setRegister" class="btn btn-form btn-default">Registrar</button>
                </div>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            rootus: [],
            rootusCompare: [],
            register: false,
            serial: ''
        }
    },
    mounted: function () {
        this.rootus = rootus.data[0];
    },
    methods: {
        setRegister: function () {
            self = this
            axios.post('http://192.168.0.103/focuxapiv1/Clients/register.json', { serial: this.serial })
                .then(function (response) {
                    this.rootusCompare = response.data;

                    console.log(this.rootusCompare);
                    self.rootus.id = this.rootusCompare.client.id;
                    self.rootus.user = this.rootusCompare.client.login;
                    self.rootus.pass = this.rootusCompare.client.password;
                    self.rootus.validity = this.rootusCompare.client.date_validity.substr(0, 10);

                    if (typeof self.rootus.$loki !== 'undefined') {
                        rootus.update(self.rootus);
                    } else {
                    }

                    db.save();
                    location.reload();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
});

Vue.component('logo', {
    template: `
    <div class="pane-group">
        <div class="pane">
        <span class="info" v-if="registered==false">Atenção! Registre seu sistema para ter acesso a todos os recursos.</span>
        <span class="info" v-if="validity==false">Atenção! Seu produto expirou, entre em contato com o fornecedor do software</span>
            <div id="central-image">
                <img src="images/logoSystem.png" alt="">
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            rootus: [],
            registered: '',
            validity: '',
        }
    },
    mounted: function () {
        this.rootus = rootus.data[0];
        if (this.rootus.user === 'admin') {
            this.registered = false;
        } else {
            this.registered = true;
        }

        if (this.rootus.validity === moment().format("YYYY-MM-DD")) {
            this.validity = false;
        } else {
            this.validity = true;
        }
    }
});

new Vue({
    el: '#main',
    data: {
        produtos: [],
        fiscal: [],
        rootus: [],
        currentTab: 'logo',
        registered: '',
        validity: '',
        tabs: {
            logo: 'logo',
            manual: 'manual',
            support: 'support',
            mainnotes: 'mainnotes',
            shortcut: 'shortcut',
            reports: 'reports',
            mainregisters: 'mainregisters',
            settings: 'settings',
            register: 'register'
        }
    },
    beforeCreate: function () {
    },
    mounted: function () {
        this.rootus = rootus.data[0];
        this.fiscal = fiscal;
        this.produtos = produtosV2.data;

        if (this.rootus.user === 'admin') {
            this.registered = false;
            console.info('Usuário:', 'Não Registrado');
        } else {
            this.registered = true;
            console.info('Usuário:', 'Registrado');
            // axios.post('http://apiv1.focux.me/Products/addOr.json', produto)
            //     .then(function (response) {
            //         console.info('exportDbProducts:',
            //             {
            //                 Resultado: response,
            //                 Produto: produto
            //             });
            //     })
            //     .catch(function (error) {
            //         console.info('exportDbProducts:',
            //             {
            //                 Resultado: error,
            //             });
            //     });
        }
    },
    beforeMount: function () {
    },
    computed: {
        currentTabComponent: function () {
            return this.currentTab.toLowerCase();
        }
    },
    methods: {
        minimize: function () {
            remote.getCurrentWindow().minimize();
        },
        closeApp: function () {
            ipcRenderer.send("close-app");
        },
        openRegisters: function () {
            ipcRenderer.send("show-salesWindow");
        },
        openSales: function () {
            ipcRenderer.send("show-salesWindow");
        },
        openReports: function () {
            ipcRenderer.send("show-reportsWindow");
        },
        openProducts: function () {
            ipcRenderer.send("show-productsWindow");
        },
        close: function () {
            ipcRenderer.send("close-app");
        },
        goToPDV: function () {
            if (this.produtos.length === 0) {
                dialog.showMessageBox({
                    message: 'Para acessar o PDV, primeiro você precisa ter produtos cadastrados!'
                });
            } else {
                location.href = "pdv.html";
            }
        }
    }
});
