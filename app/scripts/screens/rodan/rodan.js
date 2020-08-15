const path = require("path");
let loki = require("lokijs");
let db = new loki(path.join(__dirname, "./loki/rodan.json"));
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/rodan.json"));
let moment = require('moment');
const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');

let rodan = db.getCollection('rodan');

new Vue({
    el: 'body',
    data: {
        forms: {
            serial: ''
        },
        rodan: []
    },

    ready: function () {
        this.rodan = rodan.data[0];
        this.validatePrimary();
    },
    methods: {
        validate: function (rod) {
            this.rodan = rod;

            if (this.forms.serial == this.rodan.serial) {
                console.log(this.rodan.empresa);
                this.rodan.validacao = true;
                rodan.update(this.rodan);
                db.save();
                location.replace("login.html");
            }
        },
        validatePrimary: function () {
            if (this.rodan.validacao == true) {
                location.replace("login.html");
            } else {

            }
        }
    },
    computed: {
        todaInfomacaoFront: function () {
            return this.forms.serial;
        }
    }
});