import ArcadeScreenRenderer from './ArcadeScreenRenderer';
import { clamp, getRandomRange, convertRange } from './utils';

export default class ArcadeScreenController {
  constructor({ aspectRatio, width, height, arcadeScreenRenderer }) {
    if (arcadeScreenRenderer) {
      this.arcadeScreenRenderer = arcadeScreenRenderer;
      console.log('existing renderer');
    } else if (arcadeScreenRenderer === undefined) {
      console.time('new ArcadeScreenRenderer()');
      this.arcadeScreenRenderer = new ArcadeScreenRenderer(aspectRatio);
      console.timeEnd('new ArcadeScreenRenderer()');
    }

    this.canvasElement = this.arcadeScreenRenderer.getCanvasElement();

    // range between -1 and 1
    this.normalizedMouseX = 0;
    this.normalizedMouseY = 0;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.canvasElement.addEventListener('mousemove', this.handleMouseMove, false);

    this.animate = this.animate.bind(this);
    this.arcadeScreenRenderer.setSize(width, height);
  }

  mount(rootElement) {
    this.rootElement = rootElement;
    this.rootElement.append(this.canvasElement);
    this.rootElement.classList.add('fade-in');

    this.animate(0);
  }

  animate(time) {
    this.requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this));
    this.arcadeScreenRenderer.render(this.normalizedMouseX, this.normalizedMouseY, time);
  }

  handleMouseMove(event) {
    var offsetX = event.clientX - this.canvasElement.offsetLeft;
    var offsetY = event.clientY - this.canvasElement.offsetTop;

    this.normalizedMouseX = convertRange(offsetX, 0, this.canvasElement.offsetWidth, -1, 1);
    this.normalizedMouseY = convertRange(offsetY, 0, this.canvasElement.offsetHeight, -1, 1);
  }

  destroy() {
    cancelAnimationFrame(this.requestAnimationFrameId);
    this.canvasElement.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleWindowResize);
  }
}
