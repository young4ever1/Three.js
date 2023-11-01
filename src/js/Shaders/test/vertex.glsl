uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// * 用于wave 参数
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying vec2 vUv;
varying float vaRandom;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    // * 起伏计算;
    modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    //  modelPosition.z += aRandom *0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition ;

   
    gl_Position = projectionPosition;
    vUv = uv;
    vaRandom = aRandom;
}