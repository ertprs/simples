const path = require("path");
var loki = require("lokijs");
var db = new loki(path.join(__dirname, "./loki/loki.json"));
var read = require('read-file-utf8');
let moment = require('moment');
let data = read(path.join(__dirname, "./loki/loki.json"));
const { ipcRenderer } = require('electron');
db.loadJSON(data);

if (db.getCollection('usuarios') == null) {
    var usuarios = db.addCollection('usuarios');
    db.save();
    alert('Coleção de usuarios criada com sucesso...');
}

var usuarios = db.getCollection('usuarios');
let rootus = db.getCollection('rootus');
let debug = db.getCollection('debug');
var fiscal = db.getCollection('fiscal');

new Vue({
    el: 'body',
    data: {
        rootus: [],
        debug: [],
        usuarios: [],
        fiscal: [],
        link: true,
        mode: '',
        usuario: {
            data: '',
            nome: '',
            fone: '',
            status: '',
            senha: '',
            login: '',
            ativo: '',
            genero: '',
            permissoes: {
                cadastro_cliente: '',
                cadastro_fornecedor: '',
                cadastro_produto: '',
                cadastro_fabricante: '',
                cadastro_empresa: '',
                cadastro_cst: '',
                relatorios: '',
                caixa: '',
                configuracoes: '',
                importacoes: '',
            }

        },
        openModal: false
    },
    ready: function () {
        this.rootus = rootus.data[0];
        //this.validity();
        this.debug = debug.data[0];
        this.mode = 'edicao';
        this.fiscal = fiscal.data[0];
        this.usuarios = usuarios.data;

        console.log(this.usuarios);
    },
    methods: {
        logout: function () {
            if (confirm("Tem certeza que deseja sair do sistema") == true) {
                if (this.rootus.logado == true) {
                    this.rootus.logado = false;
                    rootus.update(this.rootus);
                    db.save();
                }
            } else {
            }
            
            ipcRenderer.send("show-loginWindow");
        },
        close: function () {
            ipcRenderer.send("close-app");
        },
        editUser: function (user) {
            this.openModal = true;
            this.usuario = user
        },
        validity: function () {
            if (this.rootus.logado == true) {

            } else {
                location.replace("login.html");
            }
        },
        createUser: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.usuario = {
                data: moment().format("YYYY-MM-DD"),
                nome: '',
                fone: '',
                status: '',
                senha: '',
                login: '',
                ativo: '',
                genero: '',
                permissoes: {
                    cadastro_cliente: '',
                    cadastro_fornecedor: '',
                    cadastro_produto: '',
                    cadastro_fabricante: '',
                    cadastro_empresa: '',
                    cadastro_cst: '',
                    relatorios: '',
                    caixa: '',
                    configuracoes: '',
                    importacoes: ''
                }
            };
        },
        remove(user) {
            this.usuario = user
            usuarios.remove(this.usuario);
            db.save();
            location.reload();
        },
        userStoreOrUpdate: function () {
            if (typeof this.usuario.$loki !== 'undefined') {
                usuarios.update(this.usuario);
                swal('Usuário atualizado com sucesso!');
            } else {
                usuarios.insert(this.usuario);
                swal('Usuário cadastrado com sucesso!');
            }

            db.save();
            this.openModal = false;
        }
    },
    computed: {
        todaInfomacaoFront: function () {
            return this.usuario.nome
                && this.usuario.status
                && this.usuario.login
                && this.usuario.senha
                && this.usuario.ativo
                && this.usuario.genero
        }
    }
});