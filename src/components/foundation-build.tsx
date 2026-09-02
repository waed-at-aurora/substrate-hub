'use client';

import Link from 'next/link';
import type { JSAnimation } from 'animejs';
import { useRouter } from 'next/navigation';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const INTRO_DURATION = 800;
const CHAPTER_DURATION = 2000;
const FOCUS_DURATION = 1800;
const FINAL_START = INTRO_DURATION + CHAPTER_DURATION * 4;
const FINAL_DURATION = 1900;
const SCROLL_SYNC_SMOOTHNESS = 0.35;
const EXIT_DISASSEMBLY_DELAY = 120;
const EXIT_DURATION = 1100;
const EXIT_BRICK_FADE_DURATION = 320;
const EXIT_GRID_FADE_DURATION = 420;
const EXIT_NAVIGATION_DELAY = EXIT_DISASSEMBLY_DELAY + EXIT_DURATION + 220;
const DESKTOP_PYRAMID_VIEW_OFFSET = 0.18;

const LAYERS = [
	{
		key: 'tokens',
		number: '01',
		name: 'Tokens',
		statement: 'The decisions underneath everything.',
		detail: 'Color · type · space · motion',
		cameraY: 0.25,
		targetY: -0.35,
		cameraZ: 6.7,
	},
	{
		key: 'primitives',
		number: '02',
		name: 'Primitives',
		statement: 'Shared components. Build once, reuse everywhere.',
		detail: '',
		cameraY: 0.85,
		targetY: 0.08,
		cameraZ: 6.15,
	},
	{
		key: 'composites',
		number: '03',
		name: 'Composites',
		statement: 'Complete components, ready to use.',
		detail: '',
		cameraY: 1.45,
		targetY: 0.52,
		cameraZ: 5.75,
	},
	{
		key: 'products',
		number: '04',
		name: 'Products',
		statement: 'One unified EOS experience across every product.',
		detail: 'Chronos · Amun · Origin · Solaris · Lumus',
		cameraY: 2.05,
		targetY: 1.02,
		cameraZ: 5.25,
	},
] as const;

const LAYER_SPECS = [
	{ size: 7, y: -0.42, color: '#e7000b', stud: '#ff6467' },
	{ size: 5, y: 0.02, color: '#007595', stud: '#00d3f2' },
	{ size: 3, y: 0.46, color: '#008236', stud: '#05df72' },
	{ size: 1, y: 0.9, color: '#ffcc00', stud: '#ffd633' },
] as const;

const STUD_OFFSETS = [
	[-0.2, -0.2],
	[0.2, -0.2],
	[-0.2, 0.2],
	[0.2, 0.2],
] as const;

type BrickExitMotion = {
	baseX: number;
	baseZ: number;
	travelX: number;
	travelY: number;
	travelZ: number;
	spinX: number;
	spinY: number;
	spinZ: number;
	delay: number;
};

type ExitProjection = {
	screenLeft: number;
	screenTop: number;
	screenWidth: number;
	screenHeight: number;
	cameraFullWidth: number;
	cameraFullHeight: number;
	cameraOffsetX: number;
	cameraOffsetY: number;
	cameraViewWidth: number;
	cameraViewHeight: number;
};

type ExitTransitionController = {
	prepare: () => void;
	play: () => void;
};

function seededUnit(seed: number) {
	const value = Math.sin(seed * 12.9898) * 43758.5453;
	return value - Math.floor(value);
}

