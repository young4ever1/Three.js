let shapeFn = {
  spotCircle: function (scene, spot, circleYs) {
    const geometry2 = new THREE.RingGeometry(30, 28, 100, 10);
    const material2 = new THREE.MeshBasicMaterial({
      color: "#0527AF",
      side: THREE.DoubleSide,
      // alphaTest:0.5,
      transparent: true,
      // opacity:0.5,
      // * 解决遮挡问题
      depthTest: false,
      depthWrite: false,
      // polygonOffset :true
    });
    material2.renderOrder = 1;
    const circleY = new THREE.Mesh(geometry2, material2);
    circleY.rotation.x = Math.PI * 0.5;
    circleY.position.set(spot[0], spot[1], spot[2]);
    scene.add(circleY);
    circleYs.push(circleY);
    console.log(circleYs);
    return circleYs;
  },
  // * 围栏
  wallShape: function (scene) {
    const polygon = [
      -1930.2693596828185, -613.6577958609518,

      -2504.7463330383757, -372.17155608911906,

      -2742.8426708498205, -502.7595637031484,

      -2676.659689823466, -925.1028809261629,

      -1910.8349882873947, -887.3224865459774,

      -1930.2693596828185, -613.6577958609518,
    ];
    // const polygon = [
    //   10,10,
    //   10,10,
    //   10,10
    // ];

    const geometry = new THREE.BufferGeometry();
    const position = []; // 围栏的顶点

    const height = 200; // 围栏的高度
    for (let i = 0; i < polygon.length - 2; i += 2) {
      // 用相邻的两个点及其拉升后的两个点位构造两个三角面

      // 第一个三角面的顶点和UV坐标
      position.push(
        polygon[i],
        0,
        polygon[i + 1],
        polygon[i + 2],
        0,
        polygon[i + 3],
        polygon[i + 2],
        height,
        polygon[i + 3]
      );

      // 第二个三角面的顶点和UV坐标
      position.push(
        polygon[i],
        0,
        polygon[i + 1],
        polygon[i + 2],
        height,
        polygon[i + 3],
        polygon[i],
        height,
        polygon[i + 1]
      );
    }
    geometry.attributes.position = new THREE.BufferAttribute(
      new Float32Array(position),
      3
    );

    const uv = []; // 围栏的UV坐标

    for (let i = 0; i < polygon.length - 2; i += 2) {
      // 用相邻的两个点及其拉升后的两个点位构造两个三角面

      // 第一个三角面的顶点和UV坐标

      uv.push(0, 0, 1, 0, 1, 1);

      // 第二个三角面的顶点和UV坐标

      uv.push(0, 0, 1, 1, 0, 1);
    }
    geometry.attributes.uv = new THREE.BufferAttribute(new Float32Array(uv), 2);
    console.log(geometry, 123);

    // * 材质
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `varying vec3 vPosition;
           void main() {
               vPosition = position;
          `
      );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "void main() {",
          `varying vec3 vPosition;
           void main() {
          `
        )

        .replace(
          "#include <output_fragment>",
          "gl_FragColor = vec4( outgoingLight, 1.0 - vPosition.y/200.0 );"
        ); // 其中200代表围栏的高度
    };
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.position.set(0, 0, 0);
    console.log(mesh, 1123);
    scene.add(mesh);
  },
};

export default shapeFn;
