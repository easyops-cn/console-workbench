/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  dialog
} from 'electron';
import path from 'path';
import MenuBuilder from './menu';

let mainWindow = null;
let tray = null;
let showExitPrompt = true;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const taskPidSet = new Set();

ipcMain.on('addSubprocess', (e, pid) => {
  taskPidSet.add(pid);
  // Show current running tasks count beside tray
  tray.setTitle(taskPidSet.size.toString());
});

ipcMain.on('removeSubprocess', (e, pid) => {
  taskPidSet.delete(pid);
  tray.setTitle(taskPidSet.size.toString());
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Manually close pending task
  taskPidSet.forEach(taskPid => {
    process.kill(-taskPid);
  });

  app.quit();
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('close', e => {
    if (taskPidSet.size > 0 && showExitPrompt) {
      e.preventDefault();
      dialog.showMessageBox(
        {
          type: 'question',
          title: 'Confirm',
          message: 'There are running jobs, stop them and quit?',
          buttons: ['Stop and Quit', 'Cancel']
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            showExitPrompt = false;
            mainWindow.close();
          }
        }
      );
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  const trayIcon = nativeImage.createFromPath(
    path.join(__dirname, './assets/tray.png')
  );
  tray = new Tray(trayIcon);
  tray.setTitle('0');

  tray.on('click', () => {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    } else if (!mainWindow.isFocused()) {
      mainWindow.focus();
    }
  });
});
