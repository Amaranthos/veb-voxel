import { m4 } from "../matrices";
import { degToRad } from "../angles";

export class Renderable {
  _gl = null;
  _shaderProgram = null;
  _attributes = {};

  _model = null;

  _vao = null;
  _positionBuffer = null;
  _texcoordBuffer = null;

  _objects = [];

  constructor(gl, shaderProgram, model) {
    this._gl = gl;
    this._shaderProgram = shaderProgram;
    this._model = model;

    // Create vertex buffer object and vertex array object
    this._vao = this._gl.createVertexArray();

    // TODO: Maybe interleave vertex data via ELEMENT_ARRAY_BUFFER and draw elements... rather than a buffer per type of data
    // this._vbo = this._gl.createBuffer();
    this._positionBuffer = this._gl.createBuffer();
    this._texcoordBuffer = this._gl.createBuffer();

    // TODO: Automatically figure out attributes based on shader(material)??

    this._attributes.position = this._gl.getAttribLocation(
      this._shaderProgram,
      "a_position"
    );
    this._attributes.texcoord = this._gl.getAttribLocation(
      this._shaderProgram,
      "a_texcoord"
    );
    this._attributes.mvp = this._gl.getUniformLocation(
      this._shaderProgram,
      "u_matrix"
    );

    this._gl.bindVertexArray(this._vao);

    // Bind and buffer position data
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.enableVertexAttribArray(this._attributes.position);
    this._gl.vertexAttribPointer(
      this._attributes.position,
      3,
      this._gl.FLOAT,
      false,
      0,
      0
    );
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(this._model.mesh),
      this._gl.STATIC_DRAW
    );

    // Bind and buffer uv data
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._texcoordBuffer);
    this._gl.enableVertexAttribArray(this._attributes.texcoord);
    this._gl.vertexAttribPointer(
      this._attributes.texcoord,
      2,
      this._gl.FLOAT,
      true,
      0,
      0
    );
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(this._model.uvs),
      this._gl.STATIC_DRAW
    );

    console.log(this._attributes);
  }

  draw = objects => {
    this._objects.push(...[].concat(objects || []));
  };

  render = () => {
    this._gl.useProgram(this._shaderProgram);
    this._gl.bindVertexArray(this._vao);

    const aspectRatio =
      this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
    const projectionMatrix = m4.perspective(
      degToRad(45),
      aspectRatio,
      0.1,
      2000
    );

    const cameraMatrix = m4.lookAt([0, 0, -7], [0, 0, 0], [0, 1, 0]);
    const viewMatrix = m4.inverse(cameraMatrix);
    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    for (const obj of this._objects) {
      let objectMatrix = m4.identity();
      objectMatrix = m4.translate(objectMatrix, ...obj.position);
      objectMatrix = m4.xRotate(objectMatrix, obj.rotation.x);
      objectMatrix = m4.yRotate(objectMatrix, obj.rotation.y);
      objectMatrix = m4.zRotate(objectMatrix, obj.rotation.z);
      objectMatrix = m4.scale(objectMatrix, ...obj.scale);

      const mvp = m4.multiply(viewProjectionMatrix, objectMatrix);

      this._gl.uniformMatrix4fv(this._attributes.mvp, false, mvp);
      this._gl.drawArrays(this._gl.TRIANGLES, 0, this._model.triangles);
    }

    this._objects = [];
  };
}
