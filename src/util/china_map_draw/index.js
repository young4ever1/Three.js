let chinaDrawFnList = {
    // * 处理数据源 进行Mesh 和 定位组装
    operationData: function (jsondata, scene, map) {
        // 全国信息
        const features = jsondata.features;
        features.forEach((feature) => {
            // 单个省份
            const province = new THREE.Object3D()
            // 地址
            province.properties = feature.properties.name
            const coordinates = feature.geometry.coordinates
            const color = '#0527AF';
            // const color = ['重庆市', '上海市', '北京市'].includes(feature.properties.name) ? '#00FFFF' : '#0527AF'
            if (feature.geometry.type === 'MultiPolygon') {
                // 多个，多边形
                coordinates.forEach((coordinate) => {
                    // coordinate 多边形数据
                    coordinate.forEach((rows) => {
                        const mesh = chinaDrawFnList.drawExtrudeMesh(rows, color)
                        const line = chinaDrawFnList.lineDraw(rows, color)
                        province.add(line)
                        province.add(mesh)
                    })
                })
            }

            if (feature.geometry.type === 'Polygon') {
                // 多边形
                coordinates.forEach((coordinate) => {
                    const mesh = chinaDrawFnList.drawExtrudeMesh(coordinate, color)
                    const line = chinaDrawFnList.lineDraw(coordinate, color)
                    province.add(line)
                    province.add(mesh)
                })
            }
            map.add(province)
        })
        scene.add(map)
        return map;
    },
    // * 根据数据源 绘制 组装Mesh
    drawExtrudeMesh: function (polygon, color) {
        // * 调整矢量居中的函数
        const projection = d3.geoMercator().center([106.57, 30.14]).translate([0, 0])
        const shape = new THREE.Shape()
        polygon.forEach((row, i) => {
            const [x, y] = projection(row);
            if (i === 0) {
                shape.moveTo(x, -y)
            }
            shape.lineTo(x, -y)
        })

        // 拉伸
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 7,
            bevelEnabled: false
        })
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5
        })
        return new THREE.Mesh(geometry, material)
    },
    // * 根据数据源 绘制 组装Line 
    lineDraw: function (polygon, color) {
        // * 调整矢量居中的函数
        const projection = d3.geoMercator().center([106.57, 30.14]).translate([0, 0])
        const lineGeometry = new THREE.BufferGeometry()
        const pointsArray = new Array()
        polygon.forEach((row) => {
            const [x, y] = projection(row)
            // 创建三维点
            pointsArray.push(new THREE.Vector3(x, -y, 7));
        })
        // 放入多个点
        lineGeometry.setFromPoints(pointsArray)

        const lineMaterial = new THREE.LineBasicMaterial({
            color: color
        })
        return new THREE.Line(lineGeometry, lineMaterial)
    },
    // * 画出地图轮廓线 填入流动线需要的参数
    flowingDrawLine(json, scene, map) {
        const feature = json.features[0]
        const province = new THREE.Object3D()
        province.properties = feature.properties.name
        // 点数据
        const coordinates = feature.geometry.coordinates

        coordinates.forEach((coordinate) => {
            // coordinate 多边形数据
            coordinate.forEach((rows) => {
                const line = chinaDrawFnList.flowingLine(rows, '#0527AF')
                province.add(line)
            })
        })
        chinaDrawFnList.flowingParams.positions = new Float32Array(chinaDrawFnList.flowingParams.lines.flat(1))
        // 设置顶点
        chinaDrawFnList.flowingParams.geometry.setAttribute('position', new THREE.BufferAttribute(chinaDrawFnList.flowingParams.positions, 3))
        // 设置 粒子透明度为 0
        chinaDrawFnList.flowingParams.opacitys = new Float32Array(chinaDrawFnList.flowingParams.positions.length).map(() => 0)
        chinaDrawFnList.flowingParams.geometry.setAttribute('aOpacity', new THREE.BufferAttribute(chinaDrawFnList.flowingParams.opacitys, 1))
        map.add(province)
        scene.add(map);
    },
    indexBol: true,
    // * 画出轮廓线
    flowingLine: function (polygon, color) {
        // * 调整矢量居中的函数
        const projection = d3.geoMercator().center([106.57, 30.14]).translate([0, 0])
        const lineGeometry = new THREE.BufferGeometry()
        const pointsArray = new Array()
        polygon.forEach((row) => {
            const [x, y] = projection(row)
            // 创建三维点
            pointsArray.push(new THREE.Vector3(x, -y, 7))
            if (chinaDrawFnList.indexBol) {
                chinaDrawFnList.flowingParams.lines.push([x, -y, 7])
            }
        })
        chinaDrawFnList.indexBol = false;
        // 放入多个点
        lineGeometry.setFromPoints(pointsArray)

        const lineMaterial = new THREE.LineBasicMaterial({
            color: color
        })
        return new THREE.Line(lineGeometry, lineMaterial)

    },
    // * 地图流光动画参数
    flowingParams: {
        lines: [],
        positions: null,
        opacitys: null,
        geometry: new THREE.BufferGeometry(),
        pointSize: 2.0,
        pointColor: '#4ec0e9'
    },
    // * 地图流动线样式编写
    flowingDrawStyle: function (scene) {
        const vertexShader = `
        attribute float aOpacity;
        uniform float uSize;
        varying float vOpacity;

        void main(){
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            gl_PointSize = uSize;

            vOpacity=aOpacity;
        }
        `
        const fragmentShader = `
        varying float vOpacity;
        uniform vec3 uColor;

        float invert(float n){
            return 1.-n;
        }

        void main(){
          if(vOpacity <=0.2){
              discard;
          }
          vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
          vec2 cUv=2.*uv-1.;
          vec4 color=vec4(1./length(cUv));
          color*=vOpacity;
          color.rgb*=uColor;
          gl_FragColor=color;
        }
        `
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true, // 设置透明
            uniforms: {
                uSize: {
                    value: chinaDrawFnList.flowingParams.pointSize
                },
                uColor: {
                    value: new THREE.Color(chinaDrawFnList.flowingParams.pointColor)
                }
            }
        })
        const points = new THREE.Points(chinaDrawFnList.flowingParams.geometry, material)
        scene.add(points)
        return [points, chinaDrawFnList.flowingParams.geometry, chinaDrawFnList.flowingParams.lines, chinaDrawFnList.flowingParams.opacitys];
    },

    // * 下钻具体省份地图
    provinceDetail: function () {

    }

}
export default chinaDrawFnList