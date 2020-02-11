import { m4 } from "../matrices";
import { degToRad } from "../angles";
import { createDefaultProgram, vertex, fragment } from "../shaders";
import { cube } from "../models";

class Wgl {
  #gl = null;
  #shaderProgram = null;
  #vao = null;
  #attributes = {
    position: null,
    texcoord: null
  };

  constructor() {
    const canvas = document.getElementById("render");
    this.#gl = canvas.getContext("webgl2");
    if (!this.#gl) {
      console.error("No webgl 2");
    }

    this.#vao = this.#gl.createVertexArray();
    this.#gl.bindVertexArray(this.#vao);

    this.#shaderProgram = createDefaultProgram(this.#gl, vertex, fragment);

    this.#attributes.position = this.#gl.getAttribLocation(
      this.#shaderProgram,
      "a_position"
    );
    this.#attributes.texcoord = this.#gl.getAttribLocation(
      this.#shaderProgram,
      "a_texcoord"
    );

    const vbo = this.#gl.createBuffer();
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, vbo);

    this.#gl.enableVertexAttribArray(this.#attributes.position);
    this.#gl.vertexAttribPointer(
      this.#attributes.position,
      3,
      this.#gl.FLOAT,
      false,
      0,
      0
    );

    this.#gl.bufferData(
      this.#gl.ARRAY_BUFFER,
      new Float32Array(cube.model),
      this.#gl.STATIC_DRAW
    );

    const texcoordBuffer = this.#gl.createBuffer();
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, texcoordBuffer);

    this.#gl.enableVertexAttribArray(this.#attributes.texcoord);
    this.#gl.vertexAttribPointer(
      this.#attributes.texcoord,
      2,
      this.#gl.FLOAT,
      true,
      0,
      0
    );

    this.#gl.bufferData(
      this.#gl.ARRAY_BUFFER,
      new Float32Array(cube.uvs),
      this.#gl.STATIC_DRAW
    );
  }

  get gl() {
    return this.#gl;
  }

  resizeCanvas = canvas => {
    const { clientWidth, clientHeight } = canvas;
    if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    }
  };

  predrawAndClear = () => {
    this.resizeCanvas(this.#gl.canvas);
    this.#gl.viewport(
      0,
      0,
      this.#gl.canvas.clientWidth,
      this.#gl.canvas.clientHeight
    );
    this.#gl.clearColor(0, 0, 0, 0);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
    this.#gl.enable(this.#gl.CULL_FACE);
    this.#gl.enable(this.#gl.DEPTH_TEST);
  };

  draw = (...gos) => {
    this.predrawAndClear();

    this.#gl.useProgram(this.#shaderProgram);
    this.#gl.bindVertexArray(this.#vao);

    const aspectRatio =
      this.#gl.canvas.clientWidth / this.#gl.canvas.clientHeight;
    const projectionMatrix = m4.perspective(
      degToRad(45),
      aspectRatio,
      0.1,
      2000
    );

    const cameraMatrix = m4.lookAt([0, 0, -5], [0, 0, 0], [0, -1, 0]);
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    for (const go of gos) {
      let objectMatrix = m4.identity();
      objectMatrix = m4.translate(objectMatrix, ...go.position);
      objectMatrix = m4.xRotate(objectMatrix, go.rotation.x);
      objectMatrix = m4.yRotate(objectMatrix, go.rotation.y);
      objectMatrix = m4.zRotate(objectMatrix, go.rotation.z);
      objectMatrix = m4.scale(objectMatrix, ...go.scale);

      const mvp = m4.multiply(viewProjectionMatrix, objectMatrix);

      // TODO: only query this once
      const matrixLocation = this.#gl.getUniformLocation(
        this.#shaderProgram,
        "u_matrix"
      );
      this.#gl.uniformMatrix4fv(matrixLocation, false, mvp);
      this.#gl.drawArrays(this.#gl.TRIANGLES, 0, go.model.triangles);
    }
  };
}

export const wgl = new Wgl();

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
