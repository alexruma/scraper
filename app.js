const puppeteer = require('puppeteer-core');
const converter = require('./excel-convert');
const electron = require('electron');
const url = require('url');
const path = require('path');
const excelToJson = require('convert-excel-to-json');


//Electron destructure
const {app, BrowserWindow, Menu, globalShortcut, ipcMain, dialog} = electron;

process.env.NODE_ENV = 'production'

let expiredFile;
let resultArr;


//Path to Chrome on local machine. Puppeteer will utilize Chrome rather than Chromium.
let exPath2='C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'

let imagePath= __dirname + "\\images\\"

async function physicianScraper(imageFolder){


const browser = await puppeteer.launch({
executablePath: exPath2
});

//launches started popup
started();

for (let i=0; i< resultArr.length; i++){
let val=resultArr[i];
//Runs if provider is a physician or physican assistant in Oregon
 if (val.G=="34"  && val.L.includes(',OR') || val.G=='33' && val.L.includes(',OR') && val.I=='227' || val.G=='46' && val.L.includes(',OR')){

  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto('https://omb.oregon.gov/clients/ormb/public/verificationrequest.aspx');
  await page.click('#optionsRadios2');
  await page.type('#tbLicense',val.K);
  await page.waitFor(150);
  await page.click('#btnLicense')

  await page.waitFor(750);
  await page.emulateMedia('screen');
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'});

  await page.close();
}

//Runs if provider is LPC in Oregon
else if (val.G=="33"  && val.L.includes(',OR') && val.I=="372") {

  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto('https://hrlb.oregon.gov/oblpct/licenseelookup/index.asp');
  await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select');
await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select', 'LPC')
await page.waitFor(100);

  await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)', (val.K).slice(1));
  await page.waitFor(150);
  //await Promise.all([page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]'), page.waitForNavigation])
   await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]');
  //this waitForSelector ensures that the page has loaded
  await page.waitForSelector('body > a > h3', {timeout:10000}).catch(()=>{page.close();
    let uhoh;
  });
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();
}
//Runs if provider is LMFT in Oregon
else if (val.G=="33"  && val.L.includes(',OR') && val.I=="371") {

  const page = await browser.newPage();

  await page.goto('https://hrlb.oregon.gov/oblpct/licenseelookup/index.asp');
  await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select');
await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select', 'Last')
await page.waitFor(100);

  await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)', val.F.split(' ')[0]);
  await page.waitFor(150);
  await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]')
  //this waitForSelector ensures that the page has loaded
  await page.waitForSelector('body > a > h3',{timeout:10000}).catch(()=>{page.close();
    let uhoh;
  });

  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();
  }
  //Runs if provider is LCSW
  else if(val.I=='206'  && val.L.includes(',OR')){
      //format license number to remove extra character
    if (val.K.length===5){
      val.K = val.K.slice(1);
    }

    const page = await browser.newPage();
    await page.goto('https://hrlb.oregon.gov/BLSW/LicenseeLookup/index.asp');
    await page.type('body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select','license');
    await page.type('body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)',val.K);
    await page.waitFor(200);
    await page.click('body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > div > input[type="submit"]');
    await page.waitForSelector('body > a > h3');
    await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
    await page.close();
  }
//Runs if provider is nurse practicioner or CRNA
else if (val.G == "42" && val.L.includes(',OR') || val.G == "37" && val.L.includes(',OR')) {
  const page = await browser.newPage();
try {
  await page.goto('https://osbn.oregon.gov/OSBNVerification/Default.aspx');
  await page.type('#ctl00_MainContent_txtLicense', val.K);
  await page.waitFor(150);
  await page.click('#ctl00_MainContent_btnLicense');
  await page.waitForSelector('#aspnetForm > div.page > div.main > p > span > a > span');
   await page.click('#ctl00_MainContent_gvSearchResult > tbody > tr:nth-child(2) > td:nth-child(1) > a');
} catch(error) {
console.log(error)
}
  await page.waitFor(650);
  //await page.screenshot({path:imageFolder+'\\'+ val.F+'.png', fullPage: true});
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();

}
//Runs if provider is chiropractor
else if (val.G == "16" && val.L.includes(',OR')) {


    const page = await browser.newPage();
  try {
    await page.goto('https://obce.alcsoftware.com/liclookup.php');
    await page.type('body > table > tbody > tr:nth-child(3) > td.bodyContentGutter > table:nth-child(2) > tbody > tr:nth-child(3) > td > center > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]', val.K);

    await page.waitFor(150);
    await page.click('body > table > tbody > tr:nth-child(3) > td.bodyContentGutter > table:nth-child(2) > tbody > tr:nth-child(3) > td > center > table:nth-child(3) > tbody > tr > td > input[type="submit"]:nth-child(1)');




       await page.waitForSelector('body > table > tbody > tr:nth-child(3) > td.bodyContentGutter > table:nth-child(2) > tbody > tr:nth-child(2) > td > center > table > tbody > tr:nth-child(2) > td:nth-child(3) > a', {timeout:7000});
       await page.click('body > table > tbody > tr:nth-child(3) > td.bodyContentGutter > table:nth-child(2) > tbody > tr:nth-child(2) > td > center > table > tbody > tr:nth-child(2) > td:nth-child(3) > a');
       await page.waitForSelector('body > table > tbody > tr:nth-child(3) > td.bodyContentGutter > table:nth-child(2) > tbody > tr:nth-child(2) > td > center > table:nth-child(3) > tbody > tr > td > form > input[type="submit"]',{timeout:7000})
   } catch(error) {
      console.log(error)
    }

    await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
    await page.close();
}

