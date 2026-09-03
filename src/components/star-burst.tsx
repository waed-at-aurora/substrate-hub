'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

type StarBurstProps = {
	speed?: number;
	starCount?: number;
	color?: string;
	centerX?: number;
	centerY?: number;
	starSize?: number;
	opacity?: number;
	flowerIntensity?: number;
	twinkleSpeed?: number;
	className?: string;
	style?: CSSProperties;
};

const DEFAULTS = {
	speed: 1.5,
	starCount: 28,
	color: '#f4f4f5',
	centerX: 100,
	centerY: 100,
	starSize: 11,
	opacity: 50,
	flowerIntensity: 23,
	twinkleSpeed: 11,
} as const;

function parseColor(input: string): [number, number, number] {
	const value = input.trim();
	if (value.startsWith('#')) {
		let hex = value.slice(1);
		if (hex.length === 3) {
			hex = hex
				.split('')
				.map((character) => character + character)
				.join('');
		}
		const parsed = Number.parseInt(hex, 16);
		if (hex.length === 6 && Number.isFinite(parsed)) {
			return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
		}
	}

	const rgb = value.match(/rgba?\(([^)]+)\)/i);
	if (rgb) {
		const channels = rgb[1].split(',').map((channel) => Number.parseFloat(channel.trim()));
		if (channels.length >= 3 && channels.slice(0, 3).every(Number.isFinite)) {
			return [channels[0], channels[1], channels[2]];
		}
	}

	return [255, 255, 255];
}

