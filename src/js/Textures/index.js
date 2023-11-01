import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import '../../css/global.css'
// * 贴图列表
const texturesList = [
    {
        detailTextures: require('/static/textures/kiwis.png')
    }
]
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// * Textures
// * 加载文件管理器
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log("onStart")
}

loadingManager.onLoaded = () => {
    console.log("onLoaded")
}

loadingManager.onProgress = () => {
    console.log("onProgress")
}

loadingManager.onError = () => {
    console.log("onError")
}
// * 材质加载器
const texturesLoader = new THREE.TextureLoader(loadingManager);
const firstTextures = texturesLoader.load(
    texturesList[0].detailTextures,
    () => {
        console.log('load');
    },
    () => {
        console.log('progress');
    },
    () => {
        console.log('error');
    }
)

// ! xxxx
firstTextures.magFilter = THREE.NearestFilter;

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ map: firstTextures })
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
    canvas,
    // * 抗锯齿
    antialias: true,
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