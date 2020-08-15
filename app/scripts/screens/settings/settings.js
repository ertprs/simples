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
window.Vue = require('vue');

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

new Vue({
    el: 'body',
    data: {
        rootus: [],
        cidadesestados: [],
        loading: true,
        produtos: [],
        debug: [],
        printer: [],
        fiscal: [],
        link: true,
    },
    ready: function () {
        this.loadingShow();
        this.debug = debug.data[0];
        this.printer = printer.data[0];
        this.fiscal = fiscal;
        this.rootus = rootus.data[0];
        this.produtos = produtosV2.data;
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
                console.log('Teste');
                this.loading = false;
            }, 1200);
        },
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
            let { PythonShell } = require('python-shell');
            let path = require('path');

            let options = {
                scriptPath: path.join(__dirname, 'engines'),
            };

            let lines = [];
            let test = new PythonShell('testPython.py', options)

            test.on('message', function (message) {
                if (message !== "") {
                    lines.push(
                        message
                    )
                }
            });

            setTimeout(() => {
                let privateKey = "";
                let certificate = "";
                
                for (var i = 0; i < lines.length; i++) {
                    if (i <= 27) {
                        privateKey += lines[i]+"\n";
                    }
                    if (i > 27) {
                        certificate += lines[i]+"\n";
                    }
                }

                fs.writeFile(path.join(__dirname, "../client.pem"), privateKey, (err) => {
                    if (err) {
                        dialog.showMessageBox({
                            message: "Ocorreu um erro ao importar o arquivo " + err.message
                        });
                    } else {
                    }
                });

                fs.writeFile(path.join(__dirname, "../client_public.pem"), certificate, (err) => {
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
            }, 2000);
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