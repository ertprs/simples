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