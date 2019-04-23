const puppeteer = require('puppeteer');
const converter = require('./excel-convert');
const electron = require('electron');
const url = require('url');
const path = require('path');
const excelToJson = require('convert-excel-to-json');

//Electron destructure
const {app, BrowserWindow, Menu, globalShortcut, ipcMain, dialog} = electron;


let expiredFile;
let resultArr;

async function getPic() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://osbn.oregon.gov/OSBNVerification/Default.aspx');
  await page.type(nursingInputSelector, "Johnson");
  await page.click("#ctl00_MainContent_btnNameSearch");
  await page.waitFor(1400);
  await page.setViewport({width: 1000, height: 1000})
  await page.screenshot({path: 'nursing.png'});

  await browser.close();
  await console.log('big puppin')
}

//getPic();

const imagePath = __dirname + "\\images\\"
let nursingInputSelector="#ctl00_MainContent_txtLastname";





async function physicianScraper(){
const browser = await puppeteer.launch();


for (let i=0; i< resultArr.length; i++){
let val=resultArr[i];

 if (val.G=="34"  && val.M.includes('OR')){
  console.log(val.M);

  const page = await browser.newPage();
  await page.goto('https://omb.oregon.gov/clients/ormb/public/verificationrequest.aspx');
  await page.click('#optionsRadios2');
  await page.type('#tbLicense',val.K);
  await page.waitFor(150);
  await page.click('#btnLicense')
   // await page.setViewport({width: 1000, height: 1000});
  await page.waitFor(700);
  await page.screenshot({path:imagePath+ val.F+'.png', fullPage: true});
  await page.close();
}
}
 await browser.close();
}

//test catch
// ipcMain.on('testSend', (e, fileName) => {
//   console.log('ipc test running');
//   console.log(fileName);
// }
// );



function fileSelect(fileName){
  console.log('fileSelected');
 expiredFile = excelToJson({
    sourceFile: fileName
});

resultArr=expiredFile.Sheet1;
physicianScraper();
}

//catch fileNameSent
ipcMain.on('fileNameSent', (e, fileName) => {
  fileSelect(fileName);
})


//catch fileSelected

ipcMain.on('fileSelected', ()=> {
  console.log('ipc running')
//  physicianScraper();
});
//physicianScraper();




//ElectronJS stuff


let mainWindow;

//Listen for app to be ready
app.on('ready', () => {
  //Create new mainWindow
  mainWindow = new BrowserWindow({});
  //Load html into window
  mainWindow.loadURL(url.format(
    {
      pathname: path.join(__dirname, '.\\HTML-and-scripts\\index.html'),
      protocol: 'file',
      slashes: true

    }
  ));

  mainWindow.on('closed', () => {
  app.quit();
})
  globalShortcut.register('CommandOrControl+Q', () => {
   // Do stuff when Q and either Command/Control is pressed.
   app.quit();
 });

//Build menu from template

const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

//Insert menu
Menu.setApplicationMenu(mainMenu);

});

const mainMenuTemplate =[
  {
    label:'File',
    submenu: [


      {
        label: 'Quit',
        acclerator:
        'Ctrl+Q',
        click(){
           app.quit();
         }
      },
      // {
      //   label: "Dialog",
      //   click(){
      //     createDiaglogWindow();
      //   }
      // }

    ]
  }
];


//If OS is Mac
if(process.platform =='darwin'){
  mainMenuTemplate.unshift({})
}

//Add dev tools item if not in production
if(process.env.NODE_ENV != "production"){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
      label: 'Toggle DevTools',
      click(item, focusedWindow){
        focusedWindow.toggleDevTools();
      }
    },
    {
    role: 'reload'
  }
    ]
  })
}
