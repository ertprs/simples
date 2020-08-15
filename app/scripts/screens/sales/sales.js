window.Vue = require('vue');
const path = require("path"),
    userPrompt = require('electron-osx-prompt'),
    { ipcRenderer, remote } = require('electron'),
    { dialog } = require('electron').remote;

let loki = require("lokijs"),
    db = new loki(path.join(__dirname, "./loki/loki.json")),
    read = require('read-file-utf8'),
    data = read(path.join(__dirname, "./loki/loki.json")),
    moment = require('moment');

db.loadJSON(data);

let salesPDVTest = db.getCollection('salesPDVTest'),
    rootus = db.getCollection('rootus'),
    clientes = db.getCollection('clientes'),
    produtos = db.getCollection('produtos'),
    sangrias = db.getCollection('sangrias'),
    suplementos = db.getCollection('suplementos'),
    caixafechado = db.getCollection('caixafechado'),
    debug = db.getCollection('debug'),
    totalEmCaixa = db.getCollection('totalEmCaixa'),
    fiscal = db.getCollection('fiscal');
    produtosV2 = db.getCollection('produtosV2');

new Vue({
    el: 'body',
    data: {
        root: false,
        debug: [],
        fiscal: [],
        rootus: [],
        totalEmCaixa: [],
        somaDeItensVendidos: '',
        salesPDVTest: [],
        loading: true,
        sangrias: [],
        suplementos: [],
        caixafechado: [],
        salePDVTest: [],
        clientes: [],
        produtos: [],
        total: 0,
        link: true,
        forms: {
            sangria: '',
            suplemento: ''
        },
        caixa: {
            valorAtual: ''
        }
    },

    ready: function () {
        this.loadingShow();
        this.rootus = rootus.data[0];
        this.debug = debug.data[0];
        this.salesPDVTest = salesPDVTest.data;
        this.totalEmCaixa = totalEmCaixa.data;
        this.sangrias = sangrias.data;
        this.suplementos = suplementos.data;
        this.fiscal = fiscal.data[0];
        this.caixafechado = caixafechado.data;
        let total = 0;
        this.produtos = produtosV2.data;

        for (let i = 0; i < this.salesPDVTest.length; i++) {
            total += this.salesPDVTest[i].total[0].total;
        }

        this.somaDeItensVendidos = total.toFixed(2);
        this.caixa.valorAtual = totalEmCaixa.get(this.totalEmCaixa.length).valor;
    },
    methods: {
        loadingShow: function () {
            setTimeout(() => {
                this.loading = false;
            }, 1200);
        },
        goToPDV: function () {
            if (this.produtos.length === 0) {
                dialog.showMessageBox({
                    message: 'Para acessar o PDV, primeiro você precisa ter produtos cadastrados!'
                });
            } else {
                location.href = "pdv.html";
            }
        },
        goToHome: function () {
            location.href = "main2.html";
        },
        goSales: function () {
            location.href = "sales.html";
        },
        goClosures: function () {
            location.href = "closures.html";
        },
        goSupplements: function () {
            location.href = "supplements.html"
        },
        goBleeds: function () {
            location.href = "bleeds.html";
        },
        close: function () {
            remote.getCurrentWindow().reload();
            remote.getCurrentWindow().hide();
        },
        doingBleed: function () {
            let sangria = parseFloat(totalEmCaixa.get(this.totalEmCaixa.length).valor).toFixed(2) - parseFloat(this.forms.sangria).toFixed(2);

            this.sangrias = {
                valorAntesDaSangria: parseFloat(totalEmCaixa.get(this.totalEmCaixa.length).valor).toFixed(2),
                hora: moment().format('hh:mm'),
                dataAno: moment().format("YYYY"),
                dataMes: moment().format("MM"),
                dataDia: moment().format("DD"),
                dataFullDefault: moment().format("YYYY-MM-DD"),
                dataFull: moment().format("DD-MM-YYYY"),
                valor: sangria.toFixed(2),
                usuario: this.rootus.user,
            };

            let total = parseFloat(totalEmCaixa.get(this.totalEmCaixa.length).valor).toFixed(2) - parseFloat(this.forms.sangria).toFixed(2);

            this.totalEmCaixa = {
                dataAtual: moment().format("YYYY-MM-DD"),
                valor: total.toFixed(2)
            };

            totalEmCaixa.insert(this.totalEmCaixa);
            sangrias.insert(this.sangrias);
            db.save();
            location.reload();
        },
        doingSupplement: function () {
            let suplemento = parseFloat(totalEmCaixa.get(this.totalEmCaixa.length).valor) + parseFloat(this.forms.suplemento);

            this.suplementos = {
                valorAntesDoSuplemento: parseFloat(totalEmCaixa.get(this.totalEmCaixa.length).valor).toFixed(2),
                hora: moment().format('hh:mm'),
                dataAno: moment().format("YYYY"),
                dataMes: moment().format("MM"),
                dataDia: moment().format("DD"),
                dataFullDefault: moment().format("YYYY-MM-DD"),
                dataFull: moment().format("DD-MM-YYYY"),
                valor: suplemento.toFixed(2),
                usuario: this.rootus.user,
            };

            let total = parseFloat(totalEmCaixa.get(this.totalEmCaixa.length).valor) + parseFloat(this.forms.suplemento);

            this.totalEmCaixa = {
                dataAtual: moment().format("YYYY-MM-DD"),
                valor: total.toFixed(2)
            };

            totalEmCaixa.insert(this.totalEmCaixa);
            suplementos.insert(this.suplementos);
            db.save();

            location.reload();
        },
        updateBox: function () {
            if (totalEmCaixa.get(this.totalEmCaixa.length).dataAtual !== moment().format("YYYY-MM-DD")) {
                let total = 0;
                let vendas = salesPDVTest.find({ 'dataFullDefault': moment().format("YYYY-MM-DD") });

                for (let i = 0; i < vendas.length; i++) {
                    total += vendas[i].total[0].total;
                }

                this.totalEmCaixa = {
                    dataAtual: moment().format("YYYY-MM-DD"),
                    valor: total.toFixed(2)
                };

                totalEmCaixa.insert(this.totalEmCaixa);
                db.save();
                location.reload();
            } else {
                alert('O caixa já foi atualizado hoje.');
            }
        },
        closeBox: function () {
            this.caixafechado = {
                hora: moment().format('hh:mm'),
                dataAno: moment().format("YYYY"),
                dataMes: moment().format("MM"),
                dataDia: moment().format("DD"),
                dataFullDefault: moment().format("YYYY-MM-DD"),
                dataFull: moment().format("DD-MM-YYYY"),
                valorNaHoraDoFechamento: totalEmCaixa.get(this.totalEmCaixa.length).valor,
                usuario: this.rootus.user,
                dataAtual: moment().format("YYYY-MM-DD"),
            };

            this.totalEmCaixa = {
                dataAtual: moment().format("YYYY-MM-DD"),
                valor: 0
            };

            caixafechado.insert(this.caixafechado);
            totalEmCaixa.insert(this.totalEmCaixa);
            db.save();
            location.reload();
        },
        remove(sale) {
            this.salePDVTest = sale;
            salesPDVTest.remove(this.salePDVTest);
            db.save();
            location.reload();
        },
        removeBleed(sangria) {
            this.sangrias = sangria;
            sangrias.remove(this.sangrias);
            db.save();
            location.reload();
        },
        removeBox(caixa) {
            this.caixafechado = caixa;
            caixafechado.remove(this.caixafechado);
            db.save();
            location.reload();
        },
        removeSupplement(suplemento) {
            this.suplementos = suplemento;
            suplementos.remove(this.suplementos);
            db.save();
            location.reload();
        },
        saveCloud: function () {
            let mysql = require("mysql");
            let connection = mysql.createConnection({
                host: "162.241.2.118",
                user: "focuxme_erp",
                password: "1423colibri",
                database: "focuxme_colibrierp"
            });

            connection.connect((err) => {
                if (err) {
                    return console.log(err.stack);
                }

                console.log("Conexão estabelecida com sucesso...");
            });

            for (let v = 0; v < this.vendas.length; v++) {

                queryString = 'INSERT INTO vendas(cliente, produto, quantidade, preco_unitario) VALUES (' + '"' + this.vendas[v].cliente + '",' + '"' + this.vendas[v].produto + '",' + this.vendas[v].preco_unitario + ',' + this.vendas[v].quantidade + ' );';
                console.log(queryString);

                connection.query(queryString, (err, rows, fields) => {
                    if (err) {
                        return console.log(" Aconteceu um erro ao consultar os dados...");
                    }

                    console.log(rows);

                });
            }

            connection.end(() => {
                console.log("Conexão fechada com sucesso...");
            });

        },
        backup: function () {
            console.log('Method: backup()');
            let dbB = new loki("backup.json");
            dbB.save();

            let vendasBackup = dbB.addCollection('vendasBackup');
            let clientesBackup = dbB.addCollection('clientesBackup');
            let produtosBackup = dbB.addCollection('produtosBackup');

            for (let i = 0; i < vendas.data.length; i++) {
                let data = {
                    cliente: vendas.data[i].cliente,
                    produto: vendas.data[i].produto,
                    preco_unitario: vendas.data[i].preco_unitario,
                    quantidade: vendas.data[i].quantidade,
                    observacao: vendas.data[i].observacao,
                }
                vendasBackup.insert(data);
                dbB.save();
            }

            for (let i = 0; i < clientes.data.length; i++) {
                let data = {
                    nome: clientes.data[i].nome,
                    cpf: clientes.data[i].cpf,
                    telefone: clientes.data[i].telefone,
                    email: clientes.data[i].email,
                    endereco: clientes.data[i].endereco,
                    bairro: clientes.data[i].bairro,
                    numero: clientes.data[i].numero,
                }
                clientesBackup.insert(data);
                dbB.save();
            }

            for (let i = 0; i < produtos.data.length; i++) {
                let data = {
                    nome: produtos.data[i].nome,
                    preco: produtos.data[i].preco,
                    quantidade: produtos.data[i].quantidade,
                    cod_barras: produtos.data[i].cod_barras,
                    peso_liquido: produtos.data[i].peso_liquido,
                    peso_bruto: produtos.data[i].peso_bruto,
                }
                produtosBackup.insert(data);
                dbB.save();
            }

            alert('Backup realizado com sucesso...');
        },
        newDB: function () {
            let dbB = new loki("backup.json");
            let dataBackup = read('./backup.json');
            dbB.loadJSON(dataBackup);
            let db = new loki("loki.json");

            let vendasBackup = dbB.getCollection('vendasBackup');
            let clientesBackup = dbB.getCollection('clientesBackup');
            let produtosBackup = dbB.getCollection('produtosBackup');

            let vendas = db.addCollection('vendas');
            let clientes = db.addCollection('clientes');
            let produtos = db.addCollection('produtos');

            for (let i = 0; i < vendasBackup.data.length; i++) {
                let data = {
                    cliente: vendasBackup.data[i].cliente,
                    produto: vendasBackup.data[i].produto,
                    observacao: '',
                    preco_unitario: vendasBackup.data[i].preco_unitario,
                    quantidade: vendasBackup.data[i].quantidade,
                }
                vendas.insert(data);
                db.save();
            }

            for (let i = 0; i < clientesBackup.data.length; i++) {
                let data = {
                    nome: clientesBackup.data[i].nome,
                    cpf: clientesBackup.data[i].cpf,
                    telefone: clientesBackup.data[i].telefone,
                    email: clientesBackup.data[i].email,
                    endereco: clientesBackup.data[i].endereco,
                    bairro: clientesBackup.data[i].bairro,
                    numero: clientesBackup.data[i].numero,
                }
                clientes.insert(data);
                db.save();
            }

            for (let i = 0; i < produtosBackup.data.length; i++) {
                let data = {
                    nome: produtosBackup.data[i].nome,
                    preco: produtosBackup.data[i].preco,
                    quantidade: produtosBackup.data[i].quantidade,
                    cod_barras: produtosBackup.data[i].cod_barras,
                    peso_liquido: produtosBackup.data[i].peso_liquido,
                    peso_bruto: produtosBackup.data[i].peso_bruto,
                }
                produtos.insert(data);
                db.save();
            }

            alert('Coleções recriadas com sucesso...');
        }
    },

    computed: {
        todaInfomacaoFront: function () {
            return this.venda.dataVenda;
        }
    }
});