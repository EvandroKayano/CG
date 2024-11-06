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
0,0,0
  ]; // 18 pontos

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

  const matrixUniformLocation = gl.getUniformLocation(program, `matrix`);
  const colorLocation = gl.getAttribLocation(program, `color`);
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);


  const linha = mat4.create();
  mat4.scale(linha, linha, [0.01, 2, 1.0]);
  gl.uniformMatrix4fv(matrixUniformLocation, false, linha);

  // Caixa 1
  const matrix = mat4.create();

  mat4.translate(matrix, matrix, [-0.98, 0.0, 0.0]);
  mat4.scale(matrix, matrix, [0.0625, 0.25, 1.0]);
  gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

  //Caixa 2
  const matrix1 = mat4.create();
  // (matrix que recebe, matriz que sofre a operação, [escalaX, escalaY,escalaZ])
  mat4.translate(matrix1, matrix1, [0.98, 0.0, 0.0]);
  mat4.scale(matrix1, matrix1, [0.0625, 0.25, 1.0]);
  gl.uniformMatrix4fv(matrixUniformLocation, false, matrix1);

  // Bola
  const bola = mat4.create()
  mat4.scale(bola, bola, [0.05, 0.05, 1.0])

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Quadrado
  let positionVector = [
    -0.5, -0.5,
    -0.5, 0.5,
    0.5, -0.5,

    -0.5, 0.5,
    0.5, -0.5,
    0.5, 0.5,
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionVector), gl.STATIC_DRAW);

  let theta = 0.0;
  let tx = 0.0;
  let ty = 0.0;
  let tx_step = 0.01;
  let ty_step = 0.011;



  //#region TECLADO


  const bodyElement = document.querySelector("body");
  bodyElement.addEventListener("keydown", keyDown, false);
  function keyDown(e) {
    switch (e.key) {
      // PLAYER 1
      case 'w':
        // matrix[0] = x, matrix[1] = y
        if (matrix[13] != 0.875)
          mat4.translate(matrix, matrix, [0.0, 0.25, 0.0]);
        break;

      case 's':
        if (matrix[13] != -0.875)
          mat4.translate(matrix, matrix, [0.0, -0.25, 0.0]);
        break;

      // PLAYER 2
      case 'ArrowUp':
        if (matrix1[13] != 0.875)
          mat4.translate(matrix1, matrix1, [0.0, 0.25, 0.0]);
        break;

      case 'ArrowDown':
        if (matrix1[13] != -0.875)
          mat4.translate(matrix1, matrix1, [0.0, -0.25, 0.0]);
        break;

      case ' ':
        tx = 0;
        ty = 0;
        tx_step = 0.01;
        ty_step = 0.011;
        break;

    }
  }
  //#endregion

  //#region PLACAR
  let p1 = document.querySelector('.counter-player1');
  let p2 = document.querySelector('.counter-player2');

  let count1 = 0;
  let count2 = 0;

  function updateDisplay1(){
    p1.innerHTML = count1;
  };
  function updateDisplay2(){
    p2.innerHTML = count2;
  };
  //#endregion

  function drawSquare() {
    requestAnimationFrame(drawSquare);
    gl.clear(gl.COLOR_BUFFER_BIT);

    
    theta += 2.0;
    tx += tx_step;
    ty += ty_step;
    

    if (ty > 1.0 || ty < -1.0) // rebate no teto
      ty_step = -ty_step; 

    

    if (tx > 1.01){// Gol 1 
      tx = 0;
      ty = 0;
      tx_step = 0;
      ty_step = 0;
      count1 += 1;
      updateDisplay1();
    } 
    if(tx < -1.0){// Gol 2
      // Move pro centro
      tx = 0;
      ty = 0;
      // Para de mover
      tx_step = 0;
      ty_step = 0;
      // Placar
      count2 += 1;
      updateDisplay2();
    } 
      
    // BARRA DE ESPAÇO PARA RECOMEÇAR

    

    // COLISÃO
    if(tx <= matrix[12]+0.025 && ty < matrix[13]+0.125 &&  matrix[13]-0.125 < ty){ 
      tx_step = -tx_step;
    }
    else if(tx > matrix1[12]-0.025 && ty < matrix1[13]+0.125 &&  matrix1[13]-0.125 < ty){ 
      tx_step = -tx_step;
    } 

    mat4.identity(bola);
    mat4.translate(bola, bola, [tx, ty, 0.0]);
    mat4.rotateZ(bola, bola, degToRad(theta));
    mat4.scale(bola, bola, [0.05, 0.05, 1.0]);

    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.uniformMatrix4fv(matrixUniformLocation, false, bola);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.uniformMatrix4fv(matrixUniformLocation, false, linha);
    gl.drawArrays(gl.TRIANGLES, 0, 6);


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

main();