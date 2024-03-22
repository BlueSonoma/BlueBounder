const { BrowserWindow, app, screen } = require('electron');
require('electron-reload')(__dirname);

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const percentage = 0.8;
  const windowWidth = Math.floor(width * percentage);
  const windowHeight = Math.floor(height * percentage);

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'default',
    autoHideMenuBar: true,
  });
  win.loadFile('./app/react/build/index.html').then(() => console.log('File loaded'));
  win.webContents.openDevTools();
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
