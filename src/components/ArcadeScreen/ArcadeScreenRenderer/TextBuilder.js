import { TextBufferGeometry, Object3D, Mesh } from 'three-full';

export default class TextBuilder {
  constructor({font, size, height, material}) {
    this._cache = {};
    this.params = {
      font,
      size,
      height
    };

    let resolution = this.params.font.data.resolution;

    this.scale = this.params.size / resolution;
    this.material = material;

    let data = this.params.font.data;
    this.lineHeight = (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) * this.scale;
    this.lineHeight -= 0.1;
  }

  build(text) {
    let lines = text.split('\n');
    let pivot = new Object3D();

    let changeInHeight = this.lineHeight * (lines.length - 1)
    let yOffset = (changeInHeight) - changeInHeight / 2;
    for (let i = 0; i < lines.length; ++i) {
      let lineGroup = this._buildLine(lines[i]);
      lineGroup.translateY(yOffset);
      pivot.add(lineGroup);
      yOffset -= this.lineHeight;
    }

    return pivot;
  }

  _buildLine(text) {
    var chars = Array.from ? Array.from(text) : String(text).split('');

    let textGroup = new Object3D();
    let offset = 0;
    for (let i = 0; i < chars.length; ++i) {
      let charInfo = this._getCharInfo(chars[i]);
      let mesh = new Mesh(charInfo.geometry, this.material);
      mesh.position.x += offset;
      textGroup.add(mesh);
      offset += charInfo.width;
    }

    textGroup.translateX(-offset / 2);
    textGroup.translateY(-this.lineHeight / 2);
    return textGroup;
  }

  _getCharInfo(char, useCache = true) {
    if (useCache && this._cache[char])
      return this._cache[char];

    let geom = new TextBufferGeometry(char, this.params);
    this._cache[char] = {
      geometry: geom,
      width: this.params.font.data.glyphs[char].ha * this.scale
    };

    return this._cache[char];
  }
}
