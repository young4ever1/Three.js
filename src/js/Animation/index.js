import * as THREE from 'three'
import gsap from 'gsap';
// * 形状创建
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x000fff00 })
const mesh = new THREE.Mesh(geometry, material);

const scene = new THREE.Scene();
scene.add(mesh);

// * gsap 运动方式
gsap.to(mesh.position,{duration:1,delay:1,x:2});
gsap.to(mesh.position,{duration:1,delay:2,x:0})

// * 相机
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// * 场景渲染
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);

// * Clock
const clock = new THREE.Clock();
// * Time 时间戳
// let time = Date.now();

// * Animation 动画
const tick = () => {
    // * 时间戳来调整 帧率
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;

    // * 运行时间
    const elapsedTime = clock.getElapsedTime();
    mesh.rotation.y = elapsedTime;

    // * 画圆运动 循环
    // mesh.position.x = Math.cos(elapsedTime); // * 沿着x轴左右运动
    // mesh.position.y = Math.sin(elapsedTime); // * 沿着y轴上下运动

    // * 相机跟随
    // camera.position.x = Math.cos(elapsedTime); // * 沿着x轴左右运动
    // camera.position.y = Math.sin(elapsedTime); // * 沿着y轴上下运动
    // camera.lookAt(mesh.position);

    // * Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick)
}
tick()