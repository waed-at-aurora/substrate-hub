'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { RoadmapDuck } from '@/components/roadmap-duck';

const NOISE_FPS = 12;

export function RoadmapComingSoon() {
	const noiseRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = noiseRef.current;
		const context = canvas?.getContext('2d', { alpha: true });
		if (!canvas || !context) return;

		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let frame = 0;
		let lastPaint = 0;
		let visible = true;
		let pixels = new Uint8ClampedArray();
		let image = new ImageData(1, 1);

		const resize = () => {
			const bounds = canvas.getBoundingClientRect();
			canvas.width = Math.max(180, Math.min(360, Math.round(bounds.width / 3)));
			canvas.height = Math.max(100, Math.round((canvas.width * bounds.height) / Math.max(bounds.width, 1)));
			image = context.createImageData(canvas.width, canvas.height);
			pixels = image.data;
			if (motion.matches) frame = requestAnimationFrame(paint);
		};

		const paint = (time: number) => {
			if (!visible || document.hidden) {
				frame = requestAnimationFrame(paint);
				return;
			}
			if (!motion.matches && time - lastPaint < 1000 / NOISE_FPS) {
				frame = requestAnimationFrame(paint);
				return;
			}
			lastPaint = time;

			for (let index = 0; index < pixels.length; index += 4) {
				const value = 104 + Math.random() * 151;
				pixels[index] = value;
				pixels[index + 1] = value;
				pixels[index + 2] = value;
				pixels[index + 3] = 16 + Math.random() * 34;
			}
			context.putImageData(image, 0, 0);

			if (motion.matches) return;
			frame = requestAnimationFrame(paint);
		};

		const resizeObserver = new ResizeObserver(resize);
		const intersectionObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
		});
		resizeObserver.observe(canvas);
		intersectionObserver.observe(canvas);
		resize();
		frame = requestAnimationFrame(paint);

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
		};
	}, []);

	return (
		<section className="roadmap-signal" aria-labelledby="roadmap-coming-soon-title">
			<div className="roadmap-vhs">
				<canvas className="roadmap-vhs-noise" ref={noiseRef} aria-hidden="true" />
				<RoadmapDuck />
				<div className="roadmap-vhs-scanlines" aria-hidden="true" />
				<div className="roadmap-vhs-content">
					<div className="roadmap-vhs-meta" aria-hidden="true">
						<span>SUBSTRATE / RM-06</span>
						<span>PLAY ▸</span>
					</div>

					<div className="roadmap-vhs-lockup">
						<h1 id="roadmap-coming-soon-title" data-text="Coming soon">
							Coming soon
						</h1>
						<p>The roadmap is being tuned against the planning source before transmission.</p>
					</div>

					<div className="roadmap-vhs-footer" aria-hidden="true">
						<span>TRACKING</span>
						<span className="roadmap-vhs-track"><i /></span>
						<span>00:00:06:00</span>
					</div>
				</div>
			</div>

			<p className="roadmap-signal-note">
				Until the signal is ready, follow completed work in <Link href="/releases">releases</Link>.
			</p>
		</section>
	);
}
