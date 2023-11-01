import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xfff00 })
)
scene.add(cube);

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
camera.position.z = 3;
scene.add(camera);

// * Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// * Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);

const tick = () => {

    // * 鼠标控制事件更新
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick()


