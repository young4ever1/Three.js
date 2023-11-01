import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import testVertex from './test/vertex.glsl'
import testFragment from './test/fragment.glsl'
// * Canvas
const canvas = document.querySelector('.webgl');

// * Scence
const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(5,5);

const material = new THREE.RawShaderMaterial({
    vertexShader: testVertex,
    fragmentShader: testFragment,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        // uColor:{value:new THREE.Color('orange')},
        // uTexture: { value: flagTexture }
    }
})

// * Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = -1.5
mesh.rotation.x = -Math.PI * 0.5

// mesh.rotateZ = -250
// mesh.scale.y = 2 / 3;
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
camera.position.set(3, 3,1.5);
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