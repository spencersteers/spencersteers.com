import { Scene } from 'three-full/sources/scenes/Scene';
import { Clock } from 'three-full/sources/core/Clock';
import { PerspectiveCamera } from 'three-full/sources/cameras/PerspectiveCamera';
import { BufferGeometry } from 'three-full/sources/core/BufferGeometry';
import { Color } from 'three-full/sources/math/Color';
import { Font } from 'three-full/sources/core/Font';
import { PointsMaterial } from 'three-full/sources/materials/PointsMaterial';
import { Float32BufferAttribute } from 'three-full/sources/core/BufferAttribute';
import { Points } from 'three-full/sources/objects/Points';
import { MeshBasicMaterial } from 'three-full/sources/materials/MeshBasicMaterial';
import { ShaderPass } from 'three-full/sources/postprocessing/ShaderPass';
import { RenderPass } from 'three-full/sources/postprocessing/RenderPass';
import { VignetteShader } from 'three-full/sources/shaders/VignetteShader';
import { FilmShader } from 'three-full/sources/shaders/FilmShader';
import { CopyShader } from 'three-full/sources/shaders/CopyShader';
import { _Math } from 'three-full/sources/math/Math';
import { WebGLRenderer } from 'three-full/sources/renderers/WebGLRenderer';
import { EffectComposer } from 'three-full/sources/postprocessing/EffectComposer';

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
  constructor(aspectRatio, width, height) {
    /** INIT **/
    this.scene = new Scene();
    this.clock = new Clock();

    // camera
    this.aspectRatio = aspectRatio;
    this.cameraRotationSpeed = 10;
    let cameraParams = {
      viewAngle: 45,
      aspectRatio: this.aspectRatio,
      nearClip: 0.1,
      farClip: 10000,
    };
    this.camera = new PerspectiveCamera(
      cameraParams.viewAngle,
      cameraParams.aspectRatio,
      cameraParams.nearClip,
      cameraParams.farClip
    );
    this.scene.add(this.camera);

    // particles
    let radius = 300;
    let pGeometry = new BufferGeometry();
    let pMaterial = new PointsMaterial({ color: new Color(1.0, 0, 0), size: 3.0 });
    let positions = [];
    for (var p = 0; p < 500; p++) {
      let pX = positionInSphere(radius);
      let pY = positionInSphere(radius);
      let pZ = positionInSphere(radius, 15);
      positions.push(pX, pY, pZ);
    }
    pGeometry.addAttribute('position', new Float32BufferAttribute(positions, 3));
    let particles = new Points(pGeometry, pMaterial);
    this.scene.add(particles);

    // text
    let textParams = {
      titleSize: 0.7,
      mottoSize: 0.275,
      height: 0.4,
    };
    this.textBuilder = new TextBuilder({
      font: new Font(HelvetikerRegularFont),
      size: textParams.titleSize,
      height: textParams.height,
      material: [
        new MeshBasicMaterial({ color: new Color(0.0, 0.0, 1.0), transparent: false }),
        new MeshBasicMaterial({ color: new Color(0.0, 0.0, 0.5), transparent: false }),
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
    let renderPass = new RenderPass(this.scene, this.camera);
    this.passes.push(renderPass);

    let afterImagePass = new AfterimagePass(0.9);
    this.passes.push(afterImagePass);

    this.alphaRampShader = new ShaderPass(AlphaRampShader);
    this.passes.push(this.alphaRampShader);

    let filmPass = new UniformShaderPass(FilmShader);
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

    let vignettePass = new UniformShaderPass(VignetteShader);
    vignettePass.setUniforms({
      offset: 0.3,
      darkness: 3,
    });
    this.passes.push(vignettePass);

    let radialDistortionPass = new UniformShaderPass(RadialDistortionShader);
    let distortionHorizontalFOV = 65;
    radialDistortionPass.setUniforms({
      strength: 0.3,
      height: Math.tan(_Math.degToRad(distortionHorizontalFOV) / 2) / this.camera.aspect,
      aspectRatio: this.camera.aspect,
      cylindricalRatio: 2,
    });
    this.passes.push(radialDistortionPass);

    let copyPass = new ShaderPass(CopyShader);
    copyPass.renderToScreen = true;
    this.passes.push(copyPass);

    // Renderer / EffectComposer
    this.renderer = new WebGLRenderer({
      preserveDrawingBuffer: false,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.composer = new EffectComposer(this.renderer);
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
