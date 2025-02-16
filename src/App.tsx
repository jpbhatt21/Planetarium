import { useEffect, useState } from "react";
import { distance, get, set, simulate } from "./helper";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./components/ui/card";

import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { theme } from "./theme";
import { Textarea } from "./components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./components/ui/select";
import { Separator } from "./components/ui/separator";
import { svg } from "./vectors";
let anchor = 0;
const version = "1.0.0";
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
function setImportedData(data: any) {
	if (data.version != version) {
		alert("Version mismatch");
		return;
	}
	predictionLimit = data.predictionLimit;
	maxTrailLength = data.maxTrailLength;
	deltaT = data.deltaT;
	scale = data.scale;
	set.G(data.G);
	set.collisionEnergyLoss(data.collisionEnergyLoss);
	prt = data.particles;
	ctr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	off = {
		x: ctr.x - prt[0].position.x * scale,
		y: ctr.y - prt[0].position.y * scale,
	};
	initPath();
}
let preset = [
	{
		name: "Planet",
    scale:0.5,
		data: () => {
			return [JSON.parse(JSON.stringify(planet))];
		},
	},
	{
		name: "Planet with Moon",
		data: () => {
			return [
				JSON.parse(JSON.stringify(planet)),
				JSON.parse(JSON.stringify(object)),
			];
		},
    scale:0.5
	},
	{
		name: "5 Bodies",
    scale:0.5,
		data: () => {
			let objs = "0000".split("").map(() => {
				return JSON.parse(JSON.stringify(object));
			});
			objs[0].position.x = 0;
			objs[0].position.y = 0;

			objs[1].position.x = 1000;
			objs[1].position.y = 0;

			objs[2].position.x = 0;
			objs[2].position.y = 1000;

			objs[3].position.x = 1000;
			objs[3].position.y = 1000;
			let velz = [1, 1, -1, -1];
			velz.forEach((o, i) => {
				objs[i].name = "body " + (i + 2);
				objs[i].velocity.x = o;
				objs[i].mass = 100;
				let alpha = "abcd"[i] as keyof typeof theme.nord.frost;
				objs[i].trailColor = theme.nord.dark[alpha];
				objs[i].color = theme.nord.aurora[alpha];
				objs[i].futureColor = theme.nord.aurora[alpha];
				objs[i].fixedColor = true;
			});
			let planet2 = JSON.parse(JSON.stringify(planet));
			planet2.static = true;
			return [planet2, ...objs];
		},
	},
	{
		name: "Solar System",
		data: () => {
			return [
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
			];
		},
    scale:0.1
	},
];
let prt = preset[1].data();
let pastPositions: any = prt.map((p: any) => {
	return [[p.position.x, p.position.y]];
});
let initialPositions = JSON.parse(JSON.stringify(prt));
let count = prt.map(() => {
	return 0;
});
let paths: any = prt.map(() => {
	return [];
});
paths.shift();
let futurePositions: any = [];
let predictionLimit = 5000;
let maxTrailLength = 1000;
let deltaT = 10;
let t1 = new Date().getTime();
let t2 = new Date().getTime();
function initPath() {
  t1=new Date().getTime();
	futurePositions = [];
	initialPositions = JSON.parse(JSON.stringify(prt));
	pastPositions = prt.map((p: any) => {
		return [[p.position.x, p.position.y]];
	});
	count = prt.map(() => {
		return 0;
	});
	paths = prt.map(() => {
		return [];
	});
	// paths.shift();
	let temp = JSON.parse(JSON.stringify(prt));

	for (let i = 0; i < predictionLimit; i++) {
		temp = simulate(temp);
		futurePositions.push(JSON.parse(JSON.stringify(temp)));
		for (let j = 0; j < temp.length; j++) {
			paths[j].push([temp[j].position.x, temp[j].position.y]);
		}
	}
  t2=new Date().getTime();
  console.log("Prediction time:",t2-t1+"ms");  
}

initPath();
predictionLimit = Math.floor(
	((predictionLimit * (deltaT / 250)) / (t2 - t1)) * 1000
);
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
function getColor(velocity: any) {
	let maxV = 5;
	let min = { r: 234, g: 203, b: 139 };
	let max = { r: 191, g: 97, b: 106 };
	//rgb(191, 97, 106) red
	let vel =
		Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) / maxV;
	let r = min.r + Math.floor(vel * (max.r - min.r));
	let g = min.g + Math.floor(vel * (max.g - min.g));
	let b = min.b + Math.floor(vel * (max.b - min.b));
	return `rgb(${r},${g},${b})`;
}

