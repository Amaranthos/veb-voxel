export const vertex = `# version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
	vec2 scaled = a_position * u_scale;

	vec2 rotated = vec2(
		scaled.x * u_rotation.y + scaled.y * u_rotation.x,
		scaled.y * u_rotation.y - scaled.x * u_rotation.x
	);

	vec2 translated = rotated + u_translation;

	vec2 zeroToOne = translated / u_resolution;
	vec2 zeroToTwo = zeroToOne * 2.0;
	vec2 clipSpace = zeroToTwo - 1.0;

	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;
