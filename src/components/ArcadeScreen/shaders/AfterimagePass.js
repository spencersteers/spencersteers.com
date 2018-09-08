/**
 * @author HypnosNova / https://www.threejs.org.cn/gallery/
 */

import { Scene } from 'three-full/sources/scenes/Scene';
import { Pass } from 'three-full/sources/postprocessing/Pass';
import { UniformsUtils } from 'three-full/sources/renderers/shaders/UniformsUtils';
import { WebGLRenderTarget } from 'three-full/sources/renderers/WebGLRenderTarget';
import { ShaderMaterial } from 'three-full/sources/materials/ShaderMaterial';
import { PlaneBufferGeometry } from 'three-full/sources/geometries/PlaneGeometry';
import { OrthographicCamera } from 'three-full/sources/cameras/OrthographicCamera';
import { Mesh } from 'three-full/sources/objects/Mesh';
import { MeshBasicMaterial } from 'three-full/sources/materials/MeshBasicMaterial';
import {
  LinearFilter,
  NearestFilter,
  RGBAFormat
} from 'three-full/sources/constants';
import { AfterimageShader } from './AfterimageShader';

let AfterimagePass = function(damp) {
  Pass.call(this);


  this.shader = AfterimageShader;

  this.uniforms = UniformsUtils.clone(this.shader.uniforms);

  this.uniforms['damp'].value = damp !== undefined ? damp : 0.96;

  this.textureComp = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: LinearFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
  });

  this.textureOld = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: LinearFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
  });

  this.shaderMaterial = new ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: this.shader.vertexShader,
    fragmentShader: this.shader.fragmentShader,
  });

  this.sceneComp = new Scene();
  this.scene = new Scene();

  this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  this.camera.position.z = 1;

  var geometry = new PlaneBufferGeometry(2, 2);

  this.quadComp = new Mesh(geometry, this.shaderMaterial);
  this.sceneComp.add(this.quadComp);

  var material = new MeshBasicMaterial({
    map: this.textureComp.texture,
  });

  var quadScreen = new Mesh(geometry, material);
  this.scene.add(quadScreen);
};

AfterimagePass.prototype = Object.assign(Object.create(Pass.prototype), {
  constructor: AfterimagePass,

  render: function(renderer, writeBuffer, readBuffer) {
    this.uniforms['tOld'].value = this.textureOld.texture;
    this.uniforms['tNew'].value = readBuffer.texture;

    this.quadComp.material = this.shaderMaterial;

    renderer.render(this.sceneComp, this.camera, this.textureComp);
    renderer.render(this.scene, this.camera, this.textureOld);

    if (this.renderToScreen) {
      renderer.render(this.scene, this.camera);
    } else {
      renderer.render(this.scene, this.camera, writeBuffer, this.clear);
    }
  },
});

export { AfterimagePass };
