import * as THREE from "three";
import "../../css/global.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import urlFnObject from "@util";
import * as dat from "dat.gui";
import gsap from "gsap";
// import { DirectionalLightHelper } from 'three'

// * Canvas
const canvas = document.querySelector(".webgl");

// * Scene
const scene = new THREE.Scene();

// * Overlay Geometry 加载蒙版
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  vertexShader: `
      void main()
      {
        gl_Position = vec4(position, 1.0);
      }
    `,
  fragmentShader: `
      uniform float uAlpha;
   
      void main()
      {
        gl_FragColor = vec4(0.0, 0.0, 0.0,uAlpha);
      }
    `,
  uniforms: {
    uAlpha: { value: 1 },
  },
});
const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlayMesh);

// * Debug UI
const gui = new dat.GUI();
const debugObject = {};

// * Update all Material
const updateAllMaterial = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

let glftUrlList = [
  "Chess/chess_set_4k.gltf",
  "Chess/chess_set.bin",
  "Chess/textures/chess_set_board_arm_4k.jpg",
  "Chess/textures/chess_set_board_diff_4k.jpg",
  "Chess/textures/chess_set_board_nor_gl_4k.jpg",
  "Chess/textures/chess_set_pieces_black_arm_4k.jpg",
  "Chess/textures/chess_set_pieces_black_diff_4k.jpg",
  "Chess/textures/chess_set_pieces_black_nor_gl_4k.jpg",
  "Chess/textures/chess_set_pieces_white_arm_4k.jpg",
  "Chess/textures/chess_set_pieces_white_diff_4k.jpg",
  "Chess/textures/chess_set_pieces_white_nor_gl_4k.jpg",
];
let result = urlFnObject.gltfUrlSet(glftUrlList, []);
console.log(result);

// * Point show
let pointScreen = false;

// * Point
const points = [
  {  
    position: new THREE.Vector3(-1.4, 0.9, 1.35),
    element: document.querySelector(".point_0"),
  },
];

// * Loading
const loadingBarElement = document.querySelector(".loading-bar");

//  let groupMesh = null;
const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(0.2, () => {
      // * 蒙版动画
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 });
      loadingBarElement.classList.add("enable");
      loadingBarElement.style.transform = "";

      // * 查看场景中的mesh
      //   console.log(scene.children[3].children);
    });
    setTimeout(() => {
      pointScreen = true;
    }, 2000);
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    // * 加载条动画
    let pervLoading = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX(${pervLoading})`;
  }
);

// * Models
const gltfLoader = new GLTFLoader(loadingManager);
// * Cube Texture
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
// * 模型处理
gltfLoader.load(result[0], (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, 0, 0);
  gltf.scene.rotation.y = Math.PI * -0.5;
  scene.add(gltf.scene);
  console.log(gltf.scene);
  console.log(gltf.scene.getObjectByName("piece_queen_white").position);
  // points[0].position = gltf.scene.getObjectByName("piece_rook_white_01").position.x + 1
  console.log(points)
  // * 更新场景材质方法
  updateAllMaterial();
});

// * Environment Map
const environmentMap = cubeTextureLoader.load([
  require("/static/HDR/1/px.png"),
  require("/static/HDR/1/nx.png"),
  require("/static/HDR/1/py.png"),
  require("/static/HDR/1/ny.png"),
  require("/static/HDR/1/pz.png"),
  require("/static/HDR/1/nz.png"),
]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;

// * Debug new object
debugObject.envMapIntensity = 2;
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterial);

// * Ligths
const directionalLight = new THREE.DirectionalLight("#0xffffff", 3);
directionalLight.position.set(0.25, 3, 2.5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);

const Helper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(Helper);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");
gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");

// * Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// * Resize 等比例缩放 场景
window.addEventListener("resize", () => {
  // * Sizes Update
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // * Camera Update
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // * Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  // * Pixel 像素更新
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// * Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 4);

scene.add(camera);

// * Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
// * Update Renderer
renderer.setSize(sizes.width, sizes.height);
// * Pixel 像素更新
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// * Renderer light and lvjing
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1;

// * Renderer shadow true
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// * toneMapping 场景调色
gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterial();
  });
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

// * Time
const colck = new THREE.Clock();
let perviousTime = 0;

// * Mouse
const mouse = new THREE.Vector2();
// * 鼠标滑动事件
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// * 光线追踪
const raycaster = new THREE.Raycaster();
let prevPick = null;
// * 鼠标点击事件
window.addEventListener("click", () => {
  // * 设置事件
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    scene.children[3].children,
    true
  );

  if (intersects.length > 0) {
    if (prevPick !== null) {
      if (prevPick.object.uuid !== intersects[0].object.uuid) {
        // intersects[0].object.material
        console.log(prevPick.object);
      }
    }
    if (intersects[0].object.name !== "board") {
      intersects[0].object.material = new THREE.MeshPhysicalMaterial({
        color: "#f90",
      });
      console.log(intersects[0],'xxxx');
    }
    prevPick = intersects[0];
  }
});

const tick = () => {
  // * Time
  const elapsedTime = colck.getElapsedTime();
  const deltaTime = elapsedTime - perviousTime;
  perviousTime = elapsedTime;

  if (pointScreen) {
    // * Go through each point
    for (const point of points) {
      const screenPosition = point.position.clone();
      screenPosition.project(camera);
      // console.log(screenPosition);

      raycaster.setFromCamera(screenPosition, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length === 0) {
        point.element.classList.add("visible");
      } else {
        const intersectionDistance = intersects[0].distance;
        const pointDistance = point.position.distanceTo(camera.position);
        if (intersectionDistance < pointDistance) {
          point.element.classList.remove("visible");
        } else {
          point.element.classList.add("visible");
        }
      }

      // const translateX = screenPosition.x * sizes.width * 0.5;
      // const translateY = -screenPosition.y * sizes.height * 0.5;

      // point.element.style.transform = `translate(${translateX}px,${translateY}px)`;
    }
  }

  // * Update Controls 禁止阻尼后 更新controls
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
