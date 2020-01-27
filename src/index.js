import { vertex, fragment, createProgram, createShader } from "./shaders/";

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
  { resolutionLocation, colourLocation, translationLocation, rotationLocation },
  { translation, rotation, width, height, colour }
) => {
  // console.log(translation, rotation, width, height, colour);

  resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangle(gl, 0, 0, width, height);

  gl.uniform4fv(colourLocation, colour);

  gl.uniform2fv(translationLocation, translation);

  // console.log(rotationLocation, rotation);
  gl.uniform2fv(rotationLocation, rotation);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

// main

let translation = [0, 0];
let rotation = [0, 1];
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
  const translationLocation = gl.getUniformLocation(program, "u_translation");
  const rotationLocation = gl.getUniformLocation(program, "u_rotation");

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

      angle += 1;
      if (angle >= 360) angle = 0;
      const radians = (angle * Math.PI) / 180;
      rotation = [Math.cos(radians), Math.sin(radians)];
    }

    drawScene(
      gl,
      program,
      vao,
      positionBuffer,
      {
        resolutionLocation,
        colourLocation,
        translationLocation,
        rotationLocation
      },
      { translation, rotation, width, height, colour }
    );
  }, 10);
})();
