import { Color } from 'three-full';

export const basePallette = {
  c1: new Color('rgb(255, 235, 235)'),
  c2: new Color('rgb(244, 220, 217)'),
  c3: new Color('rgb(198, 191, 210)'),
  c4: new Color('rgb(114, 108, 145)'),
  c5: new Color('rgb(63, 52, 70)'),
  c6: new Color('rgb(10, 10, 10)'),
};

export const reversePallette = {
  c6: new Color('rgb(255, 235, 235)'),
  c5: new Color('rgb(244, 220, 217)'),
  c4: new Color('rgb(198, 191, 210)'),
  c3: new Color('rgb(114, 108, 145)'),
  c2: new Color('rgb(63, 52, 70)'),
  c1: new Color('rgb(10, 10, 10)'),
};

export const redPallette = {
  c1: new Color('#6000ff'),
  c2: new Color('#6000ff'),
  c3: new Color('#fff508'),
  c4: new Color('#fff508'),
  c5: new Color('#3f3446'),
  c6: new Color('#ff0000'),
};

export const blueIcePallette = {
  c1: new Color('#ffebeb'),
  c2: new Color('#f4dcd9'),
  c3: new Color('#c6bfd2'),
  c4: new Color('#0084ff'),
  c5: new Color('#0038ff'),
  c6: new Color('#020082'),
};

export const dirtPallette = {
  c1: new Color('#ffffff'),
  c2: new Color('#4f2e2a'),
  c3: new Color('#4f2e2a'),
  c4: new Color('#4f2e2a'),
  c5: new Color('#4f2e2a'),
  c6: new Color('#8c815b'),
};

export const lemonLimePallette = {
  c1: new Color('#e0ff21'),
  c2: new Color('#ffa800'),
  c3: new Color('#ff9a3d'),
  c4: new Color('#479b04'),
  c5: new Color('#238900'),
  c6: new Color('#5efc38'),
};

export function convertPalletteToHexStrings(colorPallette) {
  let hexPallette = {};
  Object.keys(colorPallette).forEach(key => {
    hexPallette[key] = `#${colorPallette[key].getHexString()}`;
  });
  return hexPallette;
}

export const allPallettes = [
  basePallette,
  blueIcePallette,
  reversePallette,
  redPallette,
  dirtPallette,
  lemonLimePallette,
];
