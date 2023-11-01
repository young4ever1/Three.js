import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import '../../css/global.css'
import fontJson from '../../../fonts/DINCondensedBold.json'
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

// * Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(require('/static/textures/matcaps/two.png'))

const fontLoader = new FontLoader();
fontLoader.load(
    fontJson,
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        // * Text 居中
        textGeometry.center();
        const basicMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        const text = new THREE.Mesh(textGeometry, basicMaterial)
        scene.add(text);

        // * 背景
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, basicMaterial);
            donut.position.x = (Math.random() - 0.5) * 10;
            donut.position.y = (Math.random() - 0.5) * 10;
            donut.position.z = (Math.random() - 0.5) * 10;

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;
            
            const scaleRandom = Math.random();
            donut.scale.x = scaleRandom;
            donut.scale.y = scaleRandom;
            donut.scale.z = scaleRandom;

            scene.add(donut);
        }

    }
)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// * 相机视角调整
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.y = 2;
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