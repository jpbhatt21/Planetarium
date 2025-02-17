import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./components/ui/collapsible";
import { Input } from "./components/ui/input";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "./components/ui/sidebar";
import { set, get } from "./helper";
import { getVars, setImportedData, setVars, version } from "./vars";
import { svg } from "./vectors";
import { theme } from "./theme";
import { Checkbox } from "./components/ui/checkbox";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogCancel,
	AlertDialogTrigger,
} from "./components/ui/alert-dialog";

import { Textarea } from "./components/ui/textarea";
import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuLabel,
} from "./components/ui/dropdown-menu";
import {
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./components/ui/button";
import { useState } from "react";

let initPath = getVars.initPath();
let setCenter = getVars.setCenter();
const separator = (
	<div className="border-t border-primary-foreground w-9/10 self-center mt-1"></div>
);

function AppSidebar({ open }: any) {
	if (initPath == null) {
		initPath = getVars.initPath();
	}
	if (setCenter == null) {
		setCenter = getVars.setCenter();
	}
	let particles = getVars.bodies();
	let anchor = getVars.anchor();
	let [collapsibles, setCollapsibles] = useState([true, true, true]);
	return (
		<Sidebar collapsible="icon" variant="floating">
			<SidebarHeader className="flex w-full flex-row justify-center mt-1  items-center">
				{open?
				(
					<div
					className=" flex overflow-hidden flex-col mts duration-300 fadein text-xl justify-center"
					>
					<label> Planaterium</label>
					{/* <label className=" tracking-wider"> Playground</label> */}
				</div>
				)
				:svg.logo({ height: "30px", width: "30px", className:"fadein" })}
				
			</SidebarHeader>
			<SidebarContent id="sidebar">
				{separator}

				<Collapsible
				id="col1"
					open={open && collapsibles[0]}
					onOpenChange={(e) => {
						let temp = [...collapsibles];
						temp[0] = e;
						setCollapsibles(temp);
					}}>
					<SidebarGroup>
						
							
							{open? (
								<SidebarGroupLabel className="w-full fadein">
									<CollapsibleTrigger className="w-full text-start">
										Universal Settings
									</CollapsibleTrigger>
								</SidebarGroupLabel>
							):<Button className="fadein bg-background border text-accent-foreground hover:bg-accent-foreground hover:text-primary-foreground duration-300 transition-colors " 
							onClick={()=>{
								let slt=document.getElementById("sidebarTrig") as HTMLInputElement;
								if(slt){
									slt.click();
								}
								let temp=[...collapsibles];
								temp[0]=true;
								setCollapsibles(temp);
								setTimeout(()=>{
									let sidebar=document.getElementById("sidebar") as HTMLDivElement;
								let col=document.getElementById("col1") as HTMLDivElement;
								console.log(col.offsetTop);
								if(sidebar&&col){
									sidebar.scrollTop=col.offsetTop-100;
								}
								},10);
							}}
							>US</Button>}
						
						{
							open&&collapsibles[0]&&(
								<SidebarGroupContent className="fadein">
							<CollapsibleContent className="px-2">
								<SidebarMenu>
									<SidebarMenuItem className="flex  justify-between h-fit items-center">
										Speed
										<Input
											type="number"
											value={getVars.speed()}
											className="text-end"
											onChange={(e) => {
												setVars.speed(
													parseInt(e.target.value)
												);
												initPath();
												let interv = getVars.interv();
												if (interv != null) {
													clearInterval(interv);
													setVars.interv(null);

													getVars.startSimulation();
												} else {
													setCenter({
														x:
															window.innerWidth /
															2,
														y:
															window.innerHeight /
															2,
													});
												}
											}}
										/>
									</SidebarMenuItem>
									<SidebarMenuItem className="flex  justify-between h-fit items-center">
										Forecast Limit
										<Input
											type="number"
											className="text-end"
											value={getVars.predictionLimit()}
											onChange={(e) => {
												setVars.predictionLimit(
													parseInt(e.target.value)
												);
												initPath();
												setCenter({
													x: window.innerWidth / 2,
													y: window.innerHeight / 2,
												});
											}}
										/>
									</SidebarMenuItem>
									<SidebarMenuItem className="flex  justify-between h-fit items-center">
										Trail Limit
										<Input
											className="text-end"
											type="number"
											value={getVars.maxTrailLength()}
											onChange={(e) => {
												setVars.maxTrailLength(
													parseInt(e.target.value)
												);
												setCenter({
													x: window.innerWidth / 2,
													y: window.innerHeight / 2,
												});
											}}
										/>
									</SidebarMenuItem>
									<SidebarMenuItem className="flex  justify-between h-fit items-center">
										Gravitational Constant
										<Input
											className="text-end"
											type="number"
											value={get.G().toFixed(5)}
											step={0.0001}
											onChange={(e) => {
												set.G(
													parseFloat(e.target.value)
												);
												initPath();
												setCenter({
													x: window.innerWidth / 2,
													y: window.innerHeight / 2,
												});
											}}
										/>
									</SidebarMenuItem>
									<SidebarMenuItem className="flex  justify-between h-fit items-center">
										Collision Energy Loss
										<div className="flex items-center">
											<Input
												type="number"
												className=" text-end"
												value={
													get.collisionEnergyLoss() *
													100
												}
												step={0.01}
												onChange={(e) => {
													set.collisionEnergyLoss(
														parseFloat(
															e.target.value
														) / 100
													);
													initPath();
													setCenter({
														x:
															window.innerWidth /
															2,
														y:
															window.innerHeight /
															2,
													});
												}}
											/>
											<label className="text-sm mt-[2px] -translate-x-1/2">
												%
											</label>
										</div>
									</SidebarMenuItem>
									<SidebarMenuItem className="flex  justify-between h-fit items-center">
										Scale
										<Input
											type="number"
											id="scale"
											className="text-end"
											defaultValue={(
												getVars.scale() * 100
											).toFixed(2)}
											step={0.1}
											onChange={(e) => {
												let val = 0;
												try {
													val =
														parseFloat(
															e.target.value
														) / 100;
													if (val > 0) {
														setVars.scale(val);
														setCenter({
															x:
																window.innerWidth /
																2,
															y:
																window.innerHeight /
																2,
														});
													}
												} catch {}
											}}
										/>
									</SidebarMenuItem>
									<Collapsible
										className="mt-1 mb-2"
										defaultOpen={true}>
										<SidebarMenuItem className="flex flex-col">
											<CollapsibleTrigger className="w-full flex justify-between pr-3 items-center text-start">
												Anchor{" "}
												<label>
													{particles[anchor].name}
												</label>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub className="py-1 gap-1">
													{particles.map((p, i) => {
														return (
															<SidebarMenuSubButton
																key={i}
																className="cursor-pointer border"
																onClick={() => {
																	console.log(
																		i
																	);
																	setVars.anchor(
																		i
																	);
																	setCenter({
																		x:
																			window.innerWidth /
																			2,
																		y:
																			window.innerHeight /
																			2,
																	});
																}}
																style={{
																	borderColor:
																		i ==
																		anchor
																			? "#fff1"
																			: "transparent",
																}}>
																{p.name}
															</SidebarMenuSubButton>
														);
													})}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								</SidebarMenu>
							</CollapsibleContent>
						</SidebarGroupContent>
							)
						}
					</SidebarGroup>
				</Collapsible>
				{separator}
				<Collapsible
				id="col2"
					open={open && collapsibles[1]}
					onOpenChange={(e) => {
						let temp = [...collapsibles];
						temp[1] = e;
						setCollapsibles(temp);
					}}>
					<SidebarGroup>
						{
							open?(<SidebarGroupLabel>
								<CollapsibleTrigger className="w-full fadein flex justify-between items-center">
									Bodies
									<SidebarMenuButton
										onClick={(e) => {
											e.preventDefault();
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
											particles.push({
												name:
													"body " +
													(particles.length + 1),
												mass: 10,
												radius: 10,
												position: { x: pos.x, y: pos.y },
												velocity: { x: vel.x, y: vel.y },
												static: false,
												fixedColor: false,
												color: theme.nord.aurora[beta],
												trailColor: theme.nord.dark[alpha],
												futureColor:
													theme.nord.aurora[beta],
											});
											let pastPositions =
												getVars.pastPositions();
											let count = getVars.count();
											let paths = getVars.paths();
											pastPositions.push([[pos.x, pos.y]]);
											count.push(0);
											paths.push([]);
											setVars.pastPositions([
												...pastPositions,
											]);
											setVars.count([...count]);
											setVars.paths([...paths]);
											setVars.bodies([...particles]);
											getVars.setParticles()([...particles]);
											initPath();
											e.currentTarget.blur();
											setCenter({
												x: window.innerWidth / 2,
												y: window.innerHeight / 2,
											});
										}}
										className="w-8 items-center justify-center">
										+
									</SidebarMenuButton>
								</CollapsibleTrigger>
							</SidebarGroupLabel>):<Button className="fadein bg-background border text-accent-foreground hover:bg-accent-foreground hover:text-primary-foreground duration-300 transition-colors " 
							onClick={()=>{
								let slt=document.getElementById("sidebarTrig") as HTMLInputElement;
								if(slt){
									slt.click();
								}
								let temp=[...collapsibles];
								temp[1]=true;
								setCollapsibles(temp);
								setTimeout(()=>{
									let sidebar=document.getElementById("sidebar") as HTMLDivElement;
								let col=document.getElementById("col2") as HTMLDivElement;
								console.log(col.offsetTop);
								if(sidebar&&col){
									sidebar.scrollTop=col.offsetTop-100;
								}
								},10);
							}}
							>BD</Button>
						}

						{
							open&&collapsibles[1]&&(<SidebarGroupContent className="fadein">
								<CollapsibleContent className="pr-2 pb-1">
									<SidebarMenu>
										{particles.map((particle, index) => {
											return (
												<Collapsible
													key={index}
													defaultOpen={true}>
													<SidebarMenuItem className="flex flex-col">
														<CollapsibleTrigger className="w-full flex justify-between pr-3 items-center text-start">
															<Input
																type="text"
																value={
																	particle.name
																}
																className=" cursor-default  focus-within:cursor-text"
																id={
																	"nameInput" +
																	index
																}
																onClick={(e) => {
																	e.currentTarget.blur();
																}}
																onChange={(e) => {
																	particles[
																		index
																	].name =
																		e.target.value;
																	setVars.bodies([
																		...particles,
																	]);
																	initPath();
																	setCenter({
																		x:
																			window.innerWidth /
																			2,
																		y:
																			window.innerHeight /
																			2,
																	});
																}}
															/>
															<div className="flex items-center gap-1">
																<SidebarMenuButton
																	variant="outline"
																	className=" items-center justify-center w-5 h-5 border border-[#ebcb8b80]"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		document
																			.getElementById(
																				"nameInput" +
																					index
																			)
																			?.focus();
																	}}></SidebarMenuButton>
																<SidebarMenuButton
																	variant="outline"
																	className=" items-center justify-center w-5 h-5 border border-[#a3be8c80]"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		let ref = {
																			x: particles[
																				index
																			]
																				.position
																				.x,
																			y: particles[
																				index
																			]
																				.position
																				.y,
																		};
																		let refRad =
																			particles[
																				index
																			]
																				.radius;
																		let pos = {
																			x:
																				ref.x +
																				(Math.random() +
																					5) *
																					refRad *
																					(Math.random() <
																					0.5
																						? 1
																						: -1),
																			y:
																				ref.y +
																				(Math.random() +
																					5) *
																					refRad *
																					(Math.random() <
																					0.5
																						? 1
																						: -1),
																		};
																		let vel = {
																			x: 0, //Math.random() * 0.2 - 0.1,
																			y: 0, // Math.random() * 0.2 - 0.1,
																		};
																		let rand =
																			Math.random();
																		let alpha =
																			"abcd"[
																				Math.floor(
																					rand *
																						4
																				)
																			] as keyof typeof theme.nord.dark;
																		let beta =
																			"abcde"[
																				Math.floor(
																					rand *
																						5
																				)
																			] as keyof typeof theme.nord.aurora;
																		particles.push(
																			{
																				name:
																					"body " +
																					(particles.length +
																						1),
																				mass: particles[
																					index
																				]
																					.mass,
																				radius: particles[
																					index
																				]
																					.radius,
																				position:
																					{
																						x: pos.x,
																						y: pos.y,
																					},
																				velocity:
																					{
																						x: vel.x,
																						y: vel.y,
																					},
																				static: false,
																				fixedColor:
																					true,
																				color: theme
																					.nord
																					.aurora[
																					beta
																				],
																				trailColor:
																					theme
																						.nord
																						.dark[
																						alpha
																					],
																				futureColor:
																					theme
																						.nord
																						.aurora[
																						beta
																					],
																			}
																		);
																		let pastPositions =
																			getVars.pastPositions();
																		let count =
																			getVars.count();
																		let paths =
																			getVars.paths();
																		pastPositions.push(
																			[
																				[
																					pos.x,
																					pos.y,
																				],
																			]
																		);
																		count.push(
																			0
																		);
																		paths.push(
																			[]
																		);
																		setVars.pastPositions(
																			[
																				...pastPositions,
																			]
																		);
																		setVars.count(
																			[
																				...count,
																			]
																		);
																		setVars.paths(
																			[
																				...paths,
																			]
																		);
																		setVars.bodies(
																			[
																				...particles,
																			]
																		);
																		getVars.setParticles()(
																			[
																				...particles,
																			]
																		);
																		initPath();
																		e.currentTarget.blur();
																		setCenter({
																			x:
																				window.innerWidth /
																				2,
																			y:
																				window.innerHeight /
																				2,
																		});
																	}}></SidebarMenuButton>
																<SidebarMenuButton
																	variant="outline"
																	className="w-5 h-5 border  items-center justify-center border-[#bf616a80]"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		particles.splice(
																			index,
																			1
																		);
																		let pastPositions =
																			getVars.pastPositions();
																		let count =
																			getVars.count();
																		let paths =
																			getVars.paths();
																		pastPositions.splice(
																			index,
																			1
																		);
																		count.splice(
																			index,
																			1
																		);
																		paths.splice(
																			index,
																			1
																		);
																		setVars.pastPositions(
																			[
																				...pastPositions,
																			]
																		);
																		setVars.count(
																			[
																				...count,
																			]
																		);
																		setVars.paths(
																			[
																				...paths,
																			]
																		);
																		setVars.bodies(
																			[
																				...particles,
																			]
																		);
																		getVars.setParticles()(
																			[
																				...particles,
																			]
																		);
																		initPath();
																		e.currentTarget.blur();
																		setCenter({
																			x:
																				window.innerWidth /
																				2,
																			y:
																				window.innerHeight /
																				2,
																		});
																	}}></SidebarMenuButton>
															</div>
														</CollapsibleTrigger>
														<CollapsibleContent className="pr-2 w-full">
															<SidebarMenuSub className="py-1 w-full gap-1">
																<SidebarMenuSubItem className="flex w-full  justify-between h-fit items-center">
																	Mass
																	<Input
																		type="number"
																		className="text-end"
																		value={
																			particle.mass
																		}
																		onChange={(
																			e
																		) => {
																			particles[
																				index
																			].mass =
																				parseFloat(
																					e
																						.target
																						.value
																				);
																			setVars.bodies(
																				[
																					...particles,
																				]
																			);
																			initPath();
																			setCenter(
																				{
																					x:
																						window.innerWidth /
																						2,
																					y:
																						window.innerHeight /
																						2,
																				}
																			);
																		}}
																	/>
																</SidebarMenuSubItem>
																<SidebarMenuSubItem className="flex  justify-between h-fit items-center">
																	Radius
																	<Input
																		type="number"
																		className="text-end"
																		value={
																			particle.radius
																		}
																		onChange={(
																			e
																		) => {
																			particles[
																				index
																			].radius =
																				parseFloat(
																					e
																						.target
																						.value
																				);
																			setVars.bodies(
																				[
																					...particles,
																				]
																			);
																			initPath();
																			setCenter(
																				{
																					x:
																						window.innerWidth /
																						2,
																					y:
																						window.innerHeight /
																						2,
																				}
																			);
																		}}
																	/>
																</SidebarMenuSubItem>
																<SidebarMenuSubItem className="flex  justify-between h-fit items-center">
																	Position
																	<p className="flex  justify-center gap-1 items-center">
																		x
																		<Input
																			type="number"
																			value={
																				Math.round(
																					particle
																						.position
																						.x *
																						100
																				) /
																				100
																			}
																			onChange={(
																				e
																			) => {
																				particles[
																					index
																				].position.x =
																					parseInt(
																						e
																							.target
																							.value
																					);
																				setVars.bodies(
																					[
																						...particles,
																					]
																				);
																				initPath();
																				setCenter(
																					{
																						x:
																							window.innerWidth /
																							2,
																						y:
																							window.innerHeight /
																							2,
																					}
																				);
																			}}
																		/>
																	</p>
																	<p className="flex  justify-center gap-1 items-center">
																		y
																		<Input
																			type="number"
																			value={
																				Math.round(
																					particle
																						.position
																						.y *
																						100
																				) /
																				100
																			}
																			onChange={(
																				e
																			) => {
																				particles[
																					index
																				].position.y =
																					parseInt(
																						e
																							.target
																							.value
																					);
																				setVars.bodies(
																					[
																						...particles,
																					]
																				);
																				initPath();
																				setCenter(
																					{
																						x:
																							window.innerWidth /
																							2,
																						y:
																							window.innerHeight /
																							2,
																					}
																				);
																			}}
																		/>
																	</p>
																</SidebarMenuSubItem>
																<SidebarMenuSubItem className="flex  justify-between h-fit items-center">
																	Velocity
																	<p className="flex  justify-center gap-1 items-center">
																		x
																		<Input
																			type="number"
																			value={
																				Math.round(
																					particle
																						.velocity
																						.x *
																						100
																				) /
																				100
																			}
																			step={
																				0.05
																			}
																			onChange={(
																				e
																			) => {
																				particles[
																					index
																				].velocity.x =
																					parseFloat(
																						e
																							.target
																							.value
																					);
																				setVars.bodies(
																					[
																						...particles,
																					]
																				);
																				initPath();
																				setCenter(
																					{
																						x:
																							window.innerWidth /
																							2,
																						y:
																							window.innerHeight /
																							2,
																					}
																				);
																			}}
																		/>
																	</p>
																	<p className="flex  justify-center gap-1 items-center">
																		y
																		<Input
																			type="number"
																			value={
																				Math.round(
																					particle
																						.velocity
																						.y *
																						100
																				) /
																				100
																			}
																			step={
																				0.05
																			}
																			onChange={(
																				e
																			) => {
																				particles[
																					index
																				].velocity.y =
																					parseFloat(
																						e
																							.target
																							.value
																					);
																				setVars.bodies(
																					[
																						...particles,
																					]
																				);
																				initPath();
																				setCenter(
																					{
																						x:
																							window.innerWidth /
																							2,
																						y:
																							window.innerHeight /
																							2,
																					}
																				);
																			}}
																		/>
																	</p>
																</SidebarMenuSubItem>
																<SidebarMenuSubItem className="flex pr-2 justify-between h-fit items-center">
																	Static Body
																	<Checkbox
																		checked={
																			particle.static
																		}
																		onCheckedChange={(
																			checked
																		) => {
																			particles[
																				index
																			].static =
																				checked;
																			setVars.bodies(
																				[
																					...particles,
																				]
																			);
																			initPath();
																			setCenter(
																				{
																					x:
																						window.innerWidth /
																						2,
																					y:
																						window.innerHeight /
																						2,
																				}
																			);
																		}}
																	/>
																</SidebarMenuSubItem>
																<SidebarMenuSubItem className="flex  justify-between pr-2 h-fit items-center">
																	Fixed Color
																	<Checkbox
																		checked={
																			particle.fixedColor
																		}
																		onCheckedChange={(
																			checked
																		) => {
																			particles[
																				index
																			].fixedColor =
																				checked;
																			setVars.bodies(
																				[
																					...particles,
																				]
																			);
																			initPath();
																			setCenter(
																				{
																					x:
																						window.innerWidth /
																						2,
																					y:
																						window.innerHeight /
																						2,
																				}
																			);
																		}}
																	/>
																</SidebarMenuSubItem>
																<SidebarMenuSubItem className="flex  justify-between -mr-2 h-fit items-center">
																	Body Color
																	<Input
																		type="color"
																		className="w-1/2"
																		value={
																			particle.color
																		}
																		onChange={(
																			e
																		) => {
																			console.log(
																				e
																					.currentTarget
																					.value
																			);
																			particles[
																				index
																			].color =
																				e.currentTarget.value;
																			setVars.bodies(
																				[
																					...particles,
																				]
																			);
																			setCenter(
																				{
																					x:
																						window.innerWidth /
																						2,
																					y:
																						window.innerHeight /
																						2,
																				}
																			);
																		}}
																	/>
																</SidebarMenuSubItem>
																<SidebarMenuSubItem className="flex  justify-between  -mr-2 h-fit items-center">
																	Trail Color
																	<Input
																		type="color"
																		className="w-1/2"
																		value={
																			particle.trailColor
																		}
																		onChange={(
																			e
																		) => {
																			particles[
																				index
																			].trailColor =
																				e.currentTarget.value;
																			setVars.bodies(
																				[
																					...particles,
																				]
																			);
																			setCenter(
																				{
																					x:
																						window.innerWidth /
																						2,
																					y:
																						window.innerHeight /
																						2,
																				}
																			);
																		}}
																	/>
																</SidebarMenuSubItem>
																<SidebarMenuSubItem className="flex  justify-between  -mr-2 h-fit items-center">
																	Forecast Color
																	<Input
																		type="color"
																		className="w-1/2"
																		value={
																			particle.futureColor
																		}
																		onChange={(
																			e
																		) => {
																			particles[
																				index
																			].futureColor =
																				e.currentTarget.value;
																			setVars.bodies(
																				[
																					...particles,
																				]
																			);
																			setCenter(
																				{
																					x:
																						window.innerWidth /
																						2,
																					y:
																						window.innerHeight /
																						2,
																				}
																			);
																		}}
																	/>
																</SidebarMenuSubItem>
															</SidebarMenuSub>
														</CollapsibleContent>
													</SidebarMenuItem>
												</Collapsible>
											);
										})}
									</SidebarMenu>
								</CollapsibleContent>
							</SidebarGroupContent>)
						}
					</SidebarGroup>
				</Collapsible>
				{separator}
				<Collapsible
					id="col3"
					open={open && collapsibles[2]}
					onOpenChange={(e) => {
						let temp = [...collapsibles];
						temp[0] = e;
						setCollapsibles(temp);
					}}>
					<SidebarGroup>
						{
							open?(<SidebarGroupLabel>
								<CollapsibleTrigger className="w-full fadein text-start">
									Presets
								</CollapsibleTrigger>
							</SidebarGroupLabel>):<Button className="fadein bg-background border text-accent-foreground hover:bg-accent-foreground hover:text-primary-foreground duration-300 transition-colors " 
							onClick={()=>{
								let slt=document.getElementById("sidebarTrig") as HTMLInputElement;
								if(slt){
									slt.click();
								}
								let temp=[...collapsibles];
								temp[2]=true;
								setCollapsibles(temp);
								setTimeout(()=>{
									let sidebar=document.getElementById("sidebar") as HTMLDivElement;
								let col=document.getElementById("col3") as HTMLDivElement;
								console.log(col.offsetTop);
								if(sidebar&&col){
									sidebar.scrollTop=col.offsetTop;
								}
								},10);
							}}
							>PR</Button>
						}
						{
							open&&collapsibles[2]&&(
								<SidebarGroupContent className="fadein">
							<CollapsibleContent className="px-2">
								{getVars.presets().map((p, index) => {
									return (
										<SidebarMenuSubButton
											key={index}
											className=" cursor-pointer"
											onClick={(e) => {
												let prt = JSON.parse(
													JSON.stringify(p.data())
												);
												let scale = p.scale;
												let ele =
													document.getElementById(
														"scale"
													) as HTMLInputElement;
												if (ele)
													ele.value = (
														scale * 100
													).toString();
												setVars.bodies([...prt]);
												setVars.scale(scale);
												getVars.setParticles()([
													...prt,
												]);
												initPath();
												setCenter({
													x: window.innerWidth / 2,
													y: window.innerHeight / 2,
												});
												let side =
													document.getElementById(
														"sidebar"
													);
												if (side) {
													setTimeout(() => {
														side.scrollTop =
															side.scrollHeight;
													}, 50);
												}
												e.currentTarget.blur();
											}}>
											{" "}
											{p.name}
										</SidebarMenuSubButton>
									);
								})}
							</CollapsibleContent>
						</SidebarGroupContent>
							)
						}
					</SidebarGroup>
				</Collapsible>
				{separator}
			</SidebarContent>
			<SidebarFooter className="flex w-full  justify-center items-center"
			style={{
				flexDirection:open?"row":"column"
			}}
			>
				<AlertDialog>
					<AlertDialogTrigger 
					style={{
						width:open?"50%":"100%"
					}}
					>
						<SidebarMenuButton className="w-full h-10 bg-background text-accent-foreground hover:bg-accent-foreground hover:text-primary-foreground duration-300  items-center justify-center border" style={{transitionProperty:"width, color, background-color"}}>
							{open?"Import":"Imp"}
						</SidebarMenuButton>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="text-center mb-4">
								Import Data
							</AlertDialogTitle>
							<AlertDialogDescription className="flex  flex-col items-center">
								<Textarea
									placeholder="Paste text or file here..."
									autoFocus={true}
									id="pastebox"
									onPaste={(e) => {
										if (e.clipboardData.files.length > 0) {
											e.preventDefault();
											let file = e.clipboardData.files[0];
											console.log(file.type);
											if (
												file.type == "application/json"
											) {
												let filebox =
													document.getElementById(
														"filebox"
													) as HTMLInputElement;
												let label =
													document.getElementById(
														"filelabel"
													) as HTMLLabelElement;
												filebox.files =
													e.clipboardData.files;
												label.innerText = file.name;
											}
										}
									}}
									className="w-[29rem] border-dashed py-3 h-40 resize-none"
								/>
								<Input
									type="file"
									id="filebox"
									className="hidden"
									accept="application/JSON"
									onChange={(e) => {
										let label = document.getElementById(
											"filelabel"
										) as HTMLLabelElement;
										if (e.target.files != null) {
											label.innerText =
												e.target.files[0].name;
										} else {
											label.innerText = "Choose File";
										}
									}}
								/>
								<label
									htmlFor="filebox"
									id="filelabel"
									className="cursor-pointer p-2 rounded-sm border self-end bg-background border-dashed -mt-9 h-9 items-center justify-center flex">
									Choose File
								</label>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="mr-1 bg-background w-24 rounded-md text-nord-aurora-red hover:bg-nord-aurora-red hover:text-primary-foreground duration-300 transition-colors">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								className="  w-24 bg-background border text-accent-foreground hover:bg-accent-foreground hover:text-primary-foreground duration-300 transition-colors"
								onClick={() => {
									let pastebox = document.getElementById(
										"pastebox"
									) as HTMLTextAreaElement;
									let filebox = document.getElementById(
										"filebox"
									) as HTMLInputElement;
									if (
										filebox.files &&
										filebox.files.length > 0
									) {
										let file = filebox.files[0];
										if (file == null) return;
										let reader = new FileReader();
										reader.onload = (e) => {
											let data = JSON.parse(
												e.target?.result as string
											);
											setImportedData(data);
											setCenter({
												x: window.innerWidth / 2,
												y: window.innerHeight / 2,
											});
											alert("Imported Successfully");
										};
										reader.readAsText(file);
									} else {
										try {
											console.log(pastebox.value);
											let data = JSON.parse(
												pastebox.value
											);
											setImportedData(data);
											setCenter({
												x: window.innerWidth / 2,
												y: window.innerHeight / 2,
											});
											alert("Imported Successfully");
										} catch (e) {
											alert("Invalid JSON");
										}
									}
								}}>
								Import
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				<DropdownMenu>
					<DropdownMenuTrigger onFocus={(e)=>{
						e.currentTarget.blur();
					}} style={{
						width:open?"50%":"100%"
					}}>
						<SidebarMenuButton className="w-full h-10  bg-background text-accent-foreground hover:bg-accent-foreground hover:text-primary-foreground duration-300    items-center justify-center border" style={{transitionProperty:"width, color, background-color"}}>
							{open?"Export":"Exp"}
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56 mb-2 ml -80 justify-center items-center flex flex-col bg-background border rounded-md">
						<DropdownMenuLabel className="text-center">
							Export Data
						</DropdownMenuLabel>
						{separator}
						<DropdownMenuGroup className="py-2">
							<div className=" border rounded-md  mb-1">
								<Input
									type="text"
									id="filename"
									className="w-full h-8 text-end"
									defaultValue="config.json"
									onChange={(e) => {
										let filename: any =
											e.target.value.split(".");
										if (
											filename.length > 1 &&
											filename[
												filename.length - 1
											].toLowerCase() != "json"
										) {
											filename.pop();
											filename =
												filename.join(".") + ".json";
											e.target.value = filename;
										}
									}}
								/>
							</div>
							<div className="flex gap-2">
								<Button
									className="w-1/2 bg-background border text-accent-foreground hover:bg-accent-foreground hover:text-primary-foreground duration-300 transition-colors"
									onClick={() => {
										let data = JSON.stringify({
											version: version,
											speed: getVars.speed(),
											G: get.G(),
											collisionEnergyLoss:
												get.collisionEnergyLoss(),
											scale: getVars.scale(),
											anchor: getVars.anchor(),
											bodies: getVars.bodies(),
										});
										navigator.clipboard.writeText(data);
									}}>
									Copy
								</Button>
								<Button
									className="w-1/2 bg-background border text-accent-foreground hover:bg-accent-foreground hover:text-primary-foreground duration-300 transition-colors"
									onClick={() => {
										let data = JSON.stringify({
											version: version,
											speed: getVars.speed(),
											G: get.G(),
											collisionEnergyLoss:
												get.collisionEnergyLoss(),
											scale: getVars.scale(),
											anchor: getVars.anchor(),
											bodies: getVars.bodies(),
										});
										let filename: any =
											document.getElementById(
												"filename"
											) as HTMLInputElement;
										filename = filename.value.split(".");
										if (filename.length > 1) {
											filename.pop();
											filename =
												filename.join(".") + ".json";
										} else if (filename.length == 1) {
											filename = filename[0] + ".json";
										} else {
											filename = "config.json";
										}
										let file = new Blob([data], {
											type: "application/json",
										});
										let a = document.createElement("a");
										a.href = URL.createObjectURL(file);
										a.download = filename;
										a.click();
									}}>
									Download
								</Button>
							</div>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
				
			</SidebarFooter>
		</Sidebar>
	);
}

export default AppSidebar;
