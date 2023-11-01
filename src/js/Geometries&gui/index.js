import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import '../../css/global.css'

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// * 添加多个点 组成的三角形
// const geometry = new THREE.BufferGeometry();
// const count = 500;
// const positionArray = new Float32Array(count * 3 * 3);
// for (let i = 0; i < count * 3 * 3; i++) {
//     positionArray[i] = (Math.random() - 0.5) * 4
// }
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
// geometry.setAttribute('position', positionAttribute);

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: 0x000fff00 })
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// * Debug UI
const gui = new dat.GUI();
// * Color Container
const parameters = {
    color: 0xff000,
    // * 内置函数
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 })
    }
}

// * x y z
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01);
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01);
gui.add(mesh.position, 'z').min(-3).max(3).step(0.01);
// * Visible
gui.add(mesh, 'visible')
// * Wireframe
gui.add(mesh.material, 'wireframe')
// * Color Set
gui.addColor(parameters, 'color').onChange(() => {
    material.color.set(parameters.color);
})
// * Add Function
gui.add(parameters, 'spin');


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// * 相机视角调整
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// * controls 点击鼠标控制模型的转动
const controls = new OrbitControls(camera, canvas)
// * controls enableDamping 禁用阻尼 controls 更流畅
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);

// * Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2)
})

// * Animation
const tick = () => {

    // * Update Controls 禁止阻尼后 更新controls
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();