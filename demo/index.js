var createLayout = require('../');

var THREE = require('three');
var renderer = new THREE.WebGLRenderer({
  antialias: false
});
var scene = new THREE.Scene();
scene.sortObjects = false;

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1000;
camera.lookAt(new THREE.Vector3(0, 0, 0));

renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var generate = require('ngraph.generators');

var graph = generate.grid(100, 100);
var layout = createLayout(graph);
var viewModel = createViews(graph);

render();

function render() {
  requestAnimationFrame(render);
  viewModel.positions.needsUpdate = true;
  renderPoints(viewModel.points, layout.getPositions());
  renderer.render(scene, camera);
}

function renderPoints(destination, source) {
  var length = source.length / 2;
  for (var i = 0; i < length; ++i) {
    var si = i * 2;
    var di = i * 3;

    destination[di] = source[si];
    destination[di + 1] = source[si + 1];
    destination[di + 3] = 0;
  }
}

function createViews(graph) {
  var total = graph.getNodesCount();
  var points = new Float32Array(total * 3);
  var colors = new Float32Array(total * 3);
  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(points, 3));
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

  var color = new THREE.Color();

  for (var i = 0; i < total * 3; i += 3) {
    color.setRGB(1, 1, 1);

    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  var particleMaterial = new THREE.PointCloudMaterial({
    size: 15,
    vertexColors: THREE.VertexColors
  });
  var particleSystem = new THREE.PointCloud(geometry, particleMaterial);
  scene.add(particleSystem);

  return {
    positions: geometry.getAttribute('position'),
    points: points
  };
}
