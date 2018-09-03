export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function convertRange(value, oldMin, oldMax, newMin, newMax) {
  return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

export function waitUntilReady(func) {
  let _isReady = false;
  let waitArgs;
  let waitThis;

  const waiting = function(...args) {
    waitArgs = args;
    waitThis = this;

    if (_isReady) {
      func.apply(waitThis, waitArgs);
    }
  };

  function ready() {
    _isReady = true;
    if (waitArgs && waitThis) func.apply(waitThis, waitArgs);
  }

  function isReady() {
    return _isReady;
  }

  waiting.ready = ready;
  waiting.isReady = isReady;
  return waiting;
}

export function positionInSphere(radius, minimum = 0) {
  let dir = Math.random() * 2 - 1;
  return dir * (radius - minimum) + Math.sign(dir) * minimum;
}
