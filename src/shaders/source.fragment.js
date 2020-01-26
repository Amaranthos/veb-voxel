export const fragment = `# version 300 es
precision mediump float;

uniform vec4 u_colour;

out vec4 outColour;

void main() {
	outColour = u_colour;
}
`;
