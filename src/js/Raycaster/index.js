import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const cube1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff00 })
)
scene.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff00 })
)
cube2.position.x = -1.5
scene.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff00 })
)
cube3.position.x = 1.5
scene.add(cube3);

// * Raycaster
const rayCaster = new THREE.Raycaster;


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

// * Mouse
const mouse = new THREE.Vector2()
// * 鼠标滑动事件
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
    // console.log(mouse.x, mouse.y);
})
// * 鼠标点击事件
window.addEventListener('click', () => {
    if (currentInterscet) {
        console.log(currentInterscet.object);
        switch (currentInterscet.object) {
            case cube1:
                console.log('click on object1...')
                break;
            case cube2:
                console.log('click on object2...')
                break;
            case cube3:
                console.log('click on object3...')
                break;
            default:
                break;
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
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height);

const colck = new THREE.Clock()


// * Animation

let currentInterscet = null;

const tick = () => {
    const elapsedTime = colck.getElapsedTime()

    // * 球体运动
    // cube1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    // cube2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    // cube3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // * 设置事件
    rayCaster.setFromCamera(mouse, camera);
    // * 物体原始位置
    const objectsToTest = [cube1, cube2, cube3];
    // * 光线追踪 成功时 把物体对象放入同一个数组
    const intersects = rayCaster.intersectObjects(objectsToTest);

    for (const object of objectsToTest) {
        object.material.color.set('#0fff00');
    }

    for (const intersect of intersects) {
        // console.log(intersect,2)
        intersect.object.material.color.set('#0000ff');
    }

    // * 判断鼠标滑过事件 开始与结束
    if (intersects.length) {
        if (currentInterscet === null) {
            console.log('mouse enter');
        }
        currentInterscet = intersects[0]
    }
    else {
        if (currentInterscet) {
            console.log('mouse leave');
        }
        currentInterscet = null;
    }


    // * 鼠标控制事件更新
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick()


