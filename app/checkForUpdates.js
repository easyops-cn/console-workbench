/**
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 */
import { dialog, shell } from 'electron';
import { autoUpdater } from 'electron-updater';

let updater;
autoUpdater.autoDownload = false;

autoUpdater.on('error', error => {
  dialog.showErrorBox(
    'Error: ',
    error == null ? 'unknown' : (error.stack || error).toString()
  );
});

autoUpdater.on('update-available', info => {
  dialog.showMessageBox(
    {
      type: 'info',
      title: 'Found Updates',
      message:
        process.platform === 'darwin'
          ? `Found updates ${info.version}, do you want to download now?`
          : 'Found updates, do you want to update now?',
      buttons: ['Sure', 'No']
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        if (process.platform === 'darwin') {
          shell.openExternal(
            `https://github.com/easyops-cn/console-workbench/releases/download/v${
              info.version
            }/${info.path}`
          );
        } else {
          autoUpdater.downloadUpdate();
        }
      } else {
        updater.enabled = true;
        updater = null;
      }
    }
  );
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  });
  updater.enabled = true;
  updater = null;
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(
    {
      title: 'Install Updates',
      message: 'Updates downloaded, application will be quit for update...'
    },
    () => {
      setImmediate(() => autoUpdater.quitAndInstall());
    }
  );
});

// export this to MenuItem click callback
export const checkForUpdates = menuItem => {
  updater = menuItem;
  updater.enabled = false;
  autoUpdater.checkForUpdates();
};
