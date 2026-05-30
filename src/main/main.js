const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

const WINDOW_SIZE = 220;
const DRAG_TICK_MS = 16;

let petWindow;
let dragState = null;
let dragTimer = null;

function createPetWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  petWindow = new BrowserWindow({
    width: WINDOW_SIZE,
    height: WINDOW_SIZE,
    x: width - WINDOW_SIZE - 48,
    y: height - WINDOW_SIZE - 48,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    skipTaskbar: true,
    hasShadow: false,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  petWindow.setAlwaysOnTop(true, 'screen-saver');
  petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  petWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));

  petWindow.on('closed', () => {
    stopDrag();
    petWindow = null;
  });
}

function clampToDisplay(bounds) {
  const cursorPoint = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(cursorPoint);
  const workArea = display.workArea;

  return {
    x: Math.min(Math.max(bounds.x, workArea.x), workArea.x + workArea.width - bounds.width),
    y: Math.min(Math.max(bounds.y, workArea.y), workArea.y + workArea.height - bounds.height),
    width: bounds.width,
    height: bounds.height,
  };
}

function stopDrag() {
  dragState = null;
  if (dragTimer) {
    clearInterval(dragTimer);
    dragTimer = null;
  }
}

function beginDrag(pointerOffset) {
  if (!petWindow || petWindow.isDestroyed()) {
    return;
  }

  dragState = {
    offsetX: pointerOffset.offsetX,
    offsetY: pointerOffset.offsetY,
  };

  if (dragTimer) {
    return;
  }

  dragTimer = setInterval(() => {
    if (!petWindow || petWindow.isDestroyed() || !dragState) {
      stopDrag();
      return;
    }

    const cursor = screen.getCursorScreenPoint();
    const currentBounds = petWindow.getBounds();
    const nextBounds = clampToDisplay({
      x: Math.round(cursor.x - dragState.offsetX),
      y: Math.round(cursor.y - dragState.offsetY),
      width: currentBounds.width,
      height: currentBounds.height,
    });

    petWindow.setBounds(nextBounds, false);
  }, DRAG_TICK_MS);
}

app.whenReady().then(() => {
  createPetWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createPetWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('pet:drag-start', (_event, pointerOffset) => beginDrag(pointerOffset));
ipcMain.on('pet:drag-end', stopDrag);
ipcMain.on('pet:quit', () => app.quit());
