import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const gui = new dat.GUI();

// * Textures
const texturesLoader = new THREE.TextureLoader();
// const wallTextures = texturesLoader.load(require('/static/textures/fancy-pants.jpg'))
const albedoTextures = texturesLoader.load(require('/static/textures/box/storage-container2-albedo.png'))
const aoTextures = texturesLoader.load(require('/static/textures/box/storage-container2-ao.png'))
const heightTextures = texturesLoader.load(require('/static/textures/box/storage-container2-height.png'))
const metallicTextures = texturesLoader.load(require('/static/textures/box/storage-container2-metallic.png'))
const roughnessTextures = texturesLoader.load(require('/static/textures/box/storage-container2-roughness.png'))
const normalTextures = texturesLoader.load(require('/static/textures/box/storage-container2-normal-ogl.png'))

// albedoTextures.minFilter = THREE.NearestFilter;
// albedoTextures.magFilter = THREE.NearestFilter;
// albedoTextures.generateMipmaps = THREE.NearestFilter;


// const material = new THREE.MeshBasicMaterial();
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshDepthMaterial();

// * 对灯光敏感
// const material = new THREE.MeshLambertMaterial();

// * 有反射光
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100
// material.specular = new THREE.Color(0xff0000) // * 反射光颜色

// * 卡通
// const material = new THREE.MeshToonMaterial();

const material = new THREE.MeshStandardMaterial();
material.metalness = 0; // * 贴图程度
material.roughness = 1; // * 粗糙度
material.map = albedoTextures; // * 基础贴图
material.aoMap = aoTextures;   // * ao 贴图
material.aoMapIntensity = 1;
material.displacementMap = heightTextures // * 置换贴图
material.displacementScale = 0.001
material.metalnessMap = metallicTextures // * 金属贴图
material.roughnessMap = roughnessTextures // * 粗糙贴图
material.normalMap = normalTextures // * 法线贴图
material.normalScale.set(1,1);

// material.wireframe = true;

// * 设置颜色
// material.color.set('red');

// * 设置材质
// material.map = wallTextures;

// * 设置透明度
// material.transparent = true;
// material.opacity = 0.5;

// * side 可见程度
material.side = THREE.DoubleSide;

// * GUI
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
gui.add(material, 'displacementScale').min(-1).max(1).step(0.0001);


// * Lights
const ambinetLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambinetLight);
const pointLight = new THREE.PointLight(0xffffff, 0.7);
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight);

// * 1
const boxBuffer = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1,300,300,300),
    material
)
boxBuffer.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(boxBuffer.geometry.attributes.uv.array, 2)
)

// * 2
const planeBuffer = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
)
planeBuffer.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(planeBuffer.geometry.attributes.uv.array, 2)
)
planeBuffer.position.x = 2

// * 3
const sphereBuffer = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,32),
    material
)
sphereBuffer.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphereBuffer.geometry.attributes.uv.array, 2)
)
sphereBuffer.position.x = -2

scene.add(boxBuffer, planeBuffer, sphereBuffer);

// * Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// * Resize 等比例缩放 场景
window.addEventListener('resize', () => {

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
})

// * 全屏场景 及 兼容浏览器写法
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }

    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
})

// * Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 2.5;
camera.position.y = 1;
scene.add(camera);

// * Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// * Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height);


const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // * Update Object
    boxBuffer.rotation.y = 0.2 * elapsedTime;
    planeBuffer.rotation.y = 0.2 * elapsedTime;
    sphereBuffer.rotation.y = 0.2 * elapsedTime;

    boxBuffer.rotation.z = 0.2 * elapsedTime;
    planeBuffer.rotation.z = 0.2 * elapsedTime;
    // sphereBuffer.rotation.z = 0.2 * elapsedTime;


    // * 鼠标控制事件更新
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick()


