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





async function physicianScraper(imageFolder){
const browser = await puppeteer.launch();
started();


for (let i=0; i< resultArr.length; i++){
let val=resultArr[i];
//Runs if provider is a physician in Oregon
 if (val.G=="34"  && val.L.includes(',OR')){


  const page = await browser.newPage();
  await page.goto('https://omb.oregon.gov/clients/ormb/public/verificationrequest.aspx');
  await page.click('#optionsRadios2');
  await page.type('#tbLicense',val.K);
  await page.waitFor(150);
  await page.click('#btnLicense')
   // await page.setViewport({width: 1000, height: 1000});
  await page.waitFor(750);
  await page.emulateMedia('screen');
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'});
  //await page.screenshot({path:imageFolder+'\\'+ val.F+'.png', fullPage: true});
  await page.close();
}

//Runs if provider is LPC in Oregon
else if (val.G=="33"  && val.L.includes(',OR') && val.I=="372") {

  const page = await browser.newPage();
  await page.goto('https://hrlb.oregon.gov/oblpct/licenseelookup/index.asp');
  await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select');
await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select', 'LPC')
await page.waitFor(100);

  await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)', (val.K).slice(1));
  await page.waitFor(250);
  await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]')
  await page.waitFor(650);
  //await page.screenshot({path:imageFolder+'\\'+ val.F+'.png', fullPage: true});
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();
}
//Runs if provider is LMFT in Oregon
else if (val.G=="33"  && val.L.includes(',OR') && val.I=="371") {

  const page = await browser.newPage();
  await page.goto('https://hrlb.oregon.gov/oblpct/licenseelookup/index.asp');
  await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select');
await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select', 'LPC')
await page.waitFor(100);

  await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)', (val.K).slice(1));
  await page.waitFor(250);
  await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]')
  await page.waitFor(650);
  //await page.screenshot({path:imageFolder+'\\'+ val.F+'.png', fullPage: true});
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();
  }
//Runs if provider is nurse practicioner
else if (val.G == "42" && val.L.includes(',OR')) {
  const page = await browser.newPage();
  await page.goto('https://osbn.oregon.gov/OSBNVerification/Default.aspx');
  await page.type('#ctl00_MainContent_txtLicense', val.K);
  await page.waitFor(150);
  await page.click('#ctl00_MainContent_btnLicense');
  await page.waitFor(450);
  await page.click('#ctl00_MainContent_gvSearchResult > tbody > tr:nth-child(2) > td:nth-child(1) > a');
  await page.waitFor(550);
  //await page.screenshot({path:imageFolder+'\\'+ val.F+'.png', fullPage: true});
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();

}
//Runs if provider is chiropractor
if (val.G == "16" && val.L.includes(',OR')) {
    const page = await browser.newPage();
    await page.goto('https://obce.alcsoftware.com/liclookup.php');
    await page.type('body > table > tbody > tr:nth-child(3) > td.bodyContentGutter > table:nth-child(2) > tbody > tr:nth-child(3) > td > center > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]', val.K)
    await page.waitFor(150);
    await page.click('body > table > tbody > tr:nth-child(3) > td.bodyContentGutter > table:nth-child(2) > tbody > tr:nth-child(3) > td > center > table:nth-child(3) > tbody > tr > td > input[type="submit"]:nth-child(1)');
    await page.waitFor(450);
    await page.click('body > table > tbody > tr:nth-child(3) > td.bodyContentGutter > table:nth-child(2) > tbody > tr:nth-child(2) > td > center > table > tbody > tr:nth-child(2) > td:nth-child(3) > a');
    await page.waitFor(550);
    await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
    await page.close();
}

}
await browser.close();
await allDone();
}

//test catch
// ipcMain.on('testSend', (e, fileName) => {
//   console.log('ipc test running');
//   console.log(fileName);
// }
// );



function fileSelect(fileName, outputFolder){
  console.log('fileSelected');
 expiredFile = excelToJson({
    sourceFile: fileName
});

resultArr=expiredFile.Sheet1;
physicianScraper(outputFolder);
}

//catch fileNameSent
ipcMain.on('fileNameSent', (e, fileName, outputFolder) => {
  fileSelect(fileName, outputFolder);
});


//Catch please select pleaseSelectTrigger
ipcMain.on('pleaseSelectTrigger', () => {
  let pleaseSelectWindow = new BrowserWindow({
  width: 300,
  height: 220,
  title: "Error"
});
 pleaseSelectWindow.loadURL(url.format(
  {
    pathname: path.join(__dirname, '.\\HTML-and-scripts\\pleaseSelectWindow.html'),
    protocol: 'file',
    slashes: true

  }
));
//Garbage Collection
pleaseSelectWindow.on('close', function(){
  pleaseSelectWindow =null;
});
})


//catch fileSelected

ipcMain.on('fileSelected', ()=> {
  console.log('ipc running')

});

//Process started popup
function started(){
    let startedWindow = new BrowserWindow({
      width: 250,
      height: 200,
      title: "Error"
    });
    startedWindow.loadURL(url.format(
      {
    pathname: path.join(__dirname, '.\\HTML-and-scripts\\startedWindow.html'),
    protocol: 'file',
    slashes: true

    }
  ));
  //Garbage Collection
  startedWindow.on('close', function(){
      startedWindow =null;
    });
  };

//All done popup.
function allDone(){
    let allDoneWindow = new BrowserWindow({
      width: 200,
      height: 120,
      title: "Error"
    });
    allDoneWindow.loadURL(url.format(
      {
    pathname: path.join(__dirname, '.\\HTML-and-scripts\\allDoneWindow.html'),
    protocol: 'file',
    slashes: true

    }
  ));
//Garbage Collection
allDoneWindow.on('close', function(){
    allDoneWindow =null;
  });
};



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
