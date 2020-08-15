var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');
const { ipcRenderer } = require('electron');
db.loadJSON(data);
window.Vue = require('vue');


new Vue({
    el: 'body',
    data: {
        valueTest: ''
    },
    ready: function () {
        // this.countFromThree();
        // this.main();
        this.getUserFullData(); 
    },
    methods: {
        sleep: async function (forHowLong) {
            function timeout(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            await timeout(forHowLong);
        },
        countFromThree: async function () {
            await this.sleep(0);
            console.log(3);
            await this.sleep(1000);
            console.log(2);
            await this.sleep(1000);
            console.log(1);
            await this.sleep(1000);
            console.log('DONE');
        },
        getResultado: function (parametro) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(parametro * 2.5);
                    this.valueTest = parametro * 2.5;
                    console.log(this.valueTest);
                }, 3000);
            });
        },
        main: async function () {
            if (await this.getResultado(5) > 10) {
                console.log('O retorno é maior do que 10');
                if (await this.getResultado(3) > 10) {
                    console.log('O retorno é menor do que 10');
                }
            }
        },
        getUser: async function () {
            return new Promise((resolve, reject) => {
                resolve({ name: "Felipe" });
                // setTimeout(_ => {
                //     resolve({ name: "Felipe" });
                // }, 2000);
            });
        },
        getUserAddr: async function () {
            return new Promise((resolve, reject) => {
                resolve({ endereco: "Rua X, End Y, Nº 100" });
                // setTimeout(_ => {
                //     resolve({ endereco: "Rua X, End Y, Nº 100" });
                // }, 2000);
            });
        },
        getUserFullData: async function () {
            var userData = await this.getUser();
            var userAddress = await this.getUserAddr();
            console.log(userData, userAddress);
        }
    }
});