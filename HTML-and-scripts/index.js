var fs = require('fs');


 //var dialog = remote.require('dialog');
const electron = require('electron');
const {remote, ipcRenderer} = electron;
const dialog = remote.dialog;



document.getElementById('openFile').addEventListener('click', openFile);

 function openFile () {
   console.log('hey!')

   dialog.showOpenDialog(function (fileNames) {
     if (fileNames === undefined) return;

  var fileName = fileNames[0];

  fs.readFile(fileName, 'utf-8', function (err, data) {

    document.getElementById("fileValue").value = fileName;

    ipcRenderer.send('fileNameSent', fileName);
      //ipcRenderer.send('testSend', fileName);


  });

   });

 }
