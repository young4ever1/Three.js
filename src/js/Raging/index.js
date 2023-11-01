import * as THREE from "three";
import "../../css/global.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import testVertex from "./test/vertex.glsl";
import testFragment from "./test/fragment.glsl";
import * as dat from "dat.gui";
const gui = new dat.GUI();
// * Canvas
const canvas = document.querySelector(".webgl");

// * Scence
const scene = new THREE.Scene();

// * 几何体
const geometry = new THREE.PlaneGeometry(2, 2, 128, 128);

// * 颜色合集
const debugObjects = {};
debugObjects.depthColor = "#186691";
debugObjects.surfaceColor = "#9bd8ff";

// * 材质
const material = new THREE.ShaderMaterial({
  vertexShader: testVertex,
  fragmentShader: testFragment,
  uniforms: {
    uTime: { value: 0 },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },

    uDepthColor: { value: new THREE.Color(debugObjects.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObjects.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },
  },
});
gui
  .add(material.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevation");
gui
  .add(material.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesElevation");
gui
  .add(material.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesElevation");
gui
  .add(material.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uBigWavesSpeed");
gui
  .addColor(debugObjects, "depthColor")
  .name("depthColor")
  .onChange(() => {
    material.uniforms.uDepthColor.value.set(debugObjects.depthColor);
  });

gui
  .addColor(debugObjects, "surfaceColor")
  .name("surfaceColor")
  .onChange(() => {
    material.uniforms.uSurfaceColor.value.set(debugObjects.surfaceColor);
  });

gui
  .add(material.uniforms.uColorOffset, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uColorOffset");

gui
  .add(material.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uColorMultiplier");

// * Mesh 网状结构
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI * 0.5;
scene.add(mesh);

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
camera.position.set(1, 1, 1);
scene.add(camera);

// * Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// * Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);

// * Request
const clock = new THREE.Clock();
const tick = () => {
  controls.update();
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
