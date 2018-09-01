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
import TWEEN from '@tweenjs/tween.js';

import { UniformShaderPass } from './shaders/UniformShaderPass';
import { AfterimagePass } from './shaders/AfterimagePass';
import { RadialDistortionShader } from './shaders/RadialDistortionShader';
import { StaticShader } from './shaders/StaticShader';
import { AlphaRampShader } from './shaders/AlphaRampShader';
import { getRandomRange, convertRange } from './utils';
import TextBuilder from './TextBuilder';

export default class ArcadeScreenScene {
  constructor(aspectRatio) {
    this.aspectRatio = aspectRatio;

    /** INIT **/
    this.scene = new THREE.Scene();

    // camera
    let cameraParams = {
      viewAngle: 45,
      aspectRatio: this.aspectRatio,
      nearClip: 0.1,
      farClip: 10000,
    };
    this.camera = THREE.PerspectiveCamera(viewAngle, aspectRatio, nearClip, farClip);
    this.camera.position.z = 10;
    this.scene.add(this.camera);

    // particles
    let radius = 400;
    let particleGeometry = new THREE.BufferGeometry();
    let particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 3.0 });

    let positions = [];
    for (var p = 0; p < count; p++) {
      let pX = getRandomRange(-radius, radius);
      let pY = getRandomRange(-radius, radius);
      let pZ = getRandomRange(-radius, radius);
      positions.push(pX, pY, pZ);
    }
    particleGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
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
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }),
        new THREE.MeshBasicMaterial({ color: 0x777777, transparent: true }),
      ],
    });

    console.time('mottoTextGroup');
    let mottoTextGroup = this.textBuilder.build('- YOUNG PROFESSIONAL -');
    mottoTextGroup.position.z = -10;
    mottoTextGroup.position.y = -2.25;
    mottoTextGroup.position.x = 0;
    mottoTextGroup.scale.x = 0.392857143;
    mottoTextGroup.scale.y = 0.392857143;
    mottoTextGroup.scale.z = 0.392857143;
    this.camera.add(mottoTextGroup);
    console.timeEnd('text1');

    console.time('titleTextGroup');
    let titleTextGroup = this.textBuilder.build('SPENCER\nSTEERS');
    titleTextGroup.rotation.x = (-20 * Math.PI) / 180;
    titleTextGroup.position.z = -10;
    titleTextGroup.position.y = 2.0;
    titleTextGroup.position.x = 0;
    this.camera.add(titleTextGroup);
    console.timeEnd('titleTextGroup');

    // Post-processing
    this.passes = [];
    let renderPass = new RenderPass(this.scene, this.camera);
    this.passes.push(renderPass);

    let afterImagePass = new AfterimagePass(0.9);
    this.passes.push(afterImagePass);

    let alphaRampPass = new ShaderPass(AlphaRampShader);
    this.passes.push(alphaRampPass);

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
      height: Math.tan(THREE._Math.degToRad(distortionHorizontalFOV) / 2) / this.camera.aspect,
      aspectRatio: this.camera.aspect,
      cylindricalRatio: 2,
    });
    this.passes.push(radialDistortionPass);

    let copyPass = new ShaderPass(CopyShader);
    copyPass.renderToScreen = true;
    this.passes.push(copyPass);
  }

  render(cameraYRotation, cameraXRotation) {
    if (!this.clock.running) this.clock.start();

    let deltaTime = this.clock.getDelta();
    let elapsedTime = this.clock.getElapsedTime();

    // this.fadeTween.update(elapsedTime * 1000);

    let cameraXRotSpeed = convertRange(cameraXRotation, -1, 1, 1, 2);

    this.renderer.clear();
    this.camera.rotateX((Math.PI / (180 / this.cameraRotationSpeed)) * cameraXRotSpeed);
    this.camera.rotateY((cameraYRotation - this.camera.position.x) * 0.005);
    this.composer.render(deltaTime);
  }

  createController(rootElement, width, height, devicePixelRatio) {
    let renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: false,
      alpha: true,
    });
    renderer.setPixelRatio(devicePixelRatio);
    let composer = new EffectComposer(this.renderer);
    this.passes.forEach(pass => {
      composer.addPass(pass);
    });
  }
}
