const path = require("path");
let loki = require("lokijs");
let db = new loki(path.join(__dirname, "./loki/loki.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/loki.json"));
let axios = require("axios");
let moment = require('moment');
const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');

let rootus = db.getCollection('rootus');
var usuarios = db.getCollection('usuarios');
var empresas = db.getCollection('empresas');

new Vue({
    el: 'body',
    data: {
        user: '',
        pass: '',
        rootus: [],
        empresas: [],
        root: [],
        usuarios: []
    },
    ready: function () {
        this.rootus = rootus.data[0];
        this.usuarios = usuarios.data[0];
        this.empresas = empresas.data;
        document.getElementById("inputEmail").focus();
    },
    methods: {
        close: function () {
            ipcRenderer.send("close-app");
        },
        login: function () {
            let root_us = this.rootus;
            this.root = root_us;

            if (this.user == root_us.user && this.pass == root_us.pass) {
                if (root_us.logado == false) {
                    root_us.logado = true;
                } else {
                    root_us.logado = false;
                }

                if (typeof this.root.$loki !== 'undefined') {
                    console.log('Update');
                    rootus.update(this.root);
                    db.save(() => { });
                } else {
                }

                if (this.empresas.length == 0) {
                    ipcRenderer.send("show-companyWindow");
                } else {
                    ipcRenderer.send("show-mainWindow");
                }


            } else if (this.user !== root_us.user && this.pass !== root_us.pass) {
                alert('Dados Incorretos!');
            } else {
                let usuariosArray = [this.usuarios];
                for (let z = 0; z < usuariosArray.length; z++) {
                    if (usuariosArray[z].login == this.user && usuariosArray[z].senha == this.pass) {
                        if (root_us.logado == false) {
                            root_us.logado = true;
                        } else {
                            root_us.logado = false;
                        }

                        if (typeof this.root.$loki !== 'undefined') {
                            console.log('Update');
                            rootus.update(this.root);
                        } else {
                            console.log('Insert');
                            rootus.insert(this.root);
                        }

                        db.save();
                        location.replace("main2.html");
                    } else {
                    }
                }
            }
        },
        loginTest: function (root_us) {
            self = this;
            self.rootus = root_us[0];

            axios.post('http://apiv1.focux.me/clients/login.json', {
                user: self.user,
                pass: self.pass
            }).then(function (response) {

                if (typeof self.rootus.$loki !== 'undefined') {
                    self.rootus.user = response.data.client.client;
                    self.rootus.pass = "";
                    self.rootus.validity = response.data.client.date_validity;
                    self.rootus.date_now = moment().format("YYYY-MM-DD");
                    rootus.update(self.rootus);

                } else {
                    console.log("Não está funcionando...");
                }

                db.save();
                location.replace("main2.html");

            }).catch(function (error) {
                console.log(error);
            });
        },
        validity: function () {
            if (this.rootus.logado == true) {
                location.replace("main2.html");
            } else {

            }
        },
        validityTest: function () {
            if (this.rootus[0].date_now == moment().format("YYYY-MM-DD")) {
                let validity = this.rootus[0].validity;
                let now = this.rootus[0].date_now;

                const dateB = moment(now);
                const dateC = moment(validity).format("YYYY-MM-DD");

                if (dateB.diff(dateC, 'days') < 0) {
                    location.replace("main2.html");
                }
            } else {
            }
        },
        toPassword: function(){
            document.getElementById("inputPassword").focus();
        }
    }
});