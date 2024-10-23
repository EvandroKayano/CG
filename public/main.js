function main(){
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
    throw new Error('WebGL not supported');
    }

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, `
    attribute vec2 position;
    attribute vec3 color;
    varying vec3 vColor;

    void main() {
        gl_Position = vec4(position,0.0,1.0);
        vColor = color;
    }
    `);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;

    varying vec3 vColor;        

    void main() {
        gl_FragColor = vec4(vColor,1.0);
    }  
    `);

    var program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    // vertex positions for a square
    const tetoData = [
        -0.5, 0.4, //e-c
        0.5,-0.005, //d-b
        0.5, 0.4, //d-c
        
        -0.5, 0.4, //e-c
        0.5,-0.005, //d-b
        -0.5,-0.005, //e-b
    ];

    const corpoData = [
        -0.8, -0.005, //e-c
        0.9, -0.5, //d-b
        0.9, -0.005, //d-c
        
        -0.8, -0.005, //e-c
        0.9, -0.5, //d-b
        -0.8, -0.5, //e-b
    ];


    let squareVertexColors = [];
    let color = [Math.random(),Math.random(),Math.random()];
    for(let n=0;n<6;n++)
    squareVertexColors.push(...color);

/* 
TUDO CERTO POR AQUI SÓ TO ESCREVENDO PRO CTRL+Z NÃO PASSAR

     */
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // COR DO TETO E DO CORPO
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertexColors), gl.STATIC_DRAW);

    // TETO
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tetoData), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // CORPO
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corpoData), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // RODA ESQUERDA
    n=30;
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.2,[-0.5,-0.5]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0,0,0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    // RODA DIREITA
    n=30;
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.2,[0.55,-0.5]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0,0,0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}


function setCircleVertices(gl,n,radius,center){
    //let center = [0.0,0.0];
    let vertexData = [];
    for(let i=0;i<n;i++){
      vertexData.push(...center);
      vertexData.push(...[(radius*Math.cos(i*(2*Math.PI)/n))+center[0],(radius*Math.sin(i*(2*Math.PI)/n))+center[1]]);
      vertexData.push(...[(radius*Math.cos((i+1)*(2*Math.PI)/n))+center[0],(radius*Math.sin((i+1)*(2*Math.PI)/n))+center[1]]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  }
  

  function setCircleColor(gl,n,color){
    colorData = [];
    for (let triangle = 0; triangle < n; triangle++) {
      for(let vertex=0; vertex<3; vertex++)
        colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
  }

main();