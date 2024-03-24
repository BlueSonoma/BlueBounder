const { contextBridge, ipcRenderer } = require('electron');
const { channels } = require('./react/src/shared/constants');

/**Place any functions or variables to be accessed outside of React
@example
 // App.jsx
 import { electron } = window
 export function App() {
    useEffect(() => {
      // Attach a listener to be notified of ipcRenderer messages
      window.addEventListener('message', (event) => {
        if (event.data.type === channels.SelectDirectoryDialog) {
          console.log(event.data.path);
        }
      });
      return () => {
        window.removeEventListener('message', (event) => {
          if (event.data.type === channels.SelectDirectoryDialog) {
            console.log(event.data.path);
          }
        });
      };
    }, []);
    ...
    function onClick() {
      // Call the function
      electron.openDirectoryDialog();
    }
*/

contextBridge.exposeInMainWorld('electron', {
  openDirectoryDialog: () => ipcRenderer.send(channels.OpenDirectoryDialog),
});

// Register any 'on' events to send back to React
process.once('loaded', () => {
  try {
    ipcRenderer.on(channels.SelectDirectoryDialog, (event, path) => {
      console.log(channels.SelectDirectoryDialog, path);
      window.postMessage({ type: channels.SelectDirectoryDialog, path: path });
    });
  } catch (e) {
    console.log(e);
  }
});