//Runs if provider is psychologist
else if (val.G == "53" && val.L.includes(',OR') || val.G=="33" && val.I=='205') {
    const page = await browser.newPage();
    //formats license number to avoid errors when searching
    if (val.K.slice(0,1)=="0") {
    val.K=val.K.slice(1);
  }

    const navigationPromise = page.waitForNavigation();
     try {
    await page.goto('https://obpe.alcsoftware.com/liclookup.php');
    await page.type('#main-table > tbody > tr:nth-child(4) > td.bodyContentGutter > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(4) > td > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type="text"]', val.K.slice(0,4))
    await page.waitFor(150);
    await page.click('#main-table > tbody > tr:nth-child(4) > td.bodyContentGutter > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(4) > td > form > table > tbody > tr:nth-child(5) > td > input[type="Submit"]:nth-child(1)');

       await page.waitForSelector('#main-table > tbody > tr:nth-child(4) > td.bodyContentGutter > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > a');
       await page.click('#main-table > tbody > tr:nth-child(4) > td.bodyContentGutter > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > a');

       await page.waitForSelector('#main-table > tbody > tr:nth-child(4) > td.bodyContentGutter > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(4) > td > a:nth-child(20)');
     } catch(error) { console.log(error)

    }

    await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
    await page.close();
  }
  //Runs if provider is dentist
  else if (val.G == "53" && val.L.includes(',OR') && val.K.length <=6 || val.G=='17') {
  const page = await browser.newPage();

  await page.goto('https://lookup.oregondentistry.org/');
  await page.type('body > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > select','License');
  await page.type('body > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)',val.K);
  await page.waitFor(150);


  try {
  await page.click('body > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr > td > form > table > tbody > tr:nth-child(4) > td > div > input[type="submit"]');
  await page.waitForSelector('body > table > tbody > tr:nth-child(2) > td > a');
} catch(error) { let uhoh; }
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();
  }

  //Runs if provider is a physical therapist
  else if (val.G == '45'&& val.I =='420' && val.L.includes(',OR')) {
    const page = await browser.newPage();

    await page.goto('https://hrlb.oregon.gov/ptlb/licenseelookup/');
    await page.type('body > table > tbody > tr:nth-child(3) > td > div > table > tbody > tr > td:nth-child(1) > div > table > tbody > tr > td > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > select', 'Lic');
    await page.type('body > table > tbody > tr:nth-child(3) > td > div > table > tbody > tr > td:nth-child(1) > div > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > span > input[type="text"]:nth-child(1)',val.K.slice(0,5));
    await page.waitFor(200);
    await page.click('body > table > tbody > tr:nth-child(3) > td > div > table > tbody > tr > td:nth-child(1) > div > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > span > input[type="submit"]');
    await page.waitFor(200);

    try {
    await page.waitForSelector('body > a > h3',{timeout:10000});
  } catch(error){ console.log(error) }
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();
  }
  //Runs if provider is an occupational therapist
  else if (val.G == '45'&& val.I =='390' && val.L.includes(',OR')) {
    const page = await browser.newPage();

    await page.goto('https://hrlb.oregon.gov/otlb/licenseelookup/');

    await page.type('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input[type="text"]:nth-child(1)', val.F);
    await page.waitFor(250);
    await page.click('body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > form > table > tbody > tr:nth-child(3) > td > div > input[type="submit"]');

    try {
    await page.waitForSelector('body > a > h3');
  } catch(error) {console.log(error)}
  await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4'})
  await page.close();
  }

  //Runs if provider is a CADC
  else if( val.I=='004' || val.I=='002') {
    const page = await browser.newPage();
    let nameArr = val.F.split(',');


    const last = nameArr[0];
    const first = nameArr[1];

    await page.goto('https://www.mhacbo.org/en/registry/');
    await page.type('#cbParamVirtual2', last);
    await page.type('#cbParamVirtual1', first);
    await page.waitFor(450);
    await page.click('#Submit');
    await page.waitFor(2100);
    await page.emulateMedia('screen');
    await page.setViewport({ width: 1900, height: 1000})
    await page.emulateMedia('screen');
    await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4', printBackground: true});

    await page.close();
  }

  //Runs if provider is an optometrist
  else if(val.G=='43' && val.L.includes(',OR')){
    const page = await browser.newPage();
    await page.goto('https://obo.openregulate.com/webs/obo/register/');
    let licenseNumber = val.K.split('');
    let pruneLicense = licenseNumber.map((val)=>{
      if (isNaN(val) === false){
        return val;
      }
    })
    pruneLicense = pruneLicense.join('')
    await page.type('#keywords', pruneLicense);

    await page.waitFor(250);
    await page.click('body > div.container > div > form > div:nth-child(2) > div > div > div > button > i');
    await page.waitFor(850);
    try {
      await page.waitForSelector('body > div.container > div > div:nth-child(2) > div > div > div.row > div > div.pull-right > a',{timeout:5000});
        await page.click('body > div.container > div > div:nth-child(2) > div > div > table > tbody > tr > td:nth-child(6) > a');
    } catch(error) { console.log(error)}
    await page.waitFor(850);
    await page.setViewport({ width: 2400, height: 1000})
    await page.emulateMedia('screen');
    await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4', printBackground: true});

    await page.close();
  }
  // Runs for BCBA
  else if(val.I=='376' && val.L.includes(',OR')){
    if (val.K.length>9){
      let len=val.K.length-8;
      val.K=val.K.slice(len);
      ;
    }
    const page = await browser.newPage();
    try {
    await page.goto('https://elite.hlo.state.or.us/OHLOPublicR/LPRBrowser.aspx');
    await page.type('#CPH1_txtsrcLicenseNo',val.K);
    await page.waitFor(150);
    await page.click('#CPH1_btnGoFind');

      await page.waitForSelector('#CPH1_myDataGrid > tbody > tr.GridItemStyle > td:nth-child(3) > a');
      await page.click('#CPH1_myDataGrid > tbody > tr.GridItemStyle > td:nth-child(3) > a');


    } catch(error){ console.log(error) }
    await page.setViewport({ width: 2200, height: 1000})
    await page.emulateMedia('screen');
    await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4', printBackground: true});


    await page.close();
  }
  //Runs for Dietians
  else if(val.I=='326' && val.L.includes(',OR')){
    if (val.K.length>9){
      let len=val.K.length-8;
      val.K=val.K.slice(len);

    }
    const page = await browser.newPage();
  try {
    await page.goto('https://elite.hlo.state.or.us/OHLOPublicR/LPRBrowser.aspx');
    await page.type('#CPH1_txtsrcLicenseNo',val.K);
    await page.waitFor(150);
    await page.click('#CPH1_btnGoFind');

      await page.waitForSelector('#CPH1_myDataGrid > tbody > tr.GridItemStyle > td:nth-child(3) > a');
      await page.click('#CPH1_myDataGrid > tbody > tr.GridItemStyle > td:nth-child(3) > a');


    } catch(error){ console.log(error) }

    await page.setViewport({ width: 1900, height: 1000})
    await page.emulateMedia('screen');
    await page.pdf({path:imageFolder+'\\'+ val.F+'.pdf', format: 'A4', printBackground: true});

    await page.close();
  }
}



