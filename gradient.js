//canvas element
const canvas = document.getElementById("glCanvas");

// WebGL context
const gl = canvas.getContext("webgl");
if (!gl) {
  alert("WebGL not supported");
  throw new Error("WebGL not supported");
}


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

var color = [0,1,0]

function getRandomColor() {
  return [Math.random(), Math.random(), Math.random()]; // RGBA
}


function updateColor() {
  
  let rand = getRandomColor();
  for (let i = 0; i < color.length; i++) {
  //color[i] += rand[i];
  }
  color[2]+=.005;
  //console.log(color);
  gl.clearColor(color[0], color[1], color[2], 1); // Set the clear color
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas with the new color
}



setInterval(updateColor, 100);