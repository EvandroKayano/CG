const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl){
    throw new Error('WebGl not supported');
}


const vertexData = [ //cubo 1x1x1
    // Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

    // Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    // Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    // Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5, 
];


// 3 numero aleatorios em um array
function randomColor(){
    return [Math.random(), Math.random(), Math.random()];
}


let colorData = [];
for(let face = 0; face < 6; face++){
    let faceColor = randomColor();
    for(let vertex = 0; vertex < 6; vertex++){
        colorData.push(...faceColor); //36 cores, mas vão repetir 6 vezes pra cada face
    }
}

// BUFFERS

const positionBuffer = gl.createBuffer();   
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);


const vertexShader = gl.createShader(gl.VERTEX_SHADER);

// VERTEX ATTRIBUTES

gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main(){
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}    
`);

gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main(){ 
    gl_FragColor = vec4(vColor, 1); 
}    
`);
// R G B A
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program,vertexShader);
gl.attachShader(program,fragmentShader);

gl.linkProgram(program);


const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

gl.enable(gl.DEPTH_TEST);

// after program link and program use
const uniformLocations= {
    matrix: gl.getUniformLocation(program, `matrix`),
};



const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix,
    90 * Math.PI /180, // field of view (angle, radians) tipo Quake Pro no mine
    canvas.width/canvas.height, //aspect w/h
    1e-4, // boundaries virtual camera - near cull distance
    1e4 // far cull distance "render distance"
)
const finalMatrix = mat4.create();

const matrix = mat4.create();
mat4.translate(matrix, matrix, [0, 0, -2]);
mat4.scale(matrix,matrix,[0.75,0.75,0.75]);

const matrix2 = mat4.create();
mat4.translate(matrix2, matrix2, [0, 0, -2]);
mat4.scale(matrix2,matrix2,[0.75,0.75,0.75]);
mat4.rotateY(matrix2,matrix2,Math.PI/3);

const matrix3 = mat4.create();
mat4.translate(matrix3, matrix3, [0, 0, -2]);
mat4.scale(matrix3,matrix3,[0.75,0.75,0.75]);
mat4.rotateY(matrix3,matrix3,Math.PI/3);

const matrix4 = mat4.create();
mat4.translate(matrix4, matrix4, [0, 0, -2]);
mat4.scale(matrix4,matrix4,[0.75,0.75,0.75]);
mat4.rotateY(matrix4,matrix4,Math.PI/3);

// camera
mat4.translate(projectionMatrix,projectionMatrix, [0,-1,0])
mat4.rotateX(projectionMatrix, projectionMatrix, Math.PI/6)


let dt = 0.1;
let dt_step= 0.02;
let time = 0.0;
function animate(){
    requestAnimationFrame(animate);

    if(dt > 1 || dt < -1)
      dt_step = -dt_step;
    dt += dt_step;

    time += 0.01;


    gl.viewport(0, 250, canvas.width/2, canvas.height/2);
    mat4.rotateY(matrix,matrix,Math.PI/2 /70);
    mat4.multiply(finalMatrix, projectionMatrix, matrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);


    gl.viewport(0, 0, canvas.width/2, canvas.height/2);
    mat4.translate(matrix2,matrix2,[0, dt/20, 0]);
    mat4.multiply(finalMatrix, projectionMatrix, matrix2);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);


    gl.viewport(250, 250, 250, 250);
    // mat4.rotateY(matrix3,matrix3,Math.PI/2 /70);
    mat4.translate(matrix3,matrix3,[0,0,dt/20]);
    mat4.multiply(finalMatrix, projectionMatrix, matrix3);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);


    gl.viewport(250, 0, canvas.width/2, canvas.height/2);
    // mat4.rotateY(matrix4,matrix4,Math.PI/2 /70);
    mat4.scale(matrix4, matrix4, [1+(dt/100),1+(dt/100),1+(dt/100)])
    mat4.multiply(finalMatrix, projectionMatrix, matrix4);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);


}

animate();

/*
the transformations applied to the matrix are replayed into the vertex in the reverse order

rotations and scales first, before translation
*/