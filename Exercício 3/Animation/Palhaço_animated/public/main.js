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
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);


  // CRIANDO MATRIZES

  const rosto = mat4.create();
  const cabelo = mat4.create();
  const olhoD = mat4.create();
  const olhoE = mat4.create();
  const chapeu = mat4.create();
  const pupila = mat4.create();
  n = 30;


  let desloc = -2;

  // DESENHANDO E ANIMANDO OS OBJETOS

  function drawSquare() {
    requestAnimationFrame(drawSquare);
    gl.clear(gl.COLOR_BUFFER_BIT);

    desloc += 0.01;

    // rosto
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.8,[0,0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1,0.8,0.8]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rosto);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    // nariz
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.15,[0,0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1,0,0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rosto);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);
 

    //#region CABELO
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.2,[0.8,0.2]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 0.3, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, cabelo);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.2,[0.6,0.4]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 0.3, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, cabelo);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.2,[0.78,0.45]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 0.3, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, cabelo);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.2,[-0.8,0.2]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 0.3, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, cabelo);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.2,[-0.6,0.4]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 0.3, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, cabelo);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.2,[-0.78,0.45]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 0.3, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, cabelo);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);
    //#endregion

    //#region OLHO DIREITO
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.15,[0.3,0.3]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 1, 1]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, olhoD);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.15,[0.3,0.1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 1, 1]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, olhoD);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,0.15,0.1,0.3,0.2);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl,[1, 1, 1]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, olhoD);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.05,[0.3,0.25]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0, 0, 0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, pupila);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,0.25,0.15,0.1,0.1);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl,[0, 0, 0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, pupila);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.05,[0.3,0.15]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0, 0, 0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, pupila);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);
    //#endregion

    //#region OLHO ESQUERDO
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.15,[-0.3,0.3]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[1, 1, 1]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, olhoE);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.15,[-0.3,0.1]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, olhoE);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,-0.45,0.1,0.3,0.2);
    gl.uniformMatrix4fv(matrixUniformLocation, false, olhoE);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.05,[-0.3,0.25]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0, 0, 0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, pupila);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,-0.35,0.15,0.1,0.1);
    gl.uniformMatrix4fv(matrixUniformLocation, false, pupila);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.05,[-0.3,0.15]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, pupila);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    // limpando o buffer
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.05,[2,2]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, pupila);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);
    //#endregion

    // (201 - 202 - 203 - 204) % 1 - 2 - 3 - 0
    let offset = Math.cos(( (desloc*2) % 4 ) * Math.PI)/4
    mat4.translate(pupila,pupila,[-0.025*offset,0,0])

    //#region chapeu
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setSemicircleVertices(gl,n,0.15,[0,0.85]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0, 1, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, chapeu);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setSemicircleVertices(gl,n,-0.3,[0,0.8]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0, 1, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, chapeu);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.15,[0.15,0.8]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0, 1, 0.3,]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, chapeu);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setCircleVertices(gl,n,0.15,[-0.15,0.8]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl,n,[0, 1, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, chapeu);
    gl.drawArrays(gl.TRIANGLES, 0, 3*n);

    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setRectangleVertices(gl,-0.15,0.8,0.3,0.2);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl,[0, 1, 0.3]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, chapeu);
    gl.drawArrays(gl.TRIANGLES, 0, 6); 
    //#endregion

    mat4.translate(chapeu,chapeu,[0.025*offset,0,0])

    // SORRISO?
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    setSmile(gl,30,-0.55);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setSmileColor(gl,n,[0,0,0]);
    gl.uniformMatrix4fv(matrixUniformLocation, false, cabelo);
    gl.drawArrays(gl.LINE_STRIP, 0, 3*17);
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

function setSemicircleVertices(gl,n,radius,center){
  //let center = [0.0,0.0];
  let vertexData = [];
  for(let i=0;i<n;i++){
    vertexData.push(...center);
    vertexData.push(...[(radius*Math.cos(i*(Math.PI)/n))+center[0],(radius*Math.sin(i*(Math.PI)/n))+center[1]]);
    vertexData.push(...[(radius*Math.cos((i+1)*(Math.PI)/n))+center[0],(radius*Math.sin((i+1)*(Math.PI)/n))+center[1]]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setSmile(gl,n,radius){
  //let center = [0.0,0.0];
  let vertexData = [];
  for(let i=0;i<n;i++){
    if(i>5 && i<25){
      vertexData.push(...[(radius*Math.cos(i*(Math.PI)/n)),(radius*Math.sin(i*(Math.PI)/n))]);
      vertexData.push(...[(radius*Math.cos((i+1)*(Math.PI)/n)),(radius*Math.sin((i+1)*(Math.PI)/n))]);
    }
    else{
      vertexData.push(...[(radius*Math.cos(5*(Math.PI)/n)),(radius*Math.sin(5*(Math.PI)/n))]);
      vertexData.push(...[(radius*Math.cos(6*(Math.PI)/n)),(radius*Math.sin(6*(Math.PI)/n))]);
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setSmileColor(gl,n,color){
  colorData = [];
  for (let triangle = 0; triangle < n; triangle++) {
    for(let vertex=0; vertex<2; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

main();