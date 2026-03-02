import api from './api';

const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;

export const syncOfflineData = async () => {
  if (!isElectron) return;

  const { ipcRenderer } = window.require('electron');

  ipcRenderer.send('get-local');
  ipcRenderer.once('get-local-response', async (event, rows) => {
    for (const row of rows) {
      try {
        const data = JSON.parse(row.data);
        await api.post('/transactions', data);
        // Mark as synced or delete in real world
      } catch (error) {
        console.error('Sync error', error);
      }
    }
  });
};

export const saveToLocalIfOffline = (data: any) => {
  if (!isElectron) return false;

  if (!navigator.onLine) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.send('save-local', { id: Date.now().toString(), data });
    return true;
  }
  return false;
};
