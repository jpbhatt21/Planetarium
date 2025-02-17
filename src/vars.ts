import { distance, set, simulate } from "./helper";
import { theme } from "./theme";

let object = {
	name: "body 2",
	mass: 100,
	radius: 10,
	position: { x: 100, y: 100 },
	velocity: { x: 1, y: 0.0 },
	static: false,
	fixedColor: false,
	color: theme.nord.aurora.d,
	trailColor: theme.nord.dark.b,
	futureColor: theme.nord.aurora.b,
};
let time = 0;
let planet = {
	name: "planet",
	mass: 10000,
	radius: 50,
	position: { x: 500, y: 500 },
	velocity: { x: 0.1, y: 0.1 },
	static: false,
	fixedColor: true,
	color: theme.nord.frost.d,
	trailColor: theme.nord.frost.a,
	futureColor: theme.nord.frost.c,
};
let interv: any = null;
let scale = 1;
export const version = "1.1.0";
export let preset = [
	{
		name: "Star",
		data: {
			version: "1.1.0",
			speed: 0,
			G: 0.0667,
			collisionEnergyLoss: 0.01,
			scale: 0.5,
			anchor: 1,
			bodies: [
				{
					name: "planet",
					mass: 10000,
					radius: 50,
					position: { x: 500, y: 500 },
					velocity: { x: 0.1, y: 0.1 },
					static: false,
					fixedColor: true,
					color: "#5e81ac",
					trailColor: "#8fbcbb",
					futureColor: "#81a1c1",
				},
			],
		},
	},
	{
		name: "Star & Planet",
		data: {
			version: "1.1.0",
			speed: 0,
			G: 0.0667,
			collisionEnergyLoss: 0.01,
			scale: 0.5,
			anchor: 1,
			bodies: [
				{
					name: "planet",
					mass: 10000,
					radius: 50,
					position: { x: 500, y: 500 },
					velocity: { x: 0.1, y: 0.1 },
					static: false,
					fixedColor: true,
					color: "#5e81ac",
					trailColor: "#8fbcbb",
					futureColor: "#81a1c1",
				},
				{
					name: "body 2",
					mass: 100,
					radius: 10,
					position: { x: 100, y: 100 },
					velocity: { x: 1, y: 0 },
					static: false,
					fixedColor: false,
					color: "#a3be8c",
					trailColor: "#3b4252",
					futureColor: "#d08770",
				},
			],
		},
	},
	{
		name: "Star-Planet-Moon",
		data: {
			version: "1.1.0",
			speed: 0,
			G: 0.0667,
			collisionEnergyLoss: 0.01,
			scale: 1,
			anchor: 1,
			bodies: [
				{
					name: "planet",
					mass: 10000,
					radius: 50,
					position: { x: 500, y: 500 },
					velocity: { x: 0.1, y: 0.1 },
					static: true,
					fixedColor: true,
					color: "#5e81ac",
					trailColor: "#8fbcbb",
					futureColor: "#81a1c1",
				},
				{
					name: "body 2",
					mass: 1000,
					radius: 10,
					position: { x: 500, y: 250 },
					velocity: { x: 1.65, y: 0 },
					static: false,
					fixedColor: false,
					color: "#a3be8c",
					trailColor: "#3b4252",
					futureColor: "#d08770",
				},
				{
					name: "body 3",
					mass: 100,
					radius: 2,
					position: { x: 500, y: 220 },
					velocity: { x: 0, y: 0 },
					static: false,
					fixedColor: true,
					color: "#bf616a",
					trailColor: "#2e3440",
					futureColor: "#bf616a",
				},
			],
		},
	},
	{
		name: "Planetary System",
		data: {
			version: "1.1.0",
			speed: 0,
			G: 0.0667,
			collisionEnergyLoss: 0.01,
			scale: 0.1,
			anchor: 1,
			bodies: [
				{
					name: "sun",
					mass: 3330000,
					radius: 500,
					position: { x: 0, y: 0 },
					velocity: { x: 0, y: 0 },
					static: true,
					fixedColor: true,
					color: "#d3a645",
					trailColor: "#8fbcbb",
					futureColor: "#81a1c1",
				},
				{
					name: "mercury",
					mass: 1,
					radius: 20,
					position: { x: 0, y: -554 },
					velocity: { x: 20, y: 0 },
					static: false,
					fixedColor: true,
					color: "#a6943a",
					trailColor: "#2e3440",
					futureColor: "#868446",
				},
				{
					name: "venus",
					mass: 8,
					radius: 57,
					position: { x: 0, y: -1074 },
					velocity: { x: 15, y: 0 },
					static: false,
					fixedColor: true,
					color: "#ebcb8b",
					trailColor: "#3b4252",
					futureColor: "#ebcb8b",
				},
				{
					name: "earth",
					mass: 10,
					radius: 60,
					position: { x: 0, y: -1478 },
					velocity: { x: 13, y: 0 },
					static: false,
					fixedColor: true,
					color: "#629bd0",
					trailColor: "#434c5e",
					futureColor: "#8d9cbf",
				},
				{
					name: "mars",
					mass: 1,
					radius: 32,
					position: { x: 0, y: -2280 },
					velocity: { x: 10.5, y: 0 },
					static: false,
					fixedColor: true,
					color: "#e05252",
					trailColor: "#4c566a",
					futureColor: "#c86f6f",
				},
				{
					name: "jupiter",
					mass: 3180,
					radius: 150,
					position: { x: 0, y: -7624 },
					velocity: { x: 5.5, y: 0 },
					static: false,
					fixedColor: true,
					color: "#dfd1b3",
					trailColor: "#434c5e",
					futureColor: "#bcad8f",
				},
			],
		},
	},
	{
		name: "5 Bodies",

		data: {
			version: "1.1.0",
			speed: 0,
			G: 0.0667,
			collisionEnergyLoss: 0.01,
			scale: 0.5,
			anchor: 1,
			bodies: [
				{
					name: "planet",
					mass: 10000,
					radius: 50,
					position: { x: 500, y: 500 },
					velocity: { x: 0.1, y: 0.1 },
					static: true,
					fixedColor: true,
					color: "#5e81ac",
					trailColor: "#8fbcbb",
					futureColor: "#81a1c1",
				},
				{
					name: "body 2",
					mass: 100,
					radius: 10,
					position: { x: 0, y: 0 },
					velocity: { x: 1, y: 0 },
					static: false,
					fixedColor: true,
					color: "#bf616a",
					trailColor: "#2e3440",
					futureColor: "#bf616a",
				},
				{
					name: "body 3",
					mass: 100,
					radius: 10,
					position: { x: 1000, y: 0 },
					velocity: { x: 1, y: 0 },
					static: false,
					fixedColor: true,
					color: "#d08770",
					trailColor: "#3b4252",
					futureColor: "#d08770",
				},
				{
					name: "body 4",
					mass: 100,
					radius: 10,
					position: { x: 0, y: 1000 },
					velocity: { x: -1, y: 0 },
					static: false,
					fixedColor: true,
					color: "#ebcb8b",
					trailColor: "#434c5e",
					futureColor: "#ebcb8b",
				},
				{
					name: "body 5",
					mass: 100,
					radius: 10,
					position: { x: 1000, y: 1000 },
					velocity: { x: -1, y: 0 },
					static: false,
					fixedColor: true,
					color: "#a3be8c",
					trailColor: "#4c566a",
					futureColor: "#a3be8c",
				},
			],
		},
	},
];
let speed = 0;
let bodies = [planet, object];
let pastPositions: any = bodies.map((p: any) => {
	return [[p.position.x, p.position.y]];
});
let anchor = 0;
let setParticles: any = null;
let setCenter: any = null;
let setInterv: any = null;
// let initialPositions = JSON.parse(JSON.stringify(bodies));
let count = bodies.map(() => {
	return 0;
});
let paths: any = bodies.map(() => {
	return [];
});
paths.shift();
let futurePositions: any = [];
let predictionLimit = 5000;
let maxTrailLength = 1000;

