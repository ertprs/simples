const path = require("path"),
  { app, BrowserWindow, globalShortcut, ipcMain } = require('electron'),
  electron = require('electron'),
  Menu = electron.Menu,
  MenuItem = Menu.MenuItem;

let loki = require("lokijs"),
  db = new loki(path.join(__dirname, "./loki/loki.json")),
  read = require('read-file-utf8'),
  data = read(path.join(__dirname, "./app/loki/loki.json"));

db.loadJSON(data);

function loadVariables() {
  let mainWindow,
    loginWindow,
    companyWindow,
    salesWindow,
    notesWindow,
    nfcesWindow,
    clientsWindow,
    productsWindow,
    outfittersWindow,
    producersWindow,
    fiscalsWindow,
    nfeWindow,
    reportsWindow;
}

function ofTheFiscal() {
  if (db.getCollection('pis') == null) {
    var pis = db.addCollection('pis');
    let data = [
      {
        "codigo": "01",
        "descricao": "Operação Tributável com Alíquota Básica"
      },
      {
        "codigo": "02",
        "descricao": "Operação Tributável com Alíquota Diferenciada"
      },
      {
        "codigo": "03",
        "descricao": "Operação Tributável com Alíquota por Unidade de Medida de Produto"
      },
      {
        "codigo": "04",
        "descricao": "Operação Tributável Monofásica - Revenda a Alíquota Zero"
      },
      {
        "codigo": "05",
        "descricao": "Operação Tributável Por Substituição Tributária"
      },
      {
        "codigo": "06",
        "descricao": "Tributável a Alíquota Zero"
      },
      {
        "codigo": "07",
        "descricao": "Operação Isenta da Contribuição"
      },
    ];

    pis.insert(data);
    db.save();
  }

  if (db.getCollection('cofins') == null) {
    var cofins = db.addCollection('cofins');
    let data = [
      {
        "codigo": "01",
        "descricao": "Operação Tributável com Alíquota Básica"
      },
      {
        "codigo": "02",
        "descricao": "Operação Tributável com Alíquota Diferenciada"
      },
      {
        "codigo": "03",
        "descricao": "Operação Tributável com Alíquota por Unidade de Medida de Produto"
      },
      {
        "codigo": "04",
        "descricao": "Operação Tributável Monofásica - Revenda a Alíquota Zero"
      },
      {
        "codigo": "05",
        "descricao": "Operação Tributável Por Substituição Tributária"
      },
      {
        "codigo": "06",
        "descricao": "Tributável a Alíquota Zero"
      },
      {
        "codigo": "07",
        "descricao": "Operação Isenta da Contribuição"
      },
    ];

    cofins.insert(data);
    db.save();
  }
}

function ofTheSales() {
  if (db.getCollection('salesPDVTest') == null) {
    db.addCollection('salesPDVTest');
    db.save();
  }

  if (db.getCollection('caixafechado') == null) {
    let caixafechado = db.addCollection('caixafechado');
    let data = [
      {
        hora: 'x',
        dataAno: 'x',
        dataMes: 'x',
        dataDia: 'x',
        dataFullDefault: 'x',
        dataFull: 'x',
        valorNaHoraDoFechamento: 'x',
        usuario: 'x',
      }
    ];

    caixafechado.insert(data);
    db.save();
    alert('Coleção de caixafechado criada com sucesso...');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow(
    {
      width: 1300,
      height: 768,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      frame: true
    });

  mainWindow.loadFile("./app/main2.html");
  mainWindow.webContents.openDevTools()

  loginWindow = new BrowserWindow(
    {
      width: 500,
      height: 500,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    })

  loginWindow.loadFile("./app/login.html");
  loginWindow.once("ready-to-show", () => {
    loginWindow.show();
  });

  loginWindow.setMenu(null);

  companyWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 650,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  companyWindow.loadFile("./app/company.html");
}

function onMain() {
  app.on("ready", function () {
    createWindow();

    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Menu',
            click: function () {
              mainWindow.loadFile('./app/main2.html')
            },
            accelerator: 'F2'
          },
          {
            label: 'Configurações',
            click: function () {
              mainWindow.loadFile('./app/settings.html')
            },
          }
        ]
      },
      // {
      //   label: 'Cadastros',
      //   submenu: [
      //     {
      //       label: 'Clientes',
      //       click: function () {
      //         mainWindow.loadFile('./app/index.html')
      //       }
      //     },
      //     {
      //       label: 'Fornecedores',
      //       click: function () {
      //         mainWindow.loadFile('./app/fornecedores.html')
      //       }
      //     },
      //     {
      //       label: 'Vendedores',
      //       click: function () {
      //         mainWindow.loadFile('./app/produtos.html')
      //       },
      //       accelerator: 'F4'
      //     },
      //     {
      //       label: 'Transportadora',
      //       click: function () {
      //         mainWindow.loadFile('./app/fabricantes.html')
      //       }
      //     },
      //     {
      //       label: 'Vendas',
      //       click: function () {
      //         mainWindow.loadFile('./app/vendas.html')
      //       }
      //     },
      //     {
      //       label: 'Diversos',
      //       click: function () {
      //         mainWindow.loadFile('./app/empresas2.html')
      //       }
      //     },
      //     {
      //       label: 'Bancos',
      //       click: function () {
      //         mainWindow.loadFile('./app/empresas2.html')
      //       }
      //     },
      //   ]
      // },
      {
        role: 'window',
        label: 'Janela',
        submenu: [
          {
            label: 'Minimizar',
            role: 'minimize'
          },
          {
            label: 'Fechar',
            role: 'close'
          }
        ]
      },
      {
        label: 'Ajuda',
        click: function () {
          electron.shell.openExternal('http://focuxmicrosystems.co')
        }
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    globalShortcut.register('F1', () => {
      mainWindow.loadFile("./app/pdv.html");
    });

    globalShortcut.register('F2', () => {
      mainWindow.loadFile("./app/main2.html");
    });
  });

  app.on('will-quit', () => {
    globalShortcut.unregister('F1');
    globalShortcut.unregister('F2');
    globalShortcut.unregisterAll();
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });

  ipcMain.on("show-mainWindow", () => {
    loginWindow.hide();
    mainWindow.show();
    mainWindow.maximize();
  });

  ipcMain.on("show-loginWindow", () => {
    loginWindow.show();
    mainWindow.hide();
  });

  ipcMain.on("show-companyWindow", () => {
    loginWindow.hide();
    companyWindow.show();
  });

  ipcMain.on("close-app", () => {
    app.quit();
  });
}

ofTheSales();
ofTheFiscal();
loadVariables();
/*
|=====================================================
|================INICIA A APLICAÇÃO===================
|=====================================================
*/
onMain();