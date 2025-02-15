interface Vector {
	x: number;
	y: number;
}
interface Body {
	position: Vector;
	velocity: Vector;
	radius: number;
	mass: number;
	static: boolean;
}
function distance(p1:Vector, p2:Vector) {
	return Math.sqrt(
		(p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
	);
}
let collisionEnergyLoss = 0.01;
let G=0.0667
export const get={
    collisionEnergyLoss:()=>collisionEnergyLoss,
    G:()=>G
}
export const set={
    collisionEnergyLoss:(value:number)=>collisionEnergyLoss=value,
    G:(value:number)=>G=value
}
function gravity(p1:Body, p2:Body) {
    if(p1.mass === 0 || p2.mass === 0)
        return {x: 0, y: 0};

	let r = distance(p1.position, p2.position);
	let force = (G * p1.mass * p2.mass) / (r * r);
	let angle = Math.atan2(
		p2.position.y - p1.position.y,
		p2.position.x - p1.position.x
	);
	let forceX = Math.cos(angle) * force;
	let forceY = Math.sin(angle) * force;
	return { x: forceX, y: forceY };
}

function collision(p1: Body, p2: Body): { p1: Body; p2: Body } {
    if(p1.mass === 0 || p2.mass === 0)
        return {p1, p2};
	// Calculate difference between positions
	const dx = p2.position.x - p1.position.x;
	const dy = p2.position.y - p1.position.y;
	const distance = Math.sqrt(dx * dx + dy * dy);

	if (distance < p1.radius + p2.radius) {
		// Calculate the collision angle (normal)
		const angle = Math.atan2(dy, dx);
		// Calculate overlap and adjust positions to avoid sinking
		const overlap = p1.radius + p2.radius - distance;
		p1.position.x -= (Math.cos(angle) * overlap) / 2;
		p1.position.y -= (Math.sin(angle) * overlap) / 2;
		p2.position.x += (Math.cos(angle) * overlap) / 2;
		p2.position.y += (Math.sin(angle) * overlap) / 2;

		// Calculate speeds and movement angles
		const speed1 = Math.sqrt(p1.velocity.x ** 2 + p1.velocity.y ** 2);
		const speed2 = Math.sqrt(p2.velocity.x ** 2 + p2.velocity.y ** 2);
		const direction1 = Math.atan2(p1.velocity.y, p1.velocity.x);
		const direction2 = Math.atan2(p2.velocity.y, p2.velocity.x);

		// Rotate velocities to collision coordinate system
		const v1x = speed1 * Math.cos(direction1 - angle);
		const v1y = speed1 * Math.sin(direction1 - angle);
		const v2x = speed2 * Math.cos(direction2 - angle);
		const v2y = speed2 * Math.sin(direction2 - angle);

		// Apply 1D elastic collision equations along the x-axis (collision axis)
		const finalV1x =
			(v1x * (p1.mass - p2.mass) + 2 * p2.mass * v2x) /
			(p1.mass + p2.mass);
		const finalV2x =
			(v2x * (p2.mass - p1.mass) + 2 * p1.mass * v1x) /
			(p1.mass + p2.mass);

		// y-velocities remain unchanged in the rotated frame (tangent component)
		const finalV1y = v1y;
		const finalV2y = v2y;

		// Rotate the final velocities back to the original coordinate system
		p1.velocity.x =
			Math.cos(angle) * finalV1x -
			Math.sin(angle) * finalV1y * (1 - collisionEnergyLoss);
		p1.velocity.y =
			Math.sin(angle) * finalV1x +
			Math.cos(angle) * finalV1y * (1 - collisionEnergyLoss);
		p2.velocity.x =
			Math.cos(angle) * finalV2x -
			Math.sin(angle) * finalV2y * (1 - collisionEnergyLoss);
		p2.velocity.y =
			Math.sin(angle) * finalV2x +
			Math.cos(angle) * finalV2y * (1 - collisionEnergyLoss);
		if(p1.mass<p2.mass){
            if(Math.abs(p1.velocity.x-p2.velocity.x) < 0.5)
                p1.velocity.x = 0;
            if(Math.abs(p1.velocity.y-p2.velocity.y) < 0.5)
                p1.velocity.y = 0;
            if ( p1.velocity.x === 0 && p1.velocity.y === 0) {
                p2.mass += p1.mass;
                p1.mass = 0;
                p1.static = true;
                p2.radius=Math.sqrt(p1.radius*p1.radius+p2.radius*p2.radius);
                p1.radius = 0;
            }
        }
        else{
            if(Math.abs(p1.velocity.x-p2.velocity.x) < 0.5)
                p2.velocity.x = 0;
            if(Math.abs(p1.velocity.y-p2.velocity.y) < 0.5)
                p2.velocity.y = 0;
            if (
                p2.velocity.x === 0 &&
                p2.velocity.y === 0
            ) {
                p1.mass += p2.mass;
                p2.mass = 0;
                p1.radius=Math.sqrt(p1.radius*p1.radius+p2.radius*p2.radius);
                p2.radius = 0;
                p2.static = true;
            }
        }
		
	}
	return { p1, p2 };
}
function simulate(particles: any) {
	particles = particles.map((particle: any) => {
		if (particle.static || particle.mass === 0) {
			return particle;
		}
		let force = { x: 0, y: 0 };
		particles.forEach((p: any) => {
			if (p !== particle&&p.mass!==0) {
				let g = gravity(particle, p);
				force.x += g.x;
				force.y += g.y;
			}
		});
		particle.velocity.x += force.x / particle.mass;
		particle.velocity.y += force.y / particle.mass;
		particle.position.x += particle.velocity.x;
		particle.position.y += particle.velocity.y;
		// if(Math.abs(particle.velocity.x) > maxVelocities.x){
		//   maxVelocities.x = Math.abs(particle.velocity.x);
		// }
		// if(Math.abs(particle.velocity.y) > maxVelocities.y){
		//   maxVelocities.y = Math.abs(particle.velocity.y);
		// }

		return particle;
	});
	for (let i = 0; i < particles.length; i++) {
		for (let j = i + 1; j < particles.length; j++) {
			let { p1, p2 } = collision(particles[i], particles[j]);
			particles[i] = p1;
			particles[j] = p2;
		}
	}
	return particles;
}
export { distance, gravity, collision, simulate };
