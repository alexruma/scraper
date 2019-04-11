const puppeteer = require('puppeteer');
const converter = require('./excel-convert')
let expiredFile=converter.result;
async function getPic() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://osbn.oregon.gov/OSBNVerification/Default.aspx');
  await page.type(nursingInputSelector, "Smith");
  await page.click("#ctl00_MainContent_btnNameSearch");
  await page.waitFor(1400);
  await page.setViewport({width: 1000, height: 1000})
  await page.screenshot({path: 'nursing.png'});

  await browser.close();
  await console.log('big puppin')
}

getPic();


let nursingInputSelector="#ctl00_MainContent_txtLastname"


resultArr=expiredFile.Sheet1;


async function physicianScraper(){
const browser = await puppeteer.launch();


for (let i=0; i< resultArr.length; i++){
let val=resultArr[i];

 if (val.G="34"){
  console.log(val.F);

  const page = await browser.newPage();
  await page.goto('https://omb.oregon.gov/clients/ormb/public/verificationrequest.aspx');
  await page.click('#optionsRadios2');
  await page.type('#tbLicense',val.K);
   await page.setViewport({width: 1000, height: 1000});
  await page.waitFor(1500);
  await page.screenshot({path: val.F+'.png'});
  await page.close();
}
}
 await browser.close();
}

physicianScraper();
