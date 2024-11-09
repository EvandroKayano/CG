function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

  if (!gl) {
    throw new Error('WebGL not supported');
  }

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, `
        attribute vec2 position;
        attribute vec3 color;
        varying vec3 vColor;
        
        uniform mat4 matrix;
    
        void main() {
            vColor = color;
            gl_Position = matrix * vec4(position,0.0,1.0);
            gl_PointSize = 5.0;
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

  const positionBuffer = gl.createBuffer();

  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  let colorData = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ]; // 18 pontos

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

  const matrixUniformLocation = gl.getUniformLocation(program, `matrix`);
  const colorLocation = gl.getAttribLocation(program, `color`);
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0.5, 1.0, 0.75);
  gl.clear(gl.COLOR_BUFFER_BIT);


  // CRIANDO MATRIZES

  const rodas = mat4.create();

  const carro = mat4.create();
  const rua = mat4.create();
  n = 30;


  let desloc = -2;

  // DESENHANDO E ANIMANDO OS OBJETOS

  function drawSquare() {
    requestAnimationFrame(drawSquare);
    gl.clear(gl.COLOR_BUFFER_BIT);

    desloc += 0.01;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, -1, -1,2 , 0.8);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rua);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [0.3, 0.3, 0.3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, -0.67, -0.7, 0.2 , 0.1);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rua);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [1, 1, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, 0, -0.7, 0.2 , 0.1);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rua);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [1, 1, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, 0.67, -0.7, 0.2 , 0.1);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rua);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [1, 1, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    //carro
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, -0.8+desloc, -0.25, 1.6, 0.4);
    gl.uniformMatrix4fv(matrixUniformLocation, false, carro);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [0, 0.5, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, -0.45+desloc, 0.1, .85, 0.35);
    gl.uniformMatrix4fv(matrixUniformLocation, false, carro);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [0, 0.5, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);


    // roda esquerda
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.18, [-0.5+desloc, -0.25]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0, 0, 0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rodas);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    // roda direita
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.18, [0.5+desloc, -0.25]); // "Definição"
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0, 0, 0]); // "Angulo de pintar"
    gl.uniformMatrix4fv(matrixUniformLocation, false, rodas);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);


    // calota esquerda

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.15, [-0.5+desloc, -0.25]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0.5, 0.5, 0.5]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rodas);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.12, [-0.5+desloc, -0.25]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0, 0, 0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rodas);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    // calota direita

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.15, [0.5+desloc, -0.25]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0.5, 0.5, 0.5]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rodas);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.12, [0.5+desloc, -0.25]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0, 0, 0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rodas);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

  }

  drawSquare();

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

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

function setRectangleVertices(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW);
}

function setRectangleColor(gl, color) {
  colorData = [];
  for (let triangle = 0; triangle < 2; triangle++) {
    for (let vertex = 0; vertex < 3; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

function setCircleVertices(gl, n, radius, center) {
  //let center = [0.0,0.0];
  let vertexData = [];
  for (let i = 0; i < n; i++) {
    vertexData.push(...center);
    vertexData.push(...[(radius * Math.cos(i * (2 * Math.PI) / n)) + center[0], (radius * Math.sin(i * (2 * Math.PI) / n)) + center[1]]);
    vertexData.push(...[(radius * Math.cos((i + 1) * (2 * Math.PI) / n)) + center[0], (radius * Math.sin((i + 1) * (2 * Math.PI) / n)) + center[1]]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setPetals(gl, n, radius, center, offset) {
  let vertexData = [];
  for (let i = 0; i < n; i++) {
    vertexData.push(...center);
    vertexData.push(...[(radius * Math.cos(i * (2 * Math.PI) / n)) + offset[0], (radius * Math.sin(i * (2 * Math.PI) / n)) + offset[1]]);
    vertexData.push(...[(radius * Math.cos((i + 1) * (2 * Math.PI) / n)) + offset[0], (radius * Math.sin((i + 1) * (2 * Math.PI) / n)) + offset[1]]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setCircleColor(gl, n, color) {
  colorData = [];
  for (let triangle = 0; triangle < n; triangle++) {
    for (let vertex = 0; vertex < 3; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}


main();