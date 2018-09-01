import { Detector } from 'three-full';
import wrap from 'lodash/get';
import ArcadeScreenRenderer from './ArcadeScreenRenderer';
import { clamp, getRandomRange, convertRange, waitUntilReady } from './utils';

export default class ArcadeScreen {
  constructor() {

    this.aspectRatio = 3 / 4;
    this.mount = waitUntilReady(this.mount);
    this.onReady = waitUntilReady(this.onReady);
    setTimeout(() => {
      if (!Detector.webgl) {
        console.log("Browser does not support webgl.");
        return;
      }

      this.arcadeScreenRenderer = new ArcadeScreenRenderer(this.aspectRatio);
      this.arcadeScreenRenderer
        .getCanvasElement()
        .addEventListener('mousemove', this.handleMouseMove, false);
      this.mount.ready();
    });

    // mouse position over canvas normalized to -1 and 1

    this._fadeInCanvas = true;
    this._normalizedMouseX = 0;
    this._normalizedMouseY = 0;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.animate = this.animate.bind(this);
  }

  nextPallette() {
    console.log('nextPallette');
  }

  previousPallette() {
    console.log('previousPallette');
  }

  mount(rootElement, width, height, onMounted) {
    console.log('this', this);
    let canvas = this.arcadeScreenRenderer.getCanvasElement();

    if (canvas.parentElement) console.error('ArcadeScreen is already mounted!');

    if (this._fadeInCanvas) {
      this._fadeInCanvas = false;
    }

    this.arcadeScreenRenderer.setSize(width, height);
    rootElement.append(this.arcadeScreenRenderer.getCanvasElement());
    this.animate(0);
    onMounted ? onMounted() : null;
  }

  animate(time) {
    this._requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this));
    this.arcadeScreenRenderer.render(
      this._normalizedMouseX,
      this._normalizedMouseY,
      time
    );
  }

  handleMouseMove(event) {
    let relativeMouseX = event.clientX - this.arcadeScreenRenderer.getCanvasElement().offsetLeft;
    let relativeMouseY = event.clientY - this.arcadeScreenRenderer.getCanvasElement().offsetTop;

    let width = this.arcadeScreenRenderer.getCanvasElement().width;
    let height = this.arcadeScreenRenderer.getCanvasElement().height;

    this._normalizedMouseX = convertRange(relativeMouseX, 0, width, -1, 1);
    this._normalizedMouseY = convertRange(relativeMouseY, 0, height, -1, 1);
  }

  unmount() {
    cancelAnimationFrame(this._requestAnimationFrameId);
    this.arcadeScreenRenderer.getCanvasElement().remove();
  }

  isInitialized() {
    return this.arcadeScreenRenderer !== null && this.arcadeScreenRenderer !== undefined;
  }
}
