import { vertex, fragment, createDefaultProgram } from "./shaders/";
import { m4 } from "./matrices";
import { cube } from "./models";

import { wgl, Gameobject } from "./wgl";

import grass from "../assets/grass.png";

import { random } from "./random";
import { degToRad } from "./angles";

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

const drawScene = currentTime => {
  const deltaTime = (currentTime - previousTime) * 0.001;
  previousTime = currentTime;

  gos.forEach((go, i) => {
    // go.rotation.x += 0.4 * (i + 1) * 0.5 * deltaTime;
    // go.rotation.y += 0.7 * (i + 1) * 0.5 * deltaTime;
    // go.rotation.z += -0.8 * (i + 1) * 0.5 * deltaTime;
  });

  wgl.draw(...gos);
  requestAnimationFrame(drawScene);
};

(() => {
  const { gl } = wgl;

  console.log(gl);
  // wgl.setShaderProgram(program);
  // wgl.createUniforms();

  const texture = loadTexture(gl, grass);

  const count = 5;
  gos = Array(count)
    .fill(new Gameobject(cube))
    .map((e, i) => {
      const go = new Gameobject(cube);

      var angle = (i * Math.PI * 2) / count - degToRad(90);
      var x = Math.cos(angle) * 1.5;
      var y = Math.sin(angle) * 1.5;

      go.position = [x, y, 0];

      return go;
    });

  console.log(gos);

  requestAnimationFrame(drawScene);
})();
