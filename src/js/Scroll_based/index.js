import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

// * Debug
const gui = new dat.GUI()
const parameters = {
    materialColor: '#ffeded'
}
gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor);
})

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
const objectsDistance = 4;
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

// * Mesh 位置调整
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2.1;
mesh2.position.x = -1.5;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);
const sectionMeshs = [mesh1, mesh2, mesh3]

// * Particles
// * Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshs.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// * Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    setAttenuation: true,
    size: 0.03
})

// * Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles);

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
// * Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// * Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

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


// * Scroll 
let scrollY = window.scrollY;
let currentSection = 0
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    const newSection = Math.round(scrollY / sizes.height)
    if (newSection != currentSection) {
        currentSection = newSection
        gsap.to(
            sectionMeshs[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: "+=3"
        }
        )
    }
    // console.log(scrollY);
})

// * Cursor
const cursor = {}
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})

const colck = new THREE.Clock();
let previousTime = 0;
const tick = () => {

    // * Time
    const elapsedTime = colck.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // * Camera Animation
    camera.position.y = -scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x;
    const parallaxY = -cursor.y;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // * Mesh Animation
    for (const mesh of sectionMeshs) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick()


