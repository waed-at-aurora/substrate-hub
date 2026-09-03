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
				aria-label="System pyramid: Substrate spans UI primitives, tokens, composite components, and interaction patterns; each layer opens its note."
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
					{/* middle: the highest-leverage layer — reusable UX, washed in the brand yellow */}
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
						<text x="280" y="150" textAnchor="middle" fill="var(--yellow)" fontWeight="700" fontSize="12" letterSpacing="0.14em">COMPOSITES &amp; PATTERNS</text>
						<text x="280" y="170" textAnchor="middle" fill="var(--ink-2)" fontSize="9.5">Substrate&apos;s highest-leverage UX layer</text>
						<text x="280" y="186" textAnchor="middle" fill="var(--ink-2)" fontSize="9.5">reusable across every EOS product</text>
					</a>
					{/* base: the shared foundation Substrate also owns */}
					<a
						className="pyr-btn pyr-a-foundation"
						href="#pyr-foundation"
						role="button"
						aria-expanded={open === 'foundation'}
						aria-controls="pyr-foundation"
						aria-pressed={open === 'foundation'}
						onClick={pick('foundation')}
					>
						<path d="M112 214 L448 214 L486 292 L74 292 Z" fill="color-mix(in srgb, var(--yellow) 7%, var(--surface))" stroke="color-mix(in srgb, var(--yellow) 46%, var(--rule))" strokeWidth="1.2" />
						<text x="280" y="246" textAnchor="middle" fill="var(--ink)" fontWeight="600" letterSpacing="0.12em">UI PRIMITIVES &amp; TOKENS</text>
						<text x="280" y="266" textAnchor="middle" fill="var(--muted)" fontSize="9.5">shared foundation · type · spacing · base behaviors</text>
					</a>
					{/* Substrate spans the middle UX layer and its shared foundation */}
					<g stroke="color-mix(in srgb, var(--yellow) 55%, var(--rule))" strokeWidth="1">
						<line x1="412" y1="120" x2="505" y2="120" />
						<line x1="486" y1="292" x2="505" y2="292" />
						<line x1="505" y1="120" x2="505" y2="292" />
					</g>
					<text x="513" y="161" fill="color-mix(in srgb, var(--yellow) 70%, var(--muted))" fontSize="9" writingMode="tb" letterSpacing="0.1em">SUBSTRATE</text>
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
					<span className="mono">The UX core</span>
					<p>
						Substrate doubles down on the layer typical design systems leave to product flows:
						reusable composite components and interaction patterns. It is the highest-leverage UX
						work for building with AI — {composites} composites and {primitives} primitives today.
					</p>
				</div>
				<div className="pyramid-note acc" id="pyr-foundation" data-open={open === 'foundation'}>
					<span className="mono">The shared foundation</span>
					<p>
						Substrate also includes UI primitives and EOS tokens. Most design systems cover this
						foundation well; here it makes the composite UX layer dependable rather than defining the
						highest-value work.
					</p>
				</div>
			</div>

		</div>
	);
}
