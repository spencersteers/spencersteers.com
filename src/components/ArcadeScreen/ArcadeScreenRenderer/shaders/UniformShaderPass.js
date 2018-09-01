import { ShaderPass } from 'three-full';

let UniformShaderPass = function(shader, timeUniformName = 'time') {
  ShaderPass.call(this, shader);
  this.timeUniformName = timeUniformName;
  this.shouldUpdateTimeUniform = this.uniforms.hasOwnProperty(this.timeUniformName);
  this.elapsedTime = 0;
};

UniformShaderPass.prototype = Object.create(ShaderPass.prototype);
UniformShaderPass.prototype.constructor = UniformShaderPass;

UniformShaderPass.prototype.setUniforms = function(uniforms) {
  let self = this;
  Object.keys(uniforms).forEach(key => {
    self.uniforms[key].value = uniforms[key];
  });
};

UniformShaderPass.prototype.render = function(
  renderer,
  writeBuffer,
  readBuffer,
  delta,
  maskActive
) {
  this.elapsedTime += delta;
  if (this.shouldUpdateTimeUniform) this.uniforms[this.timeUniformName].value = this.elapsedTime;

  ShaderPass.prototype.render.call(this, renderer, writeBuffer, readBuffer, delta, maskActive);
};

export { UniformShaderPass };
