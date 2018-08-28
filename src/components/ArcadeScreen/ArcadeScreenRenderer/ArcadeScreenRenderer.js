import * as THREE from 'three-full';
import { EffectComposer, RenderPass, ShaderPass, CopyShader, FilmShader, VignetteShader } from 'three-full';
import HelvetikerRegularFont from 'three-full/sources/fonts/helvetiker_regular.typeface.json';
import TWEEN from '@tweenjs/tween.js';

import { TemporalShaderPass } from './shaders/TemporalShaderPass';
import { AfterimagePass } from './shaders/AfterimagePass';
import { RadialDistortionShader } from './shaders/RadialDistortionShader';
import { StaticShader } from './shaders/StaticShader';
import { AlphaRampShader } from './shaders/AlphaRampShader';
import { getRandomRange, convertRange } from './utils';


import TextBuilder from './TextBuilder';


export default class ArcadeScreenRenderer {
  constructor(container, aspectRatio) {
    this.font = new THREE.Font(HelvetikerRegularFont);

    window.textBuilder = new TextBuilder({
      font: this.font,
      size:  0.7,
      height: 0.4,
      material: [
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }),
        new THREE.MeshBasicMaterial({ color: 0x777777, transparent: true })
      ]
    });

    this.container = container;
    this.aspectRatio = aspectRatio;

    this.clock = new THREE.Clock();

    this._onReadyCallBack = () => {};
    this.cameraRotationSpeed = 0.1; // degrees per frame

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
  }

  onReady(cb) {
    if (cb !== undefined) this._onReadyCallBack = cb;

    if (this.isReady()) {
      this._onReadyCallBack();
    }
  }

  isReady() {
    return this.titleTextGroup !== null;
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

  getSize() {
    return this.renderer.getSize();
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  getCanvasElement() {
    return this.renderer.domElement;
  }

  // setup / object builders
  setupScene() {
    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: false,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.container.append(this.renderer.domElement);

    this.scene = new THREE.Scene();
    window._scene = this.scene;

    this.camera = this.createCamera();
    this.camera.aspectRatio = this.aspectRatio;
    this.camera.position.z = 10;
    this.scene.add(this.camera);

    console.time('p');
    let particles = this.createParticles();
    this.scene.add(particles);
    console.timeEnd('p');

    // Post-processing
    this.composer = new EffectComposer(this.renderer);

    let renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    let afterImagePass = new AfterimagePass(0.9);
    this.composer.addPass(afterImagePass);

    var alphaRampShader = new ShaderPass(AlphaRampShader);
    this.composer.addPass(alphaRampShader);

    this.filmPass = new TemporalShaderPass(FilmShader);
    this.filmPass.setUniforms({
      grayscale: 0,
      sCount: 600,
      sIntensity: 0.9,
      nIntensity: 0.4,
    });
    this.composer.addPass(this.filmPass);

    this.staticPass = new TemporalShaderPass(StaticShader);
    this.staticPass.setUniforms({
      amount: 0.08,
      size: 2,
    });
    this.composer.addPass(this.staticPass);

    let vignettePass = new TemporalShaderPass(VignetteShader);
    vignettePass.setUniforms({
      offset: 0.3,
      darkness: 3
    });
    this.composer.addPass(vignettePass);

    let distortionHorizontalFOV = 65;
    let radialDistortionPass = new TemporalShaderPass(RadialDistortionShader);
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

    // this.titleTextGroup = this.createTitleTextGroup(this.font);
    // this.camera.add(this.titleTextGroup);
    // this.titleTextGroup.position.z = -10;
    // this.titleTextGroup.position.y = 2.0;
    //
    // console.time('old');
    // this.createText('ABCABC', this.font, 0.275, 0.3);
    // console.timeEnd('old');
    //
    // console.time('new');
    // textBuilder.build("ABC");
    // console.timeEnd('new');

    console.time('createText');
    // this.mottoText = this.createText('- YOUNG PROFESSIONAL -', this.font, 0.275, 0.3);
    console.timeEnd('createText');
    this.mottoTextGroup = new THREE.Object3D();
    this.mottoTextGroup.add(this.mottoText);
    this.camera.add(this.mottoTextGroup);
    this.mottoTextGroup.position.z = -10;
    this.mottoTextGroup.position.y = -2.25;

    console.time("textBuilder:g1")
    var g1 = window.textBuilder.build("- YOUNG PROFESSIONAL -");
    // g1.rotation.x = (-40 * Math.PI) / 180;
    console.timeEnd("textBuilder:g1")

    // console.time("textBuilder:g2")
    var g2 = window.textBuilder.build("SPENCER\nSTEERS");
    g2.rotation.x = (-20 * Math.PI) / 180;
    // console.timeEnd("textBuilder:g2")



    g1.position.z = -10;
    g1.position.y = -2.25;
    g1.position.x = 0;
    g1.scale.x = .392857143;
    g1.scale.y = .392857143;
    g1.scale.z = .392857143;

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.z = -10;
    // this.camera.add(cube);

    // g2.rotation.x = (-20 * Math.PI) / 180;
    g2.position.z = -10;
    g2.position.y = 2.0;
    g2.position.x = 0;

    console.log(g2.position)

    this.camera.add(g1);
    // console.log('g2', g2);
    this.camera.add(g2);


    // console.log(this.font.generateShapes("0")[0]);

    // stagger text load
    // setTimeout(() => {
    //   this.titleTextGroup = this.createTitleTextGroup(this.font);
    //   this.camera.add(this.titleTextGroup);
    //   this.titleTextGroup.position.z = -10;
    //   this.titleTextGroup.position.y = 1.5;
    // });
    //
    // setTimeout(() => {
    //   this.mottoText = this.createText('- YOUNG PROFESSIONAL -', this.font, 0.2);
    //   this.mottoTextGroup = new THREE.Object3D();
    //   this.mottoTextGroup.add(this.mottoText);
    //   this.camera.add(this.mottoTextGroup);
    //   this.mottoTextGroup.position.z = -10;
    //   this.mottoTextGroup.position.y = -2;
    // }, 1);

    this.fadeTweenParams = {
      maxOpacity: 1.0,
      minOpacity: 0.4,
      currentOpacity: 1.0,
      duration: 2000,
    };
    this.fadeTween = new TWEEN.Tween(this.fadeTweenParams)
      .to({ currentOpacity: this.fadeTweenParams.minOpacity }, this.fadeTweenParams.duration)
      .repeat(Infinity)
      .yoyo(true)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        for (let i = 0; i < this.mottoText.material.length; ++i)
          this.mottoText.material[i].opacity = this.fadeTweenParams.currentOpacity;
      })
      .start();
  }

  createCamera(viewAngle = 45, aspectRatio = 3 / 4, nearClip = 0.1, farClip = 10000) {
    return new THREE.PerspectiveCamera(viewAngle, aspectRatio, nearClip, farClip);
  }

  createParticles(count = 500) {
    let radius = 400;

    let pGeometry = new THREE.BufferGeometry();
    let pMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 3.0 });

    let positions = [];
    for (var p = 0; p < count; p++) {
      var pX = getRandomRange(-radius, radius);
      var pY = getRandomRange(-radius, radius);
      var pZ = getRandomRange(-radius, radius);
      positions.push(pX, pY, pZ);
    }
    pGeometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    return new THREE.Points(pGeometry, pMaterial);
  }

  createTitleTextGroup(font) {
    let spencerText = this.createText('SPENCER', font, 0.7, 0.4);
    let steersText = this.createText('STEERS', font, 0.7, 0.4);

    let linePadding = 0.1;
    let spencerTextHeight =
      spencerText.geometry.boundingBox.max.y - spencerText.geometry.boundingBox.min.y;
    steersText.position.y = spencerText.position.y - spencerTextHeight - linePadding;

    let textGroup = new THREE.Object3D();
    textGroup.add(spencerText);
    textGroup.add(steersText);
    return textGroup;
  }

  createText(text, font, size, height) {
    var textGeom = new THREE.TextGeometry(text, {
      size: size,
      height: height,
      font: font,
      material: 0,
      extrudeMaterial: 1,
    });

    var materialArray = [
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true }),
      new THREE.MeshBasicMaterial({ color: 0x777777, transparent: true }),
    ];

    var textMesh = new THREE.Mesh(textGeom, materialArray);
    textGeom.computeBoundingBox();
    var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

    textMesh.position.set(-0.5 * textWidth, 0, 0);
    textMesh.rotation.x = (-20 * Math.PI) / 180;

    return textMesh;
  }
}
