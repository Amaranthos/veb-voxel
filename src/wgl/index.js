import { m4 } from "../matrices";
import { degToRad } from "../angles";

const internals = {
  gl: null,
  shaderProgram: null,
  uniforms: {}
};

const canvas = document.getElementById("render");
internals.gl = canvas.getContext("webgl2");
if (!internals.gl) {
  console.error("No webgl 2");
}

const setShaderProgram = program => {
  internals.shaderProgram = program;
};

const resizeCanvas = () => {
  const { clientWidth, clientHeight } = canvas;
  if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  }
};

const predrawAndClear = () => {
  const { gl } = internals;
  resizeCanvas(gl.canvas);
  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
};

const createUniforms = () => {
  const { gl, shaderProgram, uniforms } = internals;
  const count = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
  for (const index of Array(count).keys()) {
    const uniform = gl.getActiveUniform(shaderProgram, index);
    const location = gl.getUniformLocation(shaderProgram, uniform.name);
    uniforms[uniform.name] = {
      location,
      setter: () => {}
    };
  }

  console.log("uni: ", internals.uniforms);
};

const draw = (vao, ...gos) => {
  const { gl, shaderProgram: program } = internals;

  predrawAndClear();

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  // gl.bufferData(
  //   gl.ARRAY_BUFFER,
  //   new Float32Array(object.model.model),
  //   gl.STATIC_DRAW
  // );

  const fieldOfView = degToRad(60);
  const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const [near, far] = [1, 2000];
  const projectionMatrix = m4.perspective(fieldOfView, aspectRatio, near, far);

  const cameraMatrix = m4.lookAt([0, 0, -2], [0, 0, 0], [0, 1, 0]);
  const viewMatrix = m4.inverse(cameraMatrix);
  const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  for (const go of gos) {
    let objectMatrix = m4.identity();
    objectMatrix = m4.scale(objectMatrix, ...go.scale);
    objectMatrix = m4.zRotate(objectMatrix, go.rotation.z);
    objectMatrix = m4.yRotate(objectMatrix, go.rotation.y);
    objectMatrix = m4.xRotate(objectMatrix, go.rotation.x);
    objectMatrix = m4.translate(objectMatrix, ...go.position);

    const mvp = m4.multiply(viewProjectionMatrix, objectMatrix);

    // TODO: only query this once
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");
    gl.uniformMatrix4fv(matrixLocation, false, mvp);
    gl.drawArrays(gl.TRIANGLES, 0, go.model.triangles);
  }
};

export class Gameobject {
  constructor(model) {
    this.position = [0, 0, 0]; //new Vec3(0, 0, 0);
    this.rotation = new Vec3(0, 0, 0);
    this.scale = [1, 1, 1]; //new Vec3(1, 1, 1);
    this.model = model;
  }
}

class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export const wgl = {
  gl: internals.gl,
  resizeCanvas,
  predrawAndClear,
  createUniforms,
  setShaderProgram,
  draw
};
