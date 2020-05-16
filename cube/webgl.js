const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require('eases')



// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  animate: true,
  context: "webgl",
  fps: 24,
  duration: 4
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#ccff00", 0.666);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Setup a material

  const palette = random.pick(palettes);

  for (let i = 0; i < 40; i++) {
    const color = random.pick(palette);

    const material = new THREE.MeshStandardMaterial({
      color,
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);

    const positionX = random.range(-1, 1);
    const positionY = random.range(-1, 1);
    const positionZ = random.range(-1, 1);

    const scaleX = random.range(-1, 1);
    const scaleY = random.range(-1, 1);
    const scaleZ = random.range(-1, 1);

    mesh.position.set(positionX, positionY, positionZ);

    mesh.scale.set(scaleX, scaleY, scaleZ);

    mesh.scale.multiplyScalar(0.5);

    scene.add(mesh);
  }

  const ambientColor = random.pick(palette);
  const ambientLight = new THREE.AmbientLight(ambientColor);

  scene.add(ambientLight);

  const lighColor = random.pick(palette);

  const light = new THREE.DirectionalLight(lighColor, 1);

  light.position.set(0, 0, 4);

  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {

      scene.rotation.z = eases.expoInOut(Math.sin(playhead * Math.PI * 2));
      scene.rotation.y = eases.expoInOut(Math.cos(playhead * Math.PI * 2));

      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
