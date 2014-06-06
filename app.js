
var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
var MOUSEX = 0;
var MOUSEY = 0;
var WINDOWHALFX = window.innerWidth / 2;
var WINDOWHALFY = window.innerHeight / 2;


var camera;
var renderer;
var scene;
var composer;
var textComposer;
var textScene;


if (Detector.webgl) {
  init();
  animate();
}
else
  $("#nowebgl").show();



window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);

function init() {
  
  renderer = new THREE.WebGLRenderer();
  renderer.autoClearColor = false;
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(WIDTH, HEIGHT);
  
  var $container = $('#container');
  $container.append(renderer.domElement);

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0x000000, 1, 1000);



  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.z = 10;
  camera.position.y = -4;
  scene.add(camera);


  // textScene = new THREE.Scene();
  scene.add(draw_text("SPENCER STEERS"));

  drawParticles();

  // post processing 
  var parameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false};
  var renderTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT, parameters);


  composer = new THREE.EffectComposer(renderer, renderTarget);
  composer.addPass(new THREE.RenderPass(scene, camera));

  var effect1 = new THREE.ShaderPass(THREE.DotScreenShader);
  effect1.uniforms.scale.value = 1;
  composer.addPass(effect1);

  var effect2 = new THREE.ShaderPass(THREE.RGBShiftShader);
  effect2.uniforms.amount.value = 0.0001;
  effect2.renderToScreen = true;
  composer.addPass(effect2);

}

function animate() {
  requestAnimationFrame(animate);
  camera.position.x += (-MOUSEX - camera.position.x) * 0.05;
  camera.position.y += (MOUSEY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  render();
}
function render() {
  composer.render();
}

function drawParticles() {
  // create the particle variables
  var particleCount = 800,
      particles = new THREE.Geometry(),
      pMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: 1
      });

  // now create the individual particles
  for (var p = 0; p < particleCount; p++) {

    // create a particle with random
    // position values, -250 -> 250
    var pX = Math.random() * 500 - 250,
        pY = Math.random() * 500 - 250,
        pZ = Math.random() * -500 + 100,
        particle = new THREE.Vertex(
          new THREE.Vector3(pX, pY, pZ)
        );

    // add it to the geometry
    particles.vertices.push(particle);
  }

  // create the particle system
  var particleSystem = new THREE.ParticleSystem(
      particles,
      pMaterial);

  // add it to the scene
  scene.add(particleSystem);
}

function draw_text(text) {
  textGeom = new THREE.TextGeometry(text, {
    'size': 1,
    'height': 0.1,
    'font': 'helvetiker',
    'weight': 'normal',
    'style': 'normal',
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelEnabled: false,
    material: 0,
    extrudeMaterial: 1
  });

  materialArray = [
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1  }),
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF, shading: THREE.SmoothShading })
  ];

  whiteWireframe =  new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.0 });

  faceMaterial = new THREE.MeshFaceMaterial(materialArray);
  text = new THREE.Mesh(textGeom, faceMaterial);

  textGeom.computeBoundingBox();
  var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
  
  text.position.set(-0.5 * textWidth, 0, 0);

  text.rotation.x = -20 * Math.PI / 180;

  return text;
}



function onDocumentMouseMove(event) {
  MOUSEX = (event.clientX - WINDOWHALFX) / 200;
  MOUSEY = (event.clientY - WINDOWHALFY) / 200;
}

function onWindowResize() {

  WINDOWHALFX = window.innerWidth / 2;
  WINDOWHALFY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}