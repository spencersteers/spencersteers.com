import { ShaderPass } from 'three-full';

let TemporalShaderPass = function(shader, timeUniformName = 'time') {
  ShaderPass.call(this, shader);
  this.timeUniformName = timeUniformName;
  this.elapsedTime = 0;
};

TemporalShaderPass.prototype = Object.create(ShaderPass.prototype);
TemporalShaderPass.prototype.constructor = TemporalShaderPass;

TemporalShaderPass.prototype.setUniforms = function(uniforms) {
  let self = this;
  Object.keys(uniforms).forEach(key => {
    self.uniforms[key].value = uniforms[key];
  });
};

TemporalShaderPass.prototype.render = function(
  renderer,
  writeBuffer,
  readBuffer,
  delta,
  maskActive
) {
  this.elapsedTime += delta;
  if (this.uniforms.hasOwnProperty(this.timeUniformName))
    this.uniforms[this.timeUniformName].value = this.elapsedTime;

  ShaderPass.prototype.render.call(this, renderer, writeBuffer, readBuffer, delta, maskActive);
};

export { TemporalShaderPass };
