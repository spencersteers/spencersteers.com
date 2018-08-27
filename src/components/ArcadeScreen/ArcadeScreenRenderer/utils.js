export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function convertRange(value, oldMin, oldMax, newMin, newMax) {
  return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}
function lineStart(numLines, lineHeight) {
  var totalHeight = (numLines - 1) * lineHeight;
  return totalHeight - totalHeight / 2
}
