let renderer,
  camera,
  controls,
  scene,
  width = window.innerWidth,
  height = window.innerHeight;

const white = 0xffffff;
const gray = 0xccff00;
const pink = 0xff00ff;

init();
animate();
addShapes();
render();

function addShapes() {
  const num = 20;
  const distance = 10;
  const offset = 50;

  for (let i = 0; i < num; i++) {
    const streetX = random(1, 5);

    for (let j = 0; j < num; j++) {
      const streetZ = random(1, 50);

      const color = new THREE.Color(`hsl(${random(180, 210)}, 50%, 50%)`);
      const height = random(25, 75);
      const geometry = new THREE.BoxGeometry(10, height, 10);
      const material = new THREE.MeshLambertMaterial({
        color,
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = distance * i + streetX * streetZ;

      mesh.position.z = distance * j;

      scene.add(mesh);
    }
  }

  const geoBall = new THREE.DodecahedronGeometry(50, 1);
  const matBall = new THREE.MeshToonMaterial({ color: 0xff00cc });
  const ball = new THREE.Mesh(geoBall, matBall);

  ball.position.y = 150;

  scene.add(ball);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function init() {
  initRenderer();
  initCamera();
  initControls();
  initScene();
  initLights();
  initWindowListeners();

  function initCamera() {
    camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 600;
    camera.position.y = 200;
    camera.position.x = 300;
  }

  function initControls() {
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
  }

  function initLights() {
    const light1 = new THREE.AmbientLight(white, 0.5),
      light2 = new THREE.DirectionalLight(white);

    light2.position.set(15, 15, -15);
    scene.add(light1);
    scene.add(light2);
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("canvas"),
      antialias: true,
    });
    renderer.setClearColor(gray);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
  }

  function initScene() {
    scene = new THREE.Scene();
  }

  function initWindowListeners() {
    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      camera.aspect = width / height;
      //camera.updateProjectMatrix();
      renderer.setSize(width, height);
      controls.handleResize();
    }
  }
}

function render() {
  renderer.render(scene, camera);
}

function random(min, max) {
  return Math.random() * max - min + min;
}
