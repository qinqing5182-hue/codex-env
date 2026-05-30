const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopPet', {
  startDrag(pointerOffset) {
    ipcRenderer.send('pet:drag-start', pointerOffset);
  },
  endDrag() {
    ipcRenderer.send('pet:drag-end');
  },
  quit() {
    ipcRenderer.send('pet:quit');
  },
});
