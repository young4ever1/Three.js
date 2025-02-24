import * as THREE from 'three'
import '../../css/global.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// * 中国地图信息
import chinaJson from '@util/china.json'
import chinaLine from '@util/chinaLine.json'
import chinaDrawFnList from '../../util/china_map_draw'
import chinaEventFnList from '@util/china_detail_click'

// * Gui
const gui = new dat.GUI();

// * Scene
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
const map = new THREE.Object3D();

// * Loader file
const loader = new THREE.FileLoader();
loader.load(chinaJson, (data) => {
    const jsonData = JSON.parse(data);
    /**
     * jsonData 中国地图点位数据
     * scene 展示矢量的容器
     */
    chinaDrawFnList.operationData(jsonData, scene, map);
})
loader.load(chinaLine,(data)=>{
    const json = JSON.parse(data);
    // * 画出流动的轮廓线
    chinaDrawFnList.flowingDrawLine(json,scene,map);
    // * 流动形式 返回的结果 
    let flowingResult = chinaDrawFnList.flowingDrawStyle(scene);
    let currentPos = 0;
    let pointSpeed = 15;
    const tick = () => {
        // * 鼠标控制事件更新
        controls.update();
        if (flowingResult[0] && flowingResult[1].attributes.position) {
            currentPos += pointSpeed
            for (let i = 0; i < pointSpeed; i++) {
                flowingResult[3][(currentPos - i) % flowingResult[2].length] = 0
            }

            for (let i = 0; i < 200; i++) {
                flowingResult[3][(currentPos + i) % flowingResult[2].length] = i / 50 > 2 ? 2 : i / 50
            }
            flowingResult[1].attributes.aOpacity.needsUpdate = true
        }
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    }
    tick()
})

window.addEventListener('click', (event) => {
    let infoDom = document.getElementById('provinceInfo');
    chinaEventFnList.onRay(event, canvas, camera, map, infoDom)
})

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
camera.position.set(0, -20, 120);
camera.lookAt(0, 0, 0)
scene.add(camera);

// * Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// * Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

// * Update Renderer
renderer.setSize(sizes.width, sizes.height);
// * Pixel 像素更新
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// * Renderer theme
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.6;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

// * Refersh



