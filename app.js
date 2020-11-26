var VertexShaderText = 
[
'precision highp float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mProj;',
'uniform mat4 mView;',
'',
'void main()',
'{',
'   fragColor = vertColor;',
'   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);', //order is important
'}'
].join('\n');

var FragmentShaderText = 
[
'precision highp float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'   gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var launch = function() {
    gl =  document.getElementById('game-surface').getContext('webgl');
    var canvas = document.getElementById('game-surface');
    if (!gl) {
        alert("Your Browser doesn't support webgl :(")
    }

    gl.clearColor(0.1, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, VertexShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
        return;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, FragmentShaderText);
    gl.compileShader(fragmentShader);


    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);


	gl.enable(gl.DEPTH_TEST);

	gl.enable(gl.CULL_FACE);

	gl.frontFace(gl.CCW);

    gl.cullFace(gl.BACK);

	var player_vertices = [
	    // X, Y, Z           R, G, B

		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,

		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,

		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,

		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,

		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,

		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,

		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,

		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,

		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,

		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,

		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,

		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,

		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,

        -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
        
		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,

		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,

		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,

		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,

	];
	var playerIndices = [
		// Top
		0, 1, 2,
        0, 2, 3,
        
		// Left
		5, 4, 6,
        6, 4, 7,
        
		// Right
		8, 9, 10,
        8, 10, 11,
        
		// Front
		13, 12, 14,
        15, 14, 12,
        
		// Back
		16, 17, 18,
        16, 18, 19,
        
		// Bottom
		21, 20, 22,
		22, 20, 23

	];
    var playerVerticesBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, playerVerticesBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(player_vertices), gl.STATIC_DRAW);
    
    var playerIndicesBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, playerIndicesBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(playerIndices), gl.STATIC_DRAW);

    var playerPositionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        playerPositionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    var playerColorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        playerColorAttribLocation,
        3, 
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );
  gl.enableVertexAttribArray(playerPositionAttribLocation);   
  gl.enableVertexAttribArray(playerColorAttribLocation);

  gl.useProgram(program);
  //Configure Matrices
  var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);

  glMatrix.mat4.identity(worldMatrix);
  glMatrix.mat4.lookAt(viewMatrix, [0, 0, -7], [0, 0, 0], [0, 1, 0]);
  glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);

  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);


  rotation_x = 0;
  rotation_y = 0;
  function takeInput(event) {
    if (event.keyCode == 39) {
        rotation_x += 2;
    }
    else if (event.keyCode == 37) {
        rotation_x -= 2;
    }
    
    else if (event.keyCode == 38) {
        rotation_y += 2;
    }
    else if (event.keyCode == 40) {
        rotation_y -= 2;
    }
    
  }
  var loop = function () {
      document.addEventListener('keydown', function(event) {
          takeInput(event);
      });
      glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, glMatrix.glMatrix.toRadian(rotation_x/360), [0, 1, 0]); 
      glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, glMatrix.glMatrix.toRadian(rotation_y/360), [1, 0, 0]);
      glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

      gl.clearColor(0.75, 0.25, 1.0, 1.0); 
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, playerIndices.length, gl.UNSIGNED_SHORT, 0);
      requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
        
}       





