import { vertex, fragment, createDefaultProgram } from "./shaders/";
import { m4 } from "./matrices";
import { cube } from "./models";

import { wgl, Gameobject } from "./wgl";

import noodles from "../assets/noodles.jpg";

import { random } from "./random";

const setGeometry = gl => {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.model), gl.STATIC_DRAW);
};

const setTexcoords = gl => {
  gl.bufferData(gl.ARRAY_BUFFER, cube.uvs, gl.STATIC_DRAW);
};

const loadTexture = (gl, source) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );

  const image = new Image();
  image.src = source;
  image.addEventListener("load", () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  return texture;
};

// GL
let vao;

// Data
let previousTime = 0;

let gos;

const drawScene = currentTime => {
  const deltaTime = (currentTime - previousTime) * 0.001;
  previousTime = currentTime;

  // Animation

  gos.forEach((go, i) => {
    go.rotation.x += Math.sin(i) * 0.4 * deltaTime;
    go.rotation.y += Math.sin(i) * 0.7 * deltaTime;
    go.rotation.z += Math.sin(i) * -0.8 * deltaTime;
  });

  wgl.draw(vao, ...gos);
  requestAnimationFrame(drawScene);
};

(() => {
  const { gl } = wgl;

  const program = createDefaultProgram(gl, vertex, fragment);
  wgl.setShaderProgram(program);
  wgl.createUniforms();

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

  // Position data
  const positionBuffer = gl.createBuffer();
  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  setTexcoords(gl);

  gl.enableVertexAttribArray(texcoordAttributeLocation);
  gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, true, 0, 0);

  const texture = loadTexture(gl, noodles);

  gos = Array(5)
    .fill(new Gameobject(cube))
    .map(() => new Gameobject(cube));

  console.log(gos);

  requestAnimationFrame(drawScene);
})();
