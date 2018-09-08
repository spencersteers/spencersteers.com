import { Color } from 'three-full/sources/math/Color';

function buildFragmentShader(colorChannel) {
  return `
    #include <common>

    uniform vec3 c1;
    uniform vec3 c2;
    uniform vec3 c3;
    uniform vec3 c4;
    uniform vec3 c5;
    uniform vec3 c6;

    uniform sampler2D tDiffuse;
    varying vec2 vUv;

    float getColorChannel(vec3 rgb) {
      return rgb.${colorChannel};
    }

    void main() {
      vec3 use = vec3(0.0, 0.0, 0.0);
      vec4 texel = texture2D( tDiffuse, vUv );
      float c = getColorChannel(texel.rgb);

      if (c > 0.0) {
        if (c < 0.25) { use = c6; }
        else if (c < 0.40) { use = c5; }
        else if (c < 0.55) { use = c4; }
        else if (c < 0.70) { use = c3; }
        else if (c < 0.85) { use = c2; }
        else if (c <= 1.0) { use = c1; }
      }
      else {
        use = texel.rgb;
      }


      gl_FragColor = vec4(use, texel.a);
    }
  `;
}

function getUniforms() {
  return {
    tDiffuse: { value: null },
    c1: { value: new Color('rgb(255, 235, 235)') },
    c2: { value: new Color('rgb(244, 220, 217)') },
    c3: { value: new Color('rgb(198, 191, 210)') },
    c4: { value: new Color('rgb(114, 108, 145)') },
    c5: { value: new Color('rgb(63, 52, 70)') },
    c6: { value: new Color('rgb(10, 10, 10)') },
  };
}

function getVertexShader() {
  return `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;
}
let ColorPalletteShader = {
  R: {
    uniforms: getUniforms(),
    vertexShader: getVertexShader(),
    fragmentShader: buildFragmentShader('r'),
  },
  B: {
    uniforms: getUniforms(),
    vertexShader: getVertexShader(),
    fragmentShader: buildFragmentShader('b'),
  },
};

export { ColorPalletteShader };
