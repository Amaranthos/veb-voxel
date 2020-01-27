import { vertex, fragment, createProgram, createShader } from "./shaders/";
import { m4 } from "./matrices";

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

const setGeometry = gl => {
  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0,   0,   0,
      0, 150,   0,
     30,   0,   0,
      0, 150,   0,
     30, 150,   0,
     30,   0,   0,

     30,   0,   0,
     30,  30,   0,
    100,   0,   0,
     30,  30,   0,
    100,  30,   0,
    100,   0,   0,

     30,  60,   0,
     30,  90,   0,
     67,  60,   0,
     30,  90,   0,
     67,  90,   0,
     67,  60,   0,

      0,   0,  30,
     30,   0,  30,
      0, 150,  30,
      0, 150,  30,
     30,   0,  30,
     30, 150,  30,

     30,   0,  30,
    100,   0,  30,
     30,  30,  30,
     30,  30,  30,
    100,   0,  30,
    100,  30,  30,

     30,  60,  30,
     67,  60,  30,
     30,  90,  30,
     30,  90,  30,
     67,  60,  30,
     67,  90,  30,

      0,   0,   0,
    100,   0,   0,
    100,   0,  30,
      0,   0,   0,
    100,   0,  30,
      0,   0,  30,

    100,   0,   0,
    100,  30,   0,
    100,  30,  30,
    100,   0,   0,
    100,  30,  30,
    100,   0,  30,

    30,   30,   0,
    30,   30,  30,
    100,  30,  30,
    30,   30,   0,
    100,  30,  30,
    100,  30,   0,

    30,   30,   0,
    30,   60,  30,
    30,   30,  30,
    30,   30,   0,
    30,   60,   0,
    30,   60,  30,

    30,   60,   0,
    67,   60,  30,
    30,   60,  30,
    30,   60,   0,
    67,   60,   0,
    67,   60,  30,

    67,   60,   0,
    67,   90,  30,
    67,   60,  30,
    67,   60,   0,
    67,   90,   0,
    67,   90,  30,

    30,   90,   0,
    30,   90,  30,
    67,   90,  30,
    30,   90,   0,
    67,   90,  30,
    67,   90,   0,

    30,   90,   0,
    30,  150,  30,
    30,   90,  30,
    30,   90,   0,
    30,  150,   0,
    30,  150,  30,

    0,   150,   0,
    0,   150,  30,
    30,  150,  30,
    0,   150,   0,
    30,  150,  30,
    30,  150,   0,

    0,   0,   0,
    0,   0,  30,
    0, 150,  30,
    0,   0,   0,
    0, 150,  30,
    0, 150,   0,
  ]), gl.STATIC_DRAW);
};

const setColours = gl => {
  // prettier-ignore
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,

      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,

      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,
      200, 70, 120,

      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,

      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,

      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,

      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,

      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,

      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,

      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,

      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,

      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,

      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,

      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,

      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,

      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
    ]), gl.STATIC_DRAW
  );
};

const drawScene = (
  gl,
  program,
  vao,
  positionBuffer,
  { matrixLocation },
  { translation, scaling }
) => {
  resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  let matrix = m4.projection(
    gl.canvas.clientWidth,
    gl.canvas.clientHeight,
    400
  );

  matrix = m4.translate(matrix, ...translation);
  matrix = m4.xRotate(matrix, angle);
  matrix = m4.yRotate(matrix, angle);
  matrix = m4.zRotate(matrix, angle);
  // matrix = m4.scale(matrix, ...scaling);

  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.drawArrays(gl.TRIANGLES, 0, 6 * 16);
};

let translation = [45, 150, 0];
let degrees = 0;
let scaling = [1, 1, 1];
let angle = 0;

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
  const colourAttributeLocation = gl.getAttribLocation(program, "a_colour");
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Position data
  const positionBuffer = gl.createBuffer();
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  // Colour data
  const colourBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
  setColours(gl);
  gl.enableVertexAttribArray(colourAttributeLocation);
  gl.vertexAttribPointer(
    colourAttributeLocation,
    3,
    gl.UNSIGNED_BYTE,
    true,
    0,
    0
  );

  setInterval(() => {
    {
      let [x, y] = translation;

      x += 0.5;
      y += 0.5;

      if (x >= gl.canvas.width) x = 0;
      if (y >= gl.canvas.height) y = 0;

      translation = [x, y, 0];
    }
    {
      degrees += 1;
      if (degrees >= 360) degrees = 0;
      angle = (degrees * Math.PI) / 180;
      scaling = [Math.sin(angle), Math.cos(angle), 1];
    }

    drawScene(
      gl,
      program,
      vao,
      positionBuffer,
      {
        matrixLocation
      },
      { translation, scaling }
    );
  }, 10);
})();
