var scene, aspect, camera, renderer;
var sea, light, hemisphereLight, fog;

var init = function() {
  scene = new THREE.Scene();
  aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 5000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  scene.fog = new THREE.FogExp2(0xf0f0f0, 0.01);
  scene.background = new THREE.Color(0xf0f0f0);
  sea = new Sea();
  hemisphereLight = new THREE.HemisphereLight(0xffc8ee, 0x33ccff);
  scene.add(hemisphereLight);
  light = new THREE.DirectionalLight(0x404040, 0.5);
  light.position.set(0, 5, 0);
  light.target.position.set(100, 0, 0);
  light.castShadow = true;
  var plane = sea.getPlane();
  plane.castShadow = true;
  plane.receiveShadow = true;
  light.add(plane);
  scene.add(light);
  scene.add(plane);
  camera.position.y = 10;
  camera.position.z = 5;
  camera.lookAt(100, -50, 0);
}

var render = function() {
  requestAnimationFrame( render );
  sea.render();
  renderer.render( scene, camera );
};

var Sea = function() {
  this.geometry = new THREE.PlaneBufferGeometry(1000, 1000, 100, 100);
  this.material = new THREE.MeshStandardMaterial({ opacity: 0.5, color: 0x33ccff, roughness: 1.0, metalness: 0.0 });
  this.plane = new THREE.Mesh(this.geometry, this.material);
  this.pointTimer = [];

  this.geometry.rotateX(-Math.PI / 2);
  var position = this.geometry.attributes.position;
  position.dynamic = true;
  for (let i = 0; i < position.count; i += 1) {
    const r = Math.random();
    this.pointTimer.push(THREE.Math.mapLinear(r, 0, 1, 0, Math.PI * 2));
    position.setY(i, THREE.Math.mapLinear(r, 0, 1, -2, 2));
  }
};

Sea.prototype.getPlane = function() {
  return this.plane;
};

Sea.prototype.render = function() {
  var position = this.geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const pt = this.pointTimer[i];
    const h = Math.sin(pt);
    position.setY(i, h * 2);
    this.pointTimer[i] += 0.05;
  }
  position.needsUpdate = true;
};

init();
render();