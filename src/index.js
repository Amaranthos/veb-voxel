import { vertex, fragment, createDefaultProgram } from "./shaders/";
import { m4 } from "./matrices";
import { cube } from "./models";

import { wgl, Gameobject, Vec3 } from "./wgl";

import grass from "../assets/grass.png";

import { random } from "./random";
import { degToRad } from "./angles";
import { Renderable } from "./wgl/renderable";

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

// Data
let previousTime = 0;
let gos;
let cubeRenderable;

const drawScene = currentTime => {
  const { predrawAndClear } = wgl;
  predrawAndClear();

  const deltaTime = (currentTime - previousTime) * 0.001;
  previousTime = currentTime;

  gos.forEach((go, i) => {
    go.rotation.x += 0.4 * ((i % 3) + 1.5) * 0.5 * deltaTime;
    go.rotation.y += 0.7 * ((i % 3) + 1.5) * 0.5 * deltaTime;
    go.rotation.z += -0.8 * ((i % 3) + 1.5) * 0.5 * deltaTime;
  });

  cubeRenderable.draw(gos);
  cubeRenderable.render();

  requestAnimationFrame(drawScene);
};

(() => {
  const { gl, shaderProgram } = wgl;

  const texture = loadTexture(gl, grass);

  const count = 6;
  gos = Array(count)
    .fill(new Gameobject(cube))
    .map((e, i) => {
      const go = new Gameobject(cube);

      var angle = (i * Math.PI * 2) / count + degToRad(90);
      var x = Math.cos(angle) * 1.75;
      var y = Math.sin(angle) * 1.75;

      go.position = [x, y, 0];

      return go;
    });

  // Top
  gos[0].rotation = new Vec3(degToRad(-90), 0, 0);
  // Bottom
  gos[3].rotation = new Vec3(degToRad(90), 0, 0);
  //Sides
  gos[1].rotation = new Vec3(0, 0, 0);
  gos[2].rotation = new Vec3(0, degToRad(90), 0);
  gos[4].rotation = new Vec3(0, degToRad(180), 0);
  gos[5].rotation = new Vec3(0, degToRad(-90), 0);

  cubeRenderable = new Renderable(gl, shaderProgram, cube);

  requestAnimationFrame(drawScene);
})();
