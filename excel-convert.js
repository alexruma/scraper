const excelToJson = require('convert-excel-to-json');
const electron = require('electron');
const {remote, ipcRenderer, ipcMain} = electron;

const exportTest="exported"
let result;

//catch fileName
// ipcMain.on('fileNameSent', (e, fileName) => {
//   fileSelect(fileName);
// })



function fileSelect(fileName){
  console.log('fileSelect');
 result = excelToJson({
    sourceFile: fileName
});

sendRenderer();

};

// function sendRenderer(){
//   ipcRenderer.send('fileSelected');
// }
// let test =result.Sheet1[5].F;
// let space =/ /gi;
// test=test.replace(space,'');



exports.result=result;
exports.exportTest=exportTest
