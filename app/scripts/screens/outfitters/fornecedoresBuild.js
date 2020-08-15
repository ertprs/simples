var loki = require("lokijs");
var db = new loki("loki.json");
var read = require('read-file-utf8');
var data = read('./loki.json');
const { ipcRenderer } = require('electron');
db.loadJSON(data);

if (db.getCollection('fornecedoresV2') == null) {
    var fornecedoresV2 = db.addCollection('fornecedoresV2');
    let data = [
        {
            "id": 1,
            "planocontas_id": null,
            "nome": "PADRAO",
            "razao_social": "PADRAO",
            "cnpj_cpf": "00.000.000/0000-00",
            "ie": "",
            "endereco": "",
            "numero": "",
            "bairro": "SEM BAIRRO",
            "cep": "",
            "fone": "(  )    -    ",
            "fax": "(  )    -    ",
            "email_site": "",
            "obs": "",
            "estados_id": 14,
            "cidades_id": 184,
            "empresas_id": 1,
            "ativo": "1",
            "tipo": "J",
            "created": null,
            "modified": null,
            "empresa": {
                "id": 1,
                "estados_id": 14,
                "cidades_id": 206,
                "cnpj": "12.447.516/0001-68",
                "ie": "153104830",
                "im": "xx",
                "fantasia": "IDEAL FARMA",
                "razao_social": "N A ALMEIDA ME",
                "endereco": "AVE NAZEAZENO FERREIRA",
                "numero": "888",
                "bairro": "PERPETUO SOCORRO",
                "cep": "68600000",
                "telefone": "(91)3425-3577",
                "email": "xx",
                "juros_diario": 0,
                "multa": 0,
                "crt": "1",
                "cnae": "xx",
                "codigo_revenda": "87546485",
                "logo": null,
                "ativo": "S",
                "created": null,
                "modified": null
            },
            "cidade": {
                "id": 184,
                "codigocidade": "1501402",
                "iduf": "15",
                "nome": "Belem"
            },
            "estado": {
                "id": 14,
                "iduf": "15",
                "uf": "PA",
                "nome": "PARA",
                "icmscompra": "12",
                "icmsvenda": "17",
                "aliquota_interestadual": 12,
                "aliquota_fcp": 0,
                "created": null,
                "modified": null
            },
            "planoconta": null
        },
        {
            "id": 2,
            "planocontas_id": null,
            "nome": "AJUSTE DE ESTOQUE",
            "razao_social": "AJUSTE DE ESTOQUE",
            "cnpj_cpf": "00.000.000/0000-00",
            "ie": "",
            "endereco": "",
            "numero": "",
            "bairro": "SEM BAIRRO",
            "cep": "",
            "fone": "(  )    -    ",
            "fax": "(  )    -    ",
            "email_site": "",
            "obs": "",
            "estados_id": 14,
            "cidades_id": 184,
            "empresas_id": 1,
            "ativo": "1",
            "tipo": "J",
            "created": null,
            "modified": null,
            "empresa": {
                "id": 1,
                "estados_id": 14,
                "cidades_id": 206,
                "cnpj": "12.447.516/0001-68",
                "ie": "153104830",
                "im": "xx",
                "fantasia": "IDEAL FARMA",
                "razao_social": "N A ALMEIDA ME",
                "endereco": "AVE NAZEAZENO FERREIRA",
                "numero": "888",
                "bairro": "PERPETUO SOCORRO",
                "cep": "68600000",
                "telefone": "(91)3425-3577",
                "email": "xx",
                "juros_diario": 0,
                "multa": 0,
                "crt": "1",
                "cnae": "xx",
                "codigo_revenda": "87546485",
                "logo": null,
                "ativo": "S",
                "created": null,
                "modified": null
            },
            "cidade": {
                "id": 184,
                "codigocidade": "1501402",
                "iduf": "15",
                "nome": "Belem"
            },
            "estado": {
                "id": 14,
                "iduf": "15",
                "uf": "PA",
                "nome": "PARA",
                "icmscompra": "12",
                "icmsvenda": "17",
                "aliquota_interestadual": 12,
                "aliquota_fcp": 0,
                "created": null,
                "modified": null
            },
            "planoconta": null
        },
        {
            "id": 3,
            "planocontas_id": 0,
            "nome": "SB LOG - BELEM",
            "razao_social": "SB COMERCIO LTDA",
            "cnpj_cpf": "04.429.478/0004-35",
            "ie": "151995532",
            "endereco": "AV. PEDRO MIRANDA 744",
            "numero": "S/N",
            "bairro": "PEDREIRA",
            "cep": "66085005",
            "fone": "(91)4009-3535",
            "fax": "(  )    -    ",
            "email_site": "",
            "obs": "",
            "estados_id": 14,
            "cidades_id": 184,
            "empresas_id": 1,
            "ativo": "1",
            "tipo": "J",
            "created": null,
            "modified": null,
            "empresa": {
                "id": 1,
                "estados_id": 14,
                "cidades_id": 206,
                "cnpj": "12.447.516/0001-68",
                "ie": "153104830",
                "im": "xx",
                "fantasia": "IDEAL FARMA",
                "razao_social": "N A ALMEIDA ME",
                "endereco": "AVE NAZEAZENO FERREIRA",
                "numero": "888",
                "bairro": "PERPETUO SOCORRO",
                "cep": "68600000",
                "telefone": "(91)3425-3577",
                "email": "xx",
                "juros_diario": 0,
                "multa": 0,
                "crt": "1",
                "cnae": "xx",
                "codigo_revenda": "87546485",
                "logo": null,
                "ativo": "S",
                "created": null,
                "modified": null
            },
            "cidade": {
                "id": 184,
                "codigocidade": "1501402",
                "iduf": "15",
                "nome": "Belem"
            },
            "estado": {
                "id": 14,
                "iduf": "15",
                "uf": "PA",
                "nome": "PARA",
                "icmscompra": "12",
                "icmsvenda": "17",
                "aliquota_interestadual": 12,
                "aliquota_fcp": 0,
                "created": null,
                "modified": null
            },
            "planoconta": null
        }
    ];
    
    fornecedoresV2.insert(data);
    db.save();
    alert('Coleção de fornecedoresV2 criada com sucesso...');
}

var fornecedoresV2 = db.getCollection('fornecedoresV2');
console.log(fornecedoresV2.data);