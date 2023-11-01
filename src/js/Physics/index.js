import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import CANNON from 'cannon'
console.log(CANNON);
// * Debug
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

// * Canvas
const canvas = document.querySelector('.webgl');
// * Scene
const scene = new THREE.Scene();

// * Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(require('/static/textures/matcaps/spcail.png'))
matcapTexture.magFilter = THREE.NearestFilter

// * Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    map: matcapTexture
    // gradientMap:matcapTexture
})

// * Objects
// * Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

scene.add(mesh1);

// * Ligths
const directionalLight = new THREE.DirectionalLight('#fffff', 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

// * Size
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


// * Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
// * Update Renderer
renderer.setSize(sizes.width, sizes.height);
// * Pixel 像素更新
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


const colck = new THREE.Clock();
const tick = () => {
    // * Time
    const elapsedTime = colck.getElapsedTime();

    // * Update Controls 禁止阻尼后 更新controls
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick()


