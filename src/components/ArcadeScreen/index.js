import ArcadeScreen from './ArcadeScreen';

export const ArcadeScreenContext = {
  exists() {
    return window._arcadeScreen !== null && window._arcadeScreen !== undefined;
  },

  getContext() {
    return window._arcadeScreen;
  },

  createContext(width, height) {
    if (this.exists()) console.warn('ArcadeScreenContext already exists');

    window._arcadeScreen = new ArcadeScreen(width, height);
  },
};
