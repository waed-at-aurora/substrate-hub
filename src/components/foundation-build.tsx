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
const TOKEN_MODEL_CLEARANCE = 1.15;

const LAYERS = [
	{
		key: 'tokens',
		number: '01',
		name: 'Tokens',
		statement: 'Decisions beneath every product, made once.',
		detail: 'Color · type · space · motion',
		cameraY: 0.25,
		targetY: -0.35,
		cameraZ: 6.7 * TOKEN_MODEL_CLEARANCE,
	},
	{
		key: 'primitives',
		number: '02',
		name: 'Primitives',
		statement: 'Shared building blocks mean no team starts from scratch.',
		detail: '',
		cameraY: 0.85,
		targetY: 0.08,
		cameraZ: 6.15,
	},
	{
		key: 'composites',
		number: '03',
		name: 'Composites',
		statement: 'Ready-made components save development time.',
		detail: '',
		cameraY: 1.45,
		targetY: 0.52,
		cameraZ: 5.75,
	},
	{
		key: 'products',
		number: '04',
		name: 'Products',
		statement: 'Every product feels unmistakably EOS.',
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
				let rendererPixelRatio = Math.min(window.devicePixelRatio, window.innerWidth <= 832 ? 1.5 : 1.75);
				renderer.setPixelRatio(rendererPixelRatio);
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

				const [{ CSS2DObject, CSS2DRenderer }, { RoundedBoxGeometry }, { RoomEnvironment }] =
					await Promise.all([
						import('three/examples/jsm/renderers/CSS2DRenderer.js'),
						import('three/examples/jsm/geometries/RoundedBoxGeometry.js'),
						import('three/examples/jsm/environments/RoomEnvironment.js'),
					]);
				if (cancelled) return;

				const labelRenderer = new CSS2DRenderer();
				labelRenderer.domElement.className = 'foundation-model-labels';
				labelRenderer.domElement.setAttribute('aria-hidden', 'true');
				model.append(labelRenderer.domElement);

				const environmentGenerator = new THREE.PMREMGenerator(renderer);
				const environmentScene = new RoomEnvironment();
				const nonPyramidEnvironment = environmentGenerator.fromScene(environmentScene, 0.04).texture;
				environmentScene.dispose();
				environmentGenerator.dispose();

				const bentSheetGeometry = new THREE.PlaneGeometry(0.92, 0.6, 5, 3);
				const bentSheetPositions = bentSheetGeometry.attributes.position;
				for (let index = 0; index < bentSheetPositions.count; index += 1) {
					const x = bentSheetPositions.getX(index);
					const y = bentSheetPositions.getY(index);
					bentSheetPositions.setZ(index, x * x * 0.055 + Math.sin(y * 8) * 0.008);
				}
				bentSheetGeometry.computeVertexNormals();
				const windBladeShape = new THREE.Shape();
				windBladeShape.moveTo(-0.026, 0.055);
				windBladeShape.lineTo(-0.08, 0.39);
				windBladeShape.quadraticCurveTo(-0.075, 0.48, -0.018, 0.53);
				windBladeShape.lineTo(0.038, 0.43);
				windBladeShape.lineTo(0.038, 0.065);
				windBladeShape.closePath();
				const windBladeGeometry = new THREE.ExtrudeGeometry(windBladeShape, {
					depth: 0.022,
					bevelEnabled: true,
					bevelSegments: 1,
					bevelSize: 0.008,
					bevelThickness: 0.006,
					curveSegments: 3,
				});
				windBladeGeometry.translate(0, 0, -0.011);
				const turbineBladeStations = [
					{ y: 0.065, width: 0.082, thickness: 0.043, sweep: 0, twist: 0.38 },
					{ y: 0.14, width: 0.088, thickness: 0.039, sweep: -0.004, twist: 0.3 },
					{ y: 0.24, width: 0.071, thickness: 0.031, sweep: -0.014, twist: 0.2 },
					{ y: 0.35, width: 0.052, thickness: 0.024, sweep: -0.028, twist: 0.1 },
					{ y: 0.46, width: 0.036, thickness: 0.017, sweep: -0.044, twist: 0.02 },
					{ y: 0.54, width: 0.019, thickness: 0.009, sweep: -0.056, twist: -0.04 },
				];
				const turbineBladeRadialSegments = 8;
				const turbineBladePositions: number[] = [];
				const turbineBladeIndices: number[] = [];
				turbineBladeStations.forEach((station) => {
					const twistCos = Math.cos(station.twist);
					const twistSin = Math.sin(station.twist);
					for (let radialIndex = 0; radialIndex < turbineBladeRadialSegments; radialIndex += 1) {
						const angle = (radialIndex / turbineBladeRadialSegments) * Math.PI * 2;
						const crossX = Math.cos(angle) * station.width;
						const crossZ = Math.sin(angle) * station.thickness;
						turbineBladePositions.push(
							station.sweep + crossX * twistCos - crossZ * twistSin,
							station.y,
							crossX * twistSin + crossZ * twistCos,
						);
					}
				});
				for (let stationIndex = 0; stationIndex < turbineBladeStations.length - 1; stationIndex += 1) {
					const ringStart = stationIndex * turbineBladeRadialSegments;
					const nextRingStart = ringStart + turbineBladeRadialSegments;
					for (let radialIndex = 0; radialIndex < turbineBladeRadialSegments; radialIndex += 1) {
						const nextRadialIndex = (radialIndex + 1) % turbineBladeRadialSegments;
						turbineBladeIndices.push(
							ringStart + radialIndex,
							nextRingStart + radialIndex,
							nextRingStart + nextRadialIndex,
							ringStart + radialIndex,
							nextRingStart + nextRadialIndex,
							ringStart + nextRadialIndex,
						);
					}
				}
				const turbineBladeRootCenter = turbineBladePositions.length / 3;
				const turbineBladeTipCenter = turbineBladeRootCenter + 1;
				const turbineBladeTipStart =
					(turbineBladeStations.length - 1) * turbineBladeRadialSegments;
				const turbineBladeRoot = turbineBladeStations[0];
				const turbineBladeTip = turbineBladeStations[turbineBladeStations.length - 1];
				turbineBladePositions.push(turbineBladeRoot.sweep, turbineBladeRoot.y, 0);
				turbineBladePositions.push(turbineBladeTip.sweep, turbineBladeTip.y, 0);
				for (let radialIndex = 0; radialIndex < turbineBladeRadialSegments; radialIndex += 1) {
					const nextRadialIndex = (radialIndex + 1) % turbineBladeRadialSegments;
					turbineBladeIndices.push(turbineBladeRootCenter, nextRadialIndex, radialIndex);
					turbineBladeIndices.push(
						turbineBladeTipCenter,
						turbineBladeTipStart + radialIndex,
						turbineBladeTipStart + nextRadialIndex,
					);
				}
				const turbineBladeGeometry = new THREE.BufferGeometry();
				turbineBladeGeometry.setAttribute(
					'position',
					new THREE.Float32BufferAttribute(turbineBladePositions, 3),
				);
				turbineBladeGeometry.setIndex(turbineBladeIndices);
				turbineBladeGeometry.computeVertexNormals();
				const batteryWarningShape = new THREE.Shape();
				batteryWarningShape.moveTo(0, 0.07);
				batteryWarningShape.lineTo(-0.072, -0.058);
				batteryWarningShape.lineTo(0.072, -0.058);
				batteryWarningShape.closePath();
				const batteryBoltShape = new THREE.Shape();
				batteryBoltShape.moveTo(0.014, 0.052);
				batteryBoltShape.lineTo(-0.026, 0.004);
				batteryBoltShape.lineTo(-0.004, 0.004);
				batteryBoltShape.lineTo(-0.018, -0.052);
				batteryBoltShape.lineTo(0.03, 0.014);
				batteryBoltShape.lineTo(0.006, 0.014);
				batteryBoltShape.closePath();
				const miniGeometries = {
					card: new RoundedBoxGeometry(1, 0.62, 0.08, 2, 0.045),
					wide: new RoundedBoxGeometry(1.24, 0.36, 0.08, 2, 0.04),
					button: new RoundedBoxGeometry(0.5, 0.16, 0.1, 2, 0.035),
					square: new RoundedBoxGeometry(0.2, 0.2, 0.08, 2, 0.03),
					rulerBody: new RoundedBoxGeometry(1.72, 0.3, 0.09, 4, 0.035),
					rulerFace: new RoundedBoxGeometry(1.54, 0.215, 0.018, 2, 0.018),
					rulerRail: new RoundedBoxGeometry(1.56, 0.026, 0.026, 1, 0.007),
					rulerTick: new RoundedBoxGeometry(0.012, 0.09, 0.018, 1, 0.004),
					rulerEndCap: new RoundedBoxGeometry(0.075, 0.28, 0.096, 2, 0.018),
					rulerHole: new THREE.CylinderGeometry(0.042, 0.042, 0.014, 20),
					rulerHoleRing: new THREE.TorusGeometry(0.052, 0.009, 8, 20),
					rulerPrint: new THREE.PlaneGeometry(1.4, 0.12),
					avatar: new THREE.CylinderGeometry(0.19, 0.19, 0.08, 24),
					knob: new THREE.SphereGeometry(0.1, 12, 8),
					tokenSwatch: new RoundedBoxGeometry(1, 0.34, 0.035, 3, 0.045),
					tokenSwatchPrint: new THREE.PlaneGeometry(0.78, 0.21),
					tokenSheetEdge: new RoundedBoxGeometry(0.96, 0.64, 0.026, 2, 0.025),
					tokenSheetPrint: bentSheetGeometry,
					windBlade: windBladeGeometry,
					turbineFoundation: new RoundedBoxGeometry(0.82, 0.12, 0.48, 4, 0.045),
					turbineFoot: new RoundedBoxGeometry(0.17, 0.045, 0.16, 2, 0.016),
					turbineFoundationInset: new RoundedBoxGeometry(0.66, 0.028, 0.34, 2, 0.018),
					turbineTower: new THREE.CylinderGeometry(0.046, 0.14, 0.72, 24),
					turbineFlange: new THREE.CylinderGeometry(0.16, 0.18, 0.075, 24),
					turbineYawRing: new THREE.CylinderGeometry(0.083, 0.094, 0.055, 24),
					turbineNacelle: new RoundedBoxGeometry(0.38, 0.18, 0.22, 4, 0.045),
					turbineGenerator: new THREE.CylinderGeometry(0.092, 0.092, 0.2, 24),
					turbineShaft: new THREE.CylinderGeometry(0.035, 0.035, 0.22, 16),
					turbineHub: new THREE.SphereGeometry(0.11, 20, 12),
					turbineHubCap: new THREE.CylinderGeometry(0.08, 0.082, 0.024, 32),
					turbineBladeRoot: new THREE.CylinderGeometry(0.043, 0.052, 0.1, 16),
					turbineBlade: turbineBladeGeometry,
					turbineAccessPanel: new RoundedBoxGeometry(0.105, 0.19, 0.018, 3, 0.016),
					turbineNacellePanel: new RoundedBoxGeometry(0.17, 0.085, 0.014, 2, 0.014),
					turbineVent: new RoundedBoxGeometry(0.075, 0.012, 0.014, 1, 0.004),
					turbineBolt: new THREE.CylinderGeometry(0.012, 0.012, 0.018, 12),
					turbineIndicator: new THREE.TorusGeometry(0.112, 0.01, 8, 28),
					solarFoundation: new RoundedBoxGeometry(0.92, 0.1, 0.48, 4, 0.04),
					solarFoot: new RoundedBoxGeometry(0.22, 0.045, 0.16, 2, 0.016),
					solarOuterFrame: new RoundedBoxGeometry(1.28, 0.72, 0.09, 4, 0.028),
					solarBacking: new RoundedBoxGeometry(1.2, 0.64, 0.035, 3, 0.018),
					solarGlass: new RoundedBoxGeometry(1.19, 0.63, 0.01, 2, 0.012),
					solarCell: new RoundedBoxGeometry(0.134, 0.132, 0.012, 2, 0.007),
					solarSupportBeam: new RoundedBoxGeometry(0.055, 0.58, 0.055, 2, 0.014),
					solarCrossBrace: new RoundedBoxGeometry(0.62, 0.045, 0.05, 2, 0.012),
					solarPivot: new THREE.CylinderGeometry(0.055, 0.055, 0.07, 18),
					solarMountClip: new RoundedBoxGeometry(0.06, 0.04, 0.035, 2, 0.008),
					solarJunctionBox: new RoundedBoxGeometry(0.28, 0.16, 0.075, 3, 0.018),
					solarConnector: new THREE.CylinderGeometry(0.025, 0.025, 0.05, 14),
					solarFastener: new THREE.CylinderGeometry(0.012, 0.012, 0.014, 12),
					solarIndicator: new RoundedBoxGeometry(0.045, 0.018, 0.012, 1, 0.004),
					solarReflection: new RoundedBoxGeometry(0.09, 0.6, 0.008, 1, 0.004),
					batteryCase: new RoundedBoxGeometry(0.86, 0.64, 0.3, 4, 0.055),
					batteryLid: new RoundedBoxGeometry(0.82, 0.075, 0.28, 3, 0.025),
					batteryPanel: new RoundedBoxGeometry(0.7, 0.43, 0.035, 3, 0.022),
					batteryModule: new RoundedBoxGeometry(0.135, 0.235, 0.028, 2, 0.014),
					batteryModuleRail: new RoundedBoxGeometry(0.105, 0.018, 0.01, 1, 0.004),
					batteryTerminalMount: new THREE.CylinderGeometry(0.076, 0.076, 0.045, 20),
					batteryTerminal: new THREE.CylinderGeometry(0.047, 0.058, 0.11, 20),
					batteryMark: new RoundedBoxGeometry(0.058, 0.012, 0.008, 1, 0.004),
					batteryHandlePost: new RoundedBoxGeometry(0.035, 0.14, 0.042, 2, 0.012),
					batteryHandleGrip: new RoundedBoxGeometry(0.42, 0.042, 0.052, 2, 0.014),
					batteryFoot: new RoundedBoxGeometry(0.18, 0.055, 0.16, 2, 0.018),
					batteryVent: new RoundedBoxGeometry(0.078, 0.012, 0.012, 1, 0.004),
					batteryFastener: new THREE.CylinderGeometry(0.016, 0.016, 0.014, 12),
					batteryDisplay: new RoundedBoxGeometry(0.43, 0.12, 0.035, 3, 0.018),
					batteryDisplaySegment: new RoundedBoxGeometry(0.055, 0.058, 0.012, 1, 0.006),
					batteryLabelPlate: new RoundedBoxGeometry(0.19, 0.068, 0.012, 1, 0.006),
					batteryLabelLine: new RoundedBoxGeometry(0.13, 0.008, 0.006, 1, 0.003),
					batteryWarning: new THREE.ShapeGeometry(batteryWarningShape),
					batteryBolt: new THREE.ShapeGeometry(batteryBoltShape),
					microPlatform: new RoundedBoxGeometry(2.4, 0.11, 0.74, 4, 0.035),
					microPlatformInset: new RoundedBoxGeometry(2.2, 0.032, 0.58, 2, 0.014),
					microPlatformRail: new RoundedBoxGeometry(2.14, 0.025, 0.028, 1, 0.007),
					microEquipmentPad: new RoundedBoxGeometry(0.38, 0.04, 0.3, 2, 0.014),
					microMountFoot: new RoundedBoxGeometry(0.12, 0.045, 0.1, 2, 0.012),
					microWindTower: new THREE.CylinderGeometry(0.024, 0.066, 0.64, 16),
					microWindFlange: new THREE.CylinderGeometry(0.078, 0.086, 0.045, 16),
					microWindNacelle: new RoundedBoxGeometry(0.24, 0.115, 0.14, 3, 0.028),
					microWindHub: new THREE.CylinderGeometry(0.048, 0.048, 0.065, 20),
					microWindShaft: new THREE.CylinderGeometry(0.018, 0.018, 0.085, 16),
					microSolarFrame: new RoundedBoxGeometry(0.46, 0.27, 0.038, 3, 0.014),
					microSolarBack: new RoundedBoxGeometry(0.42, 0.23, 0.018, 2, 0.009),
					microSolarCell: new RoundedBoxGeometry(0.07, 0.055, 0.008, 1, 0.003),
					microSolarRail: new RoundedBoxGeometry(0.41, 0.009, 0.01, 1, 0.003),
					microSolarLeg: new RoundedBoxGeometry(0.025, 0.23, 0.025, 1, 0.007),
					microInverterCase: new RoundedBoxGeometry(0.44, 0.42, 0.24, 4, 0.028),
					microInverterDoor: new RoundedBoxGeometry(0.38, 0.35, 0.018, 3, 0.012),
					microStorageCase: new RoundedBoxGeometry(0.36, 0.4, 0.23, 4, 0.026),
					microStorageDoor: new RoundedBoxGeometry(0.31, 0.34, 0.016, 3, 0.01),
					microHandle: new RoundedBoxGeometry(0.018, 0.09, 0.024, 1, 0.006),
					microHinge: new RoundedBoxGeometry(0.018, 0.055, 0.02, 1, 0.005),
					microVent: new RoundedBoxGeometry(0.09, 0.01, 0.012, 1, 0.003),
					microFastener: new THREE.CylinderGeometry(0.008, 0.008, 0.012, 10),
					microIndicator: new RoundedBoxGeometry(0.04, 0.018, 0.012, 1, 0.004),
					microStatusSegment: new RoundedBoxGeometry(0.026, 0.062, 0.011, 1, 0.004),
					microCableEntry: new THREE.CylinderGeometry(0.016, 0.021, 0.035, 12),
					microTerminalBlock: new RoundedBoxGeometry(0.105, 0.04, 0.035, 2, 0.008),
					microBatteryCell: new RoundedBoxGeometry(0.026, 0.07, 0.011, 1, 0.004),
					microTowerLeg: new RoundedBoxGeometry(0.024, 0.56, 0.024, 1, 0.006),
					microPylonBrace: new RoundedBoxGeometry(0.2, 0.014, 0.014, 1, 0.004),
					microCrossarm: new RoundedBoxGeometry(0.42, 0.026, 0.03, 1, 0.007),
					microInsulator: new THREE.CylinderGeometry(0.011, 0.017, 0.06, 10),
					microInsulatorCap: new THREE.CylinderGeometry(0.017, 0.017, 0.012, 10),
					microTransformer: new RoundedBoxGeometry(0.24, 0.22, 0.2, 3, 0.022),
					microCoolingFin: new RoundedBoxGeometry(0.018, 0.15, 0.11, 1, 0.005),
					microCablePulse: new THREE.CapsuleGeometry(0.0035, 0.024, 2, 5),
					productBadge: new THREE.CylinderGeometry(0.29, 0.29, 0.085, 32),
					productRim: new THREE.TorusGeometry(0.268, 0.018, 8, 32),
					productIcon: new THREE.PlaneGeometry(0.38, 0.38),
					productCaption: new THREE.PlaneGeometry(0.58, 0.13),
					productRay: new RoundedBoxGeometry(0.018, 0.19, 0.012, 1, 0.006),
					productTrail: new THREE.SphereGeometry(0.027, 10, 8),
					productConfetti: new RoundedBoxGeometry(0.075, 0.18, 0.024, 1, 0.011),
					productRibbon: new THREE.PlaneGeometry(0.095, 0.28, 1, 4),
				};
				const miniGeometryList = [...new Set(Object.values(miniGeometries))];
				const makeMiniMaterial = (color: string) =>
					new THREE.MeshStandardMaterial({
						color,
						roughness: 0.68,
						metalness: 0.06,
						envMap: nonPyramidEnvironment,
						envMapIntensity: 0.52,
						transparent: true,
						opacity: 0,
						depthWrite: false,
					});
				const risePalettes = LAYER_SPECS.map((spec) => {
					const palette = {
						paper: makeMiniMaterial('#0f0f12'),
						ink: makeMiniMaterial('#e4e4e7'),
						rule: makeMiniMaterial('#52525b'),
						accent: makeMiniMaterial(spec.stud),
						muted: makeMiniMaterial('#9c9ca6'),
						red: makeMiniMaterial('#e7000b'),
						blue: makeMiniMaterial('#007595'),
						green: makeMiniMaterial('#008236'),
						yellow: makeMiniMaterial('#ffcc00'),
					};
					return { ...palette, all: Object.values(palette) };
				});

				const tokenTextures: InstanceType<typeof THREE.Texture>[] = [];
				const tokenSurfaceMaterials: InstanceType<typeof THREE.Material>[] = [];
				const makeTokenSurface = (color: string, roughness = 0.42) => {
					const material = new THREE.MeshPhysicalMaterial({
						color,
						roughness,
						metalness: 0.02,
						clearcoat: 0.4,
						clearcoatRoughness: 0.32,
						envMap: nonPyramidEnvironment,
						envMapIntensity: 0.72,
						transparent: true,
						opacity: 0,
						depthWrite: false,
					});
					material.userData.targetOpacity = 0.94;
					tokenSurfaceMaterials.push(material);
					return material;
				};
				const makeTokenPrint = (
					width: number,
					height: number,
					paint: (context: CanvasRenderingContext2D, width: number, height: number) => void,
				) => {
					const canvas = document.createElement('canvas');
					canvas.width = width;
					canvas.height = height;
					const context = canvas.getContext('2d');
					if (!context) throw new Error('Canvas 2D context unavailable');
					context.clearRect(0, 0, width, height);
					paint(context, width, height);
					const texture = new THREE.CanvasTexture(canvas);
					texture.colorSpace = THREE.SRGBColorSpace;
					texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
					tokenTextures.push(texture);
					const material = new THREE.MeshBasicMaterial({
						map: texture,
						transparent: true,
						opacity: 0,
						depthWrite: false,
						side: THREE.DoubleSide,
					});
					material.userData.targetOpacity = 1;
					tokenSurfaceMaterials.push(material);
					return material;
				};

				const colorProbe = document.createElement('span');
				colorProbe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
				model.append(colorProbe);
				const resolveSubstrateColor = (token: string) => {
					const declared = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
					if (!declared) throw new Error(`Missing Substrate color token: ${token}`);
					colorProbe.style.color = `var(${token})`;
					return getComputedStyle(colorProbe).color;
				};
				const substrateColors = {
					canvas: resolveSubstrateColor('--eos-background'),
					text: resolveSubstrateColor('--eos-foreground'),
					elevated: resolveSubstrateColor('--eos-card'),
					subtle: resolveSubstrateColor('--eos-muted'),
					secondary: resolveSubstrateColor('--eos-secondary'),
					muted: resolveSubstrateColor('--eos-muted-foreground'),
					border: resolveSubstrateColor('--eos-border'),
					primary: resolveSubstrateColor('--eos-primary'),
					primaryInk: resolveSubstrateColor('--eos-primary-foreground'),
					cyanDim: resolveSubstrateColor('--eos-color-dark-blue-300'),
					cyan: resolveSubstrateColor('--eos-color-dark-blue-800'),
					cyanBright: resolveSubstrateColor('--eos-color-dark-blue-900'),
					panelCell: resolveSubstrateColor('--eos-color-dark-blue-100'),
					coral: resolveSubstrateColor('--eos-color-dark-red-800'),
					green: resolveSubstrateColor('--eos-color-dark-green-800'),
					blue: resolveSubstrateColor('--eos-color-dark-blue-600'),
				};
				colorProbe.remove();

				type ProductName = 'Chronos' | 'Amun' | 'Origin' | 'Solaris' | 'Lumus';
				const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
				const productDefinitions: Record<
					ProductName,
					{ path: string; badge: string; ink: string }
				> = {
					Chronos: {
						path: `${assetBasePath}/assets/product-icons/chronos.svg`,
						badge: substrateColors.primary,
						ink: substrateColors.primaryInk,
					},
					Amun: {
						path: `${assetBasePath}/assets/product-icons/amun.svg`,
						badge: substrateColors.cyan,
						ink: substrateColors.text,
					},
					Origin: {
						path: `${assetBasePath}/assets/product-icons/origin.svg`,
						badge: substrateColors.coral,
						ink: substrateColors.text,
					},
					Solaris: {
						path: `${assetBasePath}/assets/product-icons/solaris.svg`,
						badge: substrateColors.green,
						ink: substrateColors.primaryInk,
					},
					Lumus: {
						path: `${assetBasePath}/assets/product-icons/lumus.svg`,
						badge: substrateColors.blue,
						ink: substrateColors.text,
					},
				};
				const productTextures: InstanceType<typeof THREE.Texture>[] = [];
				const productSurfaceMaterials: InstanceType<typeof THREE.Material>[] = [];
				const makeProductMaterial = <T extends InstanceType<typeof THREE.Material>>(
					material: T,
					targetOpacity: number,
				) => {
					material.userData.targetOpacity = targetOpacity;
					productSurfaceMaterials.push(material);
					return material;
				};
				const loadProductTexture = async (path: string, ink: string) => {
					const response = await fetch(path);
					if (!response.ok) throw new Error(`Unable to load product icon: ${path}`);
					const source = (await response.text()).replaceAll('currentColor', ink);
					const blobUrl = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }));
					try {
						const image = new Image();
						image.src = blobUrl;
						await image.decode();
						const canvas = document.createElement('canvas');
						canvas.width = 512;
						canvas.height = 512;
						const context = canvas.getContext('2d');
						if (!context) throw new Error('Canvas 2D context unavailable');
						context.drawImage(image, 0, 0, 512, 512);
						const texture = new THREE.CanvasTexture(canvas);
						texture.colorSpace = THREE.SRGBColorSpace;
						texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
						productTextures.push(texture);
						return texture;
					} finally {
						URL.revokeObjectURL(blobUrl);
					}
				};
				const productIconTextures = Object.fromEntries(
					await Promise.all(
						(Object.entries(productDefinitions) as Array<
							[ProductName, (typeof productDefinitions)[ProductName]]
						>).map(async ([name, definition]) => [
							name,
							await loadProductTexture(definition.path, definition.ink),
						]),
					),
				) as Record<ProductName, InstanceType<typeof THREE.Texture>>;
				const makeProductCaptionMaterial = (name: ProductName, color: string) => {
					const canvas = document.createElement('canvas');
					canvas.width = 512;
					canvas.height = 112;
					const context = canvas.getContext('2d');
					if (!context) throw new Error('Canvas 2D context unavailable');
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.fillStyle = color;
					context.beginPath();
					context.arc(44, 56, 8, 0, Math.PI * 2);
					context.fill();
					context.fillStyle = substrateColors.text;
					context.font = '600 38px Inter, ui-sans-serif, sans-serif';
					context.textBaseline = 'middle';
					context.fillText(name, 68, 58);
					const texture = new THREE.CanvasTexture(canvas);
					texture.colorSpace = THREE.SRGBColorSpace;
					texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
					productTextures.push(texture);
					return makeProductMaterial(
						new THREE.MeshBasicMaterial({
							map: texture,
							transparent: true,
							opacity: 0,
							depthWrite: false,
							side: THREE.DoubleSide,
						}),
						0.88,
					);
				};

				const energySurfaceMaterials: InstanceType<typeof THREE.MeshPhysicalMaterial>[] = [];
				const makeEnergySurface = (
					color: string,
					roughness: number,
					metalness: number,
					clearcoat = 0.12,
					targetOpacity = 1,
				) => {
					const material = new THREE.MeshPhysicalMaterial({
						color,
						roughness,
						metalness,
						clearcoat,
						clearcoatRoughness: 0.34,
						envMap: nonPyramidEnvironment,
						envMapIntensity: 0.78,
						transparent: true,
						opacity: 0,
						depthWrite: false,
					});
					material.userData.targetOpacity = targetOpacity;
					energySurfaceMaterials.push(material);
					return material;
				};
				const windMaterials = {
					foundation: makeEnergySurface('#031827', 0.8, 0.08, 0.12),
					baseInset: makeEnergySurface('#073747', 0.58, 0.18, 0.2),
					tower: makeEnergySurface('#d8d8cf', 0.48, 0.04, 0.34),
					nacelle: makeEnergySurface('#c9d0c8', 0.36, 0.06, 0.44),
					blade: makeEnergySurface('#e5e2d8', 0.3, 0.02, 0.42),
					hubCap: makeEnergySurface('#d8d8cf', 0.68, 0.02, 0.12),
					panel: makeEnergySurface('#07515a', 0.48, 0.22, 0.22),
					joint: makeEnergySurface('#082f3c', 0.34, 0.42, 0.3),
					brass: makeEnergySurface('#b77a2e', 0.26, 0.84, 0.52),
					copper: makeEnergySurface('#b76532', 0.3, 0.72, 0.46),
					cyan: makeEnergySurface('#34d8e3', 0.22, 0.12, 0.5),
					yellow: makeEnergySurface('#f5c842', 0.34, 0.08, 0.34),
				};
				windMaterials.cyan.emissive.set('#19b9c7');
				windMaterials.cyan.emissiveIntensity = 0.26;
				windMaterials.yellow.emissive.set('#8b6208');
				windMaterials.yellow.emissiveIntensity = 0.06;

				const solarMaterials = {
					foundation: makeEnergySurface('#031827', 0.8, 0.08, 0.12),
					support: makeEnergySurface('#073244', 0.42, 0.42, 0.28),
					frame: makeEnergySurface('#041c2b', 0.3, 0.58, 0.34),
					backing: makeEnergySurface('#073a43', 0.62, 0.04, 0.18),
					glass: makeEnergySurface('#062b3a', 0.16, 0.04, 0.82, 0.16),
					cellA: makeEnergySurface('#055968', 0.24, 0.04, 0.54),
					cellB: makeEnergySurface('#076c79', 0.22, 0.04, 0.58),
					cellC: makeEnergySurface('#064a5a', 0.28, 0.04, 0.48),
					copper: makeEnergySurface('#b86d43', 0.3, 0.76, 0.24),
					brass: makeEnergySurface('#d09b48', 0.28, 0.7, 0.28),
					rubber: makeEnergySurface('#10262d', 0.92, 0.01, 0.02),
					cyan: makeEnergySurface(substrateColors.cyanBright, 0.18, 0.04, 0.44),
					yellow: makeEnergySurface(substrateColors.primary, 0.38, 0.04, 0.24),
					reflection: makeEnergySurface('#e0b862', 0.18, 0.04, 0.62, 0.16),
				};
				solarMaterials.cyan.emissive.set(substrateColors.cyanBright);
				solarMaterials.cyan.emissiveIntensity = 0.26;
				solarMaterials.yellow.emissive.set(substrateColors.primary);
				solarMaterials.yellow.emissiveIntensity = 0.04;
				solarMaterials.reflection.emissive.set('#8b6729');
				solarMaterials.reflection.emissiveIntensity = 0.08;
				const solarCableGeometries: InstanceType<typeof THREE.BufferGeometry>[] = [];

				const batteryMaterials = {
					casing: makeEnergySurface('#031d31', 0.46, 0.06, 0.34),
					lid: makeEnergySurface('#06394c', 0.4, 0.08, 0.38),
					panel: makeEnergySurface('#075158', 0.58, 0.04, 0.24),
					module: makeEnergySurface('#073846', 0.52, 0.06, 0.28),
					rubber: makeEnergySurface('#102329', 0.9, 0.01, 0.04),
					copper: makeEnergySurface('#b86c3f', 0.3, 0.76, 0.24),
					brass: makeEnergySurface('#d09a48', 0.28, 0.7, 0.28),
					cyan: makeEnergySurface(substrateColors.cyanBright, 0.2, 0.08, 0.44),
					cyanOff: makeEnergySurface('#0b4550', 0.5, 0.02, 0.16),
					yellow: makeEnergySurface(substrateColors.primary, 0.34, 0.04, 0.26),
				};
				batteryMaterials.cyan.emissive.set(substrateColors.cyanBright);
				batteryMaterials.cyan.emissiveIntensity = 0.42;
				batteryMaterials.cyanOff.emissive.set(substrateColors.cyanDim);
				batteryMaterials.cyanOff.emissiveIntensity = 0.08;
				batteryMaterials.yellow.emissive.set(substrateColors.primary);
				batteryMaterials.yellow.emissiveIntensity = 0.08;


				const microgridSurfaceMaterials: InstanceType<typeof THREE.MeshPhysicalMaterial>[] = [];
				const makeMicrogridSurface = (
					color: string,
					roughness: number,
					metalness: number,
					clearcoat = 0.16,
					targetOpacity = 1,
				) => {
					const material = new THREE.MeshPhysicalMaterial({
						color,
						roughness,
						metalness,
						clearcoat,
						clearcoatRoughness: 0.32,
						envMap: nonPyramidEnvironment,
						envMapIntensity: 0.58,
						transparent: true,
						opacity: 0,
						depthWrite: false,
					});
					material.userData.targetOpacity = targetOpacity;
					microgridSurfaceMaterials.push(material);
					return material;
				};
				const microgridMaterials = {
					foundation: makeMicrogridSurface('#00111f', 0.84, 0.06, 0.08),
					deck: makeMicrogridSurface('#003748', 0.72, 0.06, 0.16),
					housing: makeMicrogridSurface('#002b4e', 0.52, 0.06, 0.28),
					frame: makeMicrogridSurface('#004760', 0.38, 0.44, 0.24),
					panel: makeMicrogridSurface('#00616a', 0.6, 0.03, 0.18),
					solarGlass: makeMicrogridSurface('#003747', 0.18, 0.06, 0.68),
					solarCell: makeMicrogridSurface('#005362', 0.24, 0.04, 0.52),
					offWhite: makeMicrogridSurface('#e7ebe3', 0.44, 0.02, 0.22),
					copper: makeMicrogridSurface('#b96f43', 0.3, 0.78, 0.24),
					brass: makeMicrogridSurface('#d0a04c', 0.28, 0.72, 0.3),
					rubber: makeMicrogridSurface('#08171b', 0.92, 0.01, 0.02),
					insulator: makeMicrogridSurface('#c8dcd5', 0.3, 0.03, 0.62),
					cyan: makeMicrogridSurface(substrateColors.cyanBright, 0.18, 0.04, 0.48),
					cyanOff: makeMicrogridSurface('#083740', 0.54, 0.02, 0.14),
					yellow: makeMicrogridSurface(substrateColors.primary, 0.36, 0.04, 0.3),
					charge: makeMicrogridSurface(substrateColors.cyanBright, 0.14, 0.04, 0.62),
				};
				microgridMaterials.cyan.emissive.set(substrateColors.cyanBright);
				microgridMaterials.cyan.emissiveIntensity = 0.34;
				microgridMaterials.cyanOff.emissive.set(substrateColors.cyanDim);
				microgridMaterials.cyanOff.emissiveIntensity = 0.06;
				microgridMaterials.yellow.emissive.set(substrateColors.primary);
				microgridMaterials.yellow.emissiveIntensity = 0.06;
				microgridMaterials.charge.emissive.set(substrateColors.cyanBright);
				microgridMaterials.charge.emissiveIntensity = 0.52;

				type MicrogridCableChannel = 'wind' | 'solar' | 'battery';
				const microgridCableMaterials: InstanceType<typeof THREE.MeshBasicMaterial>[] = [];
				const makeCableMaterial = (color: string, targetOpacity: number) => {
					const material = new THREE.MeshBasicMaterial({
						color,
						transparent: true,
						opacity: 0,
						depthWrite: false,
						blending: THREE.AdditiveBlending,
					});
					material.userData.targetOpacity = targetOpacity;
					microgridCableMaterials.push(material);
					return material;
				};
				const makeCableChannel = () => ({
					glow: makeCableMaterial(substrateColors.cyan, 0.11),
					core: makeCableMaterial(substrateColors.cyanBright, 0.72),
					pulse: makeCableMaterial(substrateColors.cyanBright, 0.92),
				});
				const microgridCableChannels = {
					wind: makeCableChannel(),
					solar: makeCableChannel(),
					battery: makeCableChannel(),
				};
				const microgridCableGeometries: InstanceType<typeof THREE.BufferGeometry>[] = [];
				const microgridPulseAxis = new THREE.Vector3(0, 1, 0);
				const microgridPulseTangent = new THREE.Vector3();
				const microgridShadowCanvas = document.createElement('canvas');
				microgridShadowCanvas.width = 128;
				microgridShadowCanvas.height = 64;
				const microgridShadowContext = microgridShadowCanvas.getContext('2d')!;
				const microgridShadowGradient = microgridShadowContext.createRadialGradient(
					64,
					32,
					2,
					64,
					32,
					58,
				);
				microgridShadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
				microgridShadowGradient.addColorStop(0.58, 'rgba(0, 0, 0, 0.2)');
				microgridShadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
				microgridShadowContext.fillStyle = microgridShadowGradient;
				microgridShadowContext.fillRect(0, 0, 128, 64);
				const microgridShadowTexture = new THREE.CanvasTexture(microgridShadowCanvas);
				const microgridShadowMaterial = new THREE.SpriteMaterial({
					map: microgridShadowTexture,
					color: 0x000000,
					transparent: true,
					opacity: 0,
					depthWrite: false,
				});

				const contactShadowCanvas = document.createElement('canvas');
				contactShadowCanvas.width = 128;
				contactShadowCanvas.height = 64;
				const contactShadowContext = contactShadowCanvas.getContext('2d')!;
				const contactShadowGradient = contactShadowContext.createRadialGradient(64, 32, 2, 64, 32, 58);
				contactShadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
				contactShadowGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
				contactShadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
				contactShadowContext.fillStyle = contactShadowGradient;
				contactShadowContext.fillRect(0, 0, 128, 64);
				const contactShadowTexture = new THREE.CanvasTexture(contactShadowCanvas);
				const contactShadowMaterials = LAYER_SPECS.map(
					() =>
						new THREE.SpriteMaterial({
							map: contactShadowTexture,
							color: 0x000000,
							transparent: true,
							opacity: 0,
							depthWrite: false,
						}),
				);

				type MicrogridAssemblyPart = {
					object: InstanceType<typeof THREE.Object3D>;
					restPosition: InstanceType<typeof THREE.Vector3>;
					restScale: InstanceType<typeof THREE.Vector3>;
					delay: number;
				};
				type MicrogridPulseRoute = {
					mesh: InstanceType<typeof THREE.Mesh>;
					curve: InstanceType<typeof THREE.CubicBezierCurve3>;
					speed: number;
					offset: number;
					channel: MicrogridCableChannel;
				};

				type MiniKind =
					| 'swatches'
					| 'ruler'
					| 'typography'
					| 'wind'
					| 'solar'
					| 'battery'
					| 'microgrid'
					| 'Chronos'
					| 'Amun'
					| 'Origin'
					| 'Solaris'
					| 'Lumus';
				type RiseItem = {
					kind: MiniKind;
					group: InstanceType<typeof THREE.Group>;
					labels: HTMLElement[];
					x: number;
					z: number;
					hiddenY: number;
					faceTiltX: number;
					faceTiltZ: number;
					targetY: number;
					baseRotation: number;
					floatPhase: number;
				};
				type RiseLayer = {
					items: RiseItem[];
					progress: number;
					target: number;
					visible: boolean;
					lastOpacity: number;
					sparks: InstanceType<typeof THREE.Points> | null;
					sparkBase: Float32Array | null;
					sparkDirections: Float32Array | null;
				};

				const layerKinds: readonly (readonly MiniKind[])[] = [
					['swatches', 'ruler', 'typography'],
					['wind', 'solar', 'battery'],
					['microgrid'],
					['Chronos', 'Amun', 'Origin', 'Solaris', 'Lumus'],
				];
				const layerRadii = [1.62, 1.66, 1.32, 1.28] as const;
				const layerMinDistances = [0.9, 0.9, 1.35, 0.88] as const;

				const makeMesh = (
					geometry: (typeof miniGeometries)[keyof typeof miniGeometries],
					material: InstanceType<typeof THREE.MeshStandardMaterial>,
					x = 0,
					y = 0,
					z = 0,
				) => {
					const mesh = new THREE.Mesh(geometry, material);
					mesh.position.set(x, y, z);
					return mesh;
				};
				const instanceScratch = new THREE.Object3D();
				const makeStaticInstances = (
					geometry: (typeof miniGeometries)[keyof typeof miniGeometries],
					material: InstanceType<typeof THREE.Material>,
					count: number,
					configure: (instance: InstanceType<typeof THREE.Object3D>, index: number) => void,
					castShadow = false,
				) => {
					const instances = new THREE.InstancedMesh(geometry, material, count);
					for (let index = 0; index < count; index += 1) {
						instanceScratch.position.set(0, 0, 0);
						instanceScratch.rotation.set(0, 0, 0);
						instanceScratch.scale.set(1, 1, 1);
						configure(instanceScratch, index);
						instanceScratch.updateMatrix();
						instances.setMatrixAt(index, instanceScratch.matrix);
					}
					instances.instanceMatrix.setUsage(THREE.StaticDrawUsage);
					instances.instanceMatrix.needsUpdate = true;
					instances.computeBoundingSphere();
					instances.castShadow = castShadow;
					return instances;
				};


				const addMiniLabel = (
					group: InstanceType<typeof THREE.Group>,
					layer: string,
					text: string,
					meta: string,
					variant = '',
					y = 0,
				) => {
					const element = document.createElement('span');
					element.className = `foundation-mini-label ${variant}`.trim();
					element.dataset.layer = layer;
					const sample = document.createElement('strong');
					sample.textContent = text;
					element.append(sample);
					if (meta) {
						const detail = document.createElement('small');
						detail.textContent = meta;
						element.append(detail);
					}
					element.style.opacity = '0';
					const label = new CSS2DObject(element);
					label.position.set(0, y, 0.09);
					group.add(label);
					return element;
				};

				const makeRiseItem = (kind: MiniKind, layerIndex: number, itemIndex: number) => {
					const group = new THREE.Group();
					const palette = risePalettes[layerIndex];
					const labels: HTMLElement[] = [];
					const layerKey = LAYERS[layerIndex].key;

					switch (kind) {
						case 'swatches': {
							const swatches = [
								{ name: 'EOS YELLOW', hex: '#FFCC00', color: '#ffcc00', ink: '#111113' },
								{ name: 'ERROR', hex: '#E7000B', color: '#e7000b', ink: '#f4f4f5' },
								{ name: 'INFO', hex: '#007595', color: '#007595', ink: '#f4f4f5' },
								{ name: 'SUCCESS', hex: '#008236', color: '#008236', ink: '#f4f4f5' },
								{ name: 'INK', hex: '#E4E4E7', color: '#e4e4e7', ink: '#111113' },
								{ name: 'SLATE', hex: '#52525B', color: '#52525b', ink: '#f4f4f5' },
								{ name: 'PAPER', hex: '#0F0F12', color: '#0f0f12', ink: '#f4f4f5' },
							] as const;
							const leaves = swatches.map((swatch, index) => {
								const leaf = new THREE.Group();
								const surface = new THREE.Mesh(miniGeometries.tokenSwatch, makeTokenSurface(swatch.color, 0.34));
								surface.position.x = 0.5;
								surface.castShadow = true;
								leaf.add(surface);
								const printMaterial = makeTokenPrint(512, 140, (context, width, height) => {
									context.fillStyle = swatch.ink;
									context.textBaseline = 'middle';
									context.font = '700 31px ui-sans-serif, sans-serif';
									context.fillText(swatch.name, 20, height * 0.48);
									context.globalAlpha = 0.72;
									context.font = '500 23px ui-monospace, monospace';
									context.textAlign = 'right';
									context.fillText(swatch.hex, width - 18, height * 0.5);
								});
								const print = new THREE.Mesh(miniGeometries.tokenSwatchPrint, printMaterial);
								print.position.set(0.56, 0, 0.021);
								leaf.add(print);
								leaf.position.z = index * 0.012;
								leaf.userData.restRotation = -0.51 + index * 0.17;
								group.add(leaf);
								return leaf;
							});
							const pin = new THREE.Mesh(miniGeometries.avatar, makeTokenSurface('#09090b', 0.25));
							pin.rotation.x = Math.PI / 2;
							pin.scale.set(0.2, 0.28, 0.2);
							pin.position.set(0.06, 0, 0.14);
							group.add(pin);
							group.userData.swatches = leaves;
							break;
						}
						case 'ruler': {
							const bodyMaterial = makeTokenSurface('#ffcc00', 0.32);
							bodyMaterial.emissive.set('#ffcc00');
							bodyMaterial.emissiveIntensity = 0;
							const faceMaterial = makeTokenSurface('#eebc00', 0.46);
							const inkMaterial = makeTokenSurface('#111113', 0.6);
							const metalMaterial = makeTokenSurface('#8a6b00', 0.3);
							metalMaterial.metalness = 0.52;

							const body = new THREE.Mesh(miniGeometries.rulerBody, bodyMaterial);
							body.castShadow = true;
							group.add(body);

							const face = new THREE.Mesh(miniGeometries.rulerFace, faceMaterial);
							face.position.set(0.035, 0, 0.052);
							group.add(face);

							const lowerRail = new THREE.Mesh(miniGeometries.rulerRail, inkMaterial);
							lowerRail.position.set(0.035, -0.124, 0.057);
							group.add(lowerRail);

							const ticks = makeStaticInstances(
								miniGeometries.rulerTick,
								inkMaterial,
								25,
								(tick, measurement) => {
									const isMajor = measurement % 4 === 0;
									const isMedium = measurement % 2 === 0;
									const tickScale = isMajor ? 1 : isMedium ? 0.72 : 0.45;
									tick.scale.y = tickScale;
									tick.position.set(
										-0.665 + (measurement / 24) * 1.42,
										0.101 - 0.045 * tickScale,
										0.074,
									);
								},
							);
							group.add(ticks);

							const printMaterial = makeTokenPrint(960, 110, (context, width, height) => {
								context.fillStyle = '#111113';
								context.textAlign = 'center';
								context.textBaseline = 'middle';
								context.font = '700 34px ui-monospace, monospace';
								for (let measurement = 0; measurement <= 24; measurement += 4) {
									const x = 34 + (measurement / 24) * (width - 68);
									context.fillText(String(measurement), x, height * 0.56);
								}
								context.textAlign = 'right';
								context.font = '700 19px ui-monospace, monospace';
								context.fillText('SPACING · PX', width - 12, height * 0.88);
							});
							const print = new THREE.Mesh(miniGeometries.rulerPrint, printMaterial);
							print.position.set(0.035, -0.034, 0.075);
							group.add(print);

							const endCap = new THREE.Mesh(miniGeometries.rulerEndCap, metalMaterial);
							endCap.position.x = 0.822;
							endCap.castShadow = true;
							group.add(endCap);

							const hole = new THREE.Mesh(miniGeometries.rulerHole, inkMaterial);
							hole.rotation.x = Math.PI / 2;
							hole.position.set(-0.774, -0.018, 0.058);
							group.add(hole);
							const holeRing = new THREE.Mesh(miniGeometries.rulerHoleRing, metalMaterial);
							holeRing.position.set(-0.774, -0.018, 0.069);
							group.add(holeRing);

							group.userData.rulerGlow = [bodyMaterial];
							break;
						}
						case 'typography': {
							const specimens = [
								{ name: 'BRICOLAGE', weight: 'Display 720', font: '700 158px Bricolage Grotesque, sans-serif' },
								{ name: 'BRICOLAGE', weight: 'Body 400', font: '400 150px Bricolage Grotesque, sans-serif' },
								{ name: 'IBM PLEX MONO', weight: 'Data 500', font: '500 136px IBM Plex Mono, monospace' },
								{ name: 'BRICOLAGE', weight: 'Caption 600', font: '600 144px Bricolage Grotesque, sans-serif' },
							] as const;
							const sheets = specimens.map((specimen, index) => {
								const sheet = new THREE.Group();
								const edge = new THREE.Mesh(
									miniGeometries.tokenSheetEdge,
									makeTokenSurface(index % 2 === 0 ? '#e4e4e7' : '#d4d4d8', 0.88),
								);
								edge.castShadow = true;
								sheet.add(edge);
								const printMaterial = makeTokenPrint(640, 420, (context, width, height) => {
									context.fillStyle = '#111113';
									context.textBaseline = 'alphabetic';
									context.font = specimen.font;
									context.fillText('Aa', 24, 176);
									context.font = '700 29px ui-sans-serif, sans-serif';
									context.fillText(specimen.name, 290, 55);
									context.fillStyle = '#52525b';
									context.font = '500 23px ui-monospace, monospace';
									context.fillText(specimen.weight, 290, 92);
									context.strokeStyle = 'rgba(17, 17, 19, 0.15)';
									context.lineWidth = 2;
									for (let y = 220; y <= height - 28; y += 28) {
										context.beginPath();
										context.moveTo(24, y);
										context.lineTo(width - 24, y);
										context.stroke();
									}
									context.fillStyle = '#3f3f46';
									context.font = '400 18px ui-sans-serif, sans-serif';
									context.fillText('Build once. Compose with intent.', 26, 246);
									context.fillText('Spacing, rhythm, hierarchy, voice.', 26, 302);
									context.fillText('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26, 358);
								});
								const print = new THREE.Mesh(miniGeometries.tokenSheetPrint, printMaterial);
								print.position.z = 0.016;
								sheet.add(print);
								sheet.position.set((index - 1.5) * 0.105, (index % 2) * 0.075, index * 0.055);
								sheet.rotation.set(-0.06 + index * 0.018, (index - 1.5) * 0.055, -0.16 + index * 0.105);
								sheet.userData.baseRotation = sheet.rotation.clone();
								group.add(sheet);
								return sheet;
							});
							group.userData.sheets = sheets;
							break;
						}
						case 'wind': {
							const foundation = new THREE.Mesh(
								miniGeometries.turbineFoundation,
								windMaterials.foundation,
							);
							foundation.position.y = -0.42;
							foundation.castShadow = true;
							foundation.receiveShadow = true;
							group.add(foundation);
							const feet = makeStaticInstances(
								miniGeometries.turbineFoot,
								windMaterials.foundation,
								4,
								(foot, index) => {
									foot.position.set(index < 2 ? -0.27 : 0.27, -0.497, index % 2 === 0 ? -0.135 : 0.135);
								},
								true,
							);
							group.add(feet);


							const foundationInset = new THREE.Mesh(
								miniGeometries.turbineFoundationInset,
								windMaterials.baseInset,
							);
							foundationInset.position.set(0, -0.351, 0.012);
							foundationInset.receiveShadow = true;
							group.add(foundationInset);

							const flange = new THREE.Mesh(miniGeometries.turbineFlange, windMaterials.joint);
							flange.position.y = -0.315;
							flange.castShadow = true;
							group.add(flange);
							[windMaterials.brass, windMaterials.copper].forEach((material, materialIndex) => {
								const bolts = makeStaticInstances(
									miniGeometries.turbineBolt,
									material,
									4,
									(bolt, index) => {
										const boltAngle = ((index * 2 + materialIndex) / 8) * Math.PI * 2;
										bolt.position.set(
											Math.cos(boltAngle) * 0.135,
											-0.27,
											Math.sin(boltAngle) * 0.135,
										);
									},
								);
								group.add(bolts);
							});

							const tower = new THREE.Mesh(miniGeometries.turbineTower, windMaterials.tower);
							tower.position.y = 0.055;
							tower.castShadow = true;
							tower.receiveShadow = true;
							group.add(tower);

							const accessPanel = new THREE.Mesh(
								miniGeometries.turbineAccessPanel,
								windMaterials.panel,
							);
							accessPanel.position.set(0, -0.145, 0.13);
							group.add(accessPanel);
							const doorHandle = new THREE.Mesh(
								miniGeometries.turbineVent,
								windMaterials.brass,
							);
							doorHandle.scale.set(0.22, 1, 0.7);
							doorHandle.position.set(0.028, -0.13, 0.143);
							group.add(doorHandle);
							const warning = new THREE.Mesh(
								miniGeometries.batteryWarning,
								windMaterials.yellow,
							);
							warning.scale.setScalar(0.23);
							warning.position.set(-0.025, -0.185, 0.144);
							group.add(warning);

							const yawRing = new THREE.Mesh(
								miniGeometries.turbineYawRing,
								windMaterials.joint,
							);
							yawRing.position.y = 0.407;
							yawRing.castShadow = true;
							group.add(yawRing);
							const yawBand = new THREE.Mesh(
								miniGeometries.turbineYawRing,
								windMaterials.brass,
							);
							yawBand.scale.set(1.02, 0.2, 1.02);
							yawBand.position.y = 0.43;
							group.add(yawBand);

							const nacelle = new THREE.Mesh(
								miniGeometries.turbineNacelle,
								windMaterials.nacelle,
							);
							nacelle.position.set(0.055, 0.46, 0.02);
							nacelle.castShadow = true;
							group.add(nacelle);
							const nacellePanel = new THREE.Mesh(
								miniGeometries.turbineNacellePanel,
								windMaterials.panel,
							);
							nacellePanel.position.set(0.095, 0.46, 0.137);
							group.add(nacellePanel);
							const vents = makeStaticInstances(
								miniGeometries.turbineVent,
								windMaterials.joint,
								3,
								(vent, index) => {
									vent.position.set(0.11, 0.438 + index * 0.022, 0.148);
								},
							);
							group.add(vents);

							const generator = new THREE.Mesh(
								miniGeometries.turbineGenerator,
								windMaterials.joint,
							);
							generator.rotation.x = Math.PI / 2;
							generator.position.set(-0.095, 0.46, 0.125);
							generator.castShadow = true;
							group.add(generator);
							const shaft = new THREE.Mesh(
								miniGeometries.turbineShaft,
								windMaterials.copper,
							);
							shaft.rotation.x = Math.PI / 2;
							shaft.position.set(-0.095, 0.46, 0.205);
							group.add(shaft);

							const rotor = new THREE.Group();
							rotor.position.set(-0.095, 0.46, 0.245);
							const bladeRoots = makeStaticInstances(
								miniGeometries.turbineBladeRoot,
								windMaterials.joint,
								3,
								(bladeRoot, index) => {
									const angle = (index * Math.PI * 2) / 3;
									bladeRoot.position.set(-Math.sin(angle) * 0.045, Math.cos(angle) * 0.045, 0);
									bladeRoot.rotation.z = angle;
								},
								true,
							);
							rotor.add(bladeRoots);
							const blades = makeStaticInstances(
								miniGeometries.turbineBlade,
								windMaterials.blade,
								3,
								(blade, index) => {
									blade.rotation.z = (index * Math.PI * 2) / 3;
								},
								true,
							);
							rotor.add(blades);
							const hub = new THREE.Mesh(miniGeometries.turbineHub, windMaterials.nacelle);
							hub.scale.set(1, 1, 0.82);
							hub.castShadow = true;
							rotor.add(hub);
							const hubCap = new THREE.Mesh(
								miniGeometries.turbineHubCap,
								windMaterials.hubCap,
							);
							hubCap.rotation.x = Math.PI / 2;
							hubCap.position.z = 0.1;
							hubCap.castShadow = true;
							rotor.add(hubCap);
							const indicator = new THREE.Mesh(
								miniGeometries.turbineIndicator,
								windMaterials.cyan,
							);
							indicator.position.z = 0.092;
							rotor.add(indicator);
							group.add(rotor);
							group.userData.windRotor = rotor;
							group.userData.windIndicator = indicator;
							break;
						}
						case 'solar': {
							const foundation = new THREE.Mesh(
								miniGeometries.solarFoundation,
								solarMaterials.foundation,
							);
							foundation.position.y = -0.41;
							foundation.receiveShadow = true;
							group.add(foundation);

							const solarMountXs = [-0.32, 0.32] as const;
							const solarFeet = makeStaticInstances(
								miniGeometries.solarFoot,
								solarMaterials.foundation,
								2,
								(foot, index) => foot.position.set(solarMountXs[index], -0.37, -0.075),
							);
							group.add(solarFeet);
							const uprights = makeStaticInstances(
								miniGeometries.solarSupportBeam,
								solarMaterials.support,
								2,
								(upright, index) => {
									upright.scale.y = 0.74;
									upright.position.set(solarMountXs[index], -0.19, -0.09);
									upright.rotation.set(-0.12, 0, index === 0 ? -0.16 : 0.16);
								},
							);
							group.add(uprights);
							const rearBraces = makeStaticInstances(
								miniGeometries.solarSupportBeam,
								solarMaterials.support,
								2,
								(rearBrace, index) => {
									rearBrace.scale.y = 0.62;
									rearBrace.position.set(solarMountXs[index], -0.21, 0.04);
									rearBrace.rotation.x = 0.58;
								},
							);
							group.add(rearBraces);
							const pivots = makeStaticInstances(
								miniGeometries.solarPivot,
								solarMaterials.brass,
								2,
								(pivot, index) => {
									pivot.rotation.x = Math.PI / 2;
									pivot.position.set(solarMountXs[index], -0.055, -0.02);
								},
							);
							group.add(pivots);
							const fasteners = makeStaticInstances(
								miniGeometries.solarFastener,
								solarMaterials.copper,
								2,
								(fastener, index) => {
									fastener.rotation.x = Math.PI / 2;
									fastener.position.set(solarMountXs[index], -0.055, 0.022);
								},
							);
							group.add(fasteners);
							const crossBrace = new THREE.Mesh(
								miniGeometries.solarCrossBrace,
								solarMaterials.support,
							);
							crossBrace.position.set(0, -0.34, -0.08);
							group.add(crossBrace);

							const panel = new THREE.Group();
							panel.position.set(0, 0.12, 0.045);
							panel.rotation.x = -Math.PI / 7;
							const outerFrame = new THREE.Mesh(
								miniGeometries.solarOuterFrame,
								solarMaterials.frame,
							);
							outerFrame.castShadow = true;
							panel.add(outerFrame);
							const backing = new THREE.Mesh(
								miniGeometries.solarBacking,
								solarMaterials.backing,
							);
							backing.position.z = 0.052;
							panel.add(backing);

							const cellMaterials = [
								solarMaterials.cellA,
								solarMaterials.cellB,
								solarMaterials.cellC,
							] as const;
							const solarCellPositions: Array<Array<readonly [number, number]>> = [[], [], []];
							for (let row = 0; row < 4; row += 1) {
								for (let column = 0; column < 8; column += 1) {
									const materialIndex = (row * 5 + column * 3) % cellMaterials.length;
									solarCellPositions[materialIndex].push([
										(column - 3.5) * 0.146,
										(row - 1.5) * 0.15,
									]);
								}
							}
							cellMaterials.forEach((material, materialIndex) => {
								const positions = solarCellPositions[materialIndex];
								const cells = makeStaticInstances(
									miniGeometries.solarCell,
									material,
									positions.length,
									(cell, index) => cell.position.set(positions[index][0], positions[index][1], 0.078),
								);
								panel.add(cells);
							});

							const glass = new THREE.Mesh(
								miniGeometries.solarGlass,
								solarMaterials.glass,
							);
							glass.position.z = 0.094;
							panel.add(glass);
							const clips = makeStaticInstances(
								miniGeometries.solarMountClip,
								solarMaterials.brass,
								4,
								(clip, index) => {
									clip.position.set(index < 2 ? -0.58 : 0.58, index % 2 === 0 ? -0.3 : 0.3, 0.094);
								},
							);
							panel.add(clips);

							const junctionBox = new THREE.Mesh(
								miniGeometries.solarJunctionBox,
								solarMaterials.foundation,
							);
							junctionBox.position.set(0.34, -0.255, -0.075);
							panel.add(junctionBox);
							const connectors = makeStaticInstances(
								miniGeometries.solarConnector,
								solarMaterials.copper,
								2,
								(connector, index) => {
									connector.position.set(0.34 + (index === 0 ? -0.045 : 0.045), -0.35, -0.075);
								},
							);
							panel.add(connectors);

							const reflection = new THREE.Mesh(
								miniGeometries.solarReflection,
								solarMaterials.reflection,
							);
							reflection.position.set(-0.52, 0, 0.105);
							reflection.rotation.z = -0.16;
							panel.add(reflection);
							const indicator = new THREE.Mesh(
								miniGeometries.solarIndicator,
								solarMaterials.cyan,
							);
							indicator.position.set(0.53, -0.255, 0.105);
							panel.add(indicator);
							group.add(panel);

							const cableCurve = new THREE.CatmullRomCurve3([
								new THREE.Vector3(0.44, -0.125, 0.02),
								new THREE.Vector3(0.45, -0.22, 0.075),
								new THREE.Vector3(0.38, -0.31, 0.12),
								new THREE.Vector3(0.3, -0.37, 0.14),
							]);
							const cableGeometry = new THREE.TubeGeometry(cableCurve, 24, 0.012, 6, false);
							solarCableGeometries.push(cableGeometry);
							group.add(new THREE.Mesh(cableGeometry, solarMaterials.rubber));
							const cableTerminal = new THREE.Mesh(
								miniGeometries.solarConnector,
								solarMaterials.copper,
							);
							cableTerminal.rotation.x = Math.PI / 2;
							cableTerminal.position.set(0.3, -0.37, 0.155);
							group.add(cableTerminal);

							const warning = new THREE.Mesh(
								miniGeometries.batteryWarning,
								solarMaterials.yellow,
							);
							warning.scale.setScalar(0.34);
							warning.position.set(-0.33, -0.355, 0.248);
							group.add(warning);
							const warningBolt = new THREE.Mesh(
								miniGeometries.batteryBolt,
								solarMaterials.foundation,
							);
							warningBolt.scale.setScalar(0.34);
							warningBolt.position.set(-0.33, -0.355, 0.252);
							group.add(warningBolt);

							group.userData.solarReflection = reflection;
							group.userData.solarIndicator = indicator;
							break;
						}
						case 'battery': {
							const cabinet = new THREE.Mesh(miniGeometries.batteryCase, batteryMaterials.casing);
							cabinet.castShadow = true;
							group.add(cabinet);

							const lid = new THREE.Mesh(miniGeometries.batteryLid, batteryMaterials.lid);
							lid.position.y = 0.338;
							lid.castShadow = true;
							group.add(lid);

							const frontPanel = new THREE.Mesh(miniGeometries.batteryPanel, batteryMaterials.panel);
							frontPanel.position.set(0, -0.005, 0.168);
							group.add(frontPanel);

							const moduleXs = [-0.246, -0.082, 0.082, 0.246] as const;
							const modules = makeStaticInstances(
								miniGeometries.batteryModule,
								batteryMaterials.module,
								moduleXs.length,
								(module, index) => module.position.set(moduleXs[index], 0.065, 0.202),
							);
							group.add(modules);
							const moduleRails = makeStaticInstances(
								miniGeometries.batteryModuleRail,
								batteryMaterials.rubber,
								moduleXs.length * 3,
								(rail, index) => {
									rail.position.set(moduleXs[Math.floor(index / 3)], 0.001 + (index % 3) * 0.064, 0.22);
								},
							);
							group.add(moduleRails);
							const activeModuleStatuses = makeStaticInstances(
								miniGeometries.batteryModuleRail,
								batteryMaterials.cyan,
								3,
								(status, index) => {
									status.scale.x = 0.54;
									status.position.set(moduleXs[index], 0.158, 0.222);
								},
							);
							group.add(activeModuleStatuses);
							const inactiveModuleStatus = new THREE.Mesh(
								miniGeometries.batteryModuleRail,
								batteryMaterials.cyanOff,
							);
							inactiveModuleStatus.scale.x = 0.54;
							inactiveModuleStatus.position.set(moduleXs[3], 0.158, 0.222);
							group.add(inactiveModuleStatus);

							const terminalXs = [-0.245, 0.245] as const;
							const terminalMounts = makeStaticInstances(
								miniGeometries.batteryTerminalMount,
								batteryMaterials.rubber,
								2,
								(mount, index) => mount.position.set(terminalXs[index], 0.385, -0.015),
							);
							group.add(terminalMounts);
							terminalXs.forEach((x, index) => {

								const terminal = new THREE.Mesh(
									miniGeometries.batteryTerminal,
									index === 0 ? batteryMaterials.copper : batteryMaterials.brass,
								);
								terminal.position.set(x, 0.455, -0.015);
								terminal.castShadow = true;
								group.add(terminal);

								const markMaterial = index === 0 ? batteryMaterials.casing : batteryMaterials.panel;
								const minus = new THREE.Mesh(miniGeometries.batteryMark, markMaterial);
								minus.rotation.x = -Math.PI / 2;
								minus.position.set(x, 0.515, -0.015);
								group.add(minus);
								if (index === 1) {
									const plus = new THREE.Mesh(miniGeometries.batteryMark, markMaterial);
									plus.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
									plus.position.copy(minus.position);
									group.add(plus);
								}

								const frontMarkMaterial =
									index === 0 ? batteryMaterials.copper : batteryMaterials.brass;
								const frontMinus = new THREE.Mesh(
									miniGeometries.batteryMark,
									frontMarkMaterial,
								);
								frontMinus.position.set(x, 0.267, 0.192);
								group.add(frontMinus);
								if (index === 1) {
									const frontPlus = new THREE.Mesh(
										miniGeometries.batteryMark,
										frontMarkMaterial,
									);
									frontPlus.rotation.z = Math.PI / 2;
									frontPlus.position.copy(frontMinus.position);
									group.add(frontPlus);
								}
							});

							const handle = new THREE.Group();
							const handleMounts = makeStaticInstances(
								miniGeometries.batteryFastener,
								batteryMaterials.copper,
								2,
								(mount, index) => mount.position.set(index === 0 ? -0.2 : 0.2, 0.378, -0.105),
							);
							handle.add(handleMounts);
							const handlePosts = makeStaticInstances(
								miniGeometries.batteryHandlePost,
								batteryMaterials.rubber,
								2,
								(post, index) => {
									post.position.set(index === 0 ? -0.2 : 0.2, 0.416, -0.105);
									post.rotation.z = index === 0 ? -0.18 : 0.18;
								},
							);
							handle.add(handlePosts);
							const grip = new THREE.Mesh(miniGeometries.batteryHandleGrip, batteryMaterials.rubber);
							grip.position.set(0, 0.475, -0.105);
							handle.add(grip);
							group.add(handle);

							const batteryFeet = makeStaticInstances(
								miniGeometries.batteryFoot,
								batteryMaterials.rubber,
								2,
								(foot, index) => foot.position.set(index === 0 ? -0.29 : 0.29, -0.342, 0.015),
							);
							group.add(batteryFeet);

							const batteryVents = makeStaticInstances(
								miniGeometries.batteryVent,
								batteryMaterials.rubber,
								4,
								(vent, index) => {
									vent.position.set(0.21 + index * 0.042, 0.267, 0.18);
									vent.rotation.z = Math.PI / 2;
								},
							);
							group.add(batteryVents);

							const batteryFasteners = makeStaticInstances(
								miniGeometries.batteryFastener,
								batteryMaterials.copper,
								4,
								(fastener, index) => {
									fastener.rotation.x = Math.PI / 2;
									fastener.position.set(index < 2 ? -0.322 : 0.322, index % 2 === 0 ? -0.174 : 0.174, 0.199);
								},
							);
							group.add(batteryFasteners);

							const display = new THREE.Mesh(miniGeometries.batteryDisplay, batteryMaterials.rubber);
							display.position.set(-0.075, -0.235, 0.202);
							group.add(display);
							const chargeSegments: InstanceType<typeof THREE.Mesh>[] = [];
							for (let segmentIndex = 0; segmentIndex < 5; segmentIndex += 1) {
								const segment = new THREE.Mesh(
									miniGeometries.batteryDisplaySegment,
									segmentIndex < 3 ? batteryMaterials.cyan : batteryMaterials.cyanOff,
								);
								segment.position.set(-0.22 + segmentIndex * 0.073, -0.235, 0.225);
								group.add(segment);
								chargeSegments.push(segment);
							}

							const labelPlate = new THREE.Mesh(
								miniGeometries.batteryLabelPlate,
								batteryMaterials.lid,
							);
							labelPlate.position.set(0.254, -0.238, 0.204);
							group.add(labelPlate);
							const labelLines = makeStaticInstances(
								miniGeometries.batteryLabelLine,
								batteryMaterials.copper,
								2,
								(labelLine, index) => {
									const lineY = index === 0 ? -0.012 : 0.012;
									labelLine.position.set(0.254, -0.238 + lineY, 0.215);
									labelLine.scale.x = lineY < 0 ? 0.68 : 1;
								},
							);
							group.add(labelLines);

							const warning = new THREE.Mesh(miniGeometries.batteryWarning, batteryMaterials.yellow);
							warning.position.set(0.255, -0.09, 0.202);
							group.add(warning);
							const warningBolt = new THREE.Mesh(miniGeometries.batteryBolt, batteryMaterials.casing);
							warningBolt.position.set(0.255, -0.09, 0.214);
							group.add(warningBolt);

							group.userData.batteryChargeSegments = chargeSegments;
							break;
						}
						case 'microgrid': {
							const assemblyParts: MicrogridAssemblyPart[] = [];
							const registerPart = (object: InstanceType<typeof THREE.Object3D>, delay: number) => {
								group.add(object);
								assemblyParts.push({
									object,
									restPosition: object.position.clone(),
									restScale: object.scale.clone(),
									delay,
								});
							};
							const addShadow = (
								parent: InstanceType<typeof THREE.Object3D>,
								width: number,
								x = 0,
							) => {
								const shadow = new THREE.Sprite(microgridShadowMaterial);
								shadow.scale.set(width, 0.18, 1);
								shadow.position.set(x, -0.004, -0.025);
								parent.add(shadow);
							};
							const addFastener = (
								parent: InstanceType<typeof THREE.Object3D>,
								x: number,
								y: number,
								z: number,
								material = microgridMaterials.brass,
							) => {
								const fastener = new THREE.Mesh(miniGeometries.microFastener, material);
								fastener.rotation.x = Math.PI / 2;
								fastener.position.set(x, y, z);
								parent.add(fastener);
							};

							const platform = new THREE.Group();
							const platformSlab = new THREE.Mesh(
								miniGeometries.microPlatform,
								microgridMaterials.foundation,
							);
							platformSlab.position.y = -0.36;
							platformSlab.receiveShadow = true;
							platform.add(platformSlab);
							const platformInset = new THREE.Mesh(
								miniGeometries.microPlatformInset,
								microgridMaterials.deck,
							);
							platformInset.position.set(0, -0.288, 0.018);
							platform.add(platformInset);
							([-0.26, 0.26] as const).forEach((z) => {
								const rail = new THREE.Mesh(
									miniGeometries.microPlatformRail,
									z > 0 ? microgridMaterials.copper : microgridMaterials.frame,
								);
								rail.position.set(0, -0.258, z);
								platform.add(rail);
							});
							const equipmentPadXs = [-0.9, -0.48, 0.02, 0.47, 0.94] as const;
							const equipmentPads = makeStaticInstances(
								miniGeometries.microEquipmentPad,
								microgridMaterials.housing,
								equipmentPadXs.length,
								(pad, index) => pad.position.set(equipmentPadXs[index], -0.252, 0.02),
							);
							platform.add(equipmentPads);
							const platformFastenerXs = [-0.98, -0.6, -0.2, 0.2, 0.6, 0.98] as const;
							const platformFasteners = makeStaticInstances(
								miniGeometries.microFastener,
								microgridMaterials.brass,
								platformFastenerXs.length,
								(fastener, index) => {
									fastener.rotation.x = Math.PI / 2;
									fastener.position.set(platformFastenerXs[index], -0.242, 0.32);
								},
							);
							platform.add(platformFasteners);
							registerPart(platform, 0.02);

							const wind = new THREE.Group();
							wind.position.set(-0.9, -0.255, 0.04);
							addShadow(wind, 0.36);
							const windFlange = new THREE.Mesh(
								miniGeometries.microWindFlange,
								microgridMaterials.frame,
							);
							windFlange.position.y = 0.025;
							wind.add(windFlange);
							const windFlangeRing = new THREE.Mesh(
								miniGeometries.microWindFlange,
								microgridMaterials.brass,
							);
							windFlangeRing.scale.set(0.72, 0.24, 0.72);
							windFlangeRing.position.y = 0.065;
							wind.add(windFlangeRing);
							const windTower = new THREE.Mesh(
								miniGeometries.microWindTower,
								microgridMaterials.offWhite,
							);
							windTower.position.y = 0.35;
							windTower.castShadow = true;
							wind.add(windTower);
							const nacelle = new THREE.Mesh(
								miniGeometries.microWindNacelle,
								microgridMaterials.housing,
							);
							nacelle.position.set(0.025, 0.67, 0.018);
							nacelle.castShadow = true;
							wind.add(nacelle);
							const shaft = new THREE.Mesh(
								miniGeometries.microWindShaft,
								microgridMaterials.brass,
							);
							shaft.rotation.x = Math.PI / 2;
							shaft.position.set(-0.01, 0.67, 0.105);
							wind.add(shaft);
							const windRotor = new THREE.Group();
							windRotor.position.set(-0.01, 0.67, 0.15);
							const windBlades = makeStaticInstances(
								miniGeometries.windBlade,
								microgridMaterials.offWhite,
								3,
								(blade, index) => {
									blade.scale.setScalar(0.36);
									blade.rotation.z = (index * Math.PI * 2) / 3;
								},
								true,
							);
							windRotor.add(windBlades);
							const hub = new THREE.Mesh(
								miniGeometries.microWindHub,
								microgridMaterials.brass,
							);
							hub.rotation.x = Math.PI / 2;
							windRotor.add(hub);
							const hubIndicator = new THREE.Mesh(
								miniGeometries.microIndicator,
								microgridMaterials.cyan,
							);
							hubIndicator.scale.set(0.45, 0.45, 0.45);
							hubIndicator.position.z = 0.042;
							windRotor.add(hubIndicator);
							wind.add(windRotor);
							const windTerminal = new THREE.Mesh(
								miniGeometries.microTerminalBlock,
								microgridMaterials.copper,
							);
							windTerminal.scale.set(0.55, 0.7, 0.7);
							windTerminal.position.set(0.08, 0.1, 0.215);
							wind.add(windTerminal);
							const windEntry = new THREE.Mesh(
								miniGeometries.microCableEntry,
								microgridMaterials.rubber,
							);
							windEntry.rotation.x = Math.PI / 2;
							windEntry.position.set(0.08, 0.1, 0.245);
							wind.add(windEntry);
							registerPart(wind, 0.12);

							const solar = new THREE.Group();
							solar.position.set(-0.47, -0.255, 0.06);
							addShadow(solar, 0.72);
							[-0.14, 0.14].forEach((panelX) => {
								const panel = new THREE.Group();
								panel.position.set(panelX, 0.21, 0.025);
								panel.rotation.x = -Math.PI / 6;
								const frame = new THREE.Mesh(
									miniGeometries.microSolarFrame,
									microgridMaterials.frame,
								);
								frame.castShadow = true;
								panel.add(frame);
								const backing = new THREE.Mesh(
									miniGeometries.microSolarBack,
									microgridMaterials.solarGlass,
								);
								backing.position.z = 0.022;
								panel.add(backing);
								const cells = makeStaticInstances(
									miniGeometries.microSolarCell,
									microgridMaterials.solarCell,
									15,
									(cell, index) => {
										const row = Math.floor(index / 5);
										const column = index % 5;
										cell.position.set((column - 2) * 0.077, (row - 1) * 0.062, 0.036);
									},
								);
								panel.add(cells);
								const busRails = makeStaticInstances(
									miniGeometries.microSolarRail,
									microgridMaterials.copper,
									2,
									(busRail, index) => busRail.position.set(0, index === 0 ? -0.092 : 0.092, 0.042),
								);
								panel.add(busRails);
								solar.add(panel);
								const supports = makeStaticInstances(
									miniGeometries.microSolarLeg,
									microgridMaterials.frame,
									2,
									(support, index) => {
										const supportX = index === 0 ? -0.125 : 0.125;
										support.scale.y = 0.68;
										support.position.set(panelX + supportX, 0.08, -0.035);
										support.rotation.z = supportX < 0 ? -0.26 : 0.26;
									},
								);
								solar.add(supports);
								const feet = makeStaticInstances(
									miniGeometries.microMountFoot,
									microgridMaterials.foundation,
									2,
									(foot, index) => {
										const supportX = index === 0 ? -0.125 : 0.125;
										foot.scale.set(0.48, 0.5, 0.58);
										foot.position.set(panelX + supportX, 0.012, -0.035);
									},
								);
								solar.add(feet);
							});
							const solarCombiner = new THREE.Mesh(
								miniGeometries.microTerminalBlock,
								microgridMaterials.housing,
							);
							solarCombiner.position.set(0.3, 0.1, 0.195);
							solar.add(solarCombiner);
							const solarTerminal = new THREE.Mesh(
								miniGeometries.microCableEntry,
								microgridMaterials.copper,
							);
							solarTerminal.rotation.x = Math.PI / 2;
							solarTerminal.position.set(0.3, 0.1, 0.225);
							solar.add(solarTerminal);
							registerPart(solar, 0.2);

							const inverter = new THREE.Group();
							inverter.position.set(0.02, -0.255, 0.08);
							addShadow(inverter, 0.5);
							const inverterBody = new THREE.Mesh(
								miniGeometries.microInverterCase,
								microgridMaterials.housing,
							);
							inverterBody.position.y = 0.22;
							inverterBody.castShadow = true;
							inverter.add(inverterBody);
							const inverterDoor = new THREE.Mesh(
								miniGeometries.microInverterDoor,
								microgridMaterials.panel,
							);
							inverterDoor.position.set(0, 0.22, 0.13);
							inverter.add(inverterDoor);
							const inverterFasteners = makeStaticInstances(
								miniGeometries.microFastener,
								microgridMaterials.brass,
								4,
								(fastener, index) => {
									fastener.rotation.x = Math.PI / 2;
									fastener.position.set(index < 2 ? -0.17 : 0.17, 0.22 + (index % 2 === 0 ? -0.12 : 0.12), 0.145);
								},
							);
							inverter.add(inverterFasteners);
							const inverterVents = makeStaticInstances(
								miniGeometries.microVent,
								microgridMaterials.rubber,
								3,
								(vent, index) => vent.position.set(-0.095, 0.11 + index * 0.035, 0.149),
							);
							inverter.add(inverterVents);
							const inverterHandle = new THREE.Mesh(
								miniGeometries.microHandle,
								microgridMaterials.brass,
							);
							inverterHandle.position.set(0.15, 0.22, 0.15);
							inverter.add(inverterHandle);
							const activeStatuses = makeStaticInstances(
								miniGeometries.microIndicator,
								microgridMaterials.cyan,
								2,
								(status, index) => {
									status.scale.set(0.48, 0.7, 0.7);
									status.position.set(-0.045 + index * 0.045, 0.345, 0.149);
								},
							);
							inverter.add(activeStatuses);
							const inactiveStatus = new THREE.Mesh(
								miniGeometries.microIndicator,
								microgridMaterials.cyanOff,
							);
							inactiveStatus.scale.set(0.48, 0.7, 0.7);
							inactiveStatus.position.set(0.045, 0.345, 0.149);
							inverter.add(inactiveStatus);
							const inverterWarning = new THREE.Mesh(
								miniGeometries.batteryWarning,
								microgridMaterials.yellow,
							);
							inverterWarning.scale.setScalar(0.42);
							inverterWarning.position.set(0.12, 0.075, 0.148);
							inverter.add(inverterWarning);
							const inverterBolt = new THREE.Mesh(
								miniGeometries.batteryBolt,
								microgridMaterials.housing,
							);
							inverterBolt.scale.setScalar(0.42);
							inverterBolt.position.set(0.12, 0.075, 0.152);
							inverter.add(inverterBolt);
							const inverterTerminalXs = [-0.16, 0.16] as const;
							const inverterTerminals = makeStaticInstances(
								miniGeometries.microTerminalBlock,
								microgridMaterials.copper,
								2,
								(terminal, index) => {
									terminal.scale.set(0.55, 0.7, 0.7);
									terminal.position.set(inverterTerminalXs[index], 0.09, 0.185);
								},
							);
							inverter.add(inverterTerminals);
							const inverterEntries = makeStaticInstances(
								miniGeometries.microCableEntry,
								microgridMaterials.rubber,
								2,
								(entry, index) => {
									entry.rotation.x = Math.PI / 2;
									entry.position.set(inverterTerminalXs[index], 0.09, 0.216);
								},
							);
							inverter.add(inverterEntries);
							const inverterFeet = makeStaticInstances(
								miniGeometries.microMountFoot,
								microgridMaterials.foundation,
								2,
								(foot, index) => {
									foot.scale.set(0.55, 0.55, 0.72);
									foot.position.set(index === 0 ? -0.15 : 0.15, 0.012, 0);
								},
							);
							inverter.add(inverterFeet);
							registerPart(inverter, 0.3);

							const substation = new THREE.Group();
							substation.position.set(0.47, -0.255, 0.04);
							addShadow(substation, 0.62);
							const transformer = new THREE.Mesh(
								miniGeometries.microTransformer,
								microgridMaterials.housing,
							);
							transformer.position.set(-0.13, 0.13, 0.015);
							transformer.castShadow = true;
							substation.add(transformer);
							const coolingFins = makeStaticInstances(
								miniGeometries.microCoolingFin,
								microgridMaterials.frame,
								6,
								(fin, index) => fin.position.set(-0.215 + index * 0.034, 0.13, 0.116),
							);
							substation.add(coolingFins);
							const transformerIndicator = new THREE.Mesh(
								miniGeometries.microIndicator,
								microgridMaterials.cyan,
							);
							transformerIndicator.position.set(-0.13, 0.225, 0.119);
							substation.add(transformerIndicator);
							const towerPosts = makeStaticInstances(
								miniGeometries.microTowerLeg,
								microgridMaterials.frame,
								4,
								(post, index) => {
									const column = Math.floor(index / 2);
									post.position.set(column === 0 ? 0.075 : 0.185, 0.3, index % 2 === 0 ? 0 : -0.09);
									post.rotation.z = column === 0 ? -0.14 : 0.14;
								},
							);
							substation.add(towerPosts);
							const crossarms = makeStaticInstances(
								miniGeometries.microCrossarm,
								microgridMaterials.frame,
								2,
								(crossarm, index) => {
									crossarm.scale.x = index === 0 ? 0.78 : 1;
									crossarm.position.set(0.13, index === 0 ? 0.32 : 0.48, 0);
								},
							);
							substation.add(crossarms);
							const braces = makeStaticInstances(
								miniGeometries.microPylonBrace,
								microgridMaterials.copper,
								3,
								(brace, index) => {
									brace.position.set(0.13, 0.18 + index * 0.11, 0.012);
									brace.rotation.z = index % 2 === 0 ? 0.58 : -0.58;
								},
							);
							substation.add(braces);
							const insulatorPositions = [-0.04, 0.13, 0.3] as const;
							const insulators = makeStaticInstances(
								miniGeometries.microInsulator,
								microgridMaterials.insulator,
								insulatorPositions.length,
								(insulator, index) => insulator.position.set(insulatorPositions[index], 0.44, 0),
							);
							substation.add(insulators);
							const insulatorCaps = makeStaticInstances(
								miniGeometries.microInsulatorCap,
								microgridMaterials.brass,
								insulatorPositions.length,
								(cap, index) => cap.position.set(insulatorPositions[index], 0.408, 0),
							);
							substation.add(insulatorCaps);
							const outputPost = new THREE.Mesh(
								miniGeometries.microTowerLeg,
								microgridMaterials.frame,
							);
							outputPost.scale.y = 0.62;
							outputPost.position.set(0.7, 0.19, -0.1);
							substation.add(outputPost);
							const outputArm = new THREE.Mesh(
								miniGeometries.microCrossarm,
								microgridMaterials.frame,
							);
							outputArm.scale.x = 0.7;
							outputArm.position.set(0.7, 0.37, -0.1);
							substation.add(outputArm);
							([-0.11, 0, 0.11] as const).forEach((z, index) => {
								const start = new THREE.Vector3(insulatorPositions[index], 0.405, z);
								const end = new THREE.Vector3(0.7, 0.34, -0.1 + z);
								const powerCurve = new THREE.CubicBezierCurve3(
									start,
									new THREE.Vector3(start.x + 0.2, 0.33, z),
									new THREE.Vector3(end.x - 0.2, 0.29, -0.1 + z),
									end,
								);
								const powerGeometry = new THREE.TubeGeometry(powerCurve, 24, 0.004, 5, false);
								microgridCableGeometries.push(powerGeometry);
								substation.add(new THREE.Mesh(powerGeometry, microgridMaterials.copper));
								addFastener(substation, end.x, end.y, end.z, microgridMaterials.brass);
							});
							registerPart(substation, 0.4);

							const storage = new THREE.Group();
							storage.position.set(0.92, -0.255, 0.07);
							addShadow(storage, 0.74);
							const batteryCells: InstanceType<typeof THREE.Mesh>[] = [];
							([-0.18, 0.18] as const).forEach((cabinetX, cabinetIndex) => {
								const cabinet = new THREE.Group();
								const body = new THREE.Mesh(
									miniGeometries.microStorageCase,
									microgridMaterials.housing,
								);
								body.position.y = 0.21;
								body.castShadow = true;
								cabinet.add(body);
								const door = new THREE.Mesh(
									miniGeometries.microStorageDoor,
									microgridMaterials.panel,
								);
								door.position.set(0, 0.21, 0.124);
								cabinet.add(door);
								const hinges = makeStaticInstances(
									miniGeometries.microHinge,
									microgridMaterials.brass,
									2,
									(hinge, index) => hinge.position.set(-0.15, 0.07 + index * 0.28, 0.142),
								);
								cabinet.add(hinges);
								const handle = new THREE.Mesh(
									miniGeometries.microHandle,
									microgridMaterials.brass,
								);
								handle.position.set(0.125, 0.21, 0.143);
								cabinet.add(handle);
								const cabinetVents = makeStaticInstances(
									miniGeometries.microVent,
									microgridMaterials.rubber,
									3,
									(vent, index) => vent.position.set(-0.045, 0.105 + index * 0.035, 0.143),
								);
								cabinet.add(cabinetVents);
								for (let segmentIndex = 0; segmentIndex < 3; segmentIndex += 1) {
									const chargeCell = new THREE.Mesh(
										miniGeometries.microBatteryCell,
										segmentIndex < 2 ? microgridMaterials.charge : microgridMaterials.cyanOff,
									);
									chargeCell.position.set(-0.045 + segmentIndex * 0.04, 0.31, 0.143);
									cabinet.add(chargeCell);
									batteryCells.push(chargeCell);
								}
								if (cabinetIndex === 0) {
									const warning = new THREE.Mesh(
										miniGeometries.batteryWarning,
										microgridMaterials.yellow,
									);
									warning.scale.setScalar(0.32);
									warning.position.set(0.095, 0.09, 0.142);
									cabinet.add(warning);
								}
								const cabinetFeet = makeStaticInstances(
									miniGeometries.microMountFoot,
									microgridMaterials.foundation,
									2,
									(foot, index) => {
										foot.scale.set(0.5, 0.52, 0.7);
										foot.position.set(index === 0 ? -0.12 : 0.12, 0.012, 0);
									},
								);
								cabinet.add(cabinetFeet);
								cabinet.position.x = cabinetX;
								storage.add(cabinet);
							});
							const storageTerminal = new THREE.Mesh(
								miniGeometries.microTerminalBlock,
								microgridMaterials.copper,
							);
							storageTerminal.position.set(-0.2, 0.09, 0.18);
							storage.add(storageTerminal);
							const storageEntry = new THREE.Mesh(
								miniGeometries.microCableEntry,
								microgridMaterials.rubber,
							);
							storageEntry.rotation.x = Math.PI / 2;
							storageEntry.position.set(-0.2, 0.09, 0.211);
							storage.add(storageEntry);
							registerPart(storage, 0.5);

							const cableNetwork = new THREE.Group();
							const pulseRoutes: MicrogridPulseRoute[] = [];
							const addEnergyPath = (
								channel: MicrogridCableChannel,
								start: InstanceType<typeof THREE.Vector3>,
								controlA: InstanceType<typeof THREE.Vector3>,
								controlB: InstanceType<typeof THREE.Vector3>,
								end: InstanceType<typeof THREE.Vector3>,
								speed: number,
								offset: number,
							) => {
								const curve = new THREE.CubicBezierCurve3(start, controlA, controlB, end);
								const physicalCurve = new THREE.CubicBezierCurve3(
									start.clone().add(new THREE.Vector3(0, 0, -0.012)),
									controlA.clone().add(new THREE.Vector3(0, 0, -0.012)),
									controlB.clone().add(new THREE.Vector3(0, 0, -0.012)),
									end.clone().add(new THREE.Vector3(0, 0, -0.012)),
								);
								const cableGeometry = new THREE.TubeGeometry(physicalCurve, 36, 0.009, 6, false);
								const glowGeometry = new THREE.TubeGeometry(curve, 36, 0.008, 6, false);
								const coreGeometry = new THREE.TubeGeometry(curve, 36, 0.0028, 6, false);
								microgridCableGeometries.push(cableGeometry, glowGeometry, coreGeometry);
								cableNetwork.add(new THREE.Mesh(cableGeometry, microgridMaterials.rubber));
								const materials = microgridCableChannels[channel];
								cableNetwork.add(new THREE.Mesh(glowGeometry, materials.glow));
								cableNetwork.add(new THREE.Mesh(coreGeometry, materials.core));
								[0, 0.48].forEach((highlightOffset) => {
									const highlight = new THREE.Mesh(
										miniGeometries.microCablePulse,
										materials.pulse,
									);
									cableNetwork.add(highlight);
									pulseRoutes.push({
										mesh: highlight,
										curve,
										speed,
										offset: offset + highlightOffset,
										channel,
									});
								});
							};
							addEnergyPath(
								'wind',
								new THREE.Vector3(-0.82, -0.155, 0.285),
								new THREE.Vector3(-0.68, -0.23, 0.315),
								new THREE.Vector3(-0.3, -0.23, 0.315),
								new THREE.Vector3(-0.14, -0.165, 0.295),
								0.00012,
								0.08,
							);
							addEnergyPath(
								'solar',
								new THREE.Vector3(-0.17, -0.165, 0.285),
								new THREE.Vector3(-0.15, -0.22, 0.32),
								new THREE.Vector3(-0.12, -0.2, 0.315),
								new THREE.Vector3(-0.1, -0.165, 0.295),
								0.00013,
								0.4,
							);
							addEnergyPath(
								'battery',
								new THREE.Vector3(0.72, -0.165, 0.28),
								new THREE.Vector3(0.58, -0.23, 0.315),
								new THREE.Vector3(0.3, -0.23, 0.315),
								new THREE.Vector3(0.18, -0.165, 0.295),
								0.00014,
								0.7,
							);
							group.add(cableNetwork);

							const gridKeyLight = new THREE.PointLight(0xe7ebe3, 0.16, 3.2, 2);
							gridKeyLight.position.set(-0.55, 0.9, 1.1);
							gridKeyLight.layers.set(1);
							group.add(gridKeyLight);
							const gridRimLight = new THREE.PointLight(substrateColors.cyanBright, 0.08, 2.2, 2);
							gridRimLight.position.set(0.75, 0.45, -0.65);
							gridRimLight.layers.set(1);
							group.add(gridRimLight);

							group.userData.microgridParts = assemblyParts;
							group.userData.microgridWindRotor = windRotor;
							group.userData.microgridBatteryCells = batteryCells;
							group.userData.microgridCables = cableNetwork;
							group.userData.microgridPulseRoutes = pulseRoutes;
							break;
						}
						default: {
							const name = kind as ProductName;
							const definition = productDefinitions[name];
							const emblem = new THREE.Group();
							const badgeMaterial = makeProductMaterial(
								new THREE.MeshPhysicalMaterial({
									color: definition.badge,
									roughness: 0.28,
									metalness: 0.04,
									clearcoat: 0.82,
									clearcoatRoughness: 0.2,
									envMap: nonPyramidEnvironment,
									envMapIntensity: 0.56,
									emissive: definition.badge,
									emissiveIntensity: 0.08,
									transparent: true,
									opacity: 0,
									depthWrite: false,
								}),
								0.98,
							);
							const badge = new THREE.Mesh(miniGeometries.productBadge, badgeMaterial);
							badge.rotation.x = Math.PI / 2;
							emblem.add(badge);

							const rimMaterial = makeProductMaterial(
								new THREE.MeshStandardMaterial({
									color: substrateColors.text,
									roughness: 0.26,
									metalness: 0.32,
									envMap: nonPyramidEnvironment,
									envMapIntensity: 0.52,
									transparent: true,
									opacity: 0,
									depthWrite: false,
								}),
								0.92,
							);
							const rim = new THREE.Mesh(miniGeometries.productRim, rimMaterial);
							rim.position.z = 0.054;
							emblem.add(rim);

							const iconMaterial = makeProductMaterial(
								new THREE.MeshBasicMaterial({
									map: productIconTextures[name],
									transparent: true,
									opacity: 0,
									depthWrite: false,
									side: THREE.DoubleSide,
								}),
								1,
							);
							const icon = new THREE.Mesh(miniGeometries.productIcon, iconMaterial);
							icon.position.z = 0.058;
							emblem.add(icon);

							const caption = new THREE.Mesh(
								miniGeometries.productCaption,
								makeProductCaptionMaterial(name, definition.badge),
							);
							caption.position.set(0, -0.385, 0.045);
							emblem.add(caption);

							const burst = new THREE.Group();
							const burstMaterial = makeProductMaterial(
								new THREE.MeshBasicMaterial({
									color: definition.badge,
									transparent: true,
									opacity: 0,
									depthWrite: false,
									blending: THREE.AdditiveBlending,
								}),
								0.52,
							);
							const rays = makeStaticInstances(
								miniGeometries.productRay,
								burstMaterial,
								12,
								(ray, index) => {
									const angle = (index / 12) * Math.PI * 2;
									const distance = 0.39 + (index % 2) * 0.035;
									ray.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, -0.02);
									ray.rotation.z = angle - Math.PI / 2;
									ray.scale.y = index % 2 === 0 ? 1 : 0.62;
								},
							);
							burst.add(rays);
							burst.renderOrder = -1;
							group.add(burst);

							const trails = new THREE.Group();
							const trailMaterial = makeProductMaterial(
								new THREE.MeshBasicMaterial({
									color: definition.badge,
									transparent: true,
									opacity: 0,
									depthWrite: false,
									blending: THREE.AdditiveBlending,
								}),
								0.72,
							);
							for (let trailIndex = 0; trailIndex < 4; trailIndex += 1) {
								const trail = new THREE.Mesh(miniGeometries.productTrail, trailMaterial);
								trail.userData.offset = trailIndex;
								trails.add(trail);
							}
							group.add(trails);
							group.add(emblem);
							group.userData.productEmblem = emblem;
							group.userData.productBurst = burst;
							group.userData.productBurstMaterial = burstMaterial;
							group.userData.productTrails = trails;
							group.userData.productTrailMaterial = trailMaterial;
						}
					}


					if (layerIndex === 1 || layerIndex === 3 || kind === 'microgrid') {
						group.updateMatrixWorld(true);
						const bounds = new THREE.Box3().setFromObject(group);
						const size = bounds.getSize(new THREE.Vector3());
						const center = bounds.getCenter(new THREE.Vector3());
						const normalizedHeight = kind === 'microgrid' ? 1.2 : layerIndex === 3 ? 0.86 : 1;
						const normalization = normalizedHeight / Math.max(size.y, 0.001);
						const normalizedModel = new THREE.Group();
						[...group.children].forEach((child) => normalizedModel.add(child));
						normalizedModel.scale.setScalar(normalization);
						normalizedModel.position.set(
							-center.x * normalization,
							-center.y * normalization,
							-center.z * normalization,
						);
						group.add(normalizedModel);
					}
					if (kind !== 'microgrid') {
						const shadow = new THREE.Sprite(contactShadowMaterials[layerIndex]);
						const shadowWidth = layerIndex === 3 ? 1.18 : layerIndex === 0 ? 1.34 : 1.5;
						shadow.scale.set(shadowWidth, shadowWidth * 0.27, 1);
						shadow.position.set(0, layerIndex === 0 ? -0.36 : -0.47, -0.08);
						group.add(shadow);
					}

					return { kind, group, labels };
				};

				const createSeededPositions = (layerIndex: number, count: number) => {
					const positions: Array<{ x: number; z: number; y: number; rotation: number }> = [];
					const baseRadius = layerRadii[layerIndex];
					const minimumDistance = layerMinDistances[layerIndex];
					for (let index = 0; index < count; index += 1) {
						let candidate = { x: 0, z: 0, y: 0, rotation: 0 };
						for (let attempt = 0; attempt < 24; attempt += 1) {
							const seed = (layerIndex + 1) * 1009 + index * 83 + attempt * 29;
							const angle = index * 2.399963 + seededUnit(seed) * 0.82 + layerIndex * 0.47;
							const radius = baseRadius * (0.8 + seededUnit(seed + 1) * 0.34);
							candidate = {
								x: Math.cos(angle) * radius,
								z: Math.sin(angle) * radius,
								y: LAYER_SPECS[layerIndex].y + 0.7 + seededUnit(seed + 2) * 0.52,
								rotation: (seededUnit(seed + 3) - 0.5) * 0.72,
							};
							if (positions.every((position) => Math.hypot(candidate.x - position.x, candidate.z - position.z) >= minimumDistance)) {
								break;
							}
						}
						positions.push(candidate);
					}
					return positions;
				};

				const productPositions = [
					{ x: -2, z: 0.34, y: LAYER_SPECS[3].y + 0.92, rotation: 0 },
					{ x: -1, z: -0.02, y: LAYER_SPECS[3].y + 1.1, rotation: 0 },
					{ x: 0, z: -0.2, y: LAYER_SPECS[3].y + 1.2, rotation: 0 },
					{ x: 1, z: -0.02, y: LAYER_SPECS[3].y + 1.1, rotation: 0 },
					{ x: 2, z: 0.34, y: LAYER_SPECS[3].y + 0.92, rotation: 0 },
				] as const;

				const riseLayers: RiseLayer[] = layerKinds.map((kinds, layerIndex) => {
					const positions = layerIndex === 3 ? productPositions : createSeededPositions(layerIndex, kinds.length);
					const items = kinds.map((kind, itemIndex) => {
						const built = makeRiseItem(kind, layerIndex, itemIndex);
						const position = positions[itemIndex];
						const clearance = layerIndex <= 1 ? TOKEN_MODEL_CLEARANCE : 1;
						const isMicrogrid = kind === 'microgrid';
						const presentationLift = layerIndex <= 1 ? 0.34 : layerIndex === 2 ? 0.24 : 0.28;
						built.group.visible = false;
						built.group.traverse((object) => object.layers.enable(1));
						pyramid.add(built.group);
						return {
							...built,
							x: isMicrogrid ? -0.16 : position.x * clearance,
							z: isMicrogrid ? -0.18 : position.z * clearance,
							hiddenY: LAYER_SPECS[layerIndex].y - 0.52 - itemIndex * 0.035,
							targetY: isMicrogrid
								? LAYER_SPECS[layerIndex].y + 1.12 + presentationLift
								: LAYER_SPECS[layerIndex].y +
									(position.y - LAYER_SPECS[layerIndex].y) * clearance +
									presentationLift,
							baseRotation: isMicrogrid ? 0 : position.rotation,
							floatPhase: seededUnit(700 + layerIndex * 41 + itemIndex * 7) * Math.PI * 2,
							faceTiltX: isMicrogrid
								? -0.06
								: (seededUnit(1700 + itemIndex * 17) - 0.5) * 0.08,
							faceTiltZ: isMicrogrid
								? 0
								: (seededUnit(1800 + itemIndex * 19) - 0.5) * 0.18,
						};
					});

					return {
						items,
						progress: 0,
						target: 0,
						visible: false,
						lastOpacity: -1,
						sparks: null,
						sparkBase: null,
						sparkDirections: null,
					};
				});

				const celebrationColors = [
					substrateColors.primary,
					substrateColors.cyanBright,
					substrateColors.coral,
					substrateColors.green,
					substrateColors.blue,
					substrateColors.text,
				];
				const sparkCount = 72;
				const sparkBase = new Float32Array(sparkCount * 3);
				const sparkDirections = new Float32Array(sparkCount * 3);
				const sparkColors = new Float32Array(sparkCount * 3);
				for (let index = 0; index < sparkCount; index += 1) {
					const seed = 9200 + index * 13;
					const angle = seededUnit(seed) * Math.PI * 2;
					const radius = 0.12 + seededUnit(seed + 1) * 0.58;
					const color = new THREE.Color(celebrationColors[index % celebrationColors.length]);
					sparkBase[index * 3] = 0.38 + Math.cos(angle) * radius;
					sparkBase[index * 3 + 1] = LAYER_SPECS[3].y + 1.02 + seededUnit(seed + 2) * 0.42;
					sparkBase[index * 3 + 2] = -0.08 + Math.sin(angle) * radius;
					sparkDirections[index * 3] = Math.cos(angle) * (0.7 + seededUnit(seed + 3) * 1.55);
					sparkDirections[index * 3 + 1] = 0.62 + seededUnit(seed + 4) * 1.45;
					sparkDirections[index * 3 + 2] = Math.sin(angle) * (0.62 + seededUnit(seed + 5) * 1.35);
					color.toArray(sparkColors, index * 3);
				}
				const sparkGeometry = new THREE.BufferGeometry();
				sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkBase.slice(), 3));
				sparkGeometry.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));
				const sparkMaterial = new THREE.PointsMaterial({
					size: 0.11,
					sizeAttenuation: true,
					vertexColors: true,
					transparent: true,
					opacity: 0,
					depthWrite: false,
					blending: THREE.AdditiveBlending,
				});
				const productSparks = new THREE.Points(sparkGeometry, sparkMaterial);
				productSparks.visible = false;
				pyramid.add(productSparks);
				riseLayers[3].sparks = productSparks;
				riseLayers[3].sparkBase = sparkBase;
				riseLayers[3].sparkDirections = sparkDirections;

				const confettiCount = 38;
				const ribbonCount = 16;
				const confettiMaterial = new THREE.MeshBasicMaterial({
					color: 0xffffff,
					vertexColors: true,
					transparent: true,
					opacity: 0,
					depthWrite: false,
					side: THREE.DoubleSide,
				});
				const ribbonMaterial = confettiMaterial.clone();
				const productConfetti = new THREE.InstancedMesh(
					miniGeometries.productConfetti,
					confettiMaterial,
					confettiCount,
				);
				const productRibbons = new THREE.InstancedMesh(
					miniGeometries.productRibbon,
					ribbonMaterial,
					ribbonCount,
				);
				const makeCelebrationMotion = (index: number, ribbon: boolean) => {
					const seed = 11100 + index * 31 + (ribbon ? 700 : 0);
					const angle = seededUnit(seed) * Math.PI * 2;
					return {
						x: 0.32 + (seededUnit(seed + 1) - 0.5) * 0.76,
						y: LAYER_SPECS[3].y + 1.08 + seededUnit(seed + 2) * 0.32,
						z: -0.1 + (seededUnit(seed + 3) - 0.5) * 0.68,
						vx: Math.cos(angle) * (0.48 + seededUnit(seed + 4) * 1.15),
						vy: 1.05 + seededUnit(seed + 5) * 1.35,
						vz: Math.sin(angle) * (0.42 + seededUnit(seed + 6) * 0.92),
						spin: (seededUnit(seed + 7) - 0.5) * (ribbon ? 10 : 15),
						phase: seededUnit(seed + 8) * Math.PI * 2,
					};
				};
				const confettiMotion = Array.from({ length: confettiCount }, (_, index) =>
					makeCelebrationMotion(index, false),
				);
				const ribbonMotion = Array.from({ length: ribbonCount }, (_, index) =>
					makeCelebrationMotion(index, true),
				);
				confettiMotion.forEach((_, index) => {
					productConfetti.setColorAt(index, new THREE.Color(celebrationColors[index % celebrationColors.length]));
				});
				ribbonMotion.forEach((_, index) => {
					productRibbons.setColorAt(index, new THREE.Color(celebrationColors[(index + 2) % celebrationColors.length]));
				});
				if (productConfetti.instanceColor) productConfetti.instanceColor.needsUpdate = true;
				if (productRibbons.instanceColor) productRibbons.instanceColor.needsUpdate = true;
				productConfetti.visible = false;
				productRibbons.visible = false;
				productConfetti.frustumCulled = false;
				productRibbons.frustumCulled = false;
				pyramid.add(productConfetti, productRibbons);
				let productCelebrationStartedAt = Number.NEGATIVE_INFINITY;

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

				const gridSize = 15;
				const gridDivisions = 30;
				const gridHalf = gridSize / 2;
				const gridStep = gridSize / gridDivisions;
				const gridPositions: number[] = [];
				const gridColors: number[] = [];
				const floorColor = new THREE.Color(0x09090b);
				const secondaryGridColor = new THREE.Color(0x24242a);
				const axisColor = new THREE.Color(0x3e3e48);

				const appendGridVertex = (x: number, z: number, isAxis: boolean) => {
					gridPositions.push(x, 0, z);
					if (isAxis) {
						gridColors.push(axisColor.r, axisColor.g, axisColor.b);
						return;
					}

					const distance = Math.hypot(x, z);
					const fade = 1 - smootherstep(clamp01((distance - 3.6) / (gridHalf - 3.6)));
					gridColors.push(
						floorColor.r + (secondaryGridColor.r - floorColor.r) * fade,
						floorColor.g + (secondaryGridColor.g - floorColor.g) * fade,
						floorColor.b + (secondaryGridColor.b - floorColor.b) * fade,
					);
				};

				for (let lineIndex = 0; lineIndex <= gridDivisions; lineIndex += 1) {
					const coordinate = -gridHalf + lineIndex * gridStep;
					const isAxis = Math.abs(coordinate) < gridStep / 2;
					for (let segmentIndex = 0; segmentIndex < gridDivisions; segmentIndex += 1) {
						const start = -gridHalf + segmentIndex * gridStep;
						const end = start + gridStep;
						appendGridVertex(coordinate, start, isAxis);
						appendGridVertex(coordinate, end, isAxis);
						appendGridVertex(start, coordinate, isAxis);
						appendGridVertex(end, coordinate, isAxis);
					}
				}

				const gridGeometry = new THREE.BufferGeometry();
				gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
				gridGeometry.setAttribute('color', new THREE.Float32BufferAttribute(gridColors, 3));
				const gridMaterial = new THREE.LineBasicMaterial({
					vertexColors: true,
					transparent: true,
					opacity: 0.56,
				});
				const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
				grid.position.y = -0.64;
				scene.add(grid);

				scene.add(new THREE.HemisphereLight(0xf4f4f5, 0x09090b, 1.12));
				const keyLight = new THREE.DirectionalLight(0xffffff, 1.55);
				keyLight.position.set(4, 7, 5);
				scene.add(keyLight);
				const fillLight = new THREE.DirectionalLight(substrateColors.text, 0.72);
				fillLight.position.set(-4, 3, 6);
				scene.add(fillLight);
				const rimLight = new THREE.DirectionalLight(substrateColors.primary, 0.48);
				rimLight.position.set(-5, 2, -4);
				scene.add(rimLight);

				camera.layers.enable(1);
				const modelKeyLight = new THREE.RectAreaLight(0xffffff, 0.82, 4.5, 3.2);
				modelKeyLight.position.set(-1.5, 6, 5.5);
				modelKeyLight.lookAt(0, 1.8, 0);
				modelKeyLight.layers.set(1);
				scene.add(modelKeyLight);
				const modelRimLight = new THREE.DirectionalLight(substrateColors.cyanBright, 0.16);
				modelRimLight.position.set(5, 4, -3);
				modelRimLight.layers.set(1);
				scene.add(modelRimLight);

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

				const highlightColor = new THREE.Color(0xf4f4f5);
				const highlightStudColor = new THREE.Color(0xffffff);
				const updateMaterials = () => {
					materials.forEach((entry, index) => {
						const isFocused = focusedLayer === index;
						const isHovered = hoveredLayer === index;
						const dim = focusedLayer >= 0 && !isFocused ? 1 - focusMix * 0.74 : 1;
						entry.block.opacity = dim;
						entry.stud.opacity = dim;
						entry.block.color.copy(entry.base);
						entry.stud.color.copy(entry.studBase);
						if (isHovered && !isFocused) {
							entry.block.color.lerp(highlightColor, 0.12);
							entry.stud.color.lerp(highlightStudColor, 0.2);
						}
					});
				};

				let accessoryFrame = 0;
				let accessoryLastTime = performance.now();
				let modelInView = true;
				const cameraLocalPosition = new THREE.Vector3();
				const facingGuide = new THREE.Object3D();

				let compactPresentation = model.clientWidth <= 520;
				const updateAccessoryTransforms = (time: number) => {
					riseLayers.forEach((layer, layerIndex) => {
						const isLayerActive = layer.target > 0 || layer.progress > 0.001;
						if (!isLayerActive) {
							if (layer.visible) {
								layer.items.forEach((item) => {
									item.group.visible = false;
									item.labels.forEach((label) => {
										label.style.opacity = '0';
										label.style.visibility = 'hidden';
									});
								});
								if (layer.sparks) layer.sparks.visible = false;
								layer.visible = false;
								layer.lastOpacity = -1;
							}
							return;
						}
						layer.visible = true;
						const layerOpacity = smootherstep(clamp01(layer.progress * 1.14));
						if (Math.abs(layerOpacity - layer.lastOpacity) > 0.0005) {
							risePalettes[layerIndex].all.forEach((material) => {
								material.opacity = layerOpacity;
							});
							if (layerIndex === 0) {
								tokenSurfaceMaterials.forEach((material) => {
									material.opacity =
										layerOpacity * ((material.userData.targetOpacity as number | undefined) ?? 1);
								});
							}
							if (layerIndex === 1) {
								energySurfaceMaterials.forEach((material) => {
									material.opacity =
										layerOpacity * ((material.userData.targetOpacity as number | undefined) ?? 1);
								});
							}
							if (layerIndex === 2) {
								microgridSurfaceMaterials.forEach((material) => {
									material.opacity =
										layerOpacity * ((material.userData.targetOpacity as number | undefined) ?? 1);
								});
								microgridShadowMaterial.opacity = layerOpacity * 0.44;
							}
							if (layerIndex === 3) {
								productSurfaceMaterials.forEach((material) => {
									material.opacity =
										layerOpacity * ((material.userData.targetOpacity as number | undefined) ?? 1);
								});
							}
							contactShadowMaterials[layerIndex].opacity = layerOpacity * 0.34;
							layer.lastOpacity = layerOpacity;
						}
						layer.items.forEach((item, itemIndex) => {
							const stagger = itemIndex * 0.105;
							const localProgress = smootherstep(clamp01((layer.progress - stagger) / (1 - stagger)));
							const shouldBeVisible = localProgress > 0.002;
							const isTokensModel = layerIndex === 0;
							const isPrimitivesModel = layerIndex === 1;
							const isMicrogridModel = layerIndex === 2 && item.kind === 'microgrid';
							const isProductModel = layerIndex === 3;
							const isMiniatureModel = isTokensModel || isPrimitivesModel;
							const isPresentationModel = isMiniatureModel || isMicrogridModel || isProductModel;
							const floatAmplitude = isProductModel ? 0.026 : isPresentationModel ? 0.016 : 0.045;
							const float = Math.sin(time * 0.00135 + item.floatPhase) * floatAmplitude * localProgress;
							item.group.visible = false;

							if (isPresentationModel) {
								const riseProgress = smootherstep(clamp01(localProgress / 0.72));
								const settleProgress = smootherstep(clamp01((localProgress - 0.72) / 0.28));
								const forwardProgress = smootherstep(clamp01((localProgress - 0.26) / 0.6));
								const elevatedY =
									item.hiddenY + (item.targetY + 0.16 - item.hiddenY) * riseProgress;
								item.group.position.set(
									(item.x * 0.52 + item.x * 0.48 * forwardProgress) *
										(compactPresentation ? 0.68 : 1),
									elevatedY - 0.16 * settleProgress + float,
									-0.86 - itemIndex * 0.07 + (item.z + 0.86 + itemIndex * 0.07) * forwardProgress,
								);
								facingGuide.position.copy(item.group.position);
								facingGuide.lookAt(cameraLocalPosition);
								facingGuide.rotateX(
									item.faceTiltX + Math.sin(time * 0.0007 + item.floatPhase) * 0.006 * localProgress,
								);
								facingGuide.rotateZ(
									item.faceTiltZ +
										Math.cos(time * 0.00062 + item.floatPhase) *
											(isProductModel ? 0.014 : 0.008) *
											localProgress,
								);
								item.group.quaternion.copy(facingGuide.quaternion);
								const popPhase = clamp01(localProgress / 0.8);
								const productPop =
									smootherstep(popPhase) *
									(1 + Math.sin(popPhase * Math.PI * 3) * (1 - popPhase) * 0.17);
								item.group.scale.setScalar(
									isProductModel
										? (compactPresentation ? 0.68 : 0.74) * productPop
										: (isMicrogridModel
													? compactPresentation
														? 0.64
														: 0.68
													: compactPresentation
														? 0.46
														: 0.5) * smootherstep(clamp01(localProgress / 0.58)),
								);
							} else {
								item.group.position.set(
									item.x,
									item.hiddenY + (item.targetY - item.hiddenY) * localProgress + float,
									item.z,
								);
								item.group.rotation.set(
									-0.08 + Math.sin(time * 0.0008 + item.floatPhase) * 0.025 * localProgress,
									item.baseRotation + Math.sin(time * 0.00065 + item.floatPhase) * 0.07 * localProgress,
									Math.cos(time * 0.00072 + item.floatPhase) * 0.02 * localProgress,
								);
								item.group.scale.setScalar(0.72 + localProgress * 0.28);
							}

							item.group.visible = shouldBeVisible;
							if (!shouldBeVisible) return;

							if (isTokensModel && item.kind === 'swatches') {
								const leaves = item.group.userData.swatches as
									| InstanceType<typeof THREE.Group>[]
									| undefined;
								leaves?.forEach((leaf, index) => {
									const fanProgress = smootherstep(clamp01((localProgress - index * 0.035) / 0.72));
									leaf.rotation.z = (leaf.userData.restRotation as number) * fanProgress;
									leaf.position.y = index * 0.012 * fanProgress;
								});
							}
							if (isTokensModel && item.kind === 'ruler') {
								const glowMaterials = item.group.userData.rulerGlow as
									| InstanceType<typeof THREE.MeshPhysicalMaterial>[]
									| undefined;
								glowMaterials?.forEach((material) => {
									material.emissiveIntensity =
										localProgress * (0.1 + (Math.sin(time * 0.0024 + item.floatPhase) + 1) * 0.045);
								});
							}
							if (isTokensModel && item.kind === 'typography') {
								const sheets = item.group.userData.sheets as
									| InstanceType<typeof THREE.Group>[]
									| undefined;
								sheets?.forEach((sheet, sheetIndex) => {
									const baseRotation = sheet.userData.baseRotation as InstanceType<typeof THREE.Euler>;
									const flutter = Math.sin(time * 0.0011 + item.floatPhase + sheetIndex * 1.3);
									sheet.rotation.x = baseRotation.x + flutter * 0.006 * localProgress;
									sheet.rotation.y = baseRotation.y + flutter * 0.009 * localProgress;
									sheet.rotation.z = baseRotation.z + flutter * 0.004 * localProgress;
								});
							}
							if (isPrimitivesModel && item.kind === 'wind') {
								const rotor = item.group.userData.windRotor as InstanceType<typeof THREE.Group> | undefined;
								const indicator = item.group.userData.windIndicator as
									| InstanceType<typeof THREE.Mesh>
									| undefined;
								if (rotor) rotor.rotation.z = time * 0.00022 + item.floatPhase;
								if (indicator) {
									const output = 0.5 + Math.sin(time * 0.0012 + item.floatPhase) * 0.5;
									windMaterials.cyan.emissiveIntensity = 0.18 + output * 0.12;
								}
							}
							if (isPrimitivesModel && item.kind === 'solar') {
								const reflection = item.group.userData.solarReflection as
									| InstanceType<typeof THREE.Mesh>
									| undefined;
								const indicator = item.group.userData.solarIndicator as
									| InstanceType<typeof THREE.Mesh>
									| undefined;
								const solarResponse =
									0.5 + Math.sin(time * 0.00072 + item.floatPhase) * 0.5;
								if (reflection) {
									const sweep =
										(time * 0.000075 + item.floatPhase / (Math.PI * 2)) % 1;
									reflection.position.x = -0.52 + sweep * 1.04;
									solarMaterials.reflection.opacity =
										layerOpacity * (0.04 + Math.sin(sweep * Math.PI) * 0.1);
								}
								if (indicator) {
									indicator.scale.x = 0.72 + solarResponse * 0.28;
									solarMaterials.cyan.emissiveIntensity = 0.2 + solarResponse * 0.14;
								}
							}
							if (isPrimitivesModel && item.kind === 'battery') {
								const chargeSegments = item.group.userData.batteryChargeSegments as
									| InstanceType<typeof THREE.Mesh>[]
									| undefined;
								if (chargeSegments) {
									const pulse = 0.5 + Math.sin(time * 0.00065 + item.floatPhase) * 0.5;
									const activeSegments = 2 + Math.round(pulse * 3);
									chargeSegments.forEach((segment, index) => {
										segment.material =
											index < activeSegments ? batteryMaterials.cyan : batteryMaterials.cyanOff;
										segment.scale.y = index === activeSegments - 1 ? 0.72 + pulse * 0.28 : 1;
									});
									batteryMaterials.cyan.emissiveIntensity = 0.34 + pulse * 0.18;
								}
							}
							if (isMicrogridModel) {
								const parts = item.group.userData.microgridParts as
									| MicrogridAssemblyPart[]
									| undefined;
								parts?.forEach((part) => {
									const assemblyProgress = smootherstep(
										clamp01((localProgress - part.delay) / Math.max(0.72 - part.delay, 0.01)),
									);
									part.object.visible = assemblyProgress > 0.01;
									part.object.position.copy(part.restPosition);
									part.object.position.y -= (1 - assemblyProgress) * 0.14;
									part.object.scale.copy(part.restScale).multiplyScalar(Math.max(assemblyProgress, 0.001));
								});

								const windRotor = item.group.userData.microgridWindRotor as
									| InstanceType<typeof THREE.Group>
									| undefined;
								if (windRotor) windRotor.rotation.z = time * 0.00024 + item.floatPhase;

								const solarCycle = 0.5 + Math.sin(time * 0.0002 + item.floatPhase) * 0.5;
								const solarDip = smootherstep(clamp01((solarCycle - 0.72) / 0.28));
								const networkActivation = smootherstep(clamp01((localProgress - 0.68) / 0.3));
								const cables = item.group.userData.microgridCables as
									| InstanceType<typeof THREE.Group>
									| undefined;
								if (cables) cables.visible = networkActivation > 0.01;

								(['wind', 'solar', 'battery'] as const).forEach((channel) => {
									const channelMaterials = microgridCableChannels[channel];
									const output =
										channel === 'solar'
											? 1 - solarDip * 0.52
											: channel === 'battery'
												? 0.92 + solarDip * 0.08
												: 1;
									channelMaterials.glow.opacity =
										layerOpacity *
										networkActivation *
										output *
										(channelMaterials.glow.userData.targetOpacity as number);
									channelMaterials.core.opacity =
										layerOpacity *
										networkActivation *
										output *
										(channelMaterials.core.userData.targetOpacity as number);
									channelMaterials.pulse.opacity =
										layerOpacity *
										networkActivation *
										output *
										(channelMaterials.pulse.userData.targetOpacity as number);
								});

								const pulseRoutes = item.group.userData.microgridPulseRoutes as
									| MicrogridPulseRoute[]
									| undefined;
								pulseRoutes?.forEach((route) => {
									const travel = (time * route.speed + route.offset) % 1;
									route.curve.getPointAt(travel, route.mesh.position);
									route.curve.getTangentAt(travel, microgridPulseTangent).normalize();
									route.mesh.quaternion.setFromUnitVectors(
										microgridPulseAxis,
										microgridPulseTangent,
									);
									const compensationScale =
										route.channel === 'battery'
											? 1 + solarDip * 0.24
											: route.channel === 'solar'
												? 1 - solarDip * 0.16
												: 1;
									route.mesh.scale.setScalar(networkActivation * compensationScale);
								});

								const batteryCells = item.group.userData.microgridBatteryCells as
									| InstanceType<typeof THREE.Mesh>[]
									| undefined;
								const storedEnergy =
									0.58 +
									Math.sin(time * 0.00048 + item.floatPhase) * 0.12 -
									solarDip * 0.1;
								batteryCells?.forEach((cell, index) => {
									const cellFill = smootherstep(clamp01((storedEnergy - index * 0.1) / 0.22));
									cell.material =
										cellFill > 0.45 ? microgridMaterials.charge : microgridMaterials.cyanOff;
									cell.scale.y = 0.14 + cellFill * 0.86;
								});
								microgridMaterials.charge.emissiveIntensity = 0.58 + solarDip * 0.42;
							}
							if (isProductModel) {
								const emblem = item.group.userData.productEmblem as
									| InstanceType<typeof THREE.Group>
									| undefined;
								const burst = item.group.userData.productBurst as
									| InstanceType<typeof THREE.Group>
									| undefined;
								const burstMaterial = item.group.userData.productBurstMaterial as
									| InstanceType<typeof THREE.MeshBasicMaterial>
									| undefined;
								const trails = item.group.userData.productTrails as
									| InstanceType<typeof THREE.Group>
									| undefined;
								const trailMaterial = item.group.userData.productTrailMaterial as
									| InstanceType<typeof THREE.MeshBasicMaterial>
									| undefined;
								const settle = smootherstep(clamp01((localProgress - 0.5) / 0.5));
								if (emblem) {
									emblem.position.y =
										Math.sin(time * 0.0016 + item.floatPhase) * 0.018 * localProgress;
									emblem.rotation.z =
										Math.sin(time * 0.0011 + item.floatPhase) * 0.018 * localProgress;
								}
								if (burst) {
									const burstScale = 0.42 + smootherstep(clamp01(localProgress / 0.62)) * 0.72;
									burst.scale.setScalar(burstScale);
									burst.rotation.z = time * 0.00012 + item.floatPhase * 0.08;
								}
								if (burstMaterial) {
									burstMaterial.opacity = layerOpacity * (0.16 + (1 - settle) * 0.58);
								}
								trails?.children.forEach((trail, trailIndex) => {
									const trailPhase = localProgress * 2.7 - trailIndex * 0.12;
									const trailVisibility = smootherstep(clamp01(trailPhase)) * (1 - settle);
									trail.position.set(
										-0.2 - trailIndex * 0.075,
										0.1 + Math.sin(item.floatPhase + trailIndex * 1.4) * 0.12,
										-0.025 - trailIndex * 0.014,
									);
									trail.scale.setScalar(Math.max(0.001, trailVisibility * (1 - trailIndex * 0.13)));
								});
								if (trailMaterial) trailMaterial.opacity = layerOpacity * (1 - settle) * 0.82;
							}

							const labelOpacity = clamp01((localProgress - 0.32) / 0.68);
							item.labels.forEach((label) => {
								label.style.opacity = labelOpacity.toFixed(3);
								label.style.visibility = labelOpacity > 0.02 ? 'visible' : 'hidden';
							});
						});

						if (layer.sparks && layer.sparkBase && layer.sparkDirections) {
							const elapsed = Math.max(0, time - productCelebrationStartedAt);
							const celebrationActive =
								layer.progress > 0.18 && elapsed < 2600 && Number.isFinite(productCelebrationStartedAt);
							layer.sparks.visible = celebrationActive;
							productConfetti.visible = celebrationActive;
							productRibbons.visible = celebrationActive;
							if (celebrationActive) {
								const seconds = elapsed / 1000;
								const entrance = smootherstep(clamp01(elapsed / 180));
								const exit = 1 - smootherstep(clamp01((elapsed - 1750) / 850));
								const celebrationOpacity = entrance * exit;
								sparkMaterial.opacity =
									celebrationOpacity * (0.74 + Math.sin(time * 0.012) * 0.2);
								confettiMaterial.opacity = celebrationOpacity * 0.96;
								ribbonMaterial.opacity = celebrationOpacity * 0.84;
								const positions = sparkGeometry.attributes.position.array as Float32Array;
								for (let index = 0; index < sparkCount; index += 1) {
									const offset = index * 3;
									const flicker = Math.sin(time * 0.004 + index * 1.7) * 0.075;
									positions[offset] =
										layer.sparkBase[offset] + layer.sparkDirections[offset] * seconds * 0.74;
									positions[offset + 1] =
										layer.sparkBase[offset + 1] +
										layer.sparkDirections[offset + 1] * seconds * 0.86 -
										0.58 * seconds * seconds +
										flicker;
									positions[offset + 2] =
										layer.sparkBase[offset + 2] +
										layer.sparkDirections[offset + 2] * seconds * 0.66;
								}
								sparkGeometry.attributes.position.needsUpdate = true;
								const updatePieces = (
									mesh: InstanceType<typeof THREE.InstancedMesh>,
									motions: typeof confettiMotion,
									ribbon: boolean,
								) => {
									motions.forEach((motion, index) => {
										dummy.position.set(
											motion.x + motion.vx * seconds,
											motion.y + motion.vy * seconds - 0.72 * seconds * seconds,
											motion.z + motion.vz * seconds,
										);
										dummy.rotation.set(
											motion.phase + seconds * motion.spin * 0.72,
											motion.phase * 0.5 + seconds * motion.spin,
											seconds * motion.spin * 0.55,
										);
										const flutter = ribbon
											? 0.78 + Math.sin(time * 0.01 + motion.phase) * 0.2
											: 0.86 + Math.sin(time * 0.008 + motion.phase) * 0.12;
										dummy.scale.setScalar(flutter);
										dummy.updateMatrix();
										mesh.setMatrixAt(index, dummy.matrix);
									});
									mesh.instanceMatrix.needsUpdate = true;
								};
								updatePieces(productConfetti, confettiMotion, false);
								updatePieces(productRibbons, ribbonMotion, true);
							}
						}
					});
				};

				const render = (time = performance.now()) => {
					pyramid.rotation.x = pointerY * 0.055;
					pyramid.rotation.y = pointerX * 0.1;
					camera.lookAt(lookTarget.position);
					cameraLocalPosition.copy(camera.position);
					pyramid.worldToLocal(cameraLocalPosition);
					updateAccessoryTransforms(time);
					if (!exitingScene) updateMaterials();
					renderer.render(scene, camera);
					labelRenderer.render(scene, camera);
				};

				const runAccessoryFrame = (time: number) => {
					accessoryFrame = 0;
					if (!modelInView || document.hidden) return;
					const delta = Math.min(40, Math.max(0, time - accessoryLastTime));
					accessoryLastTime = time;
					let shouldContinue = false;
					riseLayers.forEach((layer) => {
						const duration = layer.target > layer.progress ? 260 : 185;
						const ease = 1 - Math.exp(-delta / duration);
						layer.progress += (layer.target - layer.progress) * ease;
						if (Math.abs(layer.target - layer.progress) < 0.001 && layer.target === 0) layer.progress = 0;
						if (layer.target > 0 || layer.progress > 0.001) shouldContinue = true;
					});
					render(time);
					if (shouldContinue) accessoryFrame = requestAnimationFrame(runAccessoryFrame);
				};

				const ensureAccessoryAnimation = () => {
					if (accessoryFrame || !modelInView || document.hidden || reducedRef.current) return;
					accessoryLastTime = performance.now();
					accessoryFrame = requestAnimationFrame(runAccessoryFrame);
				};

				const setAccessoryFocus = (layerIndex: number, strength: number) => {
					const nextStrength = clamp01(strength);
					if (layerIndex === 3 && nextStrength > 0.12 && riseLayers[3].target <= 0.12) {
						productCelebrationStartedAt = performance.now();
					}
					riseLayers.forEach((layer, index) => {
						layer.target = index === layerIndex ? nextStrength : 0;
					});
					ensureAccessoryAnimation();
				};

				const desktopPyramidComposition = window.matchMedia(
					'(min-width: 52.0625rem) and (prefers-reduced-motion: no-preference)',
				);

				const resize = () => {
					const width = Math.max(1, model.clientWidth);
					const height = Math.max(1, model.clientHeight);
					compactPresentation = width <= 520;
					const nextPixelRatio = Math.min(window.devicePixelRatio, width <= 832 ? 1.5 : 1.75);
					if (nextPixelRatio !== rendererPixelRatio) {
						rendererPixelRatio = nextPixelRatio;
						renderer.setPixelRatio(rendererPixelRatio);
					}
					renderer.setSize(width, height, false);
					labelRenderer.setSize(width, height);
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
				const visibilityObserver = new IntersectionObserver(
					([entry]) => {
						modelInView = entry.isIntersecting;
						if (modelInView) {
							ensureAccessoryAnimation();
							render();
						} else if (accessoryFrame) {
							cancelAnimationFrame(accessoryFrame);
							accessoryFrame = 0;
						}
					},
					{ rootMargin: '15% 0px', threshold: 0.01 },
				);
				visibilityObserver.observe(model);

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
					setAccessoryFocus(index, 1);
					selectionTurn?.cancel();
					selectionTurn = anime.animate(selectionPivot, {
						rotateY: (index - (LAYERS.length - 1) / 2) * 3,
						duration: 420,
						ease: 'out(3)',
						onUpdate: () => render(),
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
						setAccessoryFocus(focusedLayer, focusedLayer >= 0 ? focusMix : 0);

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
						.add(camera, { x: index % 2 === 0 ? -0.34 : 0.34, y: layer.cameraY, z: layer.cameraZ * 1.15, duration: 650, ease: 'inOut(3)' }, start)
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
						setAccessoryFocus(-1, 0);

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
							onUpdate: () => render(),
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
				const onVisibilityChange = () => {
					if (document.hidden) {
						if (accessoryFrame) cancelAnimationFrame(accessoryFrame);
						accessoryFrame = 0;
						return;
					}
					ensureAccessoryAnimation();
					render();
				};

				window.addEventListener('pointermove', onSharedPointerMove, { passive: true });
				window.addEventListener('scroll', requestEntryReveal, { passive: true });
				window.addEventListener('resize', requestEntryReveal);
				canvas.addEventListener('pointermove', onPointerMove, { passive: true });
				canvas.addEventListener('pointerleave', onPointerLeave);
				canvas.addEventListener('click', onPointerClick);
				canvas.addEventListener('webglcontextlost', onContextLost);
				window.addEventListener('scroll', clearManualSelection, { passive: true });
				document.addEventListener('visibilitychange', onVisibilityChange);

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
					if (accessoryFrame) cancelAnimationFrame(accessoryFrame);
					exitTransitionRef.current = null;
					cancelExit();
					selectionTurn?.cancel();
					if (!timelineReverted) timeline.revert();
					resizeObserver.disconnect();
					visibilityObserver.disconnect();
					canvas.removeEventListener('pointermove', onPointerMove);
					canvas.removeEventListener('pointerleave', onPointerLeave);
					canvas.removeEventListener('click', onPointerClick);
					canvas.removeEventListener('webglcontextlost', onContextLost);
					window.removeEventListener('scroll', requestEntryReveal);
					window.removeEventListener('resize', requestEntryReveal);
					window.removeEventListener('pointermove', onSharedPointerMove);
					window.removeEventListener('scroll', clearManualSelection);
					document.removeEventListener('visibilitychange', onVisibilityChange);
					blockGeometry.dispose();
					studGeometry.dispose();
					miniGeometryList.forEach((geometry) => geometry.dispose());
					risePalettes.forEach((palette) => palette.all.forEach((material) => material.dispose()));
					tokenSurfaceMaterials.forEach((material) => material.dispose());
					tokenTextures.forEach((texture) => texture.dispose());
					productSurfaceMaterials.forEach((material) => material.dispose());
					productTextures.forEach((texture) => texture.dispose());
					energySurfaceMaterials.forEach((material) => material.dispose());
					solarCableGeometries.forEach((geometry) => geometry.dispose());
					microgridSurfaceMaterials.forEach((material) => material.dispose());
					microgridCableMaterials.forEach((material) => material.dispose());
					microgridCableGeometries.forEach((geometry) => geometry.dispose());
					microgridShadowTexture.dispose();
					microgridShadowMaterial.dispose();
					contactShadowTexture.dispose();
					contactShadowMaterials.forEach((material) => material.dispose());
					nonPyramidEnvironment.dispose();
					sparkGeometry.dispose();
					sparkMaterial.dispose();
					confettiMaterial.dispose();
					ribbonMaterial.dispose();
					labelRenderer.domElement.remove();
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
					<h2 id="foundation-title">See what one shared system unlocks.</h2>
					<p>Fewer repeated decisions, faster delivery, and one consistent EOS experience.</p>
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
									? `${primitives} shared building blocks`
									: index === 2
										? `${composites} ready-made components`
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
