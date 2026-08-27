'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import StarBurst from '@/components/star-burst';
import { InstallLine } from '@/components/install-line';

const WORD = 'Substrate'.split('');
const BASE_WGHT = 760;
const SWELL_WGHT = 900;
const SWELL_RADIUS = 220; // px — how far the light "presses" the letterforms

/**
 * The landing is the stage grown to the whole viewport. One pointer-driven
 * moment, orchestrated: the lamp follows the cursor across the drafting grid,
 * a star burst radiates beneath it, and the wordmark's variable weight answers
 * the light per letter. On touch (no hover) the lamp autopilots a slow path.
 * Everything settles to a static, legible stage under prefers-reduced-motion.
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
		if (reduced) return; // static stage: CSS defaults hold; StarBurst renders one still frame

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

			root.style.setProperty('--lx', `${((lx / width) * 100).toFixed(2)}%`);
			root.style.setProperty('--ly', `${((ly / height) * 100).toFixed(2)}%`);
			root.style.setProperty('--pnx', ((lx / width) - 0.5).toFixed(3));
			root.style.setProperty('--pny', ((ly / height) - 0.5).toFixed(3));

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
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			resizeObserver.disconnect();
			root.removeEventListener('pointermove', onMove);
		};
	}, []);

	return (
		<section className="landing" ref={rootRef} aria-label="Substrate — the EOS design system">
			<StarBurst className="landing-starburst" />
			<div className="landing-grid" aria-hidden="true" />

			<p className="landing-dateline">
				<span>Substrate Hub · internal edition</span>
				<span>
					{pkg} v{version} · last change {lastChange}
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
					<p className="landing-position">The shared layer behind consistent EOS experiences.</p>
					<p className="landing-copy">
						Reusable composite components and interaction patterns — {composites} composites,{' '}
						{primitives} primitives, one shared system with room to differ above it.
					</p>
					<div className="landing-actions">
						<Link className="action action-primary" href="/overview">
							Enter the hub
						</Link>
						<Link className="action" href="/get-started">
							Install Substrate
						</Link>
						<Link className="action" href="/patterns">
							Explore patterns
						</Link>
					</div>
					<InstallLine command="npx --yes github:AuroraEnergyResearch/substrate-cli-v2 install" />
				</div>
				<p className="landing-readout mono" aria-hidden="true">
					light <span className="landing-readout-live" ref={readoutRef}>—</span>
				</p>
			</div>
		</section>
	);
}
