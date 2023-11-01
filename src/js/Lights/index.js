import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import '../../css/global.css'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'; 

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();


// * Lights
// * 环境光
const ambinetLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambinetLight);


// * 全方位光
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight);
// * Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.2);
scene.add(directionalLightHelper);


// * 上下分割光
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight);
// * Helper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight,0.2);
scene.add(hemisphereLightHelper);


// * 光源点
const pointLight = new THREE.PointLight(0xff9000, 0.5);
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight);
// * Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight,0.15);
scene.add(pointLightHelper);


// * 直射区域光
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-0.8, -0.5, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight);

// * Helper
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);
window.requestAnimationFrame(()=>{
    rectAreaLightHelper.position.copy(rectAreaLight.position);
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion);
    rectAreaLightHelper.update()
})



// * 聚光灯
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.1, 0.5);
spotLight.position.set(0,2,3)
scene.add(spotLight);
spotLight.target.position.x = 0.75;
spotLight.target.position.y = 0.75
scene.add(spotLight.target);

// * Helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
window.requestAnimationFrame(()=>{
    spotLightHelper.update()
})


const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = -1.5;

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.position.y = -0.65
plane.rotation.x = -Math.PI * 0.5

scene.add(sphere, cube, torus, plane);


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// * 相机视角调整
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = 1.5;
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

    sphere.rotation.y = 0.3 * elapsedTime;
    cube.rotation.y = 0.3 * elapsedTime;
    torus.rotation.y = 0.3 * elapsedTime;

    sphere.rotation.x = 0.3 * elapsedTime;
    cube.rotation.x = 0.3 * elapsedTime;
    torus.rotation.x = 0.3 * elapsedTime;


    // * Update Controls 禁止阻尼后 更新controls
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();