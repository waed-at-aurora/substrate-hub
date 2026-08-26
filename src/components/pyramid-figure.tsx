'use client';

import { useState } from 'react';

type Layer = 'products' | 'substrate' | 'foundation';

/**
 * FIG. 1 — the interactive system pyramid. Each layer is a button that opens
 * its note in the accordion column. Selection is local state (no hash change,
 * no scroll jump); the Substrate layer's note is open by default.
 */
export function PyramidFigure({ composites, primitives }: { composites: number; primitives: number }) {
	const [open, setOpen] = useState<Layer>('substrate');

	const pick = (layer: Layer) => (e: React.MouseEvent) => {
		e.preventDefault();
		setOpen(layer);
	};

	return (
		<div className="pyramid-wrap">
			<svg
				viewBox="0 0 560 330"
				role="img"
				aria-label="System pyramid: each layer is a button that opens its note."
				style={{ width: '100%', height: 'auto', display: 'block' }}
			>
				<g fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="0.08em">
					{/* top: EOS products — differentiation stays possible, so the edge is dashed */}
					<a
						className="pyr-btn pyr-a-products"
						href="#pyr-products"
						role="button"
						aria-expanded={open === 'products'}
						aria-controls="pyr-products"
						aria-pressed={open === 'products'}
						onClick={pick('products')}
					>
						<path d="M205 40 L355 40 L400 106 L160 106 Z" fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth="1.2" strokeDasharray="5 4" />
						<text x="280" y="68" textAnchor="middle" fill="var(--ink)" fontWeight="600" letterSpacing="0.12em">EOS PRODUCTS</text>
						<text x="280" y="88" textAnchor="middle" fill="var(--muted)" fontSize="9.5">product variants remain possible</text>
					</a>
					{/* middle: Substrate — the layer this system owns, washed in the brand yellow */}
					<a
						className="pyr-btn pyr-a-substrate"
						href="#pyr-substrate"
						role="button"
						aria-expanded={open === 'substrate'}
						aria-controls="pyr-substrate"
						aria-pressed={open === 'substrate'}
						onClick={pick('substrate')}
					>
						<path d="M160 120 L400 120 L448 200 L112 200 Z" fill="color-mix(in srgb, var(--yellow) 22%, var(--paper))" stroke="var(--yellow)" strokeWidth="1.2" />
						<text x="280" y="150" textAnchor="middle" fill="var(--yellow)" fontWeight="700" fontSize="13" letterSpacing="0.18em">SUBSTRATE</text>
						<text x="280" y="170" textAnchor="middle" fill="var(--ink-2)" fontSize="9.5">composite components · interaction patterns</text>
						<text x="280" y="186" textAnchor="middle" fill="var(--ink-2)" fontSize="9.5">shared across every EOS product</text>
					</a>
					{/* base: primitives and tokens */}
					<a
						className="pyr-btn pyr-a-foundation"
						href="#pyr-foundation"
						role="button"
						aria-expanded={open === 'foundation'}
						aria-controls="pyr-foundation"
						aria-pressed={open === 'foundation'}
						onClick={pick('foundation')}
					>
						<path d="M112 214 L448 214 L486 292 L74 292 Z" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.2" />
						<text x="280" y="246" textAnchor="middle" fill="var(--ink)" fontWeight="600" letterSpacing="0.12em">UI PRIMITIVES &amp; TOKENS</text>
						<text x="280" y="266" textAnchor="middle" fill="var(--muted)" fontSize="9.5">base-ui primitives · EOS color, type, spacing tokens</text>
					</a>
					{/* dimension callout for the layer this system owns */}
					<g stroke="color-mix(in srgb, var(--yellow) 55%, var(--rule))" strokeWidth="1">
						<line x1="412" y1="120" x2="505" y2="120" />
						<line x1="456" y1="200" x2="505" y2="200" />
						<line x1="505" y1="120" x2="505" y2="200" />
					</g>
					<text x="513" y="164" fill="color-mix(in srgb, var(--yellow) 70%, var(--muted))" fontSize="9" writingMode="tb" letterSpacing="0.1em">THIS SYSTEM</text>
				</g>
			</svg>
			{/* notes mirror the pyramid top-to-bottom: products, substrate, foundation */}

			<div className="pyramid-notes">
				<div className="pyramid-note acc" id="pyr-products" data-open={open === 'products'}>
					<span className="mono">Room above</span>
					<p>
						Product variants remain possible above the shared system. Differentiate at the product
						layer; never fork the shared one.
					</p>
				</div>
				<div className="pyramid-note acc" id="pyr-substrate" data-open={open === 'substrate'}>
					<span className="mono">The shared layer</span>
					<p>
						Substrate&rsquo;s responsibility is the middle: composite components and interaction
						patterns every EOS product shares — {composites} composites and {primitives} primitives
						today.
					</p>
				</div>
				<div className="pyramid-note acc" id="pyr-foundation" data-open={open === 'foundation'}>
					<span className="mono">Foundation</span>
					<p>
						Primitives and tokens are the base: base-ui behaviors and the EOS color, type, and
						spacing ramps. Substrate consumes them; products rarely touch them directly.
					</p>
				</div>
			</div>

		</div>
	);
}
