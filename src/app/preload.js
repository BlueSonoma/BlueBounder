const { ipcRenderer } = require('electron');
const { channels } = require('../react/src/shared/constants');

process.once('loaded', () => {
  window.addEventListener('message', event => {
    console.log(event.data.type);
    if (event.data.type === channels.OpenDirectoryDialog) {
      ipcRenderer.send(channels.OpenDirectoryDialog);
    }
  });
});

