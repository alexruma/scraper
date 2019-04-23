const electron = require('electron');
const url = require('url');
const path = require('path');


const {app, BrowserWindow, Menu} = electron;

let mainWindow;

//Listen for app to be ready
app.on('ready', () => {
  //Create new mainWindow
  mainWindow = new BrowserWindow({});
  //Load html into window
  mainWindow.loadURL(url.format(
    {
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true

    }
  ));
//Build menu from template

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

//Insert menu
Menu.setApplicationMenu(mainMenu);

});


//Create menu template
const mainMenuTemplate =[
  {
    label:'File',
    submenu: [
      {
        label: 'Add Item'
      },
      {
        label: 'Clear Item'
      },
      {
        label: 'Quit',
        click(){
           app.quit();
         }
      }
    ]
  }
];
