import '../../css/global.css'
import * as THREE from 'three'
// * 创建场景
// ? scene
const scene = new THREE.Scene();

// * 创建 Objets 对象合集
// ? group
const group = new THREE.Group();
// * 可以改变整个组里 逐个形状
group.position.y = 1;
scene.add(group);

// * group 中添加多个形状
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x000fff00 })
)
cube1.position.x = 0;
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.x = -2;
group.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x000fff })
)
cube3.position.x = 2;
group.add(cube3);


// * 创建xyz坐标轴
// ? Axes Helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper);

// * 创建形状 几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// * 创建材质 颜色 图片等
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// * 创建网状 图层 使用几何体 与 材质
const mesh = new THREE.Mesh(geometry, material);

// * 挪动 mesh 在相机中展示不同位置
// ? Position
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
mesh.position.set(0.7, -0.6, 1);

// * 缩放 mesh 在相机中的大小
// ? Scale
// mesh.scale.x = 3;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
mesh.scale.set(2, 0.5, 0.5);

// * 原地旋转 mesh 在相机中的显示效果
// * 轴的位置 穿过 物体进行旋转
// ? Rotation
// ? reorder 先旋转Y坐标 会有新的X坐标依照旋转
mesh.rotation.reorder('YXZ');
mesh.rotation.x = Math.PI * 0.25; // * 基于x轴旋转 从前往后
mesh.rotation.y = Math.PI * 0.25; // * 基于y轴旋转 从左往右
mesh.rotation.z = 0; // * 基于z轴旋转 从右往左


// * 场景加入这个网状图层
scene.add(mesh);

// * 创建相机需要的场景尺寸
const sizes = {
    width: 800,
    height: 600
}

// * 创建相机 camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// * 正视该模型box
// ? lookAt
// camera.lookAt(mesh.position)


// * 创建渲染器 renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

