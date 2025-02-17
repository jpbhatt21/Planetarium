import { useEffect, useState } from "react";

import { theme } from "./theme";

import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

import AppSidebar from "./Sidebar";
import { getVars, setVars } from "./vars";
import { Button } from "./components/ui/button";
let anchor = 0;
// let object = {
// 	name: "body 2",
// 	mass: 100,
// 	radius: 10,
// 	position: { x: 100, y: 100 },
// 	velocity: { x: 1, y: 0.0 },
// 	static: false,
// 	fixedColor: false,
// 	color: theme.nord.aurora.d,
// 	trailColor: theme.nord.dark.b,
// 	futureColor: theme.nord.aurora.b,
// };
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

// let planet = {
// 	name: "planet",
// 	mass: 10000,
// 	radius: 50,
// 	position: { x: 500, y: 500 },
// 	velocity: { x: 0.1, y: 0.1 },
// 	static: false,
// 	fixedColor: true,
// 	color: theme.nord.frost.d,
// 	trailColor: theme.nord.frost.a,
// 	futureColor: theme.nord.frost.c,
// };

let initPath = getVars.initPath();
let getSVGPath = getVars.getSVGPath;
let bodies = getVars.bodies();
let showTrail = true;
let showFuture = !false;
let interv: any = null;
let scale = getVars.scale();
let ctr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let off = {
	x: ctr.x - bodies[0].position.x * scale,
	y: ctr.y - bodies[0].position.y * scale,
};
let change: any = null;
let velocityScale = 10;
let bodyId: any = null;
let mouseDown = false;
let bodyId2: any = null;
function setInterv(x: any) {
	interv = x;
}
setVars.setInterv(setInterv);
function App() {
	const [particles, setParticles] = useState([...bodies]);
	const [selected, setSelected] = useState(-1);

	const [center, setCenter] = useState({
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	});
	const [mousePos, setMousePos] = useState(center);
	const [offset, setOffset] = useState({
		x: center.x - bodies[0].position.x * scale,
		y: center.y - bodies[0].position.y * scale,
	});
	scale = getVars.scale();
	if (
		(offset.x != center.x - particles[anchor].position.x * scale ||
			offset.y != center.y - particles[anchor].position.y * scale) &&
		!mouseDown
	) {
		off = {
			x: center.x - particles[anchor].position.x * scale,
			y: center.y - particles[anchor].position.y * scale,
		};
		setOffset(off);
	}

	bodies = getVars.bodies();
	setVars.interv(interv);
	let temp = getVars.anchor();
	if (temp != anchor) {
		anchor = temp;
		off = {
			x: center.x - particles[anchor].position.x * scale,
			y: center.y - particles[anchor].position.y * scale,
		};
		setOffset(off);
	}
	useEffect(() => {
		setVars.setParticles(setParticles);
		setVars.setCenter(setCenter);
		function move(e: any) {
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
						bodies[bodyId].position.x = (e.clientX - off.x) / scale;
						bodies[bodyId].position.y = (e.clientY - off.y) / scale;
						setVars.bodies([...bodies]);
						setParticles([...bodies]);
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
						bodies[bodyId2].velocity.x =
							((e.clientX - off.x) / scale -
								bodies[bodyId2].position.x) /
							velocityScale;
						bodies[bodyId2].velocity.y =
							((e.clientY - off.y) / scale -
								bodies[bodyId2].position.y) /
							velocityScale;
						setVars.bodies([...bodies]);
						setParticles([...bodies]);
						initPath();
					}, 1);
				}
			}
		}
		window.addEventListener("resize", () => {
			ctr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
			setCenter(ctr);
		});
		window.addEventListener("mousemove", move);
		window.addEventListener("touchmove", move);
		window.addEventListener("touchend", () => {
			mouseDown = false;
			bodyId = null;
			bodyId2 = null;
		});
		window.addEventListener("mouseup", () => {
			mouseDown = false;
			bodyId = null;
			bodyId2 = null;
		});

		window.addEventListener("wheel", (e) => {
			let target = e.target as HTMLElement;
			if (target.id == "svg") {
				console.log(scale);
				scale -=
					e.deltaY /
					(scale > 1 ? 1000 : scale > 0.1 ? 10000 : 100000);
				if (scale <= 0) scale = 0.01;
				setVars.scale(scale);
				let ele = document.getElementById("scale") as HTMLInputElement;
				if (ele) ele.value = (scale * 100).toFixed(2);
				off = {
					x: center.x - bodies[0].position.x * scale,
					y: center.y - bodies[0].position.y * scale,
				};
				setOffset(off);
			} else if (target.id.includes("body")) {
				if (change != null) clearTimeout(change);
				if (e.shiftKey) {
					change = setTimeout(() => {
						bodies[parseInt(target.id.replace("body", ""))].mass -=
							e.deltaY;
						setVars.bodies([...bodies]);
						setParticles([...bodies]);
						initPath();
					}, 10);
				} else {
					change = setTimeout(() => {
						bodies[
							parseInt(target.id.replace("body", ""))
						].radius -= e.deltaY / 20;
						setVars.bodies([...bodies]);
						setParticles([...bodies]);
						initPath();
					}, 10);
				}
			}
		});
		window.addEventListener("keydown", (e) => {
			let id = e.target as any;

			if (id.id === "pastebox") {
				return;
			}
			if (e.key == "t") {
				showTrail = !showTrail;
				setParticles([...bodies]);
			}
			if (e.key == "f") {
				showFuture = !showFuture;
				setParticles([...bodies]);
			}
			if (e.key == " ") {
				if (interv == null) interv = getVars.startSimulation();
				else {
					clearInterval(interv);
					interv = null;
					setVars.interv(interv);
					setCenter({
						x: window.innerWidth / 2,
						y: window.innerHeight / 2,
					});
				}
			}

			if (e.key == "i") {
				initPath();
				setParticles([...bodies]);
			}
		});
		setCenter(ctr);
	}, []);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	let time = getVars.time();
	return (
		<SidebarProvider
			open={sidebarOpen}
			style={
				{
					["--sidebar-width" as string]: "20rem",
					["--sidebar-width-mobile" as string]: "20rem",
				} as React.CSSProperties
			}
			onOpenChange={(open) => {
				setSidebarOpen(open);
			}}>
			<AppSidebar open={sidebarOpen} />
			<div
				className="fixed duration -300 w-full h-full top-0 "
				style={{
					backgroundColor: "#09090b",
					backgroundImage: `${getVars.scaledBG()()}`,
					backgroundPosition: `${off.x}px ${off.y}px`,
				}}>
				<svg
					id="svg"
					className=" fadein absolute w-full h-full"
					viewBox={`${-offset.x} ${-offset.y} ${window.innerWidth} ${
						window.innerHeight
					}`}>
					{showFuture &&
						getVars.paths().map((path: any, index: any) => {
							return (
								<path
									d={getSVGPath(path, { x: 0, y: 0 })}
									fill="none"
									stroke={bodies[index].futureColor}
									strokeWidth={"1px"}
								/>
							);
						})}
					{showTrail &&
						getVars
							.pastPositions()
							.map((pastPosition: any, index: any) => {
								return (
									<path
										d={getSVGPath(pastPosition, {
											x: 0,
											y: 0,
										})}
										fill="none"
										stroke={bodies[index].trailColor}
									/>
								);
							})}
					{particles.map((particle, index) => {
						return (
							<g>
								<circle
									onMouseEnter={(e) => {
										setSelected(index);
										setMousePos({
											x: e.clientX,
											y: e.clientY,
										});
									}}
									onMouseLeave={() => {
										setSelected(-1);
									}}
									id={"body" + index}
									style={{
										transition:
											interv !== null &&
											getVars.speed() < 0
												? "all " +
												  10 * (1 - getVars.speed()) +
												  "ms"
												: "",
									}}
									onMouseDown={() => {
										if (interv != null) return;
										bodyId = index;
										mouseDown = true;
									}}
									onTouchStart={() => {
										if (interv != null) return;
										bodyId = index;
										mouseDown = true;
									}}
									onClick={() => {
										anchor = index;
										setVars.anchor(anchor);
										off = {
											x:
												center.x -
												bodies[anchor].position.x *
													scale,
											y:
												center.y -
												bodies[anchor].position.y *
													scale,
										};

										setOffset(off);
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
			</div>

			<div
				className="fixed duration-300 top-2"
				style={{
					left: sidebarOpen ? "20rem" : "4rem",
				}}>
				<SidebarTrigger id="sidebarTrig" className=" " />
			</div>
			<div className="flex flex-col items-end gap-2 absolute bottom-2 right-2">
				<label className="w-60 text-sm text-end">
					{time < 24
						? time + " hours"
						: time < 168
						? (time / 24).toFixed(1) + " days"
						: time < 720
						? (time / 168).toFixed(1) + " weeks"
						: time < 8640
						? (time / 720).toFixed(1) + " months"
						: (time / 8640).toFixed(1) + " years"}{" "}
					since initialization
				</label>
				</div>
			<div className="flex flex-col items-end gap-2 absolute top-2 right-2">
				
				<Button
					variant="outline"
					className=" w-20"
					style={{
						borderColor: interv == null ? "#a3be8c80" : "#bf616a80",
					}}
					onClick={(e) => {
						if (interv == null) getVars.startSimulation();
						else {
							clearInterval(interv);
							interv = null;
							setVars.interv(interv);
							setCenter({
								x: window.innerWidth / 2,
								y: window.innerHeight / 2,
							});
						}
						e.currentTarget.blur();
					}}>
					{interv == null ? "Play" : "Pause"}
				</Button>
				<Button
					variant="outline"
					className=" w-20 "
					style={{
						borderColor: showTrail ? "#a3be8c80" : "#bf616a80",
					}}
					onClick={(e) => {
						showTrail = !showTrail;
						setCenter({
							x: window.innerWidth / 2,
							y: window.innerHeight / 2,
						});
						e.currentTarget.blur();
					}}>
					Trail
				</Button>
				<Button
					variant="outline"
					className=" w-20 "
					style={{
						borderColor: showFuture ? "#a3be8c80" : "#bf616a80",
					}}
					onClick={(e) => {
						showFuture = !showFuture;
						setCenter({
							x: window.innerWidth / 2,
							y: window.innerHeight / 2,
						});
						e.currentTarget.blur();
					}}>
					Forecast
				</Button>
			</div>
			<div>halo</div>
			<div
				className="flex fixed bg-background/50 duration-300 text-accent-foreground border p-2 rounded-md flex-col justify-between"
				style={{
					top: mousePos.y,
					left: mousePos.x,
					opacity: selected < 0 ? 0 : 1,
					transitionProperty: "opacity,transform",
					transform: selected < 0 ? "scale(0)" : "scale(1)",
					transformOrigin: "top left",
				}}>
				
					
						<div className="w-full text-center mb-1">{selected>=0?particles[selected].name:"---"}</div>
						<div>Mass: {selected>=0?particles[selected].mass.toFixed(2):"---"}</div>
						<div>Radius: {selected>=0?particles[selected].radius.toFixed(2):"---"}</div>
						<div>
							Position: {selected>=0?particles[selected].position.x.toFixed(2):"---"} , {selected>=0?particles[selected].position.y.toFixed(2):"---"}
						</div>
						<div>
							Velocity: {selected>=0?particles[selected].velocity.x.toFixed(2):"---"} , {selected>=0?particles[selected].velocity.y.toFixed(2):"---"}
						</div>
					
			</div>
		</SidebarProvider>
	);
}

export default App;
