import * as THREE from 'three-full';
import HelvetikerRegularFont from 'three-full/sources/fonts/helvetiker_regular.typeface.json';

import { UniformShaderPass } from './shaders/UniformShaderPass';
import { AfterimagePass } from './shaders/AfterimagePass';
import { RadialDistortionShader } from './shaders/RadialDistortionShader';
import { StaticShader } from './shaders/StaticShader';
import { AlphaRampShader } from './shaders/AlphaRampShader';
import { ColorPalletteShader } from './shaders/ColorPalletteShader';
import { getRandomRange, convertRange, positionInSphere } from './utils';
import TextBuilder from './TextBuilder';

export default class ArcadeScreenRenderer {
  constructor(aspectRatio) {
    /** INIT **/
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    // camera
    this.aspectRatio = aspectRatio;
    this.cameraRotationSpeed = 10;
    let cameraParams = {
      viewAngle: 45,
      aspectRatio: this.aspectRatio,
      nearClip: 0.1,
      farClip: 10000,
    };
    this.camera = new THREE.PerspectiveCamera(
      cameraParams.viewAngle,
      cameraParams.aspectRatio,
      cameraParams.nearClip,
      cameraParams.farClip
    );
    this.scene.add(this.camera);

    // particles
    let radius = 300;
    let pGeometry = new THREE.BufferGeometry();
    let pMaterial = new THREE.PointsMaterial({ color: new THREE.Color(1.0, 0, 0), size: 3.0 });
    let positions = [];
    for (var p = 0; p < 500; p++) {
      let pX = positionInSphere(radius);
      let pY = positionInSphere(radius);
      let pZ = positionInSphere(radius, 15);
      positions.push(pX, pY, pZ);
    }
    pGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    let particles = new THREE.Points(pGeometry, pMaterial);
    this.scene.add(particles);

    // text
    let textParams = {
      titleSize: 0.7,
      mottoSize: 0.275,
      height: 0.4,
    };
    this.textBuilder = new TextBuilder({
      font: new THREE.Font(HelvetikerRegularFont),
      size: textParams.titleSize,
      height: textParams.height,
      material: [
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.0, 1.0), transparent: false }),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0.0, 0.0, 0.5), transparent: false }),
      ],
    });

    let mottoTextGroup = this.textBuilder.build('- YOUNG PROFESSIONAL -');
    mottoTextGroup.position.z = -10;
    mottoTextGroup.position.y = -2.25;
    mottoTextGroup.position.x = 0;
    mottoTextGroup.scale.x = 0.392857143;
    mottoTextGroup.scale.y = 0.392857143;
    mottoTextGroup.scale.z = 0.392857143;
    this.camera.add(mottoTextGroup);

    let titleTextGroup = this.textBuilder.build('SPENCER\nSTEERS');
    titleTextGroup.rotation.x = (-20 * Math.PI) / 180;
    titleTextGroup.position.z = -10;
    titleTextGroup.position.y = 2.0;
    titleTextGroup.position.x = 0;
    this.camera.add(titleTextGroup);

    // Post-processing
    this.passes = [];
    let renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.passes.push(renderPass);

    let afterImagePass = new AfterimagePass(0.9);
    this.passes.push(afterImagePass);

    this.alphaRampShader = new THREE.ShaderPass(AlphaRampShader);
    this.passes.push(this.alphaRampShader);

    let filmPass = new UniformShaderPass(THREE.FilmShader);
    filmPass.setUniforms({
      grayscale: 0,
      sCount: 600,
      sIntensity: 0.9,
      nIntensity: 0.4,
    });
    this.passes.push(filmPass);

    let staticPass = new UniformShaderPass(StaticShader);
    staticPass.setUniforms({
      amount: 0.08,
      size: 2,
    });
    this.passes.push(staticPass);

    let vignettePass = new UniformShaderPass(THREE.VignetteShader);
    vignettePass.setUniforms({
      offset: 0.3,
      darkness: 3,
    });
    this.passes.push(vignettePass);

    let radialDistortionPass = new UniformShaderPass(RadialDistortionShader);
    let distortionHorizontalFOV = 65;
    radialDistortionPass.setUniforms({
      strength: 0.3,
      height: Math.tan(THREE._Math.degToRad(distortionHorizontalFOV) / 2) / this.camera.aspect,
      aspectRatio: this.camera.aspect,
      cylindricalRatio: 2,
    });
    this.passes.push(radialDistortionPass);

    let copyPass = new THREE.ShaderPass(THREE.CopyShader);
    copyPass.renderToScreen = true;
    this.passes.push(copyPass);

    // Renderer / EffectComposer
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: false,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.composer = new THREE.EffectComposer(this.renderer);
    this.passes.forEach(pass => {
      this.composer.addPass(pass);
    });
  }

  render(cameraYRotation, cameraXRotation) {
    if (!this.clock.running) this.clock.start();

    let deltaTime = this.clock.getDelta();
    let elapsedTime = this.clock.getElapsedTime();

    let cameraXRotSpeed = convertRange(cameraXRotation, -1, 1, 1, 2);

    this.renderer.clear();
    this.camera.rotateX((Math.PI / (180 / this.cameraRotationSpeed)) * cameraXRotSpeed * deltaTime);
    this.camera.rotateY(
      (cameraYRotation - this.camera.position.x) * 0.01 * this.cameraRotationSpeed * deltaTime
    );

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

  // Used when rendering still frames
  _renderDeltaTime(cameraYRotation, cameraXRotation, deltaTime) {
    let cameraXRotSpeed = convertRange(cameraXRotation, -1, 1, 1, 2);
    this.renderer.clear();
    this.camera.rotateX((Math.PI / (180 / this.cameraRotationSpeed)) * cameraXRotSpeed * deltaTime);
    this.camera.rotateY(
      (cameraYRotation - this.camera.position.x) * 0.01 * this.cameraRotationSpeed * deltaTime
    );
    this.composer.render(deltaTime);
  }
}
