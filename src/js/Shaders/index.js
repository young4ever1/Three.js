import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import testVertex from './test/vertex.glsl'
import testFragment from './test/fragment.glsl'
// import texture2D from 'three'
// console.log(texture2D);
// * Canvas
const canvas = document.querySelector('.webgl');

// * Scence
const scene = new THREE.Scene();

// * Textures
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load(require('/static/textures/china.png'));

const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

// * Attribute
const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for(let i = 0;i<count;i++){
    randoms[i] = Math.random()
}
console.log(geometry.attributes.uv.array);

geometry.setAttribute('aRandom',new THREE.BufferAttribute(randoms,1));
console.log(geometry.addAttribute);

const material = new THREE.RawShaderMaterial({
    vertexShader: testVertex,
    fragmentShader: testFragment,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor:{value:new THREE.Color('orange')},
        uTexture: { value: flagTexture }
    }
})

// * Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

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
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// * Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// * Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
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
}
tick();