await browser.close();
await allDone();
}




//Converts excel to JSON and calls scraper function.
function fileSelect(fileName, outputFolder){
  console.log('fileSelected');
 expiredFile = excelToJson({
    sourceFile: fileName
});

resultArr=expiredFile.Sheet1;
physicianScraper(outputFolder);
};

//Updates path to Chrome app on user's machine

function chromePathUpdate(newPath){
  exPath2=newPath;
}

//Catch pathUpdate

ipcMain.on('pathUpdate', (e, newPath) => {
  chromePathUpdate(newPath);
});

//Catch path-select button clicked
ipcMain.on('pathSelectRun', () => {
  chromeSelectPopup();
});
//Catch fileNameSent
ipcMain.on('fileNameSent', (e, fileName, outputFolder) => {
  //console.log('file name sent caught')
  fileSelect(fileName, outputFolder);
});


//Catch  pleaseSelectTrigger
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

ipcMain.on('fileSelected', () => {
  console.log('ipc running')

});

//catch help button clicked
ipcMain.on('helpButtonClick' ,() =>{
  helpMe();
});

//Process started popup
function started(){
    let startedWindow = new BrowserWindow({
      width: 250,
      height: 150,
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

//Help button popup
function helpMe(){
  let helpWindow = new BrowserWindow({
    width:500,
    height: 570,
    title: 'Help'
  });
  helpWindow.loadURL(url.format(
    {
      pathname: path.join(__dirname, '.\\HTML-and-scripts\\helpWindow.html'),
      protocol: 'file',
      slashes: true
    }
  ));


//Garbage Collection
helpWindow.on('close', function(){
  helpWindow =null;
});
};



function chromeSelectPopup(){
  let chromeWindow = new BrowserWindow({
    width:500,
    height: 570,
    title: 'Help'
  });
  chromeWindow.loadURL(url.format(
    {
      pathname: path.join(__dirname, '.\\HTML-and-scripts\\chromeSelect.html'),
      protocol: 'file',
      slashes: true
    }
  ));


//Garbage Collection
chromeWindow.on('close', function(){
  chromeWindow =null;
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
