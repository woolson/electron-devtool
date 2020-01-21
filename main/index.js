import { app, BrowserWindow, ipcMain } from 'electron'

let mainWindow

function createWindow () {
  const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9008`
  : `file://${__dirname}/index.html`
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 650,
    height: 600,
  })
  // Load page
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    ipcMain.removeAllListeners()
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})