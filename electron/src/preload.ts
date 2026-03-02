import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveLocal: (id: string, data: any) => ipcRenderer.send('save-local', { id, data }),
  getLocal: () => ipcRenderer.send('get-local'),
  onLocalResponse: (callback: any) => ipcRenderer.on('save-local-response', (event, arg) => callback(arg)),
  onGetLocalResponse: (callback: any) => ipcRenderer.on('get-local-response', (event, arg) => callback(arg)),
});
