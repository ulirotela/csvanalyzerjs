const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
var ipc = require('electron').ipcMain;

const csv = require('fast-csv');
const fs = require('fs');

var mainWindow = null

ipc.on('close-main-window', ()=> {
  app.quit();
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipc.on('open-file-dialog-for-file', (event) => {

  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: 'CSV Files', extensions: ['csv']}
    ]
  }).then(files => {
    if (!files.canceled && files.filePaths.length > 0) {

      // reading contents of csv file

      try {

        // reading the csv data from the user
        var csvFileData = [];
        fs.createReadStream(files.filePaths[0])
          .pipe(csv.parse({ headers: true }))
          .on('error', error => console.error(error))
          .on('data', row => {
            csvFileData.push(row);
          })
          .on('end', (rowCount) => {

            console.log(`Parsed ${rowCount} rows`);
            
            // Sending the data to the renderer process
            event.sender.send('selected-file', {
              path: files.filePaths[0],
              data: csvFileData
            });

          });
          

      }
      catch (e) {
        console.log('Error in reading file', e);
      }

    }
  });

});