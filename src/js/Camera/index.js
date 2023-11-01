import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0x000fff00 })
)
scene.add(mesh);
const sizes = {
    width: 800,
    height: 800
}


// * 相机视角调整
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
// camera.lookAt(mesh.position);
scene.add(camera);

// * controls 点击鼠标控制模型的转动
const controls = new OrbitControls(camera, canvas)
// * controls enableDamping 禁用阻尼 controls 更流畅
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);

// * cursor
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    // * 保证平均值 移动值相同
    // console.log(event.clientX / sizes.width - 0.5);
    cursor.x = event.clientX / sizes.width - 0.5;
    // * 负值解决 光标随几何体移动
    cursor.y = -(event.clientY / sizes.height - 0.5);
})

// * Animation
// const clock = new THREE.Clock();
const tick = () => {
    // const elapsedTime = clock.getElapsedTime();
    // mesh.rotation.y = elapsedTime;

    // * Update Camera 旋转
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(new THREE.Vector3());

    // * Update Controls 禁止阻尼后 更新controls
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();
