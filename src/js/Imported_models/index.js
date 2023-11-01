import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfUrlSet from '@util'
// * Canvas
const canvas = document.querySelector('.webgl');
// * Scene
const scene = new THREE.Scene();

// * Objects
// * Meshes
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
    })
)
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// * Gltf function
let requireArray = gltfUrlSet(['Fox.gltf', 'Fox.bin', 'Texture.png'], []);
console.log(requireArray);

// * Mixer
let mixer = null;

// * Models
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    requireArray[0],
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2]);
        action.play();

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene);
    }
)
console.log(mixer);

// * Ligths
const ambientLight = new THREE.AmbientLight('0xffffff', 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#0xffffff', 0.2);
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-3, 3, 3)

scene.add(camera);

// * Controls
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

// * Time
const colck = new THREE.Clock();
let perviousTime = 0;
const tick = () => {
    // * Time
    const elapsedTime = colck.getElapsedTime();
    const deltaTime = elapsedTime - perviousTime;
    perviousTime = elapsedTime;

    if (mixer !== null) {
        mixer.update(deltaTime);
    }

    // * Update Controls 禁止阻尼后 更新controls
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick()