function makeRng(seed: number) {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let value = state;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Originkit Star Burst, adapted into shooting assembly lines that originate at
 * the entering pyramid's screen position and travel through the Night Portal.
 */
export default function StarBurst({
	speed = DEFAULTS.speed,
	starCount = DEFAULTS.starCount,
	color = DEFAULTS.color,
	centerX = DEFAULTS.centerX,
	centerY = DEFAULTS.centerY,
	starSize = DEFAULTS.starSize,
	opacity = DEFAULTS.opacity,
	flowerIntensity = DEFAULTS.flowerIntensity,
	twinkleSpeed = DEFAULTS.twinkleSpeed,
	className,
	style,
}: StarBurstProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;

		const context = canvas.getContext('2d');
		if (!context) return;

		const [red, green, blue] = parseColor(color);
		const safeSpeed = Math.max(0, speed / 10);
		const safeCenterX = Math.max(0, Math.min(1, centerX / 100));
		const safeCenterY = Math.max(0, Math.min(1, centerY / 100));
		const safeStarSize = Math.max(0.01, starSize / 20);
		const safeOpacity = Math.max(0, Math.min(1, opacity / 100));
		const safeFlowerIntensity = Math.max(0, flowerIntensity / 20);
		const safeTwinkleSpeed = Math.max(0, twinkleSpeed / 20);
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const rng = makeRng(0xbadf00d);

		const pulsesPerSpoke = 15;
		const maxParticles = 5000;
		const spokeCount = Math.min(maxParticles, Math.max(0, Math.floor(starCount)));
		const pulseCount =
			spokeCount === 0 ? 0 : Math.min(pulsesPerSpoke, Math.max(1, Math.floor(maxParticles / spokeCount)));
		const particleCount = spokeCount * pulseCount;

		const spokeCos = new Float32Array(spokeCount);
		const spokeSin = new Float32Array(spokeCount);
		for (let index = 0; index < spokeCount; index += 1) {
			const angle = (index / Math.max(1, spokeCount)) * Math.PI * 2 + (rng() - 0.5) * 0.02;
			spokeCos[index] = Math.cos(angle);
			spokeSin[index] = Math.sin(angle);
		}

		const particleSpoke = new Uint16Array(particleCount);
		const particlePosition = new Float32Array(particleCount);
		const particleSpeed = new Float32Array(particleCount);
		const particleSize = new Float32Array(particleCount);
		const particlePhase = new Float32Array(particleCount);

		for (let index = 0; index < particleCount; index += 1) {
			particleSpoke[index] = index % spokeCount;
			particlePosition[index] = -0.05 + rng() * 1.1;
			particleSpeed[index] = (0.5 + rng()) * 0.25;
			particleSize[index] = 0.7 + rng() * 0.8;
			particlePhase[index] = rng() * Math.PI * 2;
		}

		const spriteLength = 64;
		const streak = document.createElement('canvas');
		streak.width = spriteLength;
		streak.height = 2;
		const streakContext = streak.getContext('2d');
		if (streakContext) {
			const gradient = streakContext.createLinearGradient(0, 0, spriteLength, 0);
			gradient.addColorStop(0, `rgba(${red},${green},${blue},0)`);
			gradient.addColorStop(0.7, `rgba(${red},${green},${blue},0.6)`);
			gradient.addColorStop(1, `rgba(${red},${green},${blue},1)`);
			streakContext.fillStyle = gradient;
			streakContext.fillRect(0, 0, spriteLength, 2);
		}

		let width = 1;
		let height = 1;
		let dpr = 1;
		let centerPixelX = 0;
		let centerPixelY = 0;
		let radius = 1;
		let bloomRadius = 8;
		let bloomGradient: CanvasGradient | null = null;

		const resize = (entry?: ResizeObserverEntry) => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			const rect = entry?.contentRect;
			width = Math.max(1, Math.floor(rect?.width || container.clientWidth || 800));
			height = Math.max(1, Math.floor(rect?.height || container.clientHeight || 600));
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			context.setTransform(dpr, 0, 0, dpr, 0, 0);

			centerPixelX = safeCenterX * width;
			centerPixelY = safeCenterY * height;
			radius = Math.hypot(width, height);
			bloomRadius = Math.max(
				8,
				Math.min(width, height) * 0.18 * (safeFlowerIntensity * 0.5 + 0.5) * (0.6 + safeStarSize * 0.4),
			);

			const bloomAlpha = Math.min(1, safeFlowerIntensity * safeOpacity);
			bloomGradient = context.createRadialGradient(
				centerPixelX,
				centerPixelY,
				0,
				centerPixelX,
				centerPixelY,
				bloomRadius,
			);
			bloomGradient.addColorStop(0, `rgba(${red},${green},${blue},${bloomAlpha})`);
			bloomGradient.addColorStop(0.3, `rgba(${red},${green},${blue},${bloomAlpha * 0.5})`);
			bloomGradient.addColorStop(0.7, `rgba(${red},${green},${blue},${bloomAlpha * 0.15})`);
			bloomGradient.addColorStop(1, `rgba(${red},${green},${blue},0)`);
		};

		resize();
		const resizeObserver = new ResizeObserver((entries) => resize(entries[0]));
		resizeObserver.observe(container);

		let elapsed = 0;
		const drawFrame = (deltaSeconds: number) => {
			const delta = Math.max(0.001, Math.min(0.05, deltaSeconds));
			elapsed += delta;

			context.setTransform(dpr, 0, 0, dpr, 0, 0);
			context.globalCompositeOperation = 'source-over';
			context.clearRect(0, 0, width, height);
			context.globalCompositeOperation = 'lighter';

			if (bloomGradient && safeFlowerIntensity * safeOpacity > 0.001) {
				context.fillStyle = bloomGradient;
				context.fillRect(
					centerPixelX - bloomRadius,
					centerPixelY - bloomRadius,
					bloomRadius * 2,
					bloomRadius * 2,
				);
			}

			for (let index = 0; index < particleCount; index += 1) {
				particlePosition[index] += particleSpeed[index] * safeSpeed * delta;
				if (particlePosition[index] > 1.1) {
					particlePosition[index] = -0.05 - rng() * 0.05;
					particleSize[index] = 0.7 + rng() * 0.8;
					particlePhase[index] = rng() * Math.PI * 2;
				}

				const position = particlePosition[index];
				if (position < 0 || position >= 1) continue;

				const twinkle = 0.7 + 0.3 * Math.sin(elapsed * safeTwinkleSpeed * 6 + particlePhase[index]);
				const fade =
					position < 0.06 ? position / 0.06 : position < 0.85 ? 1 : 1 - (position - 0.85) / 0.15;
				const alpha = Math.min(1, twinkle * fade * (1 + 0.5 * position) * safeOpacity);
				if (alpha < 0.005) continue;

				const spokeIndex = particleSpoke[index];
				const cosine = spokeCos[spokeIndex];
				const sine = spokeSin[spokeIndex];
				const distance = position * radius;
				const pixelX = centerPixelX + cosine * distance;
				const pixelY = centerPixelY + sine * distance;
				const speedFactor = particleSpeed[index] / 0.25;
				const lineLength =
					(8 + 12 * speedFactor) * (0.7 + 0.6 * particleSize[index] * safeStarSize);

				context.setTransform(
					dpr * cosine,
					dpr * sine,
					-dpr * sine,
					dpr * cosine,
					dpr * pixelX,
					dpr * pixelY,
				);
				context.globalAlpha = alpha;
				context.drawImage(streak, -lineLength, -0.5, lineLength, 1);
			}

			context.setTransform(dpr, 0, 0, dpr, 0, 0);
			context.globalAlpha = 1;
		};

		if (reducedMotion) {
			for (let frame = 0; frame < 60; frame += 1) drawFrame(1 / 60);
			return () => resizeObserver.disconnect();
		}
		let isVisible = true;
		let animationFrame = 0;
		let previousTime = performance.now();
		const loop = (time: number) => {
			animationFrame = 0;
			if (!isVisible || document.hidden) return;
			const delta = (time - previousTime) / 1000;
			previousTime = time;
			drawFrame(delta);
			animationFrame = requestAnimationFrame(loop);
		};
		const start = () => {
			if (animationFrame || !isVisible || document.hidden) return;
			previousTime = performance.now();
			animationFrame = requestAnimationFrame(loop);
		};
		const stop = () => {
			if (animationFrame) cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		};
		const intersectionObserver = new IntersectionObserver(([entry]) => {
			isVisible = entry?.isIntersecting ?? false;
			if (isVisible) start();
			else stop();
		});
		intersectionObserver.observe(container);
		const onVisibilityChange = () => {
			if (document.hidden) stop();
			else start();
		};
		document.addEventListener('visibilitychange', onVisibilityChange);
		start();

		return () => {
			stop();
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}, [speed, starCount, color, centerX, centerY, starSize, opacity, flowerIntensity, twinkleSpeed]);

	return (
		<div ref={containerRef} className={className} style={style} aria-hidden="true">
			<canvas
				ref={canvasRef}
				style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
			/>
		</div>
	);
}
