function setup() {
    
    // Get the canvas
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    // Sliders
    var slider1 = document.getElementById("slider1");
    slider1.value = 0;
    var slider2 = document.getElementById("slider2");
    slider2.value = 0;
    var slider3 = document.getElementById("slider3");
    slider3.value = 0;

    var time = 0; // Variable

    // Read shader source
    var vertexSource = document.getElementById("vertexShader").text; // Get the vertex shader source
    var fragmentSource = document.getElementById("fragmentShader").text; // Get the fragment shader source

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER); // Create a vertex shader object
    gl.shaderSource(vertexShader, vertexSource); // Attach vertex shader source code
    gl.compileShader(vertexShader); // Compile the vertex shader

    // Check if there was an error during compilation
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) { 
        alert(gl.getShaderInfoLog(vertexShader)); 
        return null; 
    }

    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // Create fragment shader object
    gl.shaderSource(fragmentShader, fragmentSource); // Attach fragment shader source code
    gl.compileShader(fragmentShader); // Compile the fragment shader

    // Check if there was an error during compilation
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) { 
        alert(gl.getShaderInfoLog(fragmentShader)); 
        return null; 
    }

    // Attach the shaders and link
    var shaderProgram = gl.createProgram(); // Create the shader program
    gl.attachShader(shaderProgram, vertexShader); // Attach a vertex shader
    gl.attachShader(shaderProgram, fragmentShader); // Attach a fragment shader
    gl.linkProgram(shaderProgram); // Link both programs

    // Check if there was an error during linking
    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders"); 
    }
    gl.useProgram(shaderProgram);

    // Pass the attributes as positions
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);

    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);
    
    shaderProgram.TexCoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.TexCoordAttribute);

    // Access to the matrix uniform
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram, "uMV");
    shaderProgram.MVnormalMatrix = gl.getUniformLocation(shaderProgram, "uMVn");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram, "uMVP");
    shaderProgram.movingLight = gl.getUniformLocation(shaderProgram, "rawLight");

    // Attach samplers to texture units
    shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
    gl.uniform1i(shaderProgram.texSampler1, 0);
    shaderProgram.texSampler2 = gl.getUniformLocation(shaderProgram, "texSampler2");
    gl.uniform1i(shaderProgram.texSampler2, 1);

    // vertex positions
    var vertexPos = new Float32Array(
        [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1, // Cube
           1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
           1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
          -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
          -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
           1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1, 
           0, 5, 0,  -1, 1,-1,   1, 1,-1, // Pyramid
           0, 5, 0,   1, 1,-1,   1, 1, 1,
           0, 5, 0,   1, 1, 1,  -1, 1, 1,
           0, 5, 0,  -1, 1, 1,  -1, 1,-1,
          -1, 1,-1,   1, 1,-1,   1, 1, 1,
           1, 1, 1,  -1, 1, 1,  -1, 1,-1 ]);

    // vertex normals
    var vertexNormals = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, // Cube
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, 
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, 
          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, 
           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, 
           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1,  
           0, 1, 2,  -1, 1, 1,   1, 1, 1, // Pyramid
           2, 1, 0,   1, 1, 1,   1, 1,-1,
           0, 1,-2,   1, 1,-1,  -1, 1,-1,
          -2, 1, 0,  -1, 1,-1,  -1, 1, 1, 
          -1,-1, 1,   1,-1, 1,   1, -1,-1,
           1, -1,-1, -1,-1,-1,  -1, -1, 1 ]);

    // vertex colors
    var vertexColors = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, // Cube
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
           1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
           1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
           0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,
           1, 0.6, 0.1,     1, 0.6, 0.1,     1, 0.6, 0.1, // Pyramid
           1, 0.6, 0.1,     1, 0.6, 0.1,     1, 0.6, 0.1,
           1, 0.6, 0.1,     1, 0.6, 0.1,     1, 0.6, 0.1,
           1, 0.6, 0.1,     1, 0.6, 0.1,     1, 0.6, 0.1,
           1, 0.6, 0.1,     1, 0.6, 0.1,     1, 0.6, 0.1,
           1, 0.6, 0.1,     1, 0.6, 0.1,     1, 0.6, 0.1 ]);
    
    // vertex texture coordinates
    var vertexTextureCoords = new Float32Array(
        [  0.5, 0, 1, 0,   1, 1,   0.5, 1, // Cube
           0.5, 0, 0.5, 1, 0, 1,   0, 0,
           0, 1,   0, 0,   1, 0,   1, 1,
           0, 0,   0.5, 0, 0.5, 1, 0, 1,
           1, 1,   0, 1,   0, 0,   1, 0,
           1, 1,   0.5, 1, 0.5, 0, 1, 0,
           0.5, 0,   1, 1,     0, 1,  // Pyramid
           0.5, 0,   1, 1,     0, 1,
           0.5, 0,   1, 1,     0, 1,
           0.5, 0,   1, 1,     0, 1,
           0, 0,     1, 0,     1, 1,
           1, 1,     0, 1,     0, 0 ]);

    // element index array
    var triangleIndices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front (cube)
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	  20,21,22,  20,22,23,    // back
          24,25,26,  27,28,29,    // front/right (pyramid)
          30,31,32,  33,34,35,    // top/left
          36,37,38,  39,40,41]);  // bottom/back

    // Put verticies into buffer to block transfer them to graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 18;

    // Buffer for normals
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    normalBuffer.itemSize = 3;
    normalBuffer.numItems = 18;

    // Buffer for colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = 18;

    // BUffer for textures
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuffer.itemSize = 2;
    textureBuffer.numItems = 18;

    // Buffer for indexes
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);

    // Set up the texture
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var image = new Image(); // Create a new image object

    // Initialize texture then draw
    function initTextureThenDraw() {
        // Load the image
        image.onload = function() { 
            loadTexture(image, texture); 
        };

        image.crossOrigin = "anonymous";
        image.src = "https://live.staticflickr.com/65535/53371614493_107f9d0085_o.jpg"
        
        window.setTimeout(draw, 200);
    }

    // Load the texture
    function loadTexture(image, texture) { 
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    function nothing() {}

    function draw() { // Draw the scene
        time = time + .5; // Update the time
        time = time + slider3.value * 0.01; // Use slider to change the time

        window.requestAnimationFrame(draw); // Request the next frame

        // Variable initializations
        var angleCamera = time * 0.001 * Math.PI;
        var lightDir = slider1.value * 0.05 * Math.PI;
        var angleRotate = slider2.value * 0.03 * Math.PI;
        var eye = [400 * Math.sin(angleCamera), 200.0, 400 * Math.cos(angleCamera)];
        var target = [0, 0, 0];
        var up = [0, 1, 0];

        // Create the view matrix
        var tModel = mat4.create();
        mat4.fromRotation(tModel, angleRotate, [1, 1, 1]);
        mat4.scale(tModel, tModel, [100, 100, 100]);
        
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);
        
        var tProjection = mat4.create();
        mat4.perspective(tProjection, Math.PI / 4, 1, 10, 1000);
        
        var tMVP = mat4.create();
        var tMV = mat4.create();
        var tMVn = mat3.create();
        mat4.multiply(tMV, tCamera, tModel); // Model view matrix
        mat3.normalFromMat4(tMVn, tMV);
        mat4.multiply(tMVP, tProjection, tMV);
        
        var light = [Math.sin(lightDir), -1, Math.cos(lightDir)];

        // Clear the canvas and render
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set up unifroms and attributes
        gl.uniformMatrix4fv(shaderProgram.MVmatrix, false, tMV);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix, false, tMVP);
        gl.uniformMatrix3fv(shaderProgram.MVnormalMatrix, false, tMVn);
        gl.uniform3fv(shaderProgram.movingLight, light);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(shaderProgram.TexCoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Bind texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Draw
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);
    }

    // Call sliders
    slider1.addEventListener("input", nothing);
    slider2.addEventListener("input", nothing);

    // Function calls
    draw();
    initTextureThenDraw();
}

window.onload = setup;
