import * as THREE from "three";
import "../../css/global.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import urlFnObject from "@util";
import * as dat from "dat.gui";
// import { DirectionalLightHelper } from 'three'

// * Canvas
const canvas = document.querySelector(".webgl");
// * Scene
const scene = new THREE.Scene();

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
      // child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

// * FightHelmet


let requireArray = [
  require("/static/models/glTF/Fabric/FlightHelmet.gltf"),
  require("/static/models/glTF/Fabric/FlightHelmet.bin"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_GlassPlasticMat_BaseColor.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_GlassPlasticMat_Normal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_GlassPlasticMat_OcclusionRoughMetal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_LeatherPartsMat_BaseColor.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_LeatherPartsMat_Normal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_LeatherPartsMat_OcclusionRoughMetal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_LensesMat_BaseColor.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_LensesMat_Normal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_LensesMat_OcclusionRoughMetal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_MetalPartsMat_BaseColor.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_MetalPartsMat_Normal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_MetalPartsMat_OcclusionRoughMetal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_RubberWoodMat_BaseColor.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_RubberWoodMat_Normal.png"),
  require("/static/models/glTF/Fabric/FlightHelmet_Materials_RubberWoodMat_OcclusionRoughMetal.png"),
];

// * Models
const gltfLoader = new GLTFLoader();
gltfLoader.load(requireArray[0], (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * -0.5;
  scene.add(gltf.scene);
  updateAllMaterial();
});

// * Cube Texture
const cubeTextureLoader = new THREE.CubeTextureLoader();

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
scene.add(Helper);

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
const tick = () => {
  // * Time
  const elapsedTime = colck.getElapsedTime();
  const deltaTime = elapsedTime - perviousTime;
  perviousTime = elapsedTime;
  // console.log(deltaTime)

  // * Update Controls 禁止阻尼后 更新controls
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
