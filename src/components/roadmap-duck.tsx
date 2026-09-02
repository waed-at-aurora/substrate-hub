'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const DITHER_VERTEX = `
out vec2 vUv;
void main() {
	vUv = position.xy * 0.5 + 0.5;
	gl_Position = vec4(position, 1.0);
}`;

const DITHER_FRAGMENT = `
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uGridSize;

const mat4 thresholds = mat4(
	0.94118, 0.29412, 0.76471, 0.05882,
	0.47059, 0.70588, 0.23529, 0.52941,
	0.82353, 0.11765, 0.88235, 0.17647,
	0.35294, 0.58824, 0.41176, 0.64706
);

void main() {
	vec2 fragment = vUv * uResolution;
	vec2 cell = floor(fragment / uGridSize);
	vec2 sampleUv = (cell + 0.5) * uGridSize / uResolution;
	vec4 source = texture(tScene, sampleUv);
	float luminance = dot(source.rgb, vec3(0.299, 0.587, 0.114));
	ivec2 matrixCell = ivec2(mod(cell, 4.0));
	float mark = step(thresholds[matrixCell.x][matrixCell.y], luminance);
	outColor = vec4(vec3(0.88) * mark, source.a * mark);
}`;

export function RoadmapDuck() {
	const hostRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const host = hostRef.current;
		const canvas = canvasRef.current;
		const interactionSurface = host?.parentElement;
		if (!host || !canvas || !interactionSurface) return;

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({
				canvas,
				alpha: true,
				antialias: false,
				powerPreference: 'high-performance',
			});
		} catch {
			host.dataset.duckFailed = 'true';
			return;
		}

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
		camera.position.set(0, 0.12, 5.2);
		camera.lookAt(0, 0.05, 0);

		const pivot = new THREE.Group();
		pivot.position.set(1.05, -0.08, 0);
		scene.add(pivot);
		scene.add(new THREE.HemisphereLight(0xffffff, 0x15151a, 2.8));
		const key = new THREE.DirectionalLight(0xffffff, 4.6);
		key.position.set(-3, 5, 4);
		scene.add(key);
		const rim = new THREE.DirectionalLight(0x53eafd, 3.2);
		rim.position.set(4, 1, -2);
		scene.add(rim);

		const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
			depthBuffer: true,
			stencilBuffer: false,
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
		});
		renderTarget.texture.colorSpace = THREE.SRGBColorSpace;

		const postMaterial = new THREE.ShaderMaterial({
			glslVersion: THREE.GLSL3,
			vertexShader: DITHER_VERTEX,
			fragmentShader: DITHER_FRAGMENT,
			uniforms: {
				tScene: { value: renderTarget.texture },
				uResolution: { value: new THREE.Vector2(1, 1) },
				uGridSize: { value: 3.5 },
			},
			depthTest: false,
			depthWrite: false,
			transparent: true,
		});
		const postGeometry = new THREE.BufferGeometry();
		postGeometry.setAttribute(
			'position',
			new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
		);
		const postScene = new THREE.Scene();
		postScene.add(new THREE.Mesh(postGeometry, postMaterial));
		const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);


		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let duck: THREE.Object3D | null = null;
		let duckUnitScale = 1;
		let disposed = false;
		let inView = true;
		let frame = 0;
		let targetYaw = 0;
		let targetPitch = 0;
		let yaw = 0;
		let pitch = 0;
		let startTime = performance.now();

		const render = () => {
			renderer.setRenderTarget(renderTarget);
			renderer.setClearColor(0x000000, 0);
			renderer.clear();
			renderer.render(scene, camera);
			renderer.setRenderTarget(null);
			renderer.setClearColor(0x000000, 0);
			renderer.clear();
			renderer.render(postScene, postCamera);
		};

		const tick = (time: number) => {
			if (disposed || !inView || document.hidden) return;
			if (!reducedMotion) {
				yaw += (targetYaw - yaw) * 0.075;
				pitch += (targetPitch - pitch) * 0.075;
				pivot.rotation.set(pitch, yaw, 0);
				pivot.position.y = -0.08 + Math.sin((time - startTime) * 0.0012) * 0.035;
			}
			render();
			if (!reducedMotion) frame = requestAnimationFrame(tick);
		};

		const start = () => {
			cancelAnimationFrame(frame);
			startTime = performance.now();
			frame = requestAnimationFrame(tick);
		};

		const resize = () => {
			const { width, height } = host.getBoundingClientRect();
			const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
			pivot.position.x = width <= 520 ? 0.72 : 1.35;
			if (duck) duck.scale.setScalar(duckUnitScale * (width <= 520 ? 1.45 : 1.85));
			renderer.setPixelRatio(ratio);
			renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
			renderTarget.setSize(Math.max(Math.round(width * ratio), 1), Math.max(Math.round(height * ratio), 1));
			postMaterial.uniforms.uResolution.value.set(width * ratio, height * ratio);
			postMaterial.uniforms.uGridSize.value = 3.5 * ratio;
			camera.aspect = width / Math.max(height, 1);
			camera.updateProjectionMatrix();
			render();
		};

		const onPointerMove = (event: PointerEvent) => {
			const bounds = interactionSurface.getBoundingClientRect();
			const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
			const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
			targetYaw = THREE.MathUtils.clamp(x, -1, 1) * 0.72;
			targetPitch = THREE.MathUtils.clamp(y, -1, 1) * 0.28;
		};
		const onPointerLeave = () => {
			targetYaw = 0;
			targetPitch = 0;
		};
		const onVisibility = () => {
			if (!document.hidden && inView) start();
		};

		const resizeObserver = new ResizeObserver(resize);
		const viewObserver = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
			if (inView) start();
			else cancelAnimationFrame(frame);
		});
		resizeObserver.observe(host);
		viewObserver.observe(host);
		document.addEventListener('visibilitychange', onVisibility);
		if (!reducedMotion) {
			interactionSurface.addEventListener('pointermove', onPointerMove, { passive: true });
			interactionSurface.addEventListener('pointerleave', onPointerLeave, { passive: true });
		}

		new GLTFLoader().load(
			'/models/duck.glb',
			(gltf) => {
				if (disposed) return;
				duck = gltf.scene;
				const bounds = new THREE.Box3().setFromObject(duck);
				const size = bounds.getSize(new THREE.Vector3());
				const center = bounds.getCenter(new THREE.Vector3());
				duck.position.sub(center);
				duckUnitScale = 1 / Math.max(size.x, size.y, size.z, 0.001);
				duck.scale.setScalar(duckUnitScale * (host.clientWidth <= 520 ? 1.45 : 1.85));
				duck.rotation.y = Math.PI;
				pivot.add(duck);
				host.dataset.duckReady = 'true';
				render();
			},
			undefined,
			() => {
				host.dataset.duckFailed = 'true';
			},
		);

		resize();
		start();

		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			viewObserver.disconnect();
			document.removeEventListener('visibilitychange', onVisibility);
			interactionSurface.removeEventListener('pointermove', onPointerMove);
			interactionSurface.removeEventListener('pointerleave', onPointerLeave);
			duck?.traverse((node) => {
				const mesh = node as THREE.Mesh;
				mesh.geometry?.dispose();
				const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
				for (const material of materials) {
					if (!material) continue;
					for (const value of Object.values(material)) {
						if (value instanceof THREE.Texture) value.dispose();
					}
					material.dispose();
				}
			});
			renderTarget.dispose();
			postGeometry.dispose();
			postMaterial.dispose();
			renderer.dispose();
		};
	}, []);

	return (
		<div className="roadmap-duck" ref={hostRef} aria-hidden="true">
			<canvas ref={canvasRef} />
		</div>
	);
}