let t1 = new Date().getTime();
let t2 = new Date().getTime();
function initPath() {
	t1 = new Date().getTime();
	futurePositions = [];
	// initialPositions = JSON.parse(JSON.stringify(bodies));
	pastPositions = bodies.map((p: any) => {
		return [[p.position.x, p.position.y]];
	});
	count = bodies.map(() => {
		return 0;
	});
	paths = bodies.map(() => {
		return [];
	});
	// paths.shift();
	let temp = JSON.parse(JSON.stringify(bodies));

	for (let i = 0; i < predictionLimit; i++) {
		temp = simulate(temp);
		futurePositions.push(JSON.parse(JSON.stringify(temp)));
		for (let j = 0; j < temp.length; j++) {
			paths[j].push([temp[j].position.x, temp[j].position.y]);
		}
	}
	t2 = new Date().getTime();
	console.log("Prediction time:", t2 - t1 + "ms");
}
setImportedData(preset[1].data);
initPath();
predictionLimit = Math.floor((predictionLimit / (t2 - t1)) * 50);
initPath();
function setPath() {
	let temp = [...futurePositions[futurePositions.length - 1]];
	temp = simulate(temp);
	futurePositions.push(JSON.parse(JSON.stringify(temp)));

	for (let j = 0; j < temp.length; j++) {
		paths[j].push([temp[j].position.x, temp[j].position.y]);
		paths[j].shift();
	}
	futurePositions.shift();
}
function getSVGPath(path: any, offset: any) {
	let pth = path.map((p: any) => {
		return `${p[0] * scale + offset.x},${p[1] * scale + offset.y}`;
	});
	return `M${pth.join("L")}`;
}

