'use client';

import { useEffect, useRef } from 'react';
import { CopyBlock } from '@/components/copy-block';
import StarBurst from '@/components/star-burst';
import { SETUP_SUBSTRATE_PROMPT, SETUP_SUBSTRATE_PROMPT_PREVIEW } from '@/lib/prompts';

const WORD = 'Substrate'.split('');
const BASE_WGHT = 760;
const SWELL_WGHT = 900;
const SWELL_RADIUS = 220; // px — how far the light "presses" the letterforms
function LandingScrollCue() {
	return (
		<div className="landing-scroll-cue">
			<p>See why substrate matters</p>
			<svg viewBox="0 0 16 40" aria-hidden="true">
				<path pathLength="1" d="M8 1v36M3 32l5 5 5-5" />
			</svg>
		</div>
	);
}

/**
 * The landing is the illuminated face of the same drafting plate used by the
 * construction tour. The lamp follows the cursor, the wordmark's variable
 * weight answers it per letter, while the shooting lines keep a fixed
 * half-circle origin at the landing's lower-right corner.
 */
export function LandingStage({
	pkg,
	version,
	lastChange,
	composites,
	primitives,
}: {
	pkg: string;
	version: string;
	lastChange: string;
	composites: number;
	primitives: number;
}) {
	const rootRef = useRef<HTMLElement | null>(null);
	const wordRef = useRef<HTMLHeadingElement | null>(null);
	const readoutRef = useRef<HTMLSpanElement | null>(null);


	useEffect(() => {
		const root = rootRef.current;
		const word = wordRef.current;
		const readout = readoutRef.current;
		if (!root || !word) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;

		const autopilot = window.matchMedia('(hover: none)').matches;
		const letters = Array.from(word.querySelectorAll<HTMLSpanElement>('.landing-l'));
		const t0 = performance.now();
		let width = root.clientWidth;
		let height = root.clientHeight;
		let tx = width * 0.3;
		let ty = height * 0.25;
		let lx = tx;
		let ly = ty;
		let idle = true;
		let raf = 0;
		let lastReadout = '';
		let lastLightX = '';
		let lastLightY = '';
		let lastParallaxX = '';
		let lastParallaxY = '';
		let isVisible = true;
		let letterMetrics: Array<{ element: HTMLSpanElement; x: number; y: number; weight: number }> = [];

		const measure = () => {
			const measuredWeights = new Map(letterMetrics.map(({ element, weight }) => [element, weight]));
			const rootRect = root.getBoundingClientRect();
			width = rootRect.width;
			height = rootRect.height;
			letterMetrics = letters.map((element) => {
				const rect = element.getBoundingClientRect();
				return {
					element,
					x: rect.left - rootRect.left + rect.width / 2,
					y: rect.top - rootRect.top + rect.height / 2,
					weight: measuredWeights.get(element) ?? BASE_WGHT,
				};
			});
		};
		measure();

		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(root);
		resizeObserver.observe(word);

		const onMove = (event: PointerEvent) => {
			const rootRect = root.getBoundingClientRect();
			idle = false;
			tx = event.clientX - rootRect.left;
			ty = event.clientY - rootRect.top;
		};
		root.addEventListener('pointermove', onMove, { passive: true });

		const frame = (time: number) => {
			raf = 0;
			if (!isVisible || document.hidden) return;
			if (width < 1 || height < 1) {
				raf = requestAnimationFrame(frame);
				return;
			}

			// Autopilot on touch devices, and until the first real pointer move.
			if (autopilot || idle) {
				const elapsed = (time - t0) / 1000;
				tx = width * (0.5 + 0.34 * Math.sin(elapsed * 0.21));
				ty = height * (0.34 + 0.2 * Math.sin(elapsed * 0.13 + 1.7));
			}
			lx += (tx - lx) * 0.07;
			ly += (ty - ly) * 0.07;

			const normalizedX = lx / width;
			const normalizedY = ly / height;
			const lightX = (normalizedX * 100).toFixed(2);
			const lightY = (normalizedY * 100).toFixed(2);
			if (lightX !== lastLightX || lightY !== lastLightY) {
				root.style.setProperty('--lx', `${lightX}%`);
				root.style.setProperty('--ly', `${lightY}%`);
				lastLightX = lightX;
				lastLightY = lightY;
			}
			const parallaxX = (normalizedX - 0.5).toFixed(3);
			const parallaxY = (normalizedY - 0.5).toFixed(3);
			if (parallaxX !== lastParallaxX || parallaxY !== lastParallaxY) {
				root.style.setProperty('--pnx', parallaxX);
				root.style.setProperty('--pny', parallaxY);
				lastParallaxX = parallaxX;
				lastParallaxY = parallaxY;
			}

			for (const metric of letterMetrics) {
				const distance = Math.hypot(metric.x - lx, metric.y - ly);
				const proximity = Math.max(0, 1 - distance / SWELL_RADIUS);
				const weight = Math.round(BASE_WGHT + (SWELL_WGHT - BASE_WGHT) * proximity * proximity);
				if (weight !== metric.weight) {
					metric.element.style.fontVariationSettings = `'wght' ${weight}, 'opsz' 96`;
					metric.weight = weight;
				}
			}

			if (readout) {
				const nextReadout = `${String(Math.round(lx)).padStart(4, '0')} · ${String(Math.round(ly)).padStart(4, '0')}`;
				if (nextReadout !== lastReadout) {
					readout.textContent = nextReadout;
					lastReadout = nextReadout;
				}
			}

			raf = requestAnimationFrame(frame);
		};
		const start = () => {
			if (!raf && isVisible && !document.hidden) raf = requestAnimationFrame(frame);
		};
		const stop = () => {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
		};
		const setAnimationActivity = () => {
			root.dataset.cueActive = String(isVisible && !document.hidden);
		};
		const intersectionObserver = new IntersectionObserver(([entry]) => {
			isVisible = entry?.isIntersecting ?? false;
			setAnimationActivity();
			if (isVisible) start();
			else stop();
		});
		intersectionObserver.observe(root);
		const onVisibilityChange = () => {
			setAnimationActivity();
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
			root.removeEventListener('pointermove', onMove);
		};
	}, []);

	return (
		<section
			className="landing"
			ref={rootRef}
			aria-label="Substrate"
			data-cue-active="true"
		>
			{/* Main-branch StarBurst settings (component DEFAULTS); only centerY is
			    overridden to hold the origin at the first component's corner. */}
			<StarBurst className="landing-starburst" centerY={85} />
			<div className="landing-grid" aria-hidden="true" />

			<p className="landing-dateline">
				<span>Substrate Hub · internal edition</span>
				<span>
					{pkg} v{version}
					<span className="landing-last-change"> · last change {lastChange}</span>
				</span>
			</p>

			<div className="landing-word-wrap">
				<span className="landing-ghost" aria-hidden="true">
					Substrate
				</span>
				<h1 className="landing-word" ref={wordRef} aria-label="Substrate">
					{WORD.map((ch, i) => (
						<span key={i} aria-hidden="true" className="landing-l" style={{ animationDelay: `${i * 55}ms` }}>
							{ch}
						</span>
					))}
				</h1>
			</div>

			<div className="landing-body">
				<div className="landing-pitch">
					<p className="landing-position">The foundational medium from which experiences emerge.</p>
					<p className="landing-copy">An agent-first, modern design system.</p>
					<CopyBlock
						label="Agent-ready setup"
						copyLabel="copy prompt"
						prompt
						preview={SETUP_SUBSTRATE_PROMPT_PREVIEW}
						code={SETUP_SUBSTRATE_PROMPT}
					/>
				</div>
				<LandingScrollCue />
				<p className="landing-readout mono" aria-hidden="true">
					light <span className="landing-readout-live" ref={readoutRef}>—</span>
				</p>
			</div>
		</section>
	);
}
