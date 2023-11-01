import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import '../../css/global.css'

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// * Lights
// * 环境光
const ambinetLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambinetLight);

// * directionalLight
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, -1)
scene.add(directionalLight);
// * 开启阴影
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.radius = 10;
// * Helper
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// * Spont Light
const spontLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);

spontLight.castShadow = true;
spontLight.shadow.mapSize.width = 1024;
spontLight.shadow.mapSize.height = 1024;
spontLight.shadow.camera.fov = 30
spontLight.shadow.camera.near = 1
spontLight.shadow.camera.far = 6

spontLight.position.set(0, 2, 2);
scene.add(spontLight);
scene.add(spontLight.target);
// * Helper
const spontLightCameraHelper = new THREE.CameraHelper(spontLight.shadow.camera)
spontLightCameraHelper.visible = false
scene.add(spontLightCameraHelper);

// * pointLight
const pointLight = new THREE.PointLight(0xffffff, 0.2);

pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)


const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
// * 球体
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
// ! 开启阴影
sphere.castShadow = true;
sphere.position.y = 0;

// * 平面
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
// ! 开启阴影
plane.receiveShadow = true
plane.position.y = -0.5
plane.rotation.x = -Math.PI * 0.5
scene.add(sphere, plane);

// * Textures
const shadowTexture = new THREE.TextureLoader().load(require('/static/textures/matcaps/first.png'));
console.log(shadowTexture);
// * 增加材质阴影
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x00000,
        transparent: true,
        alphaMap: shadowTexture
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow);


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// * 相机视角调整
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 1.5;

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
// ! 场景渲染开启阴影
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

// * Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2)

})

const clock = new THREE.Clock();

// * Animation
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 2));

    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.7;



    // * Update Controls 禁止阻尼后 更新controls
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();