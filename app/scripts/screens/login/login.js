window.Vue = require('vue');
const path = require("path"), { ipcRenderer } = require('electron');
let loki = require("lokijs"),
    db = new loki(path.join(__dirname, "./loki/loki.json")),
    read = require('read-file-utf8'),
    data = read(path.join(__dirname, "./loki/loki.json"));
db.loadJSON(data);
let rootus = db.getCollection('rootus'), usuarios = db.getCollection('usuarios'), empresas = db.getCollection('empresas');

Vue.component('login', {
    template: `
    <div class="form-signin">
        <img class="mb-4" src="images/logoLogin.png" alt="" style="width:250px">
        <br>
        <br>
        <input v-on:keyup.13="toPassword" type="text" id="inputEmail" class="form-control" placeholder="Usuário" autofocus v-model="user">
        <input v-on:keyup.13="login" type="password" id="inputPassword" class="form-control" placeholder="Senha" v-model="pass">
        <button class="btn btn-lg btn-primary btn-block" @click="login()">Entrar</button>
        <button class="btn btn-lg btn-danger btn-block" @click="close()">Fechar</button>
        <br>
        <p class="mt-5 mb-3 text-muted">&copy; 2017-2019</p>
    </div>
    `,
    data() {
        return {
            user: '', pass: '', rootus: [], empresas: [], root: [], usuarios: []
        }
    },
    ready: function () {
        this.loadData();
    },
    methods: {
        loadData: function () {
            this.rootus = rootus.data[0];
            this.usuarios = usuarios.data[0];
            this.empresas = empresas.data;
            document.getElementById("inputEmail").focus();
        },
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
                }

                if (this.empresas.length == 0) {
                    ipcRenderer.send("show-companyWindow");
                } else {
                    ipcRenderer.send("show-mainWindow");
                }
            } else if (this.user !== root_us.user) {
                alert('Usuário Incorreto!');
            } else if (this.pass !== root_us.pass) {
                alert('Senha Incorreta!');
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
        toPassword: function () {
            document.getElementById("inputPassword").focus();
        }
    }
});

new Vue({
    el: '#app',
});