function startSimulation() {
	let speed = getVars.speed();
	if (interv != null) {
		return;
	}
	let delta = 10;
	let delta2 = 1;
	if (speed < 0) {
		delta = 10 * (1 - speed);
	} else {
		delta2 = speed + 1;
	}

	interv = setInterval(() => {
		for (let i = 0; i < delta2; i++) {
			for (let i = 0; i < bodies.length; i++) {
				if (
					distance(
						{
							x: pastPositions[i][count[i]][0],
							y: pastPositions[i][count[i]][1],
						},
						bodies[i].position
					) >
					bodies[i].radius / 4
				) {
					pastPositions[i].push([
						bodies[i].position.x,
						bodies[i].position.y,
					]);
					count[i]++;
				}
				if (count[i] > maxTrailLength) {
					count[i] -= 1;
					pastPositions[i].shift();
				}
			}

			bodies = futurePositions[0];
			setPath();
		}
		time += delta2;
		setParticles([...bodies]);
	}, delta);
	setInterv(interv);
	return interv;
}
function scaledBG() {
	return (
		"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" +
		150 * scale +
		"' height='" +
		150 * scale +
		"' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%231b1b1b' fill-opacity='1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
	);
}

export function setImportedData(data: any) {
	if (data.version != version) {
		alert("Version mismatch");
		return;
	}
	// predictionLimit = data.forecastLimit;
	// maxTrailLength = data.maxTrailLength;
	if (interv != null) {
		clearInterval(interv);
		interv = null;
		setInterv(interv);
	}
	speed = data.speed;
	scale = data.scale;
	let ele = document.getElementById("scale") as HTMLInputElement;
	if (ele) ele.value = (scale * 100).toString();
	set.G(data.G);
	set.collisionEnergyLoss(data.collisionEnergyLoss);
	bodies = data.bodies;
	let ctr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	anchor = data.anchor;
	initPath();
	if (setParticles != null) {
		setParticles([...bodies]);
		setCenter(ctr);
	}
}

export let getVars = {
	speed: () => speed,
	interv: () => interv,
	bodies: () => bodies,
	scale: () => scale,
	scaledBG: () => scaledBG,
	initPath: () => initPath,
	startSimulation: () => startSimulation(),
	paths: () => paths,
	getSVGPath: (path: any, offset: any) => getSVGPath(path, offset),
	pastPositions: () => pastPositions,
	setParticles: () => setParticles,
	setCenter: () => setCenter,
	setInterv: () => setInterv,
	predictionLimit: () => predictionLimit,
	maxTrailLength: () => maxTrailLength,
	anchor: () => anchor,
	count: () => count,
	presets: () => preset,
	time: () => time,
};
export let setVars = {
	speed: (s: number) => (speed = s),
	interval: (s: any) => (interv = s),
	bodies: (s: any) => (bodies = s),
	scale: (s: number) => (scale = s),
	interv: (s: any) => (interv = s),
	setParticles: (s: any) => (setParticles = s),
	setCenter: (s: any) => (setCenter = s),
	setInterv: (s: any) => (setInterv = s),
	predictionLimit: (s: number) => (predictionLimit = s),
	maxTrailLength: (s: number) => (maxTrailLength = s),
	anchor: (s: number) => (anchor = s),
	count: (s: any) => (count = s),
	paths: (s: any) => (paths = s),
	pastPositions: (s: any) => (pastPositions = s),
	time: (s: number) => (time = s),
};
