import { vertex, fragment, createProgram, createShader } from "./shaders/";
import { m4 } from "./matrices";
import { f, u, c, k } from "./models";

const degToRad = deg => (deg * Math.PI) / 180;

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
  let mat = m4.xRotation(Math.PI);
  mat = m4.translate(mat, -50, -75, -15);

  const positions = [...f.model, ...u.model, ...c.model, ...k.model];
  for (let ii = 0; ii < positions.length; ii += 3) {
    const vector = m4.transformVector(mat, [
      positions[ii + 0],
      positions[ii + 1],
      positions[ii + 2],
      1
    ]);

    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }

  console.log(positions);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
};

const setColours = gl => {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Int8Array([...f.colours, ...u.colours, ...c.colours, ...k.colours]),
    gl.STATIC_DRAW
  );
};

const predrawAndClear = gl => {
  resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
};

const drawScene = (
  gl,
  program,
  vao,
  positionBuffer,
  { matrixLocation },
  { translation, scaling, angle }
) => {
  predrawAndClear(gl);
  gl.useProgram(program);
  gl.bindVertexArray(vao);

  const fieldOfView = degToRad(60);
  const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const [near, far] = [1, 2000];
  let projectionMatrix = m4.perspective(fieldOfView, aspectRatio, near, far);
  // projectionMatrix = m4.translate(projectionMatrix, ...translation);
  // projectionMatrix = m4.xRotate(projectionMatrix, angle);
  // projectionMatrix = m4.yRotate(projectionMatrix, -angle);
  // projectionMatrix = m4.zRotate(projectionMatrix, angle);
  // projectionMatrix = m4.scale(projectionMatrix, ...scaling);

  const cameraAngle = degToRad(cameraAngleDeg);
  const radius = 200;
  let cameraMatrix = m4.yRotation(cameraAngle);
  cameraMatrix = m4.translate(cameraMatrix, 0, 50, radius * 1.5);

  const cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];

  cameraMatrix = m4.lookAt(cameraPosition, [radius, 0, 0], [0, 1, 0]);

  const viewMatrix = m4.inverse(cameraMatrix);
  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  const repetitions = 5;
  for (const i of Array(repetitions).keys()) {
    const angle = (2 * Math.PI * i) / repetitions;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const matrix = m4.translate(viewProjectionMatrix, x, 0, z);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.drawArrays(
      gl.TRIANGLES,
      0,
      f.triangles + u.triangles + c.triangles + k.triangles
    );
  }
};

const initializeCanvas = () => {
  const canvas = document.getElementById("render");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error("No webgl 2");
  }
  return gl;
};

let translation = [-150, 0, -360];
let degrees = 0;
let scaling = [1, 1, 1];
let angle = 0;
let cameraAngleDeg = 0;
(() => {
  const gl = initializeCanvas();

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

  // drawScene(
  //   gl,
  //   program,
  //   vao,
  //   positionBuffer,
  //   {
  //     matrixLocation
  //   },
  //   { translation, scaling, angle }
  // );

  setInterval(() => {
    {
      cameraAngleDeg += 0.5;
      if (cameraAngleDeg >= 360) {
        cameraAngleDeg = 0;
      }

      // let [x, y, z] = translation;
      // x += 1;
      // y += 1;
      // if (x >= gl.canvas.width) x = 0;
      // if (y >= gl.canvas.height) y = 0;
      // translation = [x, y, z];

      // degrees += 0.5 + Math.random();
      // if (degrees >= 360) degrees = 0;
      // angle = (degrees * Math.PI) / 180;
      // scaling = [Math.cos(angle), Math.cos(angle), 1];
    }

    drawScene(
      gl,
      program,
      vao,
      positionBuffer,
      {
        matrixLocation
      },
      { translation, scaling, angle }
    );
  }, 10);
})();
