import * as THREE from 'three'
import { Clock } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import '../../css/global.css'
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// * Textures
const texturesLoader = new THREE.TextureLoader();
const pointTexture = texturesLoader.load(require('/static/textures/particles/circle_02.png'))

// * Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 1000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random()
}
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// * Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.15;
particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.Color('#ff88cc')
particlesMaterial.map = pointTexture
// * Bug 处理
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
// * 支持随机色
particlesMaterial.vertexColors = true

// * Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles);

// * Cube 
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry,
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const ambinetLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambinetLight);
const pointLight = new THREE.PointLight(0xffffff, 0.7);
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight);

// * Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 6;
camera.position.y = 8;
scene.add(camera);

// * Controls
// * controls 点击鼠标控制模型的转动
const controls = new OrbitControls(camera, canvas)
// * controls enableDamping 禁用阻尼 controls 更流畅
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2)

})
const clock = new Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // *
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3];
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // * Update Controls 禁止阻尼后 更新controls
    controls.update();

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick();
