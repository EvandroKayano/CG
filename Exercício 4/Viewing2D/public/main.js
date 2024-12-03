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




  // CRIANDO MATRIZES

  const rosto = mat4.create();

  n = 30;

  // DESENHANDO E ANIMANDO OS OBJETOS

  let dt = 0.0;
  let dt_step= 0.02;
  let time = 0.0;

  function drawSquare() {
    requestAnimationFrame(drawSquare);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if(dt > 1 || dt < -1)
      dt_step = -dt_step;
    dt += dt_step;


    time += 0.01;

    //#region objects
    gl.viewport(0, 0, canvas.width/2, canvas.height/2);
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,-0.5,-0.5,1,1);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl,[0.3,1,0.3]);
    const matrix1 = mat4.create();
    mat4.translate(matrix1,matrix1,[dt,0,0])
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix1);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.viewport(250, 250, 250, 250);
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,-0.5,-0.5,1,1);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl,[0.3,1,0.3]);
    const matrix2 = mat4.create();
    mat4.rotateZ(matrix2,matrix2,-time*5+Math.PI)
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix2);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);


    gl.viewport(250, 0, canvas.width/2, canvas.height/2);
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,-0.5,-0.5,1,1);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl,[0.3,1,0.3]);
    const matrix3 = mat4.create();
    mat4.translate(matrix3,matrix3,[0,dt,0])
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix3);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);


    gl.viewport(0, 250, canvas.width/2, canvas.height/2);
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,-0.5,-0.5,1,1);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl,[0.3,1,0.3]);
    const matrix4 = mat4.create();
    mat4.scale(matrix4,matrix4,[dt*2,dt*2,0])
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix4);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);


    //#endregion
  
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

function setCircleColor(gl, n, color) {
  colorData = [];
  for (let triangle = 0; triangle < n; triangle++) {
    for (let vertex = 0; vertex < 3; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}


main();