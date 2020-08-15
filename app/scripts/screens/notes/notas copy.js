const path = require("path");
let loki = require("lokijs");
let db = new loki(path.join(__dirname, "./loki/notes.json"));
let db2 = new loki(path.join(__dirname, "./loki/loki.json"));
let fileExists = require('file-exists');
let read = require('read-file-utf8');
let data = read(path.join(__dirname, "./loki/notes.json"));
let data2 = read(path.join(__dirname, "./loki/loki.json"));
let fs = require('fs');
const { dialog } = require('electron').remote;
let convert = require('xml-js');
let moment = require('moment');
const userPrompt = require('electron-osx-prompt');
const { ipcRenderer } = require('electron');
db.loadJSON(data);
db2.loadJSON(data2);
window.Vue = require('vue');
let notas = db.getCollection('notas');
let rootus = db2.getCollection('rootus');
let debug = db2.getCollection('debug');
let fiscal = db2.getCollection('fiscal');
let produtosV2 = db2.getCollection('produtosV2');

new Vue({
    el: 'body',
    data: {
        rootus: [],
        debug: [],
        fiscal: [],
        notas: [],
        produtosV2: [],
        produtoV2: "",
        link: true,
        nota: {
            data: '',
            importado: '',
            nota: ''
        }
    },
    ready: function () {
        this.rootus = rootus.data[0];
        this.debug = debug.data[0];
        this.fiscal = fiscal.data[0];
        this.notas = notas.data;
        this.produtosV2 = produtosV2.data;
        console.log(this.produtosV2);
        //this.validity();
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
            const remote = require('electron').remote;
            let w = remote.getCurrentWindow();

            if (this.rootus.logado == true) {
                this.rootus.logado = false;
                rootus.update(this.rootus);
                db.save();
            }

            w.close();
        },
        addXML: function () {
            dialog.showOpenDialog((fileNames) => {
                if (fileNames === undefined) {
                    console.log("No file selected");
                    return;
                }

                fs.readFile(fileNames[0], 'utf-8', (err, data) => {
                    if (err) {
                        alert("An error ocurred reading the file :" + err.message);
                        return;
                    }

                    this.nota = {
                        data: moment().format("YYYY-MM-DD"),
                        importado: false,
                        nota: data
                    };

                    if (typeof this.nota.$loki !== 'undefined') {
                        notas.update(this.nota);
                    } else {
                        notas.insert(this.nota);
                    }

                    db.save();
                    console.log("The file content is : " + data);
                    location.reload();
                });
            });
        },
        addXMLAndAddProd: function () {
            dialog.showOpenDialog((fileNames) => {
                if (fileNames === undefined) {
                    console.log("No file selected");
                    return;
                }

                fs.readFile(fileNames[0], 'utf-8', (err, data) => {
                    if (err) {
                        alert("An error ocurred reading the file :" + err.message);
                        return;
                    }

                    this.nota = {
                        data: moment().format("YYYY-MM-DD"),
                        importado: true,
                        nota: data
                    };

                    if (typeof this.nota.$loki !== 'undefined') {
                        notas.update(this.nota);
                    } else {
                        notas.insert(this.nota);
                    }

                    db.save();

                    let result = convert.xml2json(data, { compact: true, spaces: 4 });
                    let resultJSON = [JSON.parse(result)];
                    // console.log(resultJSON);

                    for (let z = 0; z < resultJSON[0].nfeProc.NFe.infNFe.det.length; z++) {

                        let vICMS = "";
                        let cstICMS = "";
                        let vBC_ICMS = "";
                        let pICMS_ICMS = "";

                        if (resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70) {
                            vICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70.vICMS._text;
                            cstICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70.CST._text;
                            vBC_ICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70.vBC._text;
                            pICMS_ICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70.pICMS._text;
                        } else if (resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00) {
                            vICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00.vICMS._text;
                            cstICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00.CST._text;
                            vBC_ICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00.vBC._text;
                            pICMS_ICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00.pICMS._text;
                        }

                        this.produtoV2 = {
                            codigo: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.cProd._text,
                            referencia: "",
                            codigo_barras: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.cEAN._text,
                            nome: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.xProd._text,
                            descricao: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.xProd._text,
                            pode_desconto: "",
                            pode_fracionado: "",
                            pode_balanca: "",
                            pode_lote: "",
                            pode_comissao: "",
                            preco_compra: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.vUnCom._text,
                            preco_custo: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.vProd._text,
                            custo_medio: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.vProd._text,
                            preco_venda: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.vProd._text,
                            margem_lucro: "",
                            desconto_max: "",
                            preco_venda2: "",
                            margem_lucro2: "",
                            qtd_minimapv2: "",
                            desconto_max2: "",
                            preco_venda3: "",
                            margem_lucro3: "",
                            qtd_minimapv3: "",
                            desconto_max3: "",
                            preco_venda4: "",
                            margem_lucro4: "",
                            qtd_minimapv4: "",
                            quantidade: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.qCom._text,
                            desconto_max4: "",
                            preco_antigo: "",
                            valor_frete: "",
                            ipi: "",
                            preco_promocao: "",
                            data_promocao: "",
                            comissao: "",
                            estoque: "",
                            estoque_minimo: "",
                            estoque_max: "",
                            estoque_tara: "",
                            qtd_embalagem: "",
                            qtd_diasvalidade: "",
                            peso_bruto: "",
                            peso_liquido: "",
                            tipo_produto: "",
                            origem_produto: "",
                            ex_tipi: "",
                            ativo: "",
                            observacoes: "",
                            foto: "",
                            foto2: "",
                            foto3: "",
                            local: "",
                            ref_cruzada1: "",
                            ref_cruzada2: "",
                            ref_cruzada3: "",
                            ref_cruzada4: "",
                            ref_cruzada5: "",
                            ref_cruzada6: "",
                            cod_ean: "",
                            codigo_med: "",
                            tipo_med: "",
                            tabela_med: "",
                            linha_med: "",
                            ref_anvisa_med: "",
                            portaria_med: "",
                            rms_med: "",
                            data_vigencia_med: "",
                            edicao_pharmacos: "",
                            comb_cprodanp: "",
                            comb_descanp: "",
                            med_classeterapeutica: "",
                            med_unidademedida: "",
                            med_usoprolongado: "",
                            med_podeatualizar: "",
                            med_precovendafpop: "",
                            med_margemfpop: "",
                            med_apresentacaofpop: "",
                            trib_issaliqsaida: "",
                            trib_icmsaliqsaida: vICMS,
                            trib_icmsaliqredbasecalcsaida: vBC_ICMS,
                            trib_icmsobs: "",
                            trib_icmsaliqentrada: pICMS_ICMS,
                            trib_icmsaliqredbasecalcentrada: "",
                            trib_icmsfcpaliq: "",
                            trib_ipisaida: "",
                            trib_ipialiqsaida: "",
                            trib_ipientrada: "",
                            trib_ipialiqentrada: "",
                            trib_pissaida: "",
                            trib_pisaliqsaida: "",
                            trib_pisentrada: "",
                            trib_pisaliqentrada: "",
                            trib_cofinssaida: "",
                            trib_cofinsaliqsaida: "",
                            trib_cofinsentrada: "",
                            trib_cofinsaliqentrada: "",
                            trib_genero: "",
                            empresa: {
                                cnpj: "",
                                ie: "",
                                im: "",
                                fantasia: "",
                                razao_social: "",
                                endereco: "",
                                numero: "",
                                bairro: "",
                                cep: "",
                                telefone: "",
                                email: "",
                                juros_diario: "",
                                multa: "",
                                crt: "",
                                cnae: "",
                                codigo_revenda: "",
                                logo: "",
                                ativo: "",
                            },
                            unidade: {
                                descricao: "",
                                nome: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.uCom._text,
                                fator_conversao: "",
                                ativo: "",
                            },
                            fornecedore: {
                                nome: "",
                                razao_social: "",
                                cnpj_cpf: "",
                                ie: "",
                                endereco: "",
                                numero: "",
                                bairro: "",
                                cep: "",
                                fone: "",
                                fax: "",
                                email_site: "",
                                obs: "",
                                ativo: "",
                                tipo: "",
                            },
                            fabricante: {
                                nome: "",
                                ativo: "",
                            },
                            cest: {
                                cest: "",
                                ncm: "",
                                descricao: "",
                            },
                            ncm: {
                                codigo: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.NCM._text,
                                descricao: "",
                                aliquota_nacional: "",
                                aliquota_internacional: "",
                                aliquota_estadual: "",
                                aliquota_municipal: "",
                                ativo: "",
                            },
                            cst: {
                                codigotributario: cstICMS,
                                descricao: "",
                                icms: cstICMS,
                                ativo: "",
                            },
                            cfop: {
                                codigocfop: resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.CFOP._text,
                                descricao: "",
                                aplicacao: "",
                                ativo: "",
                            },
                            categoria_produto: {
                                nome: "",
                                ativo: "",
                                comissao: "",
                            },
                            grupotributaco: {
                                nome: "",
                                origem: "",
                                icms_saida_aliquota: "",
                                icms_saida_aliquota_red_base_calc: "",
                                pis_saida: "",
                                pis_saida_aliquota: "",
                                cofins_saida: "",
                                cofins_saida_aliquota: "",
                                ativo: ""
                            }
                        };

                        if (typeof this.produtoV2.$loki !== 'undefined') {
                            produtosV2.update(this.produtoV2);
                            db2.save();
                        } else {
                            produtosV2.insert(this.produtoV2);
                            db2.save();
                        }

                        let produto = produtosV2.find({ 'codigo_barras': this.produtoV2.codigo_barras });
                        // console.log(produto[produto.length -1]);
                        // console.log(Object.keys(produto)[produto.length -1]);
                        let quantidade = 0;

                        for (let i = 0; i < produto.length; i++) {
                            quantidade = quantidade + parseFloat(produto[i].quantidade);

                            if (i == Object.keys(produto)[produto.length - 1]) {
                                produto[i].quantidade = quantidade;
                                produtosV2.update(produto[i]);
                                db2.save();
                            }

                            if (i < Object.keys(produto)[produto.length - 1]) {
                                produtosV2.remove(produto[i]);
                                db2.save();
                            }
                        }
                    }
                });
            });
        },
        importProducts: function (data) {
            let result = convert.xml2json(data.nota, { compact: true, spaces: 4 });
            let resultJSON = [JSON.parse(result)];

            for (let z = 0; z < resultJSON[0].nfeProc.NFe.infNFe.det.length; z++) {
                if (typeof this.produtoV2.$loki !== 'undefined') {
                    produtosV2.update(this.produtoV2);
                } else {
                    produtosV2.insert(this.produtoV2);
                }
                db2.save();
            }

            if (typeof data.$loki !== 'undefined') {
                data.importado = true;
                let nota_importada = data;
                notas.update(nota_importada);
                db.save();
            }

            location.reload();
        },
        viewNote: function (data) {
            let result = convert.xml2json(data.nota, { compact: true, spaces: 4 });
            let resultJSON = [JSON.parse(result)];
            let serie = "";
            let numero = "";
            let natureza_operacao = "";
            let inscricao_estadual = "";
            let CNPJ_emit = "";
            let nome_dest = "";
            let CNPJ_dest = "";
            let data_emissao = "";
            let endereco_dest = "";
            let nro_dest = "";
            let bairro_dest = "";
            let cep_dest = "";
            let municipio_dest = "";
            let uf_dest = "";
            let inscricao_estadual_dest = "";
            let base_icms = "";
            let valor_icms = "";
            let tipo_nota = "";
            let nome_emitente = "";
            let endereco_emitente = "";
            let bairro_emitente = "";
            let cep_emitente = "";
            let municipio_emitente = "";
            let uf_emitente = "";
            let fone_emitente = "";
            let chave_acesso = "";
            let data_recebimento = "";
            let fone_dest = "";
            let protocolo_autorizacao = "";
            let icms_st = "";
            let valor_icms_st = "";
            let valor_total_produtos = "";
            let valor_total_nota = "";
            let razao_social_transportadora = "";
            let mod_frete = "";
            let info_adicionais = "";

            /**
             * Proteção da Nota
             */
            for (let x = 0; x < resultJSON.length; x++) {
                chave_acesso = resultJSON[0].nfeProc.protNFe.infProt.chNFe._text;
                data_recebimento = resultJSON[0].nfeProc.protNFe.infProt.dhRecbto._text;
                protocolo_autorizacao = resultJSON[0].nfeProc.protNFe.infProt.nProt._text
            }

            /**
             * Iteração Geral
             */
            for (let x = 0; x < resultJSON.length; x++) {
                serie = resultJSON[0].nfeProc.NFe.infNFe.ide.serie._text;
                numero = resultJSON[0].nfeProc.NFe.infNFe.ide.nNF._text;
                natureza_operacao = resultJSON[0].nfeProc.NFe.infNFe.ide.natOp._text;
                inscricao_estadual = resultJSON[0].nfeProc.NFe.infNFe.emit.IE._text;
                CNPJ_emit = resultJSON[0].nfeProc.NFe.infNFe.emit.CNPJ._text;
                nome_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.xNome._text;
                CNPJ_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.CNPJ._text;
                data_emissao = resultJSON[0].nfeProc.NFe.infNFe.ide.dhEmi._text;
                endereco_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.enderDest.xLgr._text;
                nro_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.enderDest.nro._text;
                bairro_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.enderDest.xBairro._text;
                cep_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.enderDest.CEP._text;
                municipio_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.enderDest.xMun._text;
                uf_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.enderDest.UF._text;
                inscricao_estadual_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.IE._text;
                base_icms = resultJSON[0].nfeProc.NFe.infNFe.total.ICMSTot.vBC._text;
                valor_icms = resultJSON[0].nfeProc.NFe.infNFe.total.ICMSTot.vICMS._text;
                tipo_nota = resultJSON[0].nfeProc.NFe.infNFe.ide.tpNF._text;
                nome_emitente = resultJSON[0].nfeProc.NFe.infNFe.emit.xNome._text;
                endereco_emitente = resultJSON[0].nfeProc.NFe.infNFe.emit.enderEmit.xLgr._text;
                bairro_emitente = resultJSON[0].nfeProc.NFe.infNFe.emit.enderEmit.xBairro._text;
                cep_emitente = resultJSON[0].nfeProc.NFe.infNFe.emit.enderEmit.CEP._text;
                municipio_emitente = resultJSON[0].nfeProc.NFe.infNFe.emit.enderEmit.xMun._text;
                uf_emitente = resultJSON[0].nfeProc.NFe.infNFe.emit.enderEmit.UF._text;
                fone_emitente = resultJSON[0].nfeProc.NFe.infNFe.emit.enderEmit.fone._text;
                fone_dest = resultJSON[0].nfeProc.NFe.infNFe.dest.enderDest.fone._text
                icms_st = resultJSON[0].nfeProc.NFe.infNFe.total.ICMSTot.vBCST._text
                valor_icms_st = resultJSON[0].nfeProc.NFe.infNFe.total.ICMSTot.vST._text
                valor_total_produtos = resultJSON[0].nfeProc.NFe.infNFe.total.ICMSTot.vProd._text
                valor_total_nota = resultJSON[0].nfeProc.NFe.infNFe.total.ICMSTot.vNF._text
                razao_social_transportadora = resultJSON[0].nfeProc.NFe.infNFe.transp.transporta.xNome._text
                mod_frete = resultJSON[0].nfeProc.NFe.infNFe.transp.modFrete._text
                info_adicionais = resultJSON[0].nfeProc.NFe.infNFe.infAdic.infCpl._text
            }

            let produtos = "<tbody>";

            /**
             * Iteração do Produtos
             */
            for (let z = 0; z < resultJSON[0].nfeProc.NFe.infNFe.det.length; z++) {
                let vICMS = "";
                let cstICMS = "";
                let vBC_ICMS = "";
                let pICMS_ICMS = "";
                if (resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70) {
                    vICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70.vICMS._text;
                    cstICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70.CST._text;
                    vBC_ICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS70.vBC._text;
                } else if (resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00) {
                    vICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00.vICMS._text;
                    cstICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00.CST._text;
                    vBC_ICMS = resultJSON[0].nfeProc.NFe.infNFe.det[z].imposto.ICMS.ICMS00.vBC._text;
                }

                produtos = produtos + '<tr class="titles">'
                    + '<td class="cod" style="width: 15.5mm">' + resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.cProd._text + '</td>'
                    + '<td class="descrit" style="width: 66.1mm">' + resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.xProd._text + '</td>'
                    + '<td class="ncmsh">' + resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.NCM._text + '</td>'
                    + '<td class="cfop">' + resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.CFOP._text + '</td>'
                    + '<td class="cst">' + cstICMS + '</td>'
                    + '<td class="un">' + resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.uCom._text + '</td>'
                    + '<td class="amount">' + resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.qCom._text + '</td>'
                    + '<td class="valUnit">' + resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.vUnCom._text + '</td>'
                    + '<td class="valTotal">' + resultJSON[0].nfeProc.NFe.infNFe.det[z].prod.vProd._text + '</td>'
                    + '<td class="bcIcms">' + vBC_ICMS + '</td>'
                    + '<td class="valIcms">' + vICMS + '</td>'
                    + '</tr>'
            }

            produtos = produtos + "</tbody>";

            let html = '<!-- Header -->'
                + '<style type="text/css">'
                + '@media print {'
                + '@page {'
                + 'margin-left: 15mm;'
                + 'margin-right: 15mm;'
                + '}'

                + 'footer {'
                + 'page-break-after: always;'
                + '}'
                + '}'

                + '* {'
                + 'margin: 0;'
                + '}'

                + '.ui-widget-content {'
                + 'border: none !important;'
                + '}'

                + '.nfe-square {'
                + 'margin: 0 auto 2cm;'
                + ' box-sizing: border-box;'
                + ' width: 2cm;'
                + ' height: 1cm;'
                + ' border: 1px solid #000;'
                + '}'

                + '.nfeArea.page {'
                + ' width: 21cm;'
                + ' position: relative;'
                + 'font-family: "Times New Roman", serif;'
                + ' color: #000;'
                + ' margin: 0 auto;'
                + 'overflow: hidden;'
                + ' }'

                + ' .nfeArea .font-12 {'
                + 'font-size: 12pt;'
                + '}'

                + '.nfeArea .font-8 {'
                + '   font-size: 8pt;'
                + '}'

                + '.nfeArea .bold {'
                + '  font-weight: bold;'
                + '}'

                + '/* == TABELA == */'
                + '.nfeArea .area-name {'
                + ' font-family: "Times New Roman", serif;'
                + ' color: #000;'
                + ' font-weight: bold;'
                + ' margin: 5px 0 0;'
                + ' font-size: 10pt;'
                + ' text-transform: uppercase;'
                + '}'

                + '.nfeArea .txt-upper {'
                + ' text-transform: uppercase;'
                + '}'

                + '.nfeArea .txt-center {'
                + ' text-align: center;'
                + '}'

                + '.nfeArea .txt-right {'
                + '    text-align: right;'
                + ' }'

                + '.nfeArea .nf-label {'
                + '   text-transform: uppercase;'
                + '  margin-bottom: 3px;'
                + 'display: block;'
                + ' }'

                + '.nfeArea .nf-label.label-small {'
                + ' letter-spacing: -0.5px;'
                + 'font-size: 10pt;'
                + ' }'

                + ' .nfeArea .info {'
                + ' font-weight: bold;'
                + ' font-size: 10pt;'
                + ' display: block;'
                + ' line-height: 1em;'
                + ' }'

                + ' .nfeArea table {'
                + ' font-family: "Times New Roman", serif;'
                + ' color: #000;'
                + ' font-size: 6pt;'
                + ' border-collapse: collapse;'
                + ' width: 100%;'
                + ' border-color: #000;'
                + ' border-radius: 5px;'
                + '}'

                + '.nfeArea .no-top {'
                + ' margin-top: -1px;'
                + ' }'

                + '.nfeArea .mt-table {'
                + ' margin-top: 3px;'
                + '}'

                + '.nfeArea .valign-middle {'
                + ' vertical-align: middle;'
                + ' }'

                + '.nfeArea td {'
                + ' vertical-align: top;'
                + ' box-sizing: border-box;'
                + ' overflow: hidden;'
                + ' border-color: #000;'
                + ' padding: 1px;'
                + 'height: 5mm;'
                + '}'

                + '.nfeArea .tserie {'
                + '  width: 32.2mm;'
                + ' vertical-align: middle;'
                + ' font-size: 10pt;'
                + ' font-weight: bold;'
                + '}'

                + '.nfeArea .tserie span {'
                + '    display: block;'
                + ' }'

                + '.nfeArea .tserie h3 {'
                + '    display: inline-block;'
                + ' }'

                + '.nfeArea .entradaSaida .legenda {'
                + ' text-align: left;'
                + ' margin-left: 2mm;'
                + '  display: block;'
                + '}'

                + '.nfeArea .entradaSaida .legenda span {'
                + '    display: block;'
                + ' }'

                + ' .nfeArea .entradaSaida .identificacao {'
                + ' float: right;'
                + ' margin-right: 2mm;'
                + ' border: 1px solid black;'
                + ' width: 5mm;'
                + ' height: 5mm;'
                + ' text-align: center;'
                + ' padding-top: 0;'
                + ' line-height: 5mm;'
                + ' }'

                + '.nfeArea .hr-dashed {'
                + '   border: none;'
                + ' border-top: 1px dashed #444;'
                + ' margin: 5px 0;'
                + ' }'

                + '.nfeArea .client_logo {'
                + '   height: 27.5mm;'
                + '  width: 28mm;'
                + '  margin: 0.5mm;'
                + '}'

                + ' .nfeArea .title {'
                + '   font-size: 10pt;'
                + '  margin-bottom: 2mm;'
                + '}'

                + '.nfeArea .txtc {'
                + 'text-align: center;'
                + '  }'

                + ' .nfeArea .pd-0 {'
                + ' padding: 0;'
                + '}'

                + '   .nfeArea .mb2 {'
                + '  margin-bottom: 2mm;'
                + ' }'

                + '.nfeArea table table {'
                + '   margin: -1pt;'
                + '  width: 100.5%;'
                + ' }'

                + '.nfeArea .wrapper-table {'
                + '  margin-bottom: 2pt;'
                + '}'

                + '.nfeArea .wrapper-table table {'
                + ' margin-bottom: 0;'
                + '}'

                + ' .nfeArea .wrapper-table table + table {'
                + '      margin-top: -1px;'
                + '  }'

                + ' .nfeArea .boxImposto {'
                + '     table-layout: fixed;'
                + '  }'

                + ' .nfeArea .boxImposto td {'
                + '    width: 11.11%;'
                + ' }'

                + '.nfeArea .boxImposto .nf-label {'
                + '   font-size: 6pt;'
                + '}'

                + '  .nfeArea .boxImposto .info {'
                + '    text-align: right;'
                + '  }'

                + ' .nfeArea .wrapper-border {'
                + '    border: 1px solid #000;'
                + '   border-width: 0 1px 1px;'
                + '    height: 75.7mm;'
                + ' }'

                + '.nfeArea .wrapper-border table {'
                + ' margin: 0 -1px;'
                + '  width: 100.4%;'
                + ' }'

                + '  .nfeArea .content-spacer {'
                + '      display: block;'
                + '     height: 10px;'
                + '  }'

                + '  .nfeArea .titles th {'
                + '      padding: 3px 0;'
                + ' }'

                + '  .nfeArea .listProdutoServico td {'
                + '     padding: 0;'
                + '  }'

                + '  .nfeArea .codigo {'
                + '     display: block;'
                + '      text-align: center;'
                + '      margin-top: 5px;'
                + '  }'

                + '    .nfeArea .boxProdutoServico tr td:first-child {'
                + '      border-left: none;'
                + '   }'

                + ' .nfeArea .boxProdutoServico td {'
                + '      font-size: 10pt;'
                + '       height: auto;'
                + '   }'

                + '  .nfeArea .boxFatura span {'
                + '       display: block;'
                + '   }'

                + '    .nfeArea .boxFatura td {'
                + '       border: 1px solid #000;'
                + '    }'

                + ' .nfeArea .freteConta .border {'
                + '     width: 5mm;'
                + '       height: 5mm;'
                + '      float: right;'
                + '       text-align: center;'
                + '      line-height: 5mm;'
                + '     border: 1px solid black;'
                + ' }'

                + '     .nfeArea .freteConta .info {'
                + '       line-height: 5mm;'
                + '    }'

                + '  .page .boxFields td p {'
                + '      font-family: "Times New Roman", serif;'
                + '      font-size: 10pt;'
                + '       line-height: 1.2em;'
                + '     color: #000;'
                + '  }'

                + ' .nfeArea .imgCanceled {'
                + '      position: absolute;'
                + '       top: 75mm;'
                + '       left: 30mm;'
                + '       z-index: 3;'
                + '       opacity: 0.8;'
                + '      display: none;'
                + '  }'

                + '  .nfeArea.invoiceCanceled .imgCanceled {'
                + '      display: block;'
                + '  }'

                + '  .nfeArea .imgNull {'
                + '     position: absolute;'
                + '     top: 75mm;'
                + '     left: 20mm;'
                + '      z-index: 3;'
                + '      opacity: 0.8;'
                + '      display: none;'
                + '  }'

                + '  .nfeArea.invoiceNull .imgNull {'
                + '      display: block;'
                + '   }'

                + '   .nfeArea.invoiceCancelNull .imgCanceled {'
                + '      top: 100mm;'
                + '      left: 35mm;'
                + '      display: block;'
                + '   }'

                + ' .nfeArea.invoiceCancelNull .imgNull {'
                + '     top: 65mm;'
                + '     left: 15mm;'
                + '      display: block;'
                + '   }'

                + ' .nfeArea .page-break {'
                + '      page-break-before: always;'
                + '  }'

                + '  .nfeArea .block {'
                + '       display: block;'
                + '   }'

                + ' .label-mktup {'
                + '     font-family: Arial !important;'
                + '     font-size: 10px !important;'
                + '     padding-top: 8px !important;'
                + ' }'
                + '</style>'
                + '<!-- /Header -->'
                + '<!-- Recebimentos -->'
                + '<div class="page nfeArea">'
                + ' <img class="imgCanceled" src="tarja_nf_cancelada.png" alt="" />'
                + '  <img class="imgNull" src="tarja_nf_semvalidade.png" alt="" />'
                + ' <div class="boxFields" style="padding-top: 20px;">'
                + '     <table cellpadding="0" cellspacing="0" border="1">'
                + '         <tbody>'
                + '             <tr>'
                + '                 <td colspan="2" class="txt-upper">'
                + '                     Recebemos de ' + nome_emitente + ' os produtos e serviços constantes na nota fiscal indicada ao lado'
                + '                 </td>'
                + '                 <td rowspan="2" class="tserie txt-center">'
                + '                     <span class="font-12" style="margin-bottom: 5px;">NF-e</span>'
                + '                     <span>Nº ' + numero + '</span>'
                + '                     <span>Série ' + serie + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '             <tr>'
                + '                 <td style="width: 32mm">'
                + '                     <span class="nf-label">Data de recebimento</span>'
                + '                 </td>'
                + '                 <td style="width: 124.6mm">'
                + '                     <span class="nf-label">Identificação de assinatura do Recebedor</span>'
                + '                 </td>'
                + '             </tr>'
                + '         </tbody>'
                + '     </table>'
                + '     <hr class="hr-dashed" />'
                + '     <table cellpadding="0" cellspacing="0" border="1">'
                + '         <tbody>'
                + '             <tr>'
                + '                 <td rowspan="3" style="width: 46mm; font-size: 10pt;" class="txt-center">'
                + '                     <span class="mb2 bold block">' + nome_emitente + '</span>'
                + '                     <span class="block">' + endereco_emitente + '</span>'
                + '                     <span class="block">' + bairro_emitente + '-' + cep_emitente + '</span>'
                + '                     <span class="block">' + municipio_emitente + ' - ' + uf_emitente + 'Fone:' + fone_emitente
                + '                     </span>'
                + '                 </td>'
                + '                 <td rowspan="3" class="txtc txt-upper" style="width: 34mm; height: 29.5mm; background-color: #ddd">'
                + '                     <h3 class="title">Danfe</h3>'
                + '                     <p class="mb2">Documento auxiliar da Nota Fiscal Eletrônica </p>'
                + '                     <p class="entradaSaida mb2">'
                + '                         <span class="identificacao">'
                + '                             <span>' + tipo_nota + '</span>'
                + '                         </span>'
                + '                         <span class="legenda">'
                + '                             <span>0 - Entrada</span>'
                + '                             <span>1 - Saída</span>'
                + '                         </span>'
                + '                     </p>'
                + '                     <p>'
                + '                         <span class="block bold">'
                + '                             <span>Nº</span>'
                + '                             <span>' + numero + '</span>'
                + '                         </span>'
                + '                         <span class="block bold">'
                + '                             <span>SÉRIE:</span>'
                + '                             <span>' + serie + '</span>'
                + '                         </span>'
                + '                     </p>'
                + '                 </td>'
                + '                 <td class="txt-upper" style="width: 85mm;">'
                + '                     <span class="nf-label">Controle do Fisco</span>'
                + '                     <span class="bold block txt-center info">' + chave_acesso + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '             <tr>'
                + '                 <td>'
                + '                     <span class="nf-label">CHAVE DE ACESSO</span>'
                + '                     <span class="bold block txt-center info">' + chave_acesso + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '             <tr>'
                + '                 <td class="txt-center valign-middle">'
                + '                     <span class="block">Consulta de autenticidade no portal nacional da NF-e </span> www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizada.'
                + '                 </td>'
                + '             </tr>'
                + '         </tbody>'
                + '     </table>'
                + '     <!-- Natureza da Operação -->'
                + '     <table cellpadding="0" cellspacing="0" class="boxNaturezaOperacao no-top" border="1">'
                + '         <tbody>'
                + '             <tr>'
                + '                 <td>'
                + '                     <span class="nf-label">NATUREZA DA OPERAÇÃO</span>'
                + '                     <span class="info">' + natureza_operacao + '</span>'
                + '                 </td>'
                + '                 <td style="width: 84.7mm;">'
                + '                     <span class="nf-label">PROTOCOLO DE AUTORIZAÇÃO</span>'
                + '                     <span class="info">' + protocolo_autorizacao + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '         </tbody>'
                + '     </table>'

                + '     <!-- Inscrição -->'
                + '     <table cellpadding="0" cellspacing="0" class="boxInscricao no-top" border="1">'
                + '         <tbody>'
                + '             <tr>'
                + '                 <td>'
                + '                     <span class="nf-label">INSCRIÇÃO ESTADUAL</span>'
                + '                     <span class="info">' + inscricao_estadual + '</span>'
                + '                 </td>'
                + '                 <td style="width: 67.5mm;">'
                + '                     <span class="nf-label">INSCRIÇÃO ESTADUAL DO SUBST. TRIB.</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '                 <td style="width: 64.3mm">'
                + '                     <span class="nf-label">CNPJ</span>'
                + '                     <span class="info">' + CNPJ_emit + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '         </tbody>'
                + '     </table>'

                + '     <!-- Destinatário/Remetente -->'
                + '     <p class="area-name">Destinatário/Emitente</p>'
                + '     <table cellpadding="0" cellspacing="0" class="boxDestinatario" border="1">'
                + '         <tbody>'
                + '             <tr>'
                + '                 <td class="pd-0">'
                + '                     <table cellpadding="0" cellspacing="0" border="1">'
                + '                         <tbody>'
                + '                             <tr>'
                + '                                 <td>'
                + '                                     <span class="nf-label">NOME/RAZÃO SOCIAL</span>'
                + '                                     <span class="info">' + nome_dest + '</span>'
                + '                                 </td>'
                + '                                 <td style="width: 40mm">'
                + '                                     <span class="nf-label">CNPJ/CPF</span>'
                + '                                     <span class="info">' + CNPJ_dest + '</span>'
                + '                                 </td>'
                + '                             </tr>'
                + '                         </tbody>'
                + '                     </table>'
                + '                 </td>'
                + '                 <td style="width: 22mm">'
                + '                     <span class="nf-label">DATA DE EMISSÃO</span>'
                + '                     <span class="info">' + data_emissao + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '             <tr>'
                + '                 <td class="pd-0">'
                + '                     <table cellpadding="0" cellspacing="0" border="1">'
                + '                         <tbody>'
                + '                             <tr>'
                + '                                 <td>'
                + '                                     <span class="nf-label">ENDEREÇO</span>'
                + '                                     <span class="info">' + endereco_dest + '</span>'
                + '                                 </td>'
                + '                                 <td style="width: 47mm;">'
                + '                                     <span class="nf-label">BAIRRO/DISTRITO</span>'
                + '                                     <span class="info">' + bairro_dest + '</span>'
                + '                                 </td>'
                + '                                 <td style="width: 37.2 mm">'
                + '                                     <span class="nf-label">CEP</span>'
                + '                                     <span class="info">' + cep_dest + '</span>'
                + '                                 </td>'
                + '                             </tr>'
                + '                         </tbody>'
                + '                     </table>'
                + '                 </td>'
                + '                 <td>'
                + '                     <span class="nf-label">DATA DE ENTR./SAÍDA</span>'
                + '                     <span class="info">' + data_emissao + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '             <tr>'
                + '                 <td class="pd-0">'
                + '                     <table cellpadding="0" cellspacing="0" style="margin-bottom: -1px;" border="1">'
                + '                         <tbody>'
                + '                             <tr>'
                + '                                 <td>'
                + '                                     <span class="nf-label">MUNICÍPIO</span>'
                + '                                     <span class="info">' + municipio_dest + '</span>'
                + '                                 </td>'
                + '                                 <td style="width: 34mm">'
                + '                                     <span class="nf-label">FONE/FAX</span>'
                + '                                     <span class="info">' + fone_dest + '</span>'
                + '                                 </td>'
                + '                                 <td style="width: 28mm">'
                + '                                     <span class="nf-label">UF</span>'
                + '                                     <span class="info">' + uf_dest + '</span>'
                + '                                 </td>'
                + '                                 <td style="width: 51mm">'
                + '                                     <span class="nf-label">INSCRIÇÃO ESTADUAL</span>'
                + '                                     <span class="info">' + inscricao_estadual_dest + '</span>'
                + '                                 </td>'
                + '                             </tr>'
                + '                         </tbody>'
                + '                     </table>'
                + '                 </td>'
                + '                 <td>'
                + '                     <span class="nf-label">HORA ENTR./SAÍDA</span>'
                + '                     <span id="info"></span>'
                + '                 </td>'
                + '             </tr>'
                + '         </tbody>'
                + '     </table>'

                + '     <!-- Calculo do Imposto -->'
                + '     <p class="area-name">Calculo do imposto</p>'
                + '     <div class="wrapper-table">'
                + '         <table cellpadding="0" cellspacing="0" border="1" class="boxImposto">'
                + '             <tbody>'
                + '                 <tr>'
                + '                     <td>'
                + '                         <span class="nf-label label-small">BASE DE CÁLC. DO ICMS</span>'
                + '                         <span class="info">' + base_icms + '</span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label">VALOR DO ICMS</span>'
                + '                         <span class="info">' + valor_icms + '</span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label label-small" style="font-size: 5pt;">BASE DE CÁLC. DO ICMS ST</span>'
                + '                         <span class="info">' + icms_st + '</span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label">VALOR DO ICMS ST</span>'
                + '                         <span class="info">' + valor_icms_st + '</span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label label-small">V. IMP. IMPORTAÇÃO</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label label-small">V. ICMS UF REMET.</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label">VALOR DO FCP</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label">VALOR DO PIS</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label label-small">V. TOTAL DE PRODUTOS</span>'
                + '                         <span class="info">' + valor_total_produtos + '</span>'
                + '                     </td>'
                + '                 </tr>'
                + '                 <tr>'
                + '                     <td>'
                + '                         <span class="nf-label">VALOR DO FRETE</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label">VALOR DO SEGURO</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label">DESCONTO</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label">OUTRAS DESP.</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label">VALOR DO IPI</span>'
                + '                         <span class="info"></span>'
                + '                        </td>'
                + '                       <td>'
                + '                         <span class="nf-label">V. ICMS UF DEST.</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label label-small">V. APROX. DO TRIBUTO</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label label-small">VALOR DA CONFINS</span>'
                + '                         <span class="info"></span>'
                + '                     </td>'
                + '                     <td>'
                + '                         <span class="nf-label label-small">V. TOTAL DA NOTA</span>'
                + '                         <span class="info">' + valor_total_nota + '</span>'
                + '                     </td>'
                + '                 </tr>'
                + '             </tbody>'
                + '         </table>'
                + '     </div>'
                + '     <!-- Transportador/Volumes transportados -->'
                + '     <p class="area-name">Transportador/volumes transportados</p>'
                + '     <table cellpadding="0" cellspacing="0" border="1">'
                + '         <tbody>'
                + '             <tr>'
                + '                 <td>'
                + '                     <span class="nf-label">RAZÃO SOCIAL</span>'
                + '                     <span class="info">' + razao_social_transportadora + '</span>'
                + '                 </td>'
                + '                 <td class="freteConta" style="width: 32mm">'
                + '                     <span class="nf-label">FRETE POR CONTA</span>'
                + '                     <div class="border">'
                + '                         <span class="info">' + mod_frete + '</span>'
                + '                     </div>'
                + '                     <p>0 - Emitente</p>'
                + '                     <p>1 - Destinatário</p>'
                + '                 </td>'
                + '                 <td style="width: 17.3mm">'
                + '                     <span class="nf-label">CÓDIGO ANTT</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '                 <td style="width: 24.5mm">'
                + '                     <span class="nf-label">PLACA</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '                 <td style="width: 11.3mm">'
                + '                     <span class="nf-label">UF</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '                 <td style="width: 29.5mm">'
                + '                     <span class="nf-label">CNPJ/CPF</span>'
                + '                     <span class="info">' + CNPJ_emit + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '         </tbody>'
                + '     </table>'

                + '     <table cellpadding="0" cellspacing="0" border="1" class="no-top">'
                + '         <tbody>'
                + '             <tr>'
                + '                 <td class="field endereco">'
                + '                     <span class="nf-label">ENDEREÇO</span>'
                + '                     <span class="content-spacer info">' + endereco_emitente + '</span>'
                + '                 </td>'
                + '                 <td style="width: 32mm">'
                + '                     <span class="nf-label">MUNICÍPIO</span>'
                + '                     <span class="info">' + municipio_emitente + '</span>'
                + '                 </td>'
                + '                 <td style="width: 31mm">'
                + '                     <span class="nf-label">UF</span>'
                + '                     <span class="info">' + uf_emitente + '</span>'
                + '                 </td>'
                + '                 <td style="width: 51.4mm">'
                + '                     <span class="nf-label">INSC. ESTADUAL</span>'
                + '                     <span class="info">' + inscricao_estadual + '</span>'
                + '                 </td>'
                + '             </tr>'
                + '         </tbody>'
                + '     </table>'
                + '     <table cellpadding="0" cellspacing="0" border="1" class="no-top">'
                + '         <tbody>'
                + '             <tr>'
                + '                 <td class="field quantidade">'
                + '                     <span class="nf-label">QUANTIDADE</span>'
                + '                     <span class="content-spacer info"></span>'
                + '                 </td>'
                + '                 <td style="width: 31.4mm">'
                + '                     <span class="nf-label">ESPÉCIE</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '                 <td style="width: 31mm">'
                + '                     <span class="nf-label">MARCA</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '                 <td style="width: 31.5mm">'
                + '                     <span class="nf-label">NUMERAÇÃO</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '                 <td style="width: 31.5mm">'
                + '                     <span class="nf-label">PESO BRUTO</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '                 <td style="width: 32.5mm">'
                + '                     <span class="nf-label">PESO LÍQUIDO</span>'
                + '                     <span class="info"></span>'
                + '                 </td>'
                + '             </tr>'
                + '         </tbody>'
                + '     </table>'
                + '     <!-- Dados do produto/serviço -->'
                + '     <p class="area-name">Dados do produto/serviço</p>'
                + '     <div class="wrapper-border">'
                + '                   [items]'
                + '         <table cellpadding="0" cellspacing="0" border="1" class="boxProdutoServico">'
                + '             <thead class="listProdutoServico" id="table">'
                + '                 <tr class="titles">'
                + '                     <th class="cod" style="width: 15.5mm">CÓDIGO</th>'
                + '                     <th class="descrit" style="width: 66.1mm">DESCRIÇÃO DO PRODUTO/SERVIÇO</th>'
                + '                     <th class="ncmsh">NCMSH</th>'
                + '                     <th class="cfop">CFOP</th>'
                + '                     <th class="cfop">CST</th>'
                + '                     <th class="un">UN</th>'
                + '                     <th class="amount">QTD.</th>'
                + '                     <th class="valUnit">VLR.UNIT</th>'
                + '                     <th class="valTotal">VLR.TOTAL</th>'
                + '                     <th class="bcIcms">BC ICMS</th>'
                + '                     <th class="valIcms">VLR.ICMS</th>'
                + '                  </tr>'
                + '                </thead>'
                +                  produtos
                + '          </table>'
                + '     </div>'
                + '       <!-- Dados adicionais -->'
                + '      <p class="area-name">Dados adicionais</p>'
                + '     <table cellpadding="0" cellspacing="0" border="1" class="boxDadosAdicionais">'
                + '         <tbody>'
                + '              <tr>'
                + '                 <td class="field infoComplementar">'
                + '                      <span class="nf-label">INFORMAÇÕES COMPLEMENTARES</span>'
                + '                      <span>' + info_adicionais + '</span>'
                + '                  </td>'
                + '                 <td class="field reservaFisco" style="width: 85mm; height: 24mm">'
                + '                      <span class="nf-label">RESERVA AO FISCO</span>'
                + '                     <span></span>'
                + '                 </td>'
                + '               </tr>'
                + '         </tbody>'
                + '     </table>'
                + '      <footer>'
                + '          <table cellpadding="0" cellspacing="0">'
                + '            <tbody>'
                + '              <tr>'
                + '                     <td style="text-align: right"><strong>Empresa de Software www.focuxmicrosystems.co</strong></td>'
                + '                </tr>'
                + '            </tbody>'
                + '        </table>'
                + '   </footer>'
                + '  </div>'
                + '</div>'

            const path = require("path");
            let fs = require('fs');
            let pathTo = path.join(__dirname, '/nfe_vertical.html');
            self = this;
            fs.writeFile(pathTo, html, function (err) {
                if (err) {
                    alert('write pdf file error', err);
                } else {
                    const run = async () => {
                        const path = require("path");
                        var fs = require('fs');
                        var pdf = require('html-pdf');
                        var html = fs.readFileSync(path.join(__dirname, "nfe_vertical.html"), 'utf8');
                        var options = {
                            "border": {
                                "top": "2cm",
                                "right": "2cm",
                                "bottom": "2cm",
                                "left": "2cm"
                            },
                        };

                        pdf.create(
                            html,
                            options
                        ).toFile(path.join(__dirname, "tmp", "nfe_vertical.pdf"), function (err, res) {
                            if (err) {
                                return console.log(err);
                            } else {
                                const { BrowserWindow } = require('electron').remote;
                                const PDFWindow = require('electron-pdf-window');
                                const win = new BrowserWindow(
                                    {
                                        width: 1400,
                                        height: 800,
                                        icon: path.join(__dirname, "../assets/ico.ico"),
                                    });
                                win.setMenu(null);
                                PDFWindow.addSupport(win);
                                let pathTo = path.join(__dirname, "tmp/nfe_vertical.pdf");
                                win.loadURL(pathTo);
                            }
                        });
                    }
                    run();
                }
            });
        },
        removeNote(note) {
            const icon = __dirname + '/images/logoSystem2.png';
            userPrompt('Entre com a senha para confirmar!', 'Senha', icon)
                .then(input => {
                    if (this.rootus.pass == input) {
                        this.nota = note
                        console.log(this.nota);
                        notas.remove(this.nota);
                        db.save();
                        location.reload();
                    } else {
                        alert('Operação não realizada!');
                    }
                })
                .catch(err => {
                    console.log(err);
                });

        },
        validity: function () {
            if (this.rootus.logado == true) {

            } else {
                location.replace("login.html");
            }
        },
    }
});