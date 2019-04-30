var fs = require('fs');



const electron = require('electron');
const {remote, ipcRenderer} = electron;
const dialog = remote.dialog;

let fileName;
let outputFolder;


document.getElementById('openFile').addEventListener('click', openFile);
document.getElementById('outputFolderSelect').addEventListener('click', selectOutput);
document.getElementById('run-btn').addEventListener('click', run);
document.getElementById('help-btn').addEventListener('click', help);



//Runs when Select Provider Roster button is clicked.
 function openFile(){

   dialog.showOpenDialog(function (fileNames) {
     if (fileNames === undefined) return;

  fileName = fileNames[0];

  fs.readFile(fileName, 'utf-8', function (err, data) {

    document.getElementById("fileValue").value = fileName;

      //ipcRenderer.send('testSend', fileName);
      });
   });
 }
//Runs when Select Output Folder button is clicked.
 function selectOutput(){
   console.log('hey2!')

   dialog.showOpenDialog({properties:['openDirectory']},function (fileNames) {
     if (fileNames === undefined) return;

  outputFolder = fileNames[0];

    document.getElementById("outputFolderField").value = outputFolder;

   });
 }

 function run(){
   if (document.getElementById("outputFolderField").value ==='' || document.getElementById("fileValue").value ===''){
      return ipcRenderer.send('pleaseSelectTrigger');
   }

   ipcRenderer.send('fileNameSent', fileName, outputFolder);
 }

 function help(){
   ipcRenderer.send('helpButtonClick');
 }
