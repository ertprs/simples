const path = require("path"),
    { ipcRenderer } = require('electron'),
    { dialog } = require('electron').remote;

new Vue({
    el: '#main',
    data: {
        loading: true,
        debug: [],
    },
    beforeCreate: function () {
    },
    mounted: function () {
        this.loadingShow();
    },
    beforeMount: function () {
    },
    methods: {
        loadingShow: function () {
            setTimeout(() => {
                this.loading = false;
            }, 1200);
        },
        goToPDV: function () {
            if (!this.produtos.length) {
                dialog.showMessageBox({
                    message: 'Para acessar o PDV, primeiro você precisa ter produtos cadastrados!'
                });
            } else {
                location.href = "pdv.html";
            }
        },
        closeApplication: function () {
            ipcRenderer.send("close-app");
        }
    }
});
