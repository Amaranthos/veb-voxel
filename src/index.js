import { vertex, fragment, createProgram, createShader } from "./shaders/";
import { m3 } from "./matrices";

const resizeCanvas = canvas => {
  const { clientWidth, clientHeight } = canvas;
  if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  }
};

const randomInt = range => Math.floor(Math.random() * range);

const setRectangle = (gl, x, y, width, height) => {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ]), gl.STATIC_DRAW);
};

const drawScene = (
  gl,
  program,
  vao,
  positionBuffer,
  { resolutionLocation, colourLocation, matrixLocation },
  { translation, scaling, width, height, colour }
) => {
  resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);
  setRectangle(gl, 0, 0, width, height);

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const origin = m3.translation(-width / 2, -height / 2);
  const translate = m3.translation(...translation);
  const rotate = m3.rotation(angle);
  const scale = m3.scaling(...scaling);

  let matrix = m3.multiply(translate, rotate);
  matrix = m3.multiply(matrix, scale);
  matrix = m3.multiply(matrix, origin);

  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  gl.uniform4fv(colourLocation, colour);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

// main

let translation = [0, 0];
let degrees = 0;
let scaling = [1, 1];
let angle = 0;
const width = 100;
const height = 30;
const colour = [Math.random(), Math.random(), Math.random(), 1];

(() => {
  const canvas = document.getElementById("render");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error("No webgl 2");
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colourLocation = gl.getUniformLocation(program, "u_colour");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  const positionBuffer = gl.createBuffer();
  const vao = gl.createVertexArray();

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  setInterval(() => {
    {
      let [x, y] = translation;

      x += 0.5;
      y += 0.5;

      if (x >= gl.canvas.width) x = 0;
      if (y >= gl.canvas.height) y = 0;

      translation = [x, y];
    }
    {
      degrees += 1;
      if (degrees >= 360) degrees = 0;
      angle = (degrees * Math.PI) / 180;
      scaling = [Math.sin(angle), Math.cos(angle)];
    }

    drawScene(
      gl,
      program,
      vao,
      positionBuffer,
      {
        resolutionLocation,
        colourLocation,
        matrixLocation
      },
      { translation, scaling, width, height, colour }
    );
  }, 10);
})();