function createBrickExitMotion(layerIndex: number, brickIndex: number, baseX: number, baseZ: number): BrickExitMotion {
	const seed = (layerIndex + 1) * 101 + brickIndex * 17;
	const distanceFromCenter = Math.hypot(baseX, baseZ);
	const radialAngle = distanceFromCenter > 0.2 ? Math.atan2(baseZ, baseX) : seededUnit(seed) * Math.PI * 2;
	const angle = radialAngle + (seededUnit(seed + 1) - 0.5) * 0.9;
	const distance = 10 + seededUnit(seed + 2) * 7;

	return {
		baseX,
		baseZ,
		travelX: Math.cos(angle) * distance,
		travelY: (seededUnit(seed + 3) - 0.45) * 16 + (layerIndex - 1.5) * 0.8,
		travelZ: Math.sin(angle) * distance,
		spinX: (seededUnit(seed + 4) - 0.5) * 8,
		spinY: (seededUnit(seed + 5) - 0.5) * 10,
		spinZ: (seededUnit(seed + 6) - 0.5) * 8,
		delay: seededUnit(seed + 7) * 0.1,
	};
}

function clamp01(value: number) {
	return Math.max(0, Math.min(1, value));
}

function smootherstep(value: number) {
	return value * value * value * (value * (value * 6 - 15) + 10);
}

