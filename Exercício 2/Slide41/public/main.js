function main(){
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl', {preserveDrawingBuffer : true});

    if (!gl) {
    throw new Error('WebGL not supported');
    }

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, `
    attribute vec2 position;
    
    uniform mat4 matrix;

    void main() {
        gl_Position = matrix * vec4(position,0.0,1.0);
        gl_PointSize = 10.0;
    }
    `);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;

    uniform vec3 color;        

    void main() {
        gl_FragColor = vec4(color,1.0);
    }  
    `);

    var program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // tudo o que eu fizer nesta variável, passa para o vertexShader como 'matrix'
    const matrixUniformLocation = gl.getUniformLocation(program, `matrix`);
    const colorUniformLocation = gl.getUniformLocation(program, `color`);


    let matrix = [
      2/canvas.width, 0, 0, 0,
      0, -2/canvas.height, 0, 0,
      0, 0, 0, 0,
      -1, 1, 0, 1
    ];

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // MOUSE interaction
    let positionVector = [];
    positionVector.push(canvas.width / 2, canvas.height / 2);
    positionVector.push(canvas.width / 2, canvas.height / 2);
    let colorVector = [0.0, 0.0, 1.0];
    draw2DPoints();

    canvas.addEventListener("mousedown", mouseClick,false);
    let tempVector = [];
    let colorVec = [];
    function mouseClick(e) {
      tempVector.push(e.offsetX);
      tempVector.push(e.offsetY);
      console.log(tempVector);

      
      if(tempVector.length == 4){
        gl.clear(gl.COLOR_BUFFER_BIT);
        bresenham(tempVector[0],tempVector[2],tempVector[1],tempVector[3])
        positionVector = colorVec;
        tempVector=[];
      }
      if(colorVec.length >= 4 )
        colorVec = [];
    };
  
    // KEY interaction
    const bodyElement = document.querySelector("body");
    bodyElement.addEventListener("keydown",keyDown,false);
    
    function keyDown(e){
      switch(e.key){
        case '0':
          colorVector = [0.0,0.0,0.0];
          break;
        case '1':
          colorVector = [1.0,0.0,0.0];
          break;
        case '2':
          colorVector = [1.0,1.0,0.0];
          break;
        case '3':
          colorVector = [0.0,1.0,0.0];
          break;
        case '4':
          colorVector = [0.0,1.0,1.0];
          break;
        case '5':
          colorVector = [1.0,1.0,0.4];
          break;
        case '6':
          colorVector = [1.0,0.0,1.0];
          break;
        case '7':
          colorVector = [0.0,0.0,1.0];
          break;
        case '8':
          colorVector = [0.5,0.5,0.5];
          break;
        case '9':
          colorVector = [0.8,0.8,0.8];
          break;

      }
      draw2DPoints();
      colorVec =[];
    }

    // PONTO
    function draw2DPoints() {
      gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionVector), gl.STATIC_DRAW);
      gl.uniformMatrix4fv(matrixUniformLocation,false,matrix);
      gl.uniform3fv(colorUniformLocation, colorVector);
      gl.drawArrays(gl.POINTS, 0, positionVector.length/2);
      
      
      
    }
    

    function bresenham(x1,x2,y1,y2){ 
      positionVector = [];
      let aux;


      dx = x2-x1;
      dy = y2-y1;


      // VER TODOS OS CASOS

        
      if(dx <= dy){
        if(dx < 0){
          aux = x1;
          x1 = x2;
          x2 = aux;
     
          aux = y1;
          y1 = y2;
          y2 = aux;
  
          dx = x2-x1;
          dy = y2-y1;
        }

        p = 2*dy - dx;
        incInf = 2*dy;
        incSup = 2*(dy-dx);
        x=x1;
        y=y1;
        positionVector.push(x);
        positionVector.push(y);
        colorVec.push(x);
        colorVec.push(y);
        console.log(positionVector)
        draw2DPoints();
        
        while(x < x2){
          
          if(p < 0){
            p = p + incInf;
          }
          else {
            p = p + incSup;
            y++;
          }

          x++;
        
          positionVector = [];
          positionVector.push(x);
          positionVector.push(y);
          colorVec.push(x);
          colorVec.push(y);
          draw2DPoints();
        }
      }
      // else if (-1 > dy/dx){
        
      // }
      //else if (dy/dx > 1){

        if(dy < 0){ // y1 > y2
          aux = x1;
          x1 = x2;
          x2 = aux;
     
          aux = y1;
          y1 = y2;
          y2 = aux;
  
          dx = x2-x1;
          dy = y2-y1;
        }

        p = 2*dx - dy;
        incEsq = 2*dx;
        incDir = 2*(dx-dy);
        x=x1;
        y=y1;
        positionVector.push(x);
        positionVector.push(y);
        colorVec.push(x);
        colorVec.push(y);
        console.log(positionVector)
        draw2DPoints();

        while(y < y2){
          
          if(p < 0){
            p = p + incDir;
          }
          else {
            p = p + incEsq;
            x++;
          }

          y++;
        
          positionVector = [];
          positionVector.push(x);
          positionVector.push(y);
          colorVec.push(x);
          colorVec.push(y);
          draw2DPoints();
        }

      //}
      //else if (1 >= dy/dx >= 0){  

      //}
    }



}



//#region common

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


// (x,y) ponto esquerda-embaixo, largura e altura do retângulo
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

// pintar um retangulo, jogar um cor para cada vértice de 2 triângulos
function setRectangleColor(gl,color) {
  colorData = [];
  for (let triangle = 0; triangle < 2; triangle++) {
    for(let vertex=0; vertex<3; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
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

function setSectionVertices(gl,n,radius,center){
  //let center = [0.0,0.0];
  let vertexData = [];
  for(let i=0;i<n;i++){
    vertexData.push(...center);
    vertexData.push(...[(radius*Math.cos(i*(Math.PI/2)/n))+center[0],(radius*Math.sin(i*(Math.PI/2)/n))+center[1]]);
    vertexData.push(...[(radius*Math.cos((i+1)*(Math.PI/2)/n))+center[0],(radius*Math.sin((i+1)*(Math.PI/2)/n))+center[1]]);
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

function setCircleColor(gl,n,color){
  colorData = [];
  for (let triangle = 0; triangle < n; triangle++) {
    for(let vertex=0; vertex<3; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

function setSmileColor(gl,n,color){
  colorData = [];
  for (let triangle = 0; triangle < n; triangle++) {
    for(let vertex=0; vertex<2; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

// #endregion

main();