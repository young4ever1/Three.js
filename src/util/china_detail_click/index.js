let chinaEventFnList = {
    getCanvasRelativePosition: function (event, canvas) {
        const rect = canvas.getBoundingClientRect()
        return {
            x: ((event.clientX - rect.left) * canvas.width) / rect.width,
            y: ((event.clientY - rect.top) * canvas.height) / rect.height
        }
    },
    // * 弹窗展示位置 设置
    getDetialPosition(event,infoDom) {
        infoDom.style.left = event.clientX + 2 + 'px';
        infoDom.style.top = event.clientY + 2 + 'px';
    },
    // * 点位设置数据处理
    setPickPosition: function (event, canvas) {
        let pickPosition = { x: 0, y: 0 }
        // 计算后 以画布 开始为 （0，0）点
        const pos = chinaEventFnList.getCanvasRelativePosition(event, canvas)
        console.log(pos);
        // 数据归一化
        pickPosition.x = (pos.x / canvas.width) * 2 - 1
        pickPosition.y = (pos.y / canvas.height) * -2 + 1
        return pickPosition
    },

    // * 省份模块选中状态存储
    lastPick: null,
    onRay: function (event, canvas, camera, map, infoDom) {
        console.log(event);
        let pickPosition = chinaEventFnList.setPickPosition(event, canvas)
        console.log(pickPosition);
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(pickPosition, camera)
        // 计算物体和射线的交点
        const intersects = raycaster.intersectObjects([map], true)
        console.log(intersects);
        if (intersects.length !== 0) {
            if (intersects[0].object.type === 'Mesh') {
                console.log('yes');
                // 数组大于0 表示有相交对象
                if (intersects.length > 0) {
                    if (chinaEventFnList.lastPick) {
                        if (chinaEventFnList.lastPick.object.uuid !== intersects[0].object.uuid) {
                            chinaEventFnList.lastPick.object.material.color.set('#0527AF')
                            chinaEventFnList.lastPick = null
                        }
                    }
                    if (intersects[0].object.uuid) {
                        intersects[0].object.material.color.set('#238E23')
                        // * 省份详情事件
                        chinaEventFnList.provinceDetail(intersects[0], infoDom);
                        chinaEventFnList.getDetialPosition(event,infoDom)
                    }
                    chinaEventFnList.lastPick = intersects[0]
                    console.log(chinaEventFnList.lastPick);
                } else {
                    if (chinaEventFnList.lastPick) {
                        // 复原
                        if (chinaEventFnList.lastPick.object.uuid) {
                            chinaEventFnList.lastPick.object.material.color.set('#0527AF')
                            chinaEventFnList.lastPick = null
                        }
                    }
                }
            }
        }
    },

    // * 省份弹窗详情
    provinceDetail(intersects, infoDom) {
        if (intersects.object.type === 'Mesh') {
            infoDom.textContent = intersects.object.parent.properties;
            infoDom.style.visibility = 'visible';
        } else {
            infoDom.style.visibility = 'hidden';
        }

    }

}
export default chinaEventFnList
