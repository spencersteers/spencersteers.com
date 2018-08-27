let RadialDistortionShader = {
  uniforms: {
    tDiffuse: { type: 't', value: null },
    strength: { type: 'f', value: 0.5 },
    height: { type: 'f', value: 2 },
    aspectRatio: { type: 'f', value: 16 / 9 },
    cylindricalRatio: { type: 'f', value: 2 },
  },

  vertexShader: `
    uniform float strength;          // s: 0 = perspective, 1 = stereographic
    uniform float height;            // h: tan(verticalFOVInRadians / 2)
    uniform float aspectRatio;       // a: screenWidth / screenHeight
    uniform float cylindricalRatio;  // c: cylindrical distortion ratio. 1 = spherical

    varying vec3 lensDistortion_vUV;                // output to interpolate over screen
    varying vec2 lensDistortion_vUVDot;             // output to interpolate over screen
    varying vec2 vUV;

    void main() {
      gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));
      vUV = uv;

      float scaledHeight = strength * height;
      float cylAspectRatio = aspectRatio * cylindricalRatio;
      float aspectDiagSq = aspectRatio * aspectRatio + 1.0;
      float diagSq = scaledHeight * scaledHeight * aspectDiagSq;
      vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));

      float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;
      float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);

      lensDistortion_vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;
      lensDistortion_vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);
      lensDistortion_vUV.xy += uv;
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;      // sampler of rendered scene?s render target
    uniform float strength;
    uniform float aspectRatio;

    varying vec3 lensDistortion_vUV;                // interpolated vertex output data
    varying vec2 lensDistortion_vUVDot;             // interpolated vertex output data
    varying vec2 vUV;

    vec2 radialDistortion(vec2 coord, float str) {
      vec2 aspect = vec2(aspectRatio, 1.0);
      vec2 cc = (coord - vec2(0.5)) * aspect;
      float dist = dot(cc, cc) * str;
      return coord + (cc * (1.0 - dist) * dist / aspect);
    }

    void main() {
      vec3 lensDistortion_uv = dot(lensDistortion_vUVDot, lensDistortion_vUVDot) * vec3(-0.5, -0.5, -1.0) + lensDistortion_vUV;
      vec4 diffuseColor = texture2DProj(tDiffuse, lensDistortion_uv);
      diffuseColor.a = 1.0;

      // cutout when uv coord outside of (0.0, 1.0) range
      vec2 cutout_uv = radialDistortion(vUV, strength - 0.2);
      vec2 cutout_xy0 = step(1.0, 1.0 - cutout_uv);
      vec2 cutout_xy1 = step(1.0, cutout_uv);

      vec2 cutoutBorder_uv = radialDistortion(vUV, strength);
      vec2 cutoutBorder_xy0 = step(1.0, 1.0 - cutoutBorder_uv);
      vec2 cutoutBorder_xy1 = step(1.0, cutoutBorder_uv);

      gl_FragColor = mix(diffuseColor, vec4(0.0, 0.0, 0.0, 0.0), (cutoutBorder_xy1.x + cutoutBorder_xy1.y + cutoutBorder_xy0.x + cutoutBorder_xy0.y));

      // gl_FragColor.a = 1.0 - (cutout_xy1.x + cutout_xy1.y + cutout_xy0.x + cutout_xy0.y);
      // gl_FragColor.a = 0.5;
      // if (gl_FragColor.a <= 0.5) {
      //   gl_FragColor.b = 1.0;
      // }
      // gl_FragColor.a = 1.0 - (cutout_xy1.x + cutout_xy1.y + cutout_xy0.x + cutout_xy0.y);

      // gl_FragColor = diffuseColor;
    }
  `,
};

export { RadialDistortionShader };
