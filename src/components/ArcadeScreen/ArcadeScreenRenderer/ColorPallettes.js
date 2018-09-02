import { Color } from 'three-full';

export const basePallette = {
  c1: new Color('rgb(255, 235, 235)'),
  c2: new Color('rgb(244, 220, 217)'),
  c3: new Color('rgb(198, 191, 210)'),
  c4: new Color('rgb(114, 108, 145)'),
  c5: new Color('rgb(63, 52, 70)'),
  c6: new Color('rgb(10, 10, 10)'),
};

export const baseInvertPallette = {
  c1: new Color('rgb(0, 20, 20)'),
  c2: new Color('rgb(11, 35, 48)'),
  c3: new Color('rgb(57, 64, 45)'),
  c4: new Color('rgb(141, 147, 110)'),
  c5: new Color('rgb(192, 203, 185)'),
  c6: new Color('rgb(240, 240, 240)'),
};

export const shift1Pallette = {
  c1: new Color('rgb(255, 235, 235)'),
  c2: new Color('rgb(244, 220, 217)'),
  c3: new Color('rgb(210, 198, 191)'),
  c4: new Color('rgb(145, 114, 108)'),
  c5: new Color('rgb(70, 63, 52)'),
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

export function convertPalletteToHexStrings(colorPallette) {
  let hexPallette = {};
  Object.keys(colorPallette).forEach(key => {
    hexPallette[key] = `#${colorPallette[key].getHexString()}`
  });
  return hexPallette;
}



export const allPallettes = [
  basePallette,
  shift1Pallette,
  reversePallette,
  baseInvertPallette
];
