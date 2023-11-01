import * as THREE from "three";
import "../../css/global.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import {}
import urlFnObject from "@util";
import * as dat from "dat.gui";
import gsap from "gsap";
// import { DirectionalLightHelper } from 'three'
// *
import shapeFn from "./Shape/index.js";
// console.log(shapeFn);
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
// * 模型加载
let glftUrlList = ["building/zhllt.glb"];
let result = urlFnObject.gltfUrlSet(glftUrlList, []);
console.log(result);

// * 光圈shape
const circleYs = [];

// * Loading
const loadingBarElement = document.querySelector(".loading-bar");

//  let groupMesh = null;
const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(0.2, () => {
      // * 蒙版动画
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 });
      //   loadingBarElement.classList.add("enable");
      //   loadingBarElement.style.transform = "";

      // * 查看场景中的mesh
      //   console.log(scene.children[3].children);
    });
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    console.log(itemsLoaded);
    if (itemsLoaded === 9) {
      setTimeout(() => {
        // * 光圈
        // const projection = d3.geoMercator().center([104.06, 34.26]).translate([0, 0]);
        // const res1 = projection([116.405285, 39.904989]);
        shapeFn.spotCircle(scene, [-5, -18, -2], circleYs);
        // shapeFn.wallShape(scene)
      }, 500);
    }
    // * 加载条动画
    // let pervLoading = itemsLoaded / itemsTotal;
    // loadingBarElement.style.transform = `scaleX(${pervLoading})`;
    // console.log(itemsLoaded, itemsTotal);
  }
);

// * Models
const gltfLoader = new GLTFLoader(loadingManager);
// * Cube Texture
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
// * 模型处理
gltfLoader.load(result[0], (gltf) => {
  gltf.scene.scale.set(1, 1, 1);
  gltf.scene.position.set(0, -20, 0);
  console.log(gltf.scene.children[0].children[0].material);
  gltf.scene.children[0].children[0].material.color.set("#0527AF");
  gltf.scene.children[0].children[0].material.transparent = true;
  // * 解决遮挡问题
  gltf.scene.children[0].children[0].material.depthTest = false;
  gltf.scene.children[0].children[0].material.opacity = 0.85;

  gltf.scene.side = THREE.DoubleSide;
  scene.add(gltf.scene);
  console.log(gltf.scene.children);

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
// scene.background = environmentMap;
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
directionalLight.position.set(0.25, -1.445, 2.5);
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
  120
);
// -48 15 44
camera.position.set(-48, 15, 44);

scene.add(camera);

gui.add(camera.position, "x").min(-150).max(150).step(1).name("camerax");
gui.add(camera.position, "y").min(-150).max(150).step(1).name("cameray");
gui.add(camera.position, "z").min(-150).max(150).step(1).name("cameraz");

// * Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false; //禁止右键拖拽
controls.enableZoom = false; //禁止缩放
// controls.enableRotate = false; //禁止旋转
controls.autoRotate = true; // 禁止旋转
controls.autoRotateSpeed = 3; // 旋转速度
// controls.maxPolarAngle = Math.PI;
// controls.minPolarAngle = -1;
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
renderer.toneMapping = THREE.LinearToneMapping;
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

const tick = () => {
  // * Time
  const elapsedTime = colck.getElapsedTime();
  const deltaTime = elapsedTime - perviousTime;
  perviousTime = elapsedTime;
  // * 标记点动画
  circleYs.forEach(function (mesh) {
    mesh._s += 0.004;

    // mesh.material.transparent = true;
    mesh.scale.set(1 * mesh._s, 1 * mesh._s);
    if (mesh._s <= 1.5) {
      mesh.material.opacity = 1.5 - mesh._s;
      // console.log(2 - mesh._s )
    } else {
      // setTimeout(() => {
      mesh._s = 1;
      // }, 2000);
    }
  });

  // * Update Controls 禁止阻尼后 更新controls
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
