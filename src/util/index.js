let urlFnObject = {
    gltfUrlSet: function (filename, staticArray) {
        filename.forEach((name) => {
            staticArray.push(require(`@module/${name}`))
        })
        return staticArray;
    },
}
export default urlFnObject