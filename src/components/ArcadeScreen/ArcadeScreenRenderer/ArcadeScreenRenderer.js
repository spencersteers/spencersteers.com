import * as THREE from 'three-full';
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  CopyShader,
  FilmShader,
  VignetteShader,
} from 'three-full';
import HelvetikerRegularFont from 'three-full/sources/fonts/helvetiker_regular.typeface.json';

import { UniformShaderPass } from './shaders/UniformShaderPass';
import { AfterimagePass } from './shaders/AfterimagePass';
import { RadialDistortionShader } from './shaders/RadialDistortionShader';
import { StaticShader } from './shaders/StaticShader';
import { AlphaRampShader } from './shaders/AlphaRampShader';
import { ColorPalletteShader } from './shaders/ColorPalletteShader';
import { getRandomRange, convertRange } from './utils';
import TextBuilder from './TextBuilder';

export default class ArcadeScreenRenderer {
  constructor(aspectRatio) {
    console.group('ArcadeScreenRenderer:constructor');
    console.time('constructor');
    this.textBuilder = new TextBuilder({
      font: new THREE.Font(HelvetikerRegularFont),
      size: 0.7,
      height: 0.4,
      material: [
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.0, 1.0), transparent: false }),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.0, 0.5), transparent: false }),
      ],
    });

    this.aspectRatio = aspectRatio;

    this.clock = new THREE.Clock();
    this.cameraRotationSpeed = 10;

    // THREE
    this.scene;
    this.renderer;

    // Post-processing
    this.composer;
    this.filmPass;
    this.staticPass;

    // Scene Nodes
    this.camera;
    this.titleTextGroup;
    this.mottoTextGroup;
    this.mottoText;

    this.setupScene();
    console.timeEnd('constructor');
    console.groupEnd('ArcadeScreenRenderer:constructor');
  }

  render(cameraYRotation, cameraXRotation) {
    if (!this.clock.running) this.clock.start();

    let deltaTime = this.clock.getDelta();
    let elapsedTime = this.clock.getElapsedTime();

    let cameraXRotSpeed = convertRange(cameraXRotation, -1, 1, 1, 2);

    this.renderer.clear();
    this.camera.rotateX((Math.PI / (180 / this.cameraRotationSpeed)) * cameraXRotSpeed * deltaTime);
    this.camera.rotateY((cameraYRotation - this.camera.position.x) * 0.01 * this.cameraRotationSpeed * deltaTime);

    this.composer.render(deltaTime);
  }

  renderDeltaTime(cameraYRotation, cameraXRotation, deltaTime) {
    if (!this.clock.running) this.clock.start();

    let cameraXRotSpeed = convertRange(cameraXRotation, -1, 1, 1, 2);

    this.renderer.clear();
    this.camera.rotateX((Math.PI / (180 / this.cameraRotationSpeed)) * cameraXRotSpeed * deltaTime);
    this.camera.rotateY((cameraYRotation - this.camera.position.x) * 0.01 * this.cameraRotationSpeed * deltaTime);

    this.composer.render(deltaTime);
  }

  getSize() {
    return this.renderer.getSize();
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
    let renderSize = this.renderer.getDrawingBufferSize();
    this.composer.setSize(renderSize.width, renderSize.height);
  }

  getCanvasElement() {
    return this.renderer.domElement;
  }

  setColorPallette(colorPallette) {
    Object.keys(colorPallette).forEach(key => {
      this.alphaRampShader.uniforms[key].value.set(colorPallette[key]);
    });
  }

  // setup / object builders
  setupScene() {
    console.group('ArcadeScreenRenderer:setupScene');

    console.time('new THREE.WebGLRenderer');
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: false,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    console.log('window.devicePixelRatio', window.devicePixelRatio);
    console.timeEnd('new THREE.WebGLRenderer');

    this.scene = new THREE.Scene();

    this.camera = this.createCamera();
    this.camera.aspectRatio = this.aspectRatio;
    this.camera.position.z = 10;
    this.scene.add(this.camera);

    let particles = this.createParticles();
    this.scene.add(particles);

    // Post-processing
    console.time('pp');
    this.composer = new EffectComposer(this.renderer);

    let renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    let afterImagePass = new AfterimagePass(0.90);
    this.composer.addPass(afterImagePass);

    this.alphaRampShader = new ShaderPass(AlphaRampShader);
    this.composer.addPass(this.alphaRampShader);

    this.filmPass = new UniformShaderPass(FilmShader);
    this.filmPass.setUniforms({
      grayscale: 0,
      sCount: 600,
      sIntensity: 0.9,
      nIntensity: 0.4,
    });
    this.composer.addPass(this.filmPass);

    this.staticPass = new UniformShaderPass(StaticShader);
    this.staticPass.setUniforms({
      amount: 0.08,
      size: 2,
    });
    this.composer.addPass(this.staticPass);

    let vignettePass = new UniformShaderPass(VignetteShader);
    vignettePass.setUniforms({
      offset: 0.3,
      darkness: 3,
    });
    this.composer.addPass(vignettePass);

    let distortionHorizontalFOV = 65;
    let radialDistortionPass = new UniformShaderPass(RadialDistortionShader);
    radialDistortionPass.setUniforms({
      strength: 0.3,
      height: Math.tan(THREE._Math.degToRad(distortionHorizontalFOV) / 2) / this.camera.aspect,
      aspectRatio: this.camera.aspect,
      cylindricalRatio: 2,
    });
    this.composer.addPass(radialDistortionPass);

    var copyPass = new ShaderPass(CopyShader);
    copyPass.renderToScreen = true;
    this.composer.addPass(copyPass);
    console.timeEnd('pp');

    console.time('text1');
    let mottoTextGroup = this.textBuilder.build('- YOUNG PROFESSIONAL -');
    mottoTextGroup.position.z = -10;
    mottoTextGroup.position.y = -2.25;
    mottoTextGroup.position.x = 0;
    mottoTextGroup.scale.x = 0.392857143;
    mottoTextGroup.scale.y = 0.392857143;
    mottoTextGroup.scale.z = 0.392857143;
    this.camera.add(mottoTextGroup);
    console.timeEnd('text1');

    console.time('text2');
    let titleTextGroup = this.textBuilder.build('SPENCER\nSTEERS');
    titleTextGroup.rotation.x = (-20 * Math.PI) / 180;
    titleTextGroup.position.z = -10;
    titleTextGroup.position.y = 2.0;
    titleTextGroup.position.x = 0;
    this.camera.add(titleTextGroup);
    console.timeEnd('text2');

    console.groupEnd('ArcadeScreenRenderer:setupScene');
  }

  createCamera(viewAngle = 45, aspectRatio = 3 / 4, nearClip = 0.1, farClip = 10000) {
    return new THREE.PerspectiveCamera(viewAngle, aspectRatio, nearClip, farClip);
  }

  createParticles(count = 500) {
    let radius = 400;

    let pGeometry = new THREE.BufferGeometry();
    let pMaterial = new THREE.PointsMaterial({ color: new THREE.Color(1.0, 0, 0), size: 3.0 });

    let color = new THREE.Color(1.0, 0.00, 0.00);
    let positions = [];
    let colors = []
    for (var p = 0; p < count; p++) {
      let pX = getRandomRange(-radius, radius);
      let pY = getRandomRange(-radius, radius);
      let pZ = getRandomRange(-radius, radius);
      positions.push(pX, pY, pZ);
      colors.push(color.r, color.g, color.b);
    }
    pGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    // pGeometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return new THREE.Points(pGeometry, pMaterial);
  }
}
