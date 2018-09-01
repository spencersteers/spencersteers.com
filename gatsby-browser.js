import "./src/styles/global.css"
import "./src/styles/prism-perfect.css"

import { ArcadeScreen } from './src/components/ArcadeScreen/ArcadeScreenRenderer';
export function onClientEntry() {
  if (window._arcadeScreen) {
    console.log('onClientEntry:window._arcadeScreen exists');
  }
  else {
    console.log('onClientEntry: new ArcadeScreen()');
    window._arcadeScreen = new ArcadeScreen();
  }
}
