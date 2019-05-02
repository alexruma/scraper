var fs = require('fs');



const electron = require('electron');
const {remote, ipcRenderer} = electron;
const dialog = remote.dialog;

let fileName;

document.getElementById('selectFile').addEventListener('click', openFile);


//Runs when select location button is fileSelected
function openFile(){
console.log('going')
  dialog.showOpenDialog(function (fileNames) {
    if (fileNames === undefined) return;

 fileName = fileNames[0];

 fs.readFile(fileName, 'utf-8', function (err, data) {

   document.getElementById("fileValue").value = fileName;

     ipcRenderer.send('pathUpdate', fileName);
     });
  });
}