export function FoundationBuild({ primitives, composites }: { primitives: number; composites: number }) {
	const router = useRouter();
	const rootRef = useRef<HTMLElement | null>(null);
	const modelRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const readoutRef = useRef<HTMLSpanElement | null>(null);
	const exitTransitionRef = useRef<ExitTransitionController | null>(null);
	const exitNavigationTimerRef = useRef<number | null>(null);
	const layerSelectionRef = useRef<((index: number) => void) | null>(null);
	const exitingRef = useRef(false);
	const reducedRef = useRef(false);
	const [activeStage, setActiveStage] = useState(-1);
	const [isInspecting, setIsInspecting] = useState(false);
	const [isExiting, setIsExiting] = useState(false);
	const [threeReady, setThreeReady] = useState(false);

	const exitToOverview = (event: MouseEvent<HTMLAnchorElement>) => {
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		const exitTransition = exitTransitionRef.current;
		if (reducedRef.current || !exitTransition) return;

		event.preventDefault();
		if (exitingRef.current) return;
		exitingRef.current = true;
		exitTransition.prepare();
		flushSync(() => setIsExiting(true));
		exitTransition.play();
		exitNavigationTimerRef.current = window.setTimeout(() => {
			exitNavigationTimerRef.current = null;
			router.push('/overview');
		}, EXIT_NAVIGATION_DELAY);
	};

	const selectLayer = (index: number) => {
		if (reducedRef.current) {
			document.getElementById(`foundation-layer-${LAYERS[index].key}`)?.scrollIntoView({ block: 'center' });
			return;
		}
		const select = layerSelectionRef.current;
		if (select) {
			select(index);
			return;
		}
		setActiveStage(index);
		setIsInspecting(true);
	};

	useEffect(() => {
		const root = rootRef.current;
		const model = modelRef.current;
		const canvas = canvasRef.current;
		if (!root || !model || !canvas) return;

		let cancelled = false;
		let dispose = () => {};
		let cancelExit = () => {};

		const setup = async () => {
			root.dataset.renderState = 'loading';
			try {
				const [THREE, anime] = await Promise.all([
					import('three'),
					import('animejs'),
					import('animejs/adapters/three'),
				]);
				if (cancelled) return;

				const renderer = new THREE.WebGLRenderer({
					canvas,
					alpha: true,
					antialias: true,
					powerPreference: 'high-performance',
				});
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
				renderer.outputColorSpace = THREE.SRGBColorSpace;
				renderer.setClearColor(0x09090b, 0);

				const scene = new THREE.Scene();
				const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
				camera.position.set(0, 3.4, 10.5);

				const lookTarget = new THREE.Object3D();
				lookTarget.position.y = 0.45;
				scene.add(lookTarget);

				const orbit = new THREE.Group();
				const selectionPivot = new THREE.Group();
				const pyramid = new THREE.Group();
				selectionPivot.add(pyramid);
				orbit.add(selectionPivot);
				scene.add(orbit);
				orbit.rotation.y = THREE.MathUtils.degToRad(-25);

				const blockGeometry = new THREE.BoxGeometry(0.74, 0.34, 0.74);
				const studGeometry = new THREE.CylinderGeometry(0.085, 0.085, 0.085, 20);
				const layerGroups: InstanceType<typeof THREE.Group>[] = [];
				const blockMeshes: InstanceType<typeof THREE.InstancedMesh>[] = [];
				const instancedLayers: Array<{
					blocks: InstanceType<typeof THREE.InstancedMesh>;
					studs: InstanceType<typeof THREE.InstancedMesh>;
					bricks: BrickExitMotion[];
				}> = [];
				const materials: Array<{
					block: InstanceType<typeof THREE.MeshStandardMaterial>;
					stud: InstanceType<typeof THREE.MeshStandardMaterial>;
					base: InstanceType<typeof THREE.Color>;
					studBase: InstanceType<typeof THREE.Color>;
				}> = [];
				const dummy = new THREE.Object3D();
				const studLocalMatrices = STUD_OFFSETS.map(([x, z]) => new THREE.Matrix4().makeTranslation(x, 0.212, z));
				const composedStudMatrix = new THREE.Matrix4();

				LAYER_SPECS.forEach((spec, layerIndex) => {
					const group = new THREE.Group();
					group.position.y = spec.y;
					group.userData.layer = layerIndex;
					pyramid.add(group);
					layerGroups.push(group);

					const base = new THREE.Color(spec.color);
					const studBase = new THREE.Color(spec.stud);
					const blockMaterial = new THREE.MeshStandardMaterial({
						color: base,
						roughness: 0.76,
						metalness: 0.06,
						transparent: true,
					});
					const studMaterial = new THREE.MeshStandardMaterial({
						color: studBase,
						roughness: 0.68,
						metalness: 0.08,
						transparent: true,
					});
					materials.push({ block: blockMaterial, stud: studMaterial, base, studBase });

					const count = spec.size * spec.size;
					const blocks = new THREE.InstancedMesh(blockGeometry, blockMaterial, count);
					const studs = new THREE.InstancedMesh(studGeometry, studMaterial, count * 4);
					blocks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
					studs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
					blocks.userData.layer = layerIndex;
					blockMeshes.push(blocks);

					let blockIndex = 0;
					let studIndex = 0;
					const offset = (spec.size - 1) * 0.41;
					const bricks: BrickExitMotion[] = [];
					for (let row = 0; row < spec.size; row += 1) {
						for (let column = 0; column < spec.size; column += 1) {
							const x = column * 0.82 - offset;
							const z = row * 0.82 - offset;
							bricks.push(createBrickExitMotion(layerIndex, blockIndex, x, z));
							dummy.position.set(x, 0, z);
							dummy.rotation.set(0, 0, 0);
							dummy.scale.set(1, 1, 1);
							dummy.updateMatrix();
							blocks.setMatrixAt(blockIndex, dummy.matrix);
							blockIndex += 1;

							for (let studOffsetIndex = 0; studOffsetIndex < studLocalMatrices.length; studOffsetIndex += 1) {
								composedStudMatrix.multiplyMatrices(dummy.matrix, studLocalMatrices[studOffsetIndex]);
								studs.setMatrixAt(studIndex, composedStudMatrix);
								studIndex += 1;
							}
						}
					}
					blocks.instanceMatrix.needsUpdate = true;
					studs.instanceMatrix.needsUpdate = true;
					group.add(blocks, studs);
					instancedLayers.push({ blocks, studs, bricks });
				});

				const updateBrickExit = (progress: number) => {
					for (let layerIndex = 0; layerIndex < instancedLayers.length; layerIndex += 1) {
						const { blocks, studs, bricks } = instancedLayers[layerIndex];
						for (let brickIndex = 0; brickIndex < bricks.length; brickIndex += 1) {
							const brick = bricks[brickIndex];
							const localProgress = clamp01((progress - brick.delay) / (1 - brick.delay));
							const distance = smootherstep(localProgress);
							dummy.position.set(
								brick.baseX + brick.travelX * distance,
								brick.travelY * distance,
								brick.baseZ + brick.travelZ * distance,
							);
							dummy.rotation.set(brick.spinX * distance, brick.spinY * distance, brick.spinZ * distance);
							dummy.scale.set(1, 1, 1);
							dummy.updateMatrix();
							blocks.setMatrixAt(brickIndex, dummy.matrix);

							const firstStudIndex = brickIndex * STUD_OFFSETS.length;
							for (let studOffsetIndex = 0; studOffsetIndex < studLocalMatrices.length; studOffsetIndex += 1) {
								composedStudMatrix.multiplyMatrices(dummy.matrix, studLocalMatrices[studOffsetIndex]);
								studs.setMatrixAt(firstStudIndex + studOffsetIndex, composedStudMatrix);
							}
						}
						blocks.instanceMatrix.needsUpdate = true;
						studs.instanceMatrix.needsUpdate = true;
					}
				};

				const grid = new THREE.GridHelper(15, 30, 0x34343c, 0x1b1b20);
				grid.position.y = -0.64;
				const gridMaterial = grid.material as InstanceType<typeof THREE.LineBasicMaterial>;
				gridMaterial.transparent = true;
				gridMaterial.opacity = 0.56;
				scene.add(grid);

				scene.add(new THREE.HemisphereLight(0xf4f4f5, 0x09090b, 0.9));
				const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
				keyLight.position.set(4, 7, 5);
				scene.add(keyLight);
				const rimLight = new THREE.DirectionalLight(0xffcc00, 0.42);
				rimLight.position.set(-5, 2, -4);
				scene.add(rimLight);

				let pointerX = 0;
				let pointerY = 0;
				let hoveredLayer = -1;
				let focusedLayer = -1;
				let focusMix = 0;
				let manuallySelectedLayer = -1;
				let manualSelectionScrollY = 0;
				let selectionTurn: JSAnimation | null = null;
				let exitingScene = false;
				let preservedExitProjection: ExitProjection | null = null;
				let lastReportedStage = -2;
				let lastReportedInspecting = false;
				const raycaster = new THREE.Raycaster();
				const pointer = new THREE.Vector2();

				const updateMaterials = () => {
					materials.forEach((entry, index) => {
						const isFocused = focusedLayer === index;
						const isHovered = hoveredLayer === index;
						const dim = focusedLayer >= 0 && !isFocused ? 1 - focusMix * 0.74 : 1;
						entry.block.opacity = dim;
						entry.stud.opacity = dim;
						entry.block.color.copy(entry.base);
						entry.stud.color.copy(entry.studBase);
						if (isFocused || isHovered) {
							const amount = isFocused ? 0.17 * focusMix : 0.12;
							entry.block.color.lerp(new THREE.Color(0xf4f4f5), amount);
							entry.stud.color.lerp(new THREE.Color(0xffffff), amount + 0.08);
						}
					});
				};

				const render = () => {
					pyramid.rotation.x = pointerY * 0.055;
					pyramid.rotation.y = pointerX * 0.1;
					camera.lookAt(lookTarget.position);
					if (!exitingScene) updateMaterials();
					renderer.render(scene, camera);
				};

				const desktopPyramidComposition = window.matchMedia(
					'(min-width: 52.0625rem) and (prefers-reduced-motion: no-preference)',
				);

				const resize = () => {
					const width = Math.max(1, model.clientWidth);
					const height = Math.max(1, model.clientHeight);
					renderer.setSize(width, height, false);
					const exitProjection = preservedExitProjection;
					if (exitProjection) {
						const screenWidth = Math.max(1, exitProjection.screenWidth);
						const screenHeight = Math.max(1, exitProjection.screenHeight);
						camera.setViewOffset(
							exitProjection.cameraFullWidth,
							exitProjection.cameraFullHeight,
							exitProjection.cameraOffsetX -
								(exitProjection.screenLeft / screenWidth) * exitProjection.cameraViewWidth,
							exitProjection.cameraOffsetY -
								(exitProjection.screenTop / screenHeight) * exitProjection.cameraViewHeight,
							exitProjection.cameraViewWidth * (width / screenWidth),
							exitProjection.cameraViewHeight * (height / screenHeight),
						);
					} else if (desktopPyramidComposition.matches) {
						camera.setViewOffset(width, height, -width * DESKTOP_PYRAMID_VIEW_OFFSET, 0, width, height);
					} else {
						camera.aspect = width / height;
						camera.clearViewOffset();
					}
					render();
				};
				const resizeObserver = new ResizeObserver(resize);
				resizeObserver.observe(model);

				const reportStage = (nextStage: number) => {
					if (nextStage === lastReportedStage) return;
					lastReportedStage = nextStage;
					setActiveStage(nextStage);
				};

				const reportInspecting = (nextInspecting: boolean) => {
					if (nextInspecting === lastReportedInspecting) return;
					lastReportedInspecting = nextInspecting;
					setIsInspecting(nextInspecting);
				};

				layerSelectionRef.current = (index) => {
					manuallySelectedLayer = index;
					manualSelectionScrollY = window.scrollY;
					focusedLayer = index;
					focusMix = 1;
					reportStage(index);
					reportInspecting(true);
					root.style.setProperty('--focus-opacity', '1');
					selectionTurn?.cancel();
					selectionTurn = anime.animate(selectionPivot, {
						rotateY: (index - (LAYERS.length - 1) / 2) * 3,
						duration: 420,
						ease: 'out(3)',
						onUpdate: render,
					});
					render();
				};

				const focusState = { value: 0 };
				const timeline = anime.createTimeline({
					autoplay: anime.onScroll({
						target: root,
						enter: 'top top',
						leave: 'bottom bottom',
						sync: SCROLL_SYNC_SMOOTHNESS,
					}),
					onUpdate: (self) => {
						const time = self.currentTime;
						const progress = clamp01(time / self.duration);
						let nextStage = manuallySelectedLayer;
						if (nextStage < 0) {
							for (let index = 0; index < LAYERS.length; index += 1) {
								const start = INTRO_DURATION + index * CHAPTER_DURATION;
								if (time >= start && time < start + FOCUS_DURATION) nextStage = index;
							}
							if (time >= FINAL_START) nextStage = 4;
							focusMix = Number(focusState.value);
							reportInspecting(time >= INTRO_DURATION && time < FINAL_START);
						} else {
							focusMix = 1;
							reportInspecting(true);
						}
						focusedLayer = nextStage >= 0 && nextStage < 4 ? nextStage : -1;
						reportStage(nextStage);

						const ending = clamp01((time - FINAL_START) / 850);
						root.style.setProperty('--build-progress', `${Math.round(progress * 100)}%`);
						root.style.setProperty('--focus-opacity', String(Math.max(0.14, focusMix)));
						root.style.setProperty('--ending-progress', String(ending));
						if (readoutRef.current) readoutRef.current.textContent = String(Math.round(progress * 100)).padStart(3, '0');
						render();
					},
				});

				timeline.add(orbit, { rotateY: 58, duration: INTRO_DURATION, ease: 'inOut(3)' }, 0);

				LAYERS.forEach((layer, index) => {
					const start = INTRO_DURATION + index * CHAPTER_DURATION;
					const rotation = 82 + index * 108;
					const group = layerGroups[index];
					const baseY = LAYER_SPECS[index].y;
					timeline
						.add(orbit, { rotateY: rotation, duration: 650, ease: 'inOut(3)' }, start)
						.add(camera, { x: index % 2 === 0 ? -0.34 : 0.34, y: layer.cameraY, z: layer.cameraZ, duration: 650, ease: 'inOut(3)' }, start)
						.add(lookTarget, { y: layer.targetY, duration: 650, ease: 'inOut(3)' }, start)
						.add(group, { y: baseY + 0.16, scale: 1.045, duration: 650, ease: 'out(3)' }, start)
						.add(focusState, { value: 1, duration: 650, ease: 'out(3)' }, start)
						.add(orbit, { rotateY: rotation + 30, duration: 550, ease: 'linear' }, start + 650)
						.add(orbit, { rotateY: rotation + 66, duration: 600, ease: 'inOut(3)' }, start + 1200)
						.add(camera, { x: 0, y: 3.4, z: 10.5, duration: 600, ease: 'inOut(3)' }, start + 1200)
						.add(lookTarget, { y: 0.45, duration: 600, ease: 'inOut(3)' }, start + 1200)
						.add(group, { y: baseY, scale: 1, duration: 600, ease: 'inOut(3)' }, start + 1200)
						.add(focusState, { value: 0, duration: 600, ease: 'inOut(3)' }, start + 1200);
				});

				timeline
					.add(orbit, { rotateY: 520, duration: 900, ease: 'inOut(3)' }, FINAL_START)
					.add(camera, { x: 0, y: 3.7, z: 12.4, duration: 900, ease: 'inOut(3)' }, FINAL_START)
					.add(lookTarget, { y: 0.35, duration: 900, ease: 'inOut(3)' }, FINAL_START)
					.add(orbit, { rotateY: 555, duration: FINAL_DURATION - 900, ease: 'linear' }, FINAL_START + 900);

				exitTransitionRef.current = {
					prepare: () => {
						const bounds = canvas.getBoundingClientRect();
						const modelWidth = Math.max(1, model.clientWidth);
						const modelHeight = Math.max(1, model.clientHeight);
						const view = camera.view?.enabled ? camera.view : null;
						preservedExitProjection = {
							screenLeft: bounds.left,
							screenTop: bounds.top,
							screenWidth: bounds.width,
							screenHeight: bounds.height,
							cameraFullWidth: view?.fullWidth ?? modelWidth,
							cameraFullHeight: view?.fullHeight ?? modelHeight,
							cameraOffsetX: view?.offsetX ?? 0,
							cameraOffsetY: view?.offsetY ?? 0,
							cameraViewWidth: view?.width ?? modelWidth,
							cameraViewHeight: view?.height ?? modelHeight,
						};
					},
					play: () => {
						grid.renderOrder = -1;
						gridMaterial.depthTest = false;
						gridMaterial.depthWrite = false;
						exitingScene = true;
						resize();
						timeline.pause();
						hoveredLayer = -1;
						focusedLayer = -1;
						pointerX = 0;
						pointerY = 0;

						const exitState = { progress: 0 };
						const exitTimeline = anime.createTimeline({
							autoplay: false,
							onUpdate: () => {
								updateBrickExit(Number(exitState.progress));
								render();
							},
						});
						exitTimeline.add(
							exitState,
							{ progress: 1, delay: EXIT_DISASSEMBLY_DELAY, duration: EXIT_DURATION, ease: 'linear' },
							0,
						);
						materials.forEach(({ block, stud }) => {
							exitTimeline
								.add(
									block,
									{ opacity: 0, duration: EXIT_BRICK_FADE_DURATION, ease: 'inOut(2)' },
									EXIT_DISASSEMBLY_DELAY + EXIT_DURATION - EXIT_BRICK_FADE_DURATION,
								)
								.add(
									stud,
									{ opacity: 0, duration: EXIT_BRICK_FADE_DURATION, ease: 'inOut(2)' },
									EXIT_DISASSEMBLY_DELAY + EXIT_DURATION - EXIT_BRICK_FADE_DURATION,
								);
						});
						exitTimeline.add(
							gridMaterial,
							{ opacity: 0, duration: EXIT_GRID_FADE_DURATION, ease: 'inOut(2)' },
							0,
						);
						cancelExit = () => exitTimeline.cancel();
						exitTimeline.play();
					},
				};

				const onSharedPointerMove = (event: globalThis.PointerEvent) => {
					if (
						reducedRef.current ||
						exitingScene ||
						event.target === canvas ||
						window.scrollY > window.innerHeight
					) {
						return;
					}
					pointerX = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
					pointerY = -((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
					render();
				};

				const onPointerMove = (event: globalThis.PointerEvent) => {
					const bounds = canvas.getBoundingClientRect();
					pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
					pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
					raycaster.setFromCamera(pointer, camera);
					const hit = raycaster.intersectObjects(blockMeshes, false)[0];
					hoveredLayer = typeof hit?.object.userData.layer === 'number' ? hit.object.userData.layer : -1;
					canvas.dataset.interactive = hoveredLayer >= 0 ? 'true' : 'false';
					if (!reducedRef.current) {
						pointerX = pointer.x;
						pointerY = pointer.y;
					}
					render();
				};
				const onPointerLeave = () => {
					hoveredLayer = -1;
					pointerX = 0;
					pointerY = 0;
					canvas.dataset.interactive = 'false';
					render();
				};
				const onPointerClick = () => {
					if (hoveredLayer >= 0) selectLayer(hoveredLayer);
				};
				const onContextLost = (event: Event) => {
					event.preventDefault();
					root.dataset.renderState = 'fallback';
					setThreeReady(false);
				};

				const clearManualSelection = () => {
					if (manuallySelectedLayer >= 0 && Math.abs(window.scrollY - manualSelectionScrollY) > 1) {
						manuallySelectedLayer = -1;
						selectionTurn?.cancel();
						selectionTurn = anime.animate(selectionPivot, {
							rotateY: 0,
							duration: 240,
							ease: 'out(3)',
							onUpdate: render,
						});
					}
				};
				const landingBody = root.previousElementSibling?.querySelector<HTMLElement>('.landing-body');
				let entryRevealFrame = 0;
				const updateEntryReveal = () => {
					entryRevealFrame = 0;
					const viewportHeight = Math.max(1, window.innerHeight);
					const handoffBottom =
						landingBody?.getBoundingClientRect().bottom ?? root.getBoundingClientRect().top;
					const reveal = clamp01(-handoffBottom / (viewportHeight * 0.14));
					root.style.setProperty('--entry-copy-opacity', reveal.toFixed(3));
				};
				const requestEntryReveal = () => {
					if (!entryRevealFrame) entryRevealFrame = requestAnimationFrame(updateEntryReveal);
				};
				requestEntryReveal();


				window.addEventListener('pointermove', onSharedPointerMove, { passive: true });
				window.addEventListener('scroll', requestEntryReveal, { passive: true });
				window.addEventListener('resize', requestEntryReveal);
				canvas.addEventListener('pointermove', onPointerMove, { passive: true });
				canvas.addEventListener('pointerleave', onPointerLeave);
				canvas.addEventListener('click', onPointerClick);
				canvas.addEventListener('webglcontextlost', onContextLost);
				window.addEventListener('scroll', clearManualSelection, { passive: true });

				let timelineReverted = false;
				const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
				reducedRef.current = motionPreference.matches;
				root.dataset.reduced = String(motionPreference.matches);
				if (motionPreference.matches) {
					timeline.revert();
					timelineReverted = true;
					orbit.rotation.y = THREE.MathUtils.degToRad(28);
					camera.position.set(0, 3.4, 10.5);
					lookTarget.position.y = 0.45;
					root.style.setProperty('--build-progress', '100%');
					root.style.setProperty('--ending-progress', '1');
					if (readoutRef.current) readoutRef.current.textContent = '100';
					reportStage(4);
					reportInspecting(false);
				}

				root.dataset.renderState = 'ready';
				setThreeReady(true);
				resize();

				dispose = () => {
					if (entryRevealFrame) cancelAnimationFrame(entryRevealFrame);
					exitTransitionRef.current = null;
					cancelExit();
					selectionTurn?.cancel();
					if (!timelineReverted) timeline.revert();
					resizeObserver.disconnect();
					canvas.removeEventListener('pointermove', onPointerMove);
					canvas.removeEventListener('pointerleave', onPointerLeave);
					canvas.removeEventListener('click', onPointerClick);
					canvas.removeEventListener('webglcontextlost', onContextLost);
					window.removeEventListener('scroll', requestEntryReveal);
					window.removeEventListener('resize', requestEntryReveal);
					window.removeEventListener('pointermove', onSharedPointerMove);
					window.removeEventListener('scroll', clearManualSelection);
					blockGeometry.dispose();
					studGeometry.dispose();
					grid.geometry.dispose();
					gridMaterial.dispose();
					materials.forEach(({ block, stud }) => {
						block.dispose();
						stud.dispose();
					});
					renderer.dispose();
				};
			} catch (error) {
				console.error('Unable to initialise the foundation model.', error);
				root.dataset.renderState = 'fallback';
				setThreeReady(false);
			}
		};

		void setup();
		return () => {
			layerSelectionRef.current = null;
			if (exitNavigationTimerRef.current !== null) {
				window.clearTimeout(exitNavigationTimerRef.current);
				exitNavigationTimerRef.current = null;
			}
			cancelled = true;
			dispose();
		};
	}, []);

	return (
		<section
			className="foundation-scroll"
			ref={rootRef}
			aria-labelledby="foundation-title"
			data-ending={activeStage === 4}
			data-inspecting={isInspecting}
			data-exiting={isExiting}
			aria-busy={isExiting}
			data-three-ready={threeReady}
		>
			<div className="foundation-sticky">
				<header className="foundation-copy">
					<p className="foundation-caption">Fig. 02 · system architecture</p>
					<h2 id="foundation-title">See how Substrate stacks up.</h2>
					<p>Scroll to inspect each layer of the system, from shared decisions to distinct products.</p>
				</header>

				<div className="foundation-model" ref={modelRef}>
					<canvas ref={canvasRef} aria-hidden="true" />
					<div className="foundation-fallback" aria-hidden="true">
						<span>Products</span>
						<span>Composites</span>
						<span>Primitives</span>
						<span>Tokens</span>
					</div>
					<p className="foundation-inspect-hint">Move to orbit · select a tier to inspect</p>
				</div>

				<div className="foundation-narrative" aria-live="polite">
					{LAYERS.map((layer, index) => (
						<article
							id={`foundation-layer-${layer.key}`}
							key={layer.key}
							data-active={activeStage === index}
							aria-hidden={activeStage !== index && !reducedRef.current}
						>
							<p className="foundation-layer-name">
								<span>{layer.number}</span> {layer.name}
							</p>
							<h3>{layer.statement}</h3>
							<p>
								{index === 1
									? `${primitives} shareable primitives · reuse instead of rebuild`
									: index === 2
										? `${composites} production-ready composites`
										: layer.detail}
							</p>
						</article>
					))}
				</div>

				<ol className="foundation-stages" aria-label="Inspect a system layer">
					{LAYERS.map((layer, index) => (
						<li key={layer.key}>
							<button type="button" onClick={() => selectLayer(index)} aria-pressed={activeStage === index}>
								<span>{layer.number}</span>
								{layer.name}
							</button>
						</li>
					))}
				</ol>

				<div className="foundation-ending" aria-hidden={activeStage !== 4 && !reducedRef.current}>
					<p className="foundation-caption">Construction complete</p>
					<h2>Ready to explore Substrate?</h2>
					<p>The system is assembled. See how it fits, install it, and build with the real components.</p>
					<Link
						className="action action-primary"
						href="/overview"
						onClick={exitToOverview}
						aria-disabled={isExiting || undefined}
						tabIndex={isExiting ? -1 : activeStage === 4 || reducedRef.current ? 0 : -1}
					>
						Open the overview
					</Link>
				</div>

				<div className="foundation-progress" aria-hidden="true">
					<span>System tour</span>
					<span className="foundation-progress-track" />
					<span>
						<span ref={readoutRef}>000</span>%
					</span>
				</div>
			</div>
		</section>
	);
}
