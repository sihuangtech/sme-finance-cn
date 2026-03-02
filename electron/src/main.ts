import { app, BrowserWindow, ipcMain, session } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';
import * as sqlite3 from 'sqlite3';

let mainWindow: BrowserWindow | null;
let db: sqlite3.Database;

const dbPath = path.join(app.getPath('userData'), 'local_cache.sqlite');
db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Local DB open error', err);
  else {
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      data TEXT,
      synced INTEGER DEFAULT 0
    )`);
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../../frontend/dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('save-local', (event, { id, data }) => {
  db.run('INSERT OR REPLACE INTO transactions (id, data, synced) VALUES (?, ?, 0)', [id, JSON.stringify(data)], (err) => {
    event.reply('save-local-response', { success: !err });
  });
});

ipcMain.on('get-local', (event) => {
  db.all('SELECT * FROM transactions WHERE synced = 0', [], (err, rows) => {
    event.reply('get-local-response', rows);
  });
});
