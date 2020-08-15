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

ofTheSales();
ofTheFiscal();

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

  salesWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1250,
      height: 650,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  salesWindow.loadFile("./app/sales.html");

  notesWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 530,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  notesWindow.loadFile("./app/notes.html");

  nfcesWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 530,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  nfcesWindow.loadFile("./app/nfces.html");

  clientsWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 600,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  clientsWindow.loadFile("./app/clients.html");

  productsWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 730,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  productsWindow.loadFile("./app/products.html");

  outfittersWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 530,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  outfittersWindow.loadFile("./app/outfitters.html");

  producersWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 530,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  producersWindow.loadFile("./app/producers.html");

  fiscalsWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 530,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  fiscalsWindow.loadFile("./app/fiscals.html");

  nfeWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 720,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  nfeWindow.loadFile("./app/nfe.html");

  reportsWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      width: 1200,
      height: 720,
      icon: __dirname + "/assets/ico.ico",
      show: false,
      resizable: false,
      frame: false
    });

  reportsWindow.loadFile("./app/reports.html");
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
            mainWindow.loadFile('./app/configuracoes.html')
          },
        }
      ]
    },
    {
      label: 'Cadastros',
      submenu: [
        {
          label: 'Clientes',
          click: function () {
            mainWindow.loadFile('./app/index.html')
          }
        },
        {
          label: 'Fornecedores',
          click: function () {
            mainWindow.loadFile('./app/fornecedores.html')
          }
        },
        {
          label: 'Vendedores',
          click: function () {
            mainWindow.loadFile('./app/produtos.html')
          },
          accelerator: 'F4'
        },
        {
          label: 'Transportadora',
          click: function () {
            mainWindow.loadFile('./app/fabricantes.html')
          }
        },
        {
          label: 'Vendas',
          click: function () {
            mainWindow.loadFile('./app/vendas.html')
          }
        },
        {
          label: 'Diversos',
          click: function () {
            mainWindow.loadFile('./app/empresas2.html')
          }
        },
        {
          label: 'Bancos',
          click: function () {
            mainWindow.loadFile('./app/empresas2.html')
          }
        },
      ]
    },
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
}

onMain();

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

ipcMain.on("show-mainWindow2", () => {
  companyWindow.hide();
  mainWindow.show();
});

ipcMain.on("show-salesWindow", () => {
  salesWindow.show();
});

ipcMain.on("close-app", () => {
  app.quit();
});

ipcMain.on("show-notesWindow", () => {
  notesWindow.show();
});

ipcMain.on("show-nfcesWindow", () => {
  nfcesWindow.show();
});

ipcMain.on("show-clientsWindow", () => {
  clientsWindow.show();
});

ipcMain.on("show-productsWindow", () => {
  productsWindow.show();
});

ipcMain.on("show-outfittersWindow", () => {
  outfittersWindow.show();
});

ipcMain.on("show-producersWindow", () => {
  producersWindow.show();
});

ipcMain.on("show-fiscalsWindow", () => {
  fiscalsWindow.show();
});

ipcMain.on("show-nfeWindow", () => {
  nfeWindow.show();
});

ipcMain.on("show-reportsWindow", () => {
  reportsWindow.show();
});