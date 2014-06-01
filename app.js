
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


init();
render();



window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);

function init() {

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.sortObjects = false;
  renderer.autoClearColor = false;
  renderer.setSize(WIDTH, HEIGHT);
  
  var $container = $('#container');
  $container.append(renderer.domElement);

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.z = 10;
  camera.position.y = -4;
  scene.add(camera);


  draw_text("SPENCER STEERS");
  drawParticles();

  // post processing 
  var parameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false};
  var renderTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT, parameters);


  composer = new THREE.EffectComposer(renderer, renderTarget);
  composer.addPass(new THREE.RenderPass(scene, camera));

  var effect1 = new THREE.ShaderPass(THREE.DotScreenShader);
  effect1.uniforms.scale.value = 1;
  // composer.addPass(effect1);

  var effect2 = new THREE.ShaderPass(THREE.RGBShiftShader);
  effect2.uniforms.amount.value = 0.00015;
  effect2.renderToScreen = true;
  composer.addPass(effect2);
}

function render() {
  update();

  requestAnimationFrame(render); 
  renderer.clear();
  composer.render();
}

function update() {
  camera.position.x += (MOUSEX - camera.position.x) * 0.05;
  camera.position.y += (-MOUSEY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
}

function drawParticles() {
  // create the particle variables
  var particleCount = 1800,
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
        pZ = Math.random() * 500 - 250,
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

function initFBO() {
  var fboMat = new THREE.MeshBasicMaterial({color:0xffffff, transparent: true, opacity: 0.5, map: fbo});
  var fboGeo = new THREE.PlaneGeometry(WIDTH, HEIGHT);
  fboMesh = new THREE.Mesh(fboGeo, fboMat);
  fboMesh.position.z = -10;
  fboMesh.position.x = -5;
}

function grid() {
  var size = 50, step = 5;

  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial({ color: 0x333333, opacity: 1 });

  for (var i = - size; i <= size; i += step) {

    geometry.vertices.push(new THREE.Vector3(- size, 0, i));
    geometry.vertices.push(new THREE.Vector3(  size, 0, i));

    geometry.vertices.push(new THREE.Vector3(i, 0, - size));
    geometry.vertices.push(new THREE.Vector3(i, 0,   size));

  }

  var line = new THREE.Line(geometry, material, THREE.LinePieces);
  scene.add(line);
}

function draw_lines() {
  var linegeo = new THREE.Geometry();
  var linemat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1 });
  linegeo.vertices.push(new THREE.Vector3(0, 30, -100));
  linegeo.vertices.push(new THREE.Vector3(4, 0, 0));
  var line = new THREE.Line(linegeo, linemat, THREE.LinePieces);
  scene.add(line);

  var linegeo2 = new THREE.Geometry();
  linegeo2.vertices.push(new THREE.Vector3(0, 30, -100));
  linegeo2.vertices.push(new THREE.Vector3(-4, 0, 0));
  var line2 = new THREE.Line(linegeo2, linemat, THREE.LinePieces);
  scene.add(line2);
}

function draw_line(start_position, end_position) {
  var linegeo = new THREE.Geometry();
  var linemat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1 });
  linegeo.vertices.push(start_position);
  linegeo.vertices.push(end_position);
  var line = new THREE.Line(linegeo, linemat, THREE.LinePieces);
  scene.add(line);
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

  scene.add(text);
  //draw_geometry_lines(text);

  // Outline

  var outlineMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000});
  var outlineMesh1 = new THREE.Mesh(textGeom, outlineMaterial1);
  
  outlineMesh1.scale.multiplyScalar(1.05);
  // scene.add(outlineMesh1);
}

function draw_geometry_lines(mesh) {
  var geo = mesh.geometry;
  var vertices = geo.vertices;
  var start = new THREE.Vector3(0, 30, -100);
  for (var i = 0;i < vertices.length; i += 25) {
    var vertex = vertices[i];
    var end = new THREE.Vector3(vertex.x, vertex.y, vertex.z);
    draw_line(start, end);
  }
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