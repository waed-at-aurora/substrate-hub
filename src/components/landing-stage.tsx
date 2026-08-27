'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import StarBurst from '@/components/star-burst';
import { ExtArrow } from '@/components/marks';
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

		// Pointer state, lerped each frame so the lamp trails like a real light.
		let tx = window.innerWidth * 0.3;
		let ty = window.innerHeight * 0.25;
		let lx = tx;
		let ly = ty;
		let idle = true;
		let raf = 0;
		let t0 = performance.now();

		const onMove = (e: PointerEvent) => {
			idle = false;
			tx = e.clientX;
			ty = e.clientY;
		};
		root.addEventListener('pointermove', onMove);

		let w = 0;
		let h = 0;
		const resize = () => {
			w = root.clientWidth;
			h = root.clientHeight;
		};
		resize();
		window.addEventListener('resize', resize);

		const frame = (t: number) => {
			// Autopilot on touch devices, and until the first real pointer move.
			if (autopilot || idle) {
				const s = (t - t0) / 1000;
				tx = w * (0.5 + 0.34 * Math.sin(s * 0.21));
				ty = h * (0.34 + 0.2 * Math.sin(s * 0.13 + 1.7));
			}
			lx += (tx - lx) * 0.07;
			ly += (ty - ly) * 0.07;

			root.style.setProperty('--lx', `${((lx / w) * 100).toFixed(2)}%`);
			root.style.setProperty('--ly', `${((ly / h) * 100).toFixed(2)}%`);
			root.style.setProperty('--pnx', ((lx / w) - 0.5).toFixed(3));
			root.style.setProperty('--pny', ((ly / h) - 0.5).toFixed(3));

			// The light presses the letterforms: weight swells with proximity.
			for (const el of letters) {
				const r = el.getBoundingClientRect();
				const dx = r.left + r.width / 2 - lx;
				const dy = r.top + r.height / 2 - ly;
				const d = Math.hypot(dx, dy);
				const k = Math.max(0, 1 - d / SWELL_RADIUS);
				const wght = Math.round(BASE_WGHT + (SWELL_WGHT - BASE_WGHT) * k * k);
				el.style.fontVariationSettings = `'wght' ${wght}, 'opsz' 96`;
			}

			if (readout) {
				readout.textContent = `${String(Math.round(lx)).padStart(4, '0')} · ${String(Math.round(ly)).padStart(4, '0')}`;
			}

			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			root.removeEventListener('pointermove', onMove);
			window.removeEventListener('resize', resize);
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
