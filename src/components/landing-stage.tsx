'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ExtArrow } from '@/components/marks';
import { InstallLine } from '@/components/install-line';

const WORD = 'Substrate'.split('');
const BASE_WGHT = 760;
const SWELL_WGHT = 900;
const SWELL_RADIUS = 220; // px — how far the light "presses" the letterforms

/**
 * The landing is the stage grown to the whole viewport. One pointer-driven
 * moment, orchestrated: the lamp follows the cursor across the drafting grid,
 * dust drifts in its beam, and the wordmark's variable weight answers the
 * light per letter. On touch (no hover) the lamp autopilots a slow path.
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
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const readoutRef = useRef<HTMLSpanElement | null>(null);

	useEffect(() => {
		const root = rootRef.current;
		const word = wordRef.current;
		const canvas = canvasRef.current;
		const readout = readoutRef.current;
		if (!root || !word || !canvas) return;

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return; // static stage: CSS defaults hold, no rAF, no particles

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

		// Dust in the beam — bounded canvas, DPR-aware, paused when hidden.
		const ctx = canvas.getContext('2d');
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		let w = 0;
		let h = 0;
		const resize = () => {
			w = root.clientWidth;
			h = root.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx?.scale(dpr, dpr);
			ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener('resize', resize);

		const N = 112;
		const dust = Array.from({ length: N }, (_, i) => ({
			x: ((i * 379) % 1000) / 1000,
			y: ((i * 613) % 1000) / 1000,
			r: 0.6 + ((i * 97) % 100) / 90,
			vx: -0.03 - ((i * 53) % 100) / 2400,
			vy: -0.05 - ((i * 31) % 100) / 2000,
			warm: i % 9 === 0, // a few motes catch the lamp's own color
		}));

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

			if (ctx && !document.hidden) {
				ctx.clearRect(0, 0, w, h);
				for (const p of dust) {
					p.x += p.vx / 100;
					p.y += p.vy / 100;
					if (p.x < -0.02) p.x = 1.02;
					if (p.y < -0.02) p.y = 1.02;
					const px = p.x * w;
					const py = p.y * h;
					const d = Math.hypot(px - lx, py - ly);
					const lit = Math.max(0, 1 - d / (w * 0.32));
					const a = 0.05 + lit * lit * 0.5;
					ctx.beginPath();
					ctx.arc(px, py, p.r, 0, Math.PI * 2);
					ctx.fillStyle = p.warm
						? `rgba(255, 204, 0, ${(a * 0.55).toFixed(3)})`
						: `rgba(244, 244, 245, ${a.toFixed(3)})`;
					ctx.fill();
				}
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
			<canvas ref={canvasRef} className="landing-dust" aria-hidden="true" />
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
