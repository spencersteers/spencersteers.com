import { Color } from 'three-full/sources/math/Color';

let AlphaRampShader = {
  uniforms: {
    tDiffuse: { value: null },
    c1: { value: new Color('rgb(255, 235, 235)') },
    c2: { value: new Color('rgb(244, 220, 217)') },
    c3: { value: new Color('rgb(198, 191, 210)') },
    c4: { value: new Color('rgb(114, 108, 145)') },
    c5: { value: new Color('rgb(63, 52, 70)') },
    c6: { value: new Color('rgb(10, 10, 10)') },
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,

  fragmentShader: `
    #include <common>

    uniform vec3 c1;
    uniform vec3 c2;
    uniform vec3 c3;
    uniform vec3 c4;
    uniform vec3 c5;
    uniform vec3 c6;

    uniform sampler2D tDiffuse;
    varying vec2 vUv;

    // the 'v' in hsv
    float rgbMax(vec3 rgb) {
      return rgb.r > rgb.g ? (rgb.r > rgb.b ? rgb.r : rgb.b) : (rgb.g > rgb.b ? rgb.g : rgb.b);
    }

    void main() {
      vec3 use = vec3(0.0, 0.0, 0.0);
      vec4 texel = texture2D( tDiffuse, vUv );
      float c = rgbMax(texel.rgb);
      if (c < 0.25) { use = c6; }
      else if (c < 0.40) { use = c5; }
      else if (c < 0.55) { use = c4; }
      else if (c < 0.70) { use = c3; }
      else if (c < 0.85) { use = c2; }
      else if (c <= 1.0) { use = c1; }

      gl_FragColor = vec4(use, texel.a);
    }
  `,
};

export { AlphaRampShader };
