const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');


if (!gl) {
    throw new Error('WebGL not supported');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);
// vertexData = [...]

// create buffer
// load vertexData into buffer

// create vertex shader
// create fragment shader
// create program
// attach shaders to program

// enable vertex attributes

// draw
// Triangle vertex sets
const traingleVertices= [
    0, Math.sqrt(3) / 2, 0,  // Top vertex (0, sqrt(3)/2)
    0.5, -Math.sqrt(3) / 6, 0, // Bottom right vertex (0.5, -sqrt(3)/6)
    -0.5, -Math.sqrt(3) / 6, 0 // Bottom left vertex (-0.5, -sqrt(3)/6)
];
const pyramidVertices = [
    // Base triangle
    -0.5, 0.0, -0.5,
     0.5, 0.0, -0.5,
     0.0, 0.0,  0.5,

    // Side 1
    -0.5, 0.0, -0.5,
     0.5, 0.0, -0.5,
     0.0, 1.0,  0.0,

    // Side 2
     0.5, 0.0, -0.5,
     0.0, 0.0,  0.5,
     0.0, 1.0,  0.0,

    // Side 3
     0.0, 0.0,  0.5,
    -0.5, 0.0, -0.5,
     0.0, 1.0,  0.0,
];




let currentVertices = pyramidVertices;//const ma no reassigning the whole thing i.e. 1 element of array can be chnaged, not the whole array

// Create buffer with intial values
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(currentVertices), gl.STATIC_DRAW);

// Vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
    attribute vec3 position;
    void main() {
        gl_Position = vec4(position, 1.0);
    }
`);
gl.compileShader(vertexShader);

// Fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
    void main() {
        gl_FragColor = vec4(0.2, 0.8, 1.0, 1.0);
    }
`);
gl.compileShader(fragmentShader);

// Link program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Get attribute location and enable it
const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// Clear screen and set viewport
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);






let changeFlag=1;
   
let scale=1.0;
let angle=0;




// Draw function
function drawTriangle(vertices) {
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // white background i.e. canvas color

    gl.clear(gl.COLOR_BUFFER_BIT);      // thingy on the canvas
    //gl.drawArrays(gl.TRIANGLES, 0, 3);    //for traingles
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3); // 4 triangles = 12 vertices, 3 per vertex
    
}
function drawPyramid(vertices) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // white background i.e. canvas color
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}


function animateTrianglePulse() {
    let A = [
        0, Math.sqrt(3) / 2, 0,  // Top vertex (0, sqrt(3)/2)
        0.5, -Math.sqrt(3) / 6, 0, // Bottom right vertex (0.5, -sqrt(3)/6)
        -0.5, -Math.sqrt(3) / 6, 0 // Bottom left vertex (-0.5, -sqrt(3)/6)
    ];
    if(changeFlag===1)
    {
        scale-=0.01;
        //multiply logic
        if(scale<=0.1)
        {
            changeFlag=0;
            scale=0.1;
        }
    }
    else
    {
        scale+=0.01;
        //mul
        if(scale>=1.0)
        {
            changeFlag=1;
            scale=1.0;
        }
    }
    A=A.map(v => v * scale);
    currentVertices=A;
    drawTriangle(currentVertices);
    requestAnimationFrame(animate);
}


function animateAndRotate() {
    // Pyramid: square base + top vertex
    const baseSize = 0.5;
    const height = 0.7;
    const base = [
        [-baseSize, 0, -baseSize],
        [baseSize, 0, -baseSize],
        [baseSize, 0, baseSize],
        [-baseSize, 0, baseSize],
    ];
    const top = [0, height, 0];

    const rotatedVertices = [];

    // Update scale
    if (changeFlag === 1) {
        scale -= 0.01;
        if (scale <= 0.3) {
            changeFlag = 0;
            scale = 0.3;
        }
    } else {
        scale += 0.01;
        if (scale >= 1.0) {
            changeFlag = 1;
            scale = 1.0;
        }
    }

    // Update rotation angle
    angle += 0.02;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Rotate and scale function (Y-axis)
    function transform(v) {
        const x = v[0] * scale;
        const y = v[1] * scale;
        const z = v[2] * scale;
        return [
            x * cosA - z * sinA,
            y,
            x * sinA + z * cosA
        ];
    }

    // Faces of the pyramid (4 sides)
    const faces = [
        [top, base[0], base[1]],
        [top, base[1], base[2]],
        [top, base[2], base[3]],
        [top, base[3], base[0]],
    ];

    for (const face of faces) {
        for (const vertex of face) {
            rotatedVertices.push(...transform(vertex));
        }
    }

    drawPyramid(rotatedVertices);
    requestAnimationFrame(animateAndRotate);
}
// Initial draw
//drawTriangle(currentVertices);
//animateAndRotate();
//drawPyramid(currentVertices);
function rotateY(vertices, angleRad) {
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    const rotated = [];

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];

        const newX = x * cosA - z * sinA;
        const newZ = x * sinA + z * cosA;

        rotated.push(newX, y, newZ);
    }

    return rotated;
}

function draw() {
    angle += 0.01;
    const rotatedVertices = rotateY(pyramidVertices, angle);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rotatedVertices), gl.STATIC_DRAW);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // white background i.e. canvas color
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, rotatedVertices.length / 3);

    requestAnimationFrame(draw);
}

draw();




