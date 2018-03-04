
var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;
var MOUSEX = 0;
var MOUSEY = 0;
var WINDOWHALFX = window.innerWidth / 2;
var WINDOWHALFY = window.innerHeight / 2;

var camera;
var camGroup;
var renderer;
var scene;
var composer;
var textComposer;
var textScene;
var textMesh;
var renderTarget;
var fadeMaterial;

GrayscaleRampShader = {

	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }
	},

	vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,

	fragmentShader: `
		uniform float opacity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec3 c1 = vec3(255, 235, 235);
			vec3 c2 = vec3(244, 220, 217);
			vec3 c3 = vec3(198, 191, 210);
			vec3 c4 = vec3(114, 108, 145);
			// vec3 c5 = vec3(63, 52, 70);
			vec3 c5 = vec3(0, 0, 0);
			vec4 texel = texture2D( tDiffuse, vUv );
			
			vec3 use = vec3(0.0, 0.0, 0.0);
			float c = (texel.r + texel.g + texel.b) / 3.0;
			if (c < 0.25) { use = c5; }
			else if (c < 0.4) { use = c4; }
			else if (c < 0.6) { use = c3; }
			else if (c < 0.8) { use = c2; }
			else if (c < 1.0) { use = c1; }
			texel.r = use.r / 256.0;
			texel.g = use.g / 256.0;
			texel.b = use.b / 256.0;
			gl_FragColor = opacity * texel;
		}
	`
};

if (Detector.webgl) {
  init();
  animate();
  startMouseStoppedTimer();
}
else {
  document.getElementById('nowebgl').style.display = 'block';
}

window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.autoClearColor = false;
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(WIDTH, HEIGHT);
  
  var container = document.getElementById('container');
  container.append(renderer.domElement);

  scene = new THREE.Scene();
  
  // create camera
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.z = 10;
  camera.position.y = -4;
  scene.add(camera);
  
  // make transparent plane
  fadeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.01
  });
  var fadePlane = new THREE.PlaneGeometry(10, 10);
  fadeMesh = new THREE.Mesh(fadePlane, fadeMaterial);
  
  // place plane in front of camera
  camera.add(fadeMesh);
  fadeMesh.position.z = -0.5;  
  
  
  

  // draw text
  var padding = 0.1;
  var spencerText = draw_text("SPENCER");
  spencerText.position.y = padding;
  var spencerTextHeight = spencerText.geometry.boundingBox.max.y - spencerText.geometry.boundingBox.min.y;
  var steersText = draw_text("STEERS");
  steersText.position.y = spencerText.position.y - spencerTextHeight - padding;
  scene.add(spencerText);
  scene.add(steersText);
  
  // draw particles
  drawParticles();

  // setup post processing
  // each frame gets copied to the previous frame to create the particle trails
  var parameters = {
    minFilter: THREE.LinearFilter, 
    magFilter: THREE.LinearFilter, 
    format: THREE.RGBAFormat, 
    stencilBuffer: false
  };
  renderTarget = new THREE.WebGLRenderTarget(WIDTH * devicePixelRatio, HEIGHT * devicePixelRatio, parameters);

  composer = new THREE.EffectComposer(renderer, renderTarget);
  composer.addPass(new THREE.RenderPass(scene, camera));

  var copyShader = new THREE.ShaderPass(GrayscaleRampShader);
  copyShader.renderToScreen = true;
  composer.addPass(copyShader);
}


function initPostProcessing() {}

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
        particle = new THREE.Vector3(pX, pY, pZ);

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
    'size': 0.8,
    'height': 0.2,
    'font': 'helvetiker',
    'weight': 'normal',
    'style': 'normal',
    bevelThickness: 1,
    bevelSize: 1,
    bevelEnabled: false,
    material: 0,
    extrudeMaterial: 1
  });

  materialArray = [
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 1  }),
    new THREE.MeshBasicMaterial({ color: 0x444444, shading: THREE.SmoothShading })
  ];

  whiteWireframe =  new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.0 });

  faceMaterial = new THREE.MeshFaceMaterial(materialArray);
  textMesh = new THREE.Mesh(textGeom, faceMaterial);

  textGeom.computeBoundingBox();
  var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
  
  textMesh.position.set(-0.5 * textWidth, 0, 0);
  textMesh.rotation.x = -20 * Math.PI / 180;

  return textMesh;
}

var mouseStoppedTimer;
function startMouseStoppedTimer() {
  clearTimeout(mouseStoppedTimer);
  mouseStoppedTimer = setTimeout(onMouseStopped, 2000);
}

function onMouseStopped() {
  // composer.reset();
}

function onDocumentMouseMove(event) {
  // 
  // fadeMaterial.opacity = 0.05;
  
  
  MOUSEX = (event.clientX - WINDOWHALFX) / 200;
  MOUSEY = (event.clientY - WINDOWHALFY) / 200;
  
  // reset mouse stopped timer
  startMouseStoppedTimer();
}

function onWindowResize() {

  WINDOWHALFX = window.innerWidth / 2;
  WINDOWHALFY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderTarget.setSize(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
  composer.reset();
}




