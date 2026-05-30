import { petManifest } from '../pet/manifest.js';

const stage = document.querySelector('#petStage');
const sprite = document.querySelector('#petSprite');
const expressionPill = document.querySelector('#expressionPill');

let currentExpression = petManifest.defaultExpression;
let expressionTimer;
let isDragging = false;

function randomBetween([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseNextExpression() {
  const choices = petManifest.expressions.filter((expression) => expression.id !== currentExpression);
  return choices[Math.floor(Math.random() * choices.length)];
}

function setExpression(expression) {
  currentExpression = expression.id;
  sprite.src = expression.asset;
  sprite.alt = `${petManifest.displayName} ${expression.label.toLowerCase()} expression`;
  expressionPill.textContent = expression.label;

  sprite.classList.remove('expression-pop');
  window.requestAnimationFrame(() => sprite.classList.add('expression-pop'));
}

function scheduleExpressionSwap() {
  window.clearTimeout(expressionTimer);
  expressionTimer = window.setTimeout(() => {
    setExpression(chooseNextExpression());
    scheduleExpressionSwap();
  }, randomBetween(petManifest.randomExpressionIntervalMs));
}

function pointerOffset(event) {
  const rect = stage.getBoundingClientRect();
  return {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  };
}

function startDrag(event) {
  if (event.button !== 0) {
    return;
  }

  isDragging = true;
  stage.classList.add('dragging');
  stage.setPointerCapture(event.pointerId);
  window.desktopPet.startDrag(pointerOffset(event));
}

function endDrag(event) {
  if (!isDragging) {
    return;
  }

  isDragging = false;
  stage.classList.remove('dragging');

  if (stage.hasPointerCapture(event.pointerId)) {
    stage.releasePointerCapture(event.pointerId);
  }

  window.desktopPet.endDrag();
}

function quitFromKeyboard(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'q') {
    window.desktopPet.quit();
  }
}

stage.addEventListener('pointerdown', startDrag);
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);
stage.addEventListener('lostpointercapture', () => {
  if (isDragging) {
    isDragging = false;
    stage.classList.remove('dragging');
    window.desktopPet.endDrag();
  }
});
window.addEventListener('keydown', quitFromKeyboard);

setExpression(petManifest.expressions.find((expression) => expression.id === petManifest.defaultExpression));
scheduleExpressionSwap();
