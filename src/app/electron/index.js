const { BrowserWindow, app, screen, ipcMain, dialog, ipcRenderer } = require('electron');
require('electron-reload')(__dirname);
const { channels } = require('../react/src/shared/constants');
const path = require('path');

const preloadPath = path.join(app.getAppPath(), 'app/preload.js');
const reactAppPath = './app/react/build/index.html';

let mainWindow;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const percentage = 0.8;
  const windowWidth = Math.floor(width * percentage);
  const windowHeight = Math.floor(height * percentage);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    webPreferences: {
      preload: preloadPath, contextIsolation: true, nodeIntegration: true,
    },
  });
  mainWindow.loadFile(reactAppPath).then(() => console.log('File loaded'));
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  if (!mainWindow) {
    createWindow();
  }

  // Register any ipcMain events here
  ipcMain.on(channels.OpenDirectoryDialog, async (event) => {
    console.log(channels.OpenDirectoryDialog);
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    console.log(result);
    // Send the result back to sender
    event.sender.send(channels.SelectDirectoryDialog, result.filePaths[0]);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
