export const vertex = `# version 300 es

in vec4 a_position;
in vec4 a_colour;

uniform mat4 u_matrix;

out vec4 v_colour;

void main() {
	gl_Position = u_matrix * a_position;
	v_colour = a_colour;
}
`;
