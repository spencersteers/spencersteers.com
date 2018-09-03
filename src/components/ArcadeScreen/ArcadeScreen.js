import { Detector } from 'three-full';
import padStart from 'lodash/padStart';

import ArcadeScreenRenderer from './ArcadeScreenRenderer';
import { clamp, getRandomRange, convertRange, waitUntilReady } from './utils';
import { allPallettes, convertPalletteToHexStrings } from './ColorPallettes';

export default class ArcadeScreen {
  constructor() {
    this.aspectRatio = 3 / 4;
    this.currentPalletteIndex = 0;

    this.mount = waitUntilReady(this.mount);
    this.onReady = waitUntilReady(this.onReady);

    setTimeout(() => {
      if (!Detector.webgl) {
        console.log('Browser does not support webgl.');
        return;
      }

      this.arcadeScreenRenderer = new ArcadeScreenRenderer(this.aspectRatio);
      this.arcadeScreenRenderer.setColorPallette(allPallettes[this.currentPalletteIndex]);
      this.arcadeScreenRenderer
        .getCanvasElement()
        .addEventListener('mousemove', this.handleMouseMove, false);
      this.mount.ready();
    });

    // mouse position over canvas normalized to -1 and 1
    this._normalizedMouseX = 0;
    this._normalizedMouseY = 0;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.animate = this.animate.bind(this);

    if (process.env.NODE_ENV !== 'production') {
      this.createGUI();
    }
  }

  nextPallette() {
    if (this.currentPalletteIndex === allPallettes.length - 1) this.currentPalletteIndex = 0;
    else this.currentPalletteIndex++;

    this.arcadeScreenRenderer.setColorPallette(allPallettes[this.currentPalletteIndex]);
  }

  previousPallette() {
    if (this.currentPalletteIndex === 0) this.currentPalletteIndex = allPallettes.length - 1;
    else this.currentPalletteIndex--;

    this.arcadeScreenRenderer.setColorPallette(allPallettes[this.currentPalletteIndex]);
  }

  mount(rootElement, width, height, onMounted) {
    let canvas = this.arcadeScreenRenderer.getCanvasElement();

    if (canvas.parentElement) console.error('ArcadeScreen is already mounted!');

    this.arcadeScreenRenderer.setSize(width, height);
    rootElement.append(this.arcadeScreenRenderer.getCanvasElement());
    this.animate(0);
    onMounted ? onMounted() : null;
  }

  animate(time) {
    this._requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this));
    this.arcadeScreenRenderer.render(this._normalizedMouseX, this._normalizedMouseY, time);
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

  createGUI() {
    const dat = require('dat.gui');
    let colorPallette = convertPalletteToHexStrings(allPallettes[this.currentPalletteIndex]);
    let gui = new dat.GUI({ name: 'Color Pallette' });
    Object.keys(colorPallette).forEach((key, value) => {
      gui.addColor(colorPallette, key).onChange(val => {
        this.arcadeScreenRenderer.setColorPallette(colorPallette);
      });
    });

    let printButton = {
      print: function() {
        console.log(JSON.stringify(colorPallette, '', 2));
      },
    };
    gui.add(printButton, 'print');
  }

  // Rendering still frames
  _exportImages(frames, fps = 60) {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    cancelAnimationFrame(this._requestAnimationFrameId);
    setTimeout(() => {
      let { width, height } = this.arcadeScreenRenderer.getSize();
      let canvas = this.arcadeScreenRenderer.getCanvasElement();
      let deltaTime = 1 / fps;
      for (let i = 0; i < frames; ++i) {
        this.arcadeScreenRenderer.renderDeltaTime(0, 0, deltaTime);
        let linkTitle = `Frame_${padStart(i, 3, '0')}.png`;
        let downloadLink = document.createElement('a');
        downloadLink.textContent = linkTitle;
        downloadLink.setAttribute('download', linkTitle);
        downloadLink.setAttribute(
          'href',
          canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        );
        downloadLink.setAttribute('style', 'display: block; padding-bottom: 5px');
        document.body.append(downloadLink);
      }

      let batches = {};
      let i = 0;
      let k = 0;
      document.querySelectorAll('a').forEach(element => {
        if (!batches[k]) batches[k] = [];
        if (element.parentNode == document.body) {
          batches[k].push(element);
          ++i;

          if (i > 4) {
            let downloadBatch = batches[k];
            setTimeout(() => {
              downloadBatch.forEach(element => element.click());
            }, 5000 * k);
            k += 1;
            i = 0;
            batches[k] = [];
          }
        }
      });
      console.log('batches', batches);
    }, 1000);
  }
}
