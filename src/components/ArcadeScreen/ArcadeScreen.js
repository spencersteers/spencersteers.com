import { Detector } from 'three-full/sources/helpers/Detector';
import padStart from 'lodash/padStart';

import ArcadeScreenRenderer from './ArcadeScreenRenderer';
import { clamp, getRandomRange, convertRange, waitUntilReady } from './utils';
import { allPallettes, convertPalletteToHexStrings } from './ColorPallettes';

export default class ArcadeScreen {
  constructor(width, height) {
    this.aspectRatio = 3 / 4;
    this.currentPalletteIndex = 0;

    this.mount = waitUntilReady(this.mount);
    this.onReady = waitUntilReady(this.onReady);

    setTimeout(() => {
      if (!Detector.webgl) {
        console.log('Browser does not support webgl.');
        return;
      }

      this.arcadeScreenRenderer = new ArcadeScreenRenderer(this.aspectRatio, width, height);
      this.arcadeScreenRenderer.setColorPallette(allPallettes[this.currentPalletteIndex]);
      this.arcadeScreenRenderer
        .getCanvasElement()
        .addEventListener('mousemove', this.handleMouseMove, false);
      this.arcadeScreenRenderer
        .getCanvasElement()
        .addEventListener('touchmove', this.handleTouchMove, false);

      this.mount.ready();
    });

    // input position over canvas normalized from -1 and 1
    this._inputScreenCoord = {
      x: 0,
      y: 0,
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.animate = this.animate.bind(this);

    this._devCreateGUI();
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
    rootElement.append(this.arcadeScreenRenderer.getCanvasElement());
    this.animate(0);
    onMounted ? onMounted() : null;
  }

  animate(time) {
    this._requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this));
    this.arcadeScreenRenderer.render(this._inputScreenCoord.x, this._inputScreenCoord.y, time);
  }

  handleMouseMove(event) {
    this._inputScreenCoord = this.inputCoordinateToScreenCoordinate(event.clientX, event.clientY);
  }

  handleTouchMove(event) {
    if (event.changedTouches.length === 0) return;

    let touch = event.changedTouches[0];
    this._inputScreenCoord = this.inputCoordinateToScreenCoordinate(touch.clientX, touch.clientY);
  }

  inputCoordinateToScreenCoordinate(clientX, clientY) {
    let relativeInputX = clientX - this.arcadeScreenRenderer.getCanvasElement().offsetLeft;
    let relativeInputY = clientY - this.arcadeScreenRenderer.getCanvasElement().offsetTop;

    let width = this.arcadeScreenRenderer.getCanvasElement().clientWidth;
    let height = this.arcadeScreenRenderer.getCanvasElement().clientHeight;

    return {
      x: convertRange(relativeInputX, 0, width, -1, 1),
      y: convertRange(relativeInputY, 0, height, -1, 1),
    };
  }

  unmount() {
    cancelAnimationFrame(this._requestAnimationFrameId);
    this.arcadeScreenRenderer
      .getCanvasElement()
      .removeEventListener('mousemove', this.handleMouseMove, false);
    this.arcadeScreenRenderer
      .getCanvasElement()
      .removeEventListener('touchmove', this.handleTouchMove, false);
    this.arcadeScreenRenderer.getCanvasElement().remove();
  }

  isInitialized() {
    return this.arcadeScreenRenderer !== null && this.arcadeScreenRenderer !== undefined;
  }

  _devCreateGUI() {
    if (process.env.NODE_ENV !== 'production') {
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
  }

  _devRenderFrames(frames, fps = 60) {
    if (process.env.NODE_ENV !== 'production') {
      cancelAnimationFrame(this._requestAnimationFrameId);
      setTimeout(() => {
        let { width, height } = this.arcadeScreenRenderer.getSize();
        let canvas = this.arcadeScreenRenderer.getCanvasElement();
        let deltaTime = 1 / fps;
        for (let i = 0; i < frames; ++i) {
          this.arcadeScreenRenderer._renderDeltaTime(0, 0, deltaTime);
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
}
