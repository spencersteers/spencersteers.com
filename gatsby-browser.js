import "./src/styles/global.css"
import "./src/styles/prism-perfect.css"

import { ArcadeScreenContext } from './src/components/ArcadeScreen';
export function onClientEntry() {
  if (!ArcadeScreenContext.exists()) {
    ArcadeScreenContext.createContext();
  }
}