let showTrail = true;
let showFuture = !false;
let interv: any = null;
let scale = preset[1 ].scale
let ctr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let off = {
	x: ctr.x - prt[0].position.x * scale,
	y: ctr.y - prt[0].position.y * scale,
};
let change: any = null;
let velocityScale = 10;
let bodyId: any = null;
let mouseDown = false;
let root = document.getElementById("root");
root?.style.setProperty("background-position", `${off.x}px ${off.y}px`);
function startSimulation(setParticles: any) {
	if (interv != null) {
		return;
	}
	let delta = Math.max(deltaT, 10);
	let delta2 = 1;
	if (deltaT < 10) {
		delta2 = 10 - deltaT;
	}
	delta2 = Math.min(delta2, 10);
	console.log(delta, delta2);
	interv = setInterval(() => {
		for (let i = 0; i < delta2; i++) {
			for (let i = 0; i < prt.length; i++) {
				if (
					distance(
						{
							x: pastPositions[i][count[i]][0],
							y: pastPositions[i][count[i]][1],
						},
						prt[i].position
					) >
					prt[i].radius / 4
				) {
					pastPositions[i].push([
						prt[i].position.x,
						prt[i].position.y,
					]);
					count[i]++;
				}
				if (count[i] > maxTrailLength) {
					count[i] -= 1;
					pastPositions[i].shift();
				}
			}

			prt = futurePositions[0];
			setPath();
		}
		setParticles([...prt]);
	}, delta);
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
let bodyId2: any = null;
root?.style.setProperty("background-image", scaledBG());
function App() {
	const [particles, setParticles] = useState([...prt]);

	const [center, setCenter] = useState({
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	});
	const [offset, setOffset] = useState({
		x: center.x - prt[0].position.x * scale,
		y: center.y - prt[0].position.y * scale,
	});
	if (
		center.x != window.innerWidth / 2 ||
		center.y != window.innerHeight / 2
	) {
		ctr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		setCenter(ctr);
	}
	if (
		(offset.x != center.x - particles[anchor].position.x * scale ||
			offset.y != center.y - particles[anchor].position.y * scale) &&
		!mouseDown
	) {
		off = {
			x: center.x - prt[anchor].position.x * scale,
			y: center.y - prt[anchor].position.y * scale,
		};
		root?.style.setProperty("background-position", `${off.x}px ${off.y}px`);
		root?.style.setProperty("background-image", scaledBG());
		setOffset(off);
	}

	useEffect(() => {
		window.addEventListener("resize", () => {
			ctr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
			setCenter(ctr);
		});
		window.addEventListener("mousemove", (e) => {
			if (bodyId != null) {
				let body = document.getElementById("body" + bodyId);
				if (body != null && mouseDown) {
					clearInterval(interv);
					interv = null;
					body.setAttribute("cx", (e.clientX - off.x).toString());
					body.setAttribute("cy", (e.clientY - off.y).toString());
					if (change != null) {
						clearTimeout(change);
					}
					change = setTimeout(() => {
						prt[bodyId].position.x = (e.clientX - off.x) / scale;
						prt[bodyId].position.y = (e.clientY - off.y) / scale;
						setParticles([...prt]);
						initPath();
					}, 1);
				}
			}
			if (bodyId2 !== null) {
				let body = document.getElementById("velocity" + bodyId2);
				if (body != null && mouseDown) {
					clearInterval(interv);
					interv = null;
					body.setAttribute("cx", (e.clientX - off.x).toString());
					body.setAttribute("cy", (e.clientY - off.y).toString());
					if (change != null) {
						clearTimeout(change);
					}
					change = setTimeout(() => {
						prt[bodyId2].velocity.x =
							((e.clientX - off.x) / scale -
								prt[bodyId2].position.x) /
							velocityScale;
						prt[bodyId2].velocity.y =
							((e.clientY - off.y) / scale -
								prt[bodyId2].position.y) /
							velocityScale;
						setParticles([...prt]);
						initPath();
					}, 1);
				}
			}
		});
		window.addEventListener("mouseup", () => {
			mouseDown = false;
			// if (bodyId == null)
			// prt[bodyId].position.x = (e.clientX - off.x) / scale;
			// prt[bodyId].position.y = (e.clientY - off.y) / scale;

			// setParticles([...prt]);
			// initPath();
			bodyId = null;
			bodyId2 = null;
		});
		window.addEventListener("keydown", (e) => {
			let id = e.target as any;
			if (id.id === "pastebox") {
				return;
			}
			if (e.key == "t") {
				showTrail = !showTrail;
				setParticles([...prt]);
			}
			if (e.key == "f") {
				showFuture = !showFuture;
				setParticles([...prt]);
			}
			if (e.key == " ") {
				if (interv == null) startSimulation(setParticles);
				else {
					clearInterval(interv);
					interv = null;
					setCenter({
						x: window.innerWidth / 2,
						y: window.innerHeight / 2,
					});
				}
			}

			if (e.key == "i") {
				initPath();
				setParticles([...prt]);
			}
		});
	}, []);
	return (
		<>
			<svg
				className="absolute fadein"
				style={{ top: 0, left: 0 }}
				viewBox={`${-offset.x} ${-offset.y} ${window.innerWidth} ${
					window.innerHeight
				}`}>
				{showFuture &&
					paths.map((path: any, index: any) => {
						return (
							<path
								d={getSVGPath(path, { x: 0, y: 0 })}
								fill="none"
								stroke={prt[index].futureColor}
							/>
						);
					})}
				{showTrail &&
					pastPositions.map((pastPosition: any, index: any) => {
						return (
							<path
								d={getSVGPath(pastPosition, { x: 0, y: 0 })}
								fill="none"
								stroke={prt[index].trailColor}
							/>
						);
					})}
				{particles.map((particle, index) => {
					return (
						<g>
							<circle
								id={"body" + index}
								onMouseDown={() => {
									bodyId = index;
									mouseDown = true;
								}}
								key={index}
								cx={particle.position.x * scale}
								cy={particle.position.y * scale}
								r={particle.radius * scale}
								fill={
									particle.fixedColor
										? particle.color
										: getColor(particle.velocity)
								}
								stroke={theme.nord.dark.d}
								strokeWidth={1}
							/>
							{interv == null && (
								<path
									d={
										"M " +
										particle.position.x * scale +
										" " +
										particle.position.y * scale +
										" l " +
										particle.velocity.x *
											velocityScale *
											scale +
										" " +
										particle.velocity.y *
											velocityScale *
											scale
									}
									stroke="#505050"
									strokeOpacity={0.5}
									strokeWidth={2}></path>
							)}
							{interv == null && (
								<circle
									cx={
										(particle.position.x +
											particle.velocity.x *
												velocityScale) *
										scale
									}
									cy={
										(particle.position.y +
											particle.velocity.y *
												velocityScale) *
										scale
									}
									r={5}
									fill="#505050"
									fillOpacity={0.5}
									id={"velocity" + index}
									stroke={theme.nord.light.a}
									strokeOpacity={0.5}
									onMouseDown={() => {
										bodyId2 = index;
										mouseDown = true;
									}}
								/>
							)}
						</g>
					);
				})}
			</svg>
			<div className="absolute fadein p-2 w-80 h-full flex flex-col text-white gap-2">
				<Card className="w-full flex flex-col">
					{/* <Button variant="outline" className=" border-[#bf616a]" onClick={() => {
            prt = preset[0]();
            setParticles([...prt]);
            initPath();
          }}>Reset</Button> */}
					<CardHeader className="self-center">
						<CardTitle>Universal Variables</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<p className="flex  justify-between h-fit items-center">
							Delta T (ms)
							<Input
								type="number"
								value={deltaT}
								onChange={(e) => {
									deltaT = parseInt(e.target.value);
									initPath();
									if (interv != null) {
										clearInterval(interv);
										interv = null;
										startSimulation(setParticles);
									} else {
										setCenter({
											x: window.innerWidth / 2,
											y: window.innerHeight / 2,
										});
									}
								}}
							/>
						</p>
						<p className="flex  justify-between h-fit items-center">
							Forecast Limit
							<Input
								type="number"
								value={predictionLimit}
								onChange={(e) => {
									predictionLimit = parseInt(e.target.value);
									initPath();
									setCenter({
										x: window.innerWidth / 2,
										y: window.innerHeight / 2,
									});
								}}
							/>
						</p>
						<p className="flex  justify-between h-fit items-center">
							Max Trail Length
							<Input
								type="number"
								value={maxTrailLength}
								onChange={(e) => {
									maxTrailLength = parseInt(e.target.value);
									setCenter({
										x: window.innerWidth / 2,
										y: window.innerHeight / 2,
									});
								}}
							/>
						</p>
						<p className="flex  justify-between h-fit items-center">
							Gravitational Constant
							<Input
								type="number"
								value={get.G()}
								step={0.0001}
								onChange={(e) => {
									set.G(parseFloat(e.target.value));
									initPath();
									setCenter({
										x: window.innerWidth / 2,
										y: window.innerHeight / 2,
									});
								}}
							/>
						</p>
						<p className="flex  justify-between h-fit items-center">
							Collision Energy Loss %
							<Input
								type="number"
								value={get.collisionEnergyLoss() * 100}
								step={0.01}
								onChange={(e) => {
									set.collisionEnergyLoss(
										parseFloat(e.target.value) / 100
									);
									initPath();
									setCenter({
										x: window.innerWidth / 2,
										y: window.innerHeight / 2,
									});
								}}
							/>
						</p>
						<p className="flex  justify-between h-fit items-center">
							Scale
							<Input
								type="number"
								value={scale * 100}
								step={0.1}
								onChange={(e) => {
									scale = Math.max(
										0.001,
										parseFloat(e.target.value) / 100
									);
									setCenter({
										x: window.innerWidth / 2,
										y: window.innerHeight / 2,
									});
								}}
							/>
						</p>
						<p className="flex  justify-between gap-2 h-fit w-full items-center">
							<label>Anchor</label>
							<Select
								value={particles[anchor].name}
								onValueChange={(value) => {
									anchor = parseInt(value);
									setCenter({
										x: window.innerWidth / 2,
										y: window.innerHeight / 2,
									});
								}}>
								<SelectTrigger className="w-full">
									<SelectValue>
										{particles[anchor].name}
									</SelectValue>
								</SelectTrigger>

								<SelectContent>
									<SelectGroup>
										<SelectLabel>Choose Body</SelectLabel>
										{/* <SelectItem value="apple">Apple</SelectItem> */}
										{particles.map((particle, index) => {
											return (
												<SelectItem
													value={index.toString()}>
													{particle.name}
												</SelectItem>
											);
										})}
									</SelectGroup>
								</SelectContent>
							</Select>
						</p>
					</CardContent>
				</Card>
				<Card className="w-full h-full flex flex-col">
					<CardHeader className="self-center">
						<CardTitle>Presets</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						{preset.map((p) => {
							return (
								<Button
									variant="outline"
									onClick={() => {
										prt = JSON.parse(
											JSON.stringify(p.data())
										);
                    scale = p.scale
										initPath();
										setParticles([...prt]);
										setCenter({
											x: window.innerWidth / 2,
											y: window.innerHeight / 2,
										});
									}}>
									{p.name}
								</Button>
							);
						})}
					</CardContent>
				</Card>
				<Card className="w-full flex flex-col">
					<CardHeader className="self-center">
						<CardTitle className="self-center">Import</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center flex-col w-full gap-2">
						<Textarea
							placeholder="Paste here"
							id="pastebox"
							className=" resize-none"
							onChange={(e) => {
								if (change != null) {
									clearTimeout(change);
								}
								change = setTimeout(() => {
									try {
										let data = JSON.parse(e.target.value);
										setImportedData(data);
										setParticles([...prt]);
										setCenter({
											x: window.innerWidth / 2,
											y: window.innerHeight / 2,
										});
										e.target.value = "";
										alert("Imported Successfully");
									} catch (e) {
										alert("Invalid JSON");
									}
									change = null;
								}, 1000);
							}}
						/>
						or
						<Input
							type="file"
							accept=".json"
							onChange={(e) => {
								if (e.target.files == null) return;
								let file = e.target.files[0];
								if (file == null) return;
								let reader = new FileReader();
								reader.onload = (e) => {
									let data = JSON.parse(
										e.target?.result as string
									);
									setImportedData(data);
									setParticles([...prt]);
									setCenter({
										x: window.innerWidth / 2,
										y: window.innerHeight / 2,
									});
									alert("Imported Successfully");
								};
								reader.readAsText(file);
							}}
						/>
					</CardContent>
					{/* </Card>
				<Card className=" flex flex-col w-80  "> */}
					<Separator />
					{/* <Button variant="outline" className=" border-[#bf616a]" onClick={() => {
            prt = preset[0]();
            setParticles([...prt]);
            initPath();
          }}>Reset</Button> */}
					<CardHeader className="self-center">
						<CardTitle className="self-center">Export</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center w-full gap-2">
						<Button
							variant="outline"
							className="w-1/2"
							onClick={() => {
								let data = JSON.stringify({
									version,
									particles: initialPositions,
									predictionLimit,
									maxTrailLength,
									deltaT,
									G: get.G(),
									collisionEnergyLoss:
										get.collisionEnergyLoss(),
									scale,
								});
								navigator.clipboard.writeText(data);
								alert("Copied to clipboard");
							}}>
							Copy
						</Button>
						or
						<Button
							variant="outline"
							className="w-1/2 "
							onClick={() => {
								let data = JSON.stringify({
									version,
									particles: initialPositions,
									predictionLimit,
									maxTrailLength,
									deltaT,
									G: get.G(),
									collisionEnergyLoss:
										get.collisionEnergyLoss(),
									scale,
								});
								let blob = new Blob([data], {
									type: "text/plain",
								});
								let url = URL.createObjectURL(blob);
								let a = document.createElement("a");
								a.href = url;
								a.download = "config.json";
								a.click();
								URL.revokeObjectURL(url);
							}}>
							Download
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className="absolute fadein bottom-2 left-2  gap-1 flex flex-col  text-white "></div>
			<div className="absolute fadein h-full w-84 overflow-y-scroll pl- top-0 right-0 flex gap-2 flex-col text-white p-2">
				{particles.map((particle, index) => {
					return (
						<Card className="">
							<CardHeader>
								<CardTitle>
									<Input
										className="w-full text-center self-center"
										type="text"
										value={particle.name}
										onChange={(e) => {
											prt[index].name = e.target.value;
											setParticles([...prt]);
										}}
									/>
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<p className="flex  justify-between h-fit items-center">
									Mass
									<Input
										type="number"
										value={particle.mass}
										onChange={(e) => {
											prt[index].mass = parseFloat(
												e.target.value
											);
											setParticles([...prt]);
											initPath();
										}}
									/>
								</p>
								<p className="flex  justify-between h-fit items-center">
									Radius
									<Input
										type="number"
										value={particle.radius}
										onChange={(e) => {
											prt[index].radius = parseFloat(
												e.target.value
											);
											setParticles([...prt]);
											initPath();
										}}
									/>
								</p>
								<div className="flex  justify-between h-fit items-center">
									Position
									<p className="flex  justify-center gap-1 items-center">
										x
										<Input
											type="number"
											value={
												Math.round(
													particle.position.x * 100
												) / 100
											}
											onChange={(e) => {
												prt[index].position.x =
													parseInt(e.target.value);
												setParticles([...prt]);
												initPath();
											}}
										/>
									</p>
									<p className="flex  justify-center gap-1 items-center">
										y
										<Input
											type="number"
											value={
												Math.round(
													particle.position.y * 100
												) / 100
											}
											onChange={(e) => {
												prt[index].position.y =
													parseInt(e.target.value);
												setParticles([...prt]);
												initPath();
											}}
										/>
									</p>
								</div>
								<div className="flex  justify-between h-fit items-center">
									Velocity
									<p className="flex  justify-center gap-1 items-center">
										x
										<Input
											type="number"
											value={
												Math.round(
													particle.velocity.x * 100
												) / 100
											}
											step={0.05}
											onChange={(e) => {
												prt[index].velocity.x =
													parseFloat(e.target.value);
												setParticles([...prt]);
												initPath();
											}}
										/>
									</p>
									<p className="flex  justify-center gap-1 items-center">
										y
										<Input
											type="number"
											value={
												Math.round(
													particle.velocity.y * 100
												) / 100
											}
											step={0.05}
											onChange={(e) => {
												prt[index].velocity.y =
													parseFloat(e.target.value);
												setParticles([...prt]);
												initPath();
											}}
										/>
									</p>
								</div>
								<p className="flex  justify-between h-fit items-center">
									Static Body
									<Checkbox
										defaultChecked={particle.static}
										onCheckedChange={(checked) => {
											prt[index].static = checked;
											setParticles([...prt]);
											initPath();
										}}
									/>
								</p>
								<p className="flex  justify-between h-fit items-center">
									Fixed Color
									<Checkbox
										defaultChecked={particle.fixedColor}
										onCheckedChange={(checked) => {
											prt[index].fixedColor = checked;
											setParticles([...prt]);
											initPath();
										}}
									/>
								</p>
								<p className="flex  justify-between h-fit items-center">
									Body Color
									<Input
										type="color"
										className="w-1/2"
										value={particle.color}
										onChange={(e) => {
											console.log(e.currentTarget.value);
											prt[index].color =
												e.currentTarget.value;
											setParticles([...prt]);
										}}
									/>
								</p>
								<p className="flex  justify-between h-fit items-center">
									Trail Color
									<Input
										type="color"
										className="w-1/2"
										value={particle.trailColor}
										onChange={(e) => {
											prt[index].trailColor =
												e.currentTarget.value;
											setParticles([...prt]);
										}}
									/>
								</p>
								<p className="flex  justify-between h-fit items-center">
									Forecast Color
									<Input
										type="color"
										className="w-1/2"
										value={particle.futureColor}
										onChange={(e) => {
											prt[index].futureColor =
												e.currentTarget.value;
											setParticles([...prt]);
										}}
									/>
								</p>
							</CardContent>
							<CardFooter className="flex justify-between">
								<Button
									variant="outline"
									className=" "
									onClick={() => {
										let ref = {
											x: prt[index].position.x,
											y: prt[index].position.y,
										};
										let refRad = prt[index].radius;
										let pos = {
											x:
												ref.x +
												(Math.random() + 5) *
													refRad *
													(Math.random() < 0.5
														? 1
														: -1),
											y:
												ref.y +
												(Math.random() + 5) *
													refRad *
													(Math.random() < 0.5
														? 1
														: -1),
										};
										let vel = {
											x: 0, //Math.random() * 0.2 - 0.1,
											y: 0, // Math.random() * 0.2 - 0.1,
										};
										let rand = Math.random();
										let alpha = "abcd"[
											Math.floor(rand * 4)
										] as keyof typeof theme.nord.dark;
										let beta = "abcde"[
											Math.floor(rand * 5)
										] as keyof typeof theme.nord.aurora;
										prt.push({
											name: "body " + (prt.length + 1),
											mass: prt[index].mass,
											radius: prt[index].radius,
											position: { x: pos.x, y: pos.y },
											velocity: { x: vel.x, y: vel.y },
											static: false,
											fixedColor: true,
											color: theme.nord.aurora[beta],
											trailColor: theme.nord.dark[alpha],
											futureColor:
												theme.nord.aurora[beta],
										});
										pastPositions.push([[pos.x, pos.y]]);
										count.push(0);
										paths.push([]);
										setParticles([...prt]);
										initPath();
									}}>
									Duplicate
								</Button>
								<Button
									variant="outline"
									className=" border-[#bf616a80]"
									onClick={() => {
										prt.splice(index, 1);
										pastPositions.splice(index, 1);
										count.splice(index, 1);
										paths.splice(index, 1);
										setParticles([...prt]);
										initPath();
									}}>
									Delete
								</Button>
							</CardFooter>
						</Card>
					);
				})}

				<Button
					variant="outline"
					className=" border-[#a3be8c]"
					onClick={() => {
						let ref = {
							x: particles[0].position.x,
							y: particles[0].position.y,
						};
						let refRad = particles[0].radius;
						let pos = {
							x:
								ref.x +
								(Math.random() + 5) *
									refRad *
									(Math.random() < 0.5 ? 1 : -1),
							y:
								ref.y +
								(Math.random() + 5) *
									refRad *
									(Math.random() < 0.5 ? 1 : -1),
						};
						let vel = {
							x: Math.random() * 0.2 - 0.1,
							y: Math.random() * 0.2 - 0.1,
						};
						let rand = Math.random();
						let alpha = "abcd"[
							Math.floor(rand * 4)
						] as keyof typeof theme.nord.dark;
						let beta = "abcde"[
							Math.floor(rand * 5)
						] as keyof typeof theme.nord.aurora;
						prt.push({
							name: "body " + (prt.length + 1),
							mass: 10,
							radius: 10,
							position: { x: pos.x, y: pos.y },
							velocity: { x: vel.x, y: vel.y },
							static: false,
							fixedColor: false,
							color: theme.nord.aurora[beta],
							trailColor: theme.nord.dark[alpha],
							futureColor: theme.nord.aurora[beta],
						});
						pastPositions.push([[pos.x, pos.y]]);
						count.push(0);
						paths.push([]);
						setParticles([...prt]);
						initPath();
					}}>
					Add Body
				</Button>
			</div>
			<div
				className=" fixed  top-5 left-1/2 fadein -translate-x-1/2 prt  flex justify-center items-center gap-2"
				style={{ animationDuration: "3s" }}>
				{svg.logo({ height: "40px", width: "40px" })}
				<label className=" mts text-xl"> Planaterium</label>
			</div>
		</>
	);
}

export default App;
