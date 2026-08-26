/**
 * FIG. 1 — the system pyramid drawn as a report exhibit.
 * Primitives are the foundation; Substrate owns the shared composite
 * and pattern layer; product variants remain possible above it.
 */
export function Pyramid() {
	return (
		<svg
			viewBox="0 0 560 330"
			role="img"
			aria-label="System pyramid: UI primitives and tokens at the base; Substrate's composite components and interaction patterns in the middle; EOS products and product variants at the top."
			style={{ width: '100%', height: 'auto', display: 'block' }}
		>
			<g fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="0.08em">
				{/* top: EOS products — differentiation stays possible, so the edge is dashed */}
				<path
					d="M205 40 L355 40 L400 106 L160 106 Z"
					fill="var(--paper-raised)"
					stroke="var(--ink)"
					strokeWidth="1.2"
					strokeDasharray="5 4"
				/>
				<text x="280" y="68" textAnchor="middle" fill="var(--ink)" fontWeight="600" letterSpacing="0.12em">
					EOS PRODUCTS
				</text>
				<text x="280" y="88" textAnchor="middle" fill="var(--muted)" fontSize="9.5">
					product variants remain possible
				</text>

				{/* middle: Substrate — the layer this system owns */}
				<path d="M160 120 L400 120 L448 200 L112 200 Z" fill="var(--ink)" stroke="var(--ink)" strokeWidth="1.2" />
				<text x="280" y="150" textAnchor="middle" fill="var(--paper)" fontWeight="700" fontSize="13" letterSpacing="0.18em">
					SUBSTRATE
				</text>
				<text x="280" y="170" textAnchor="middle" fill="var(--rule)" fontSize="9.5">
					composite components · interaction patterns
				</text>
				<text x="280" y="186" textAnchor="middle" fill="var(--rule)" fontSize="9.5">
					shared across every EOS product
				</text>

				{/* base: primitives and tokens */}
				<path d="M112 214 L448 214 L486 292 L74 292 Z" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.2" />
				<text x="280" y="246" textAnchor="middle" fill="var(--ink)" fontWeight="600" letterSpacing="0.12em">
					UI PRIMITIVES &amp; TOKENS
				</text>
				<text x="280" y="266" textAnchor="middle" fill="var(--muted)" fontSize="9.5">
					base-ui primitives · EOS color, type, spacing tokens
				</text>

				{/* dimension callout for the layer this system owns */}
				<g stroke="var(--rule)" strokeWidth="1">
					<line x1="412" y1="120" x2="505" y2="120" />
					<line x1="456" y1="200" x2="505" y2="200" />
					<line x1="505" y1="120" x2="505" y2="200" />
				</g>
				<text x="513" y="164" fill="var(--muted)" fontSize="9" writingMode="tb" letterSpacing="0.1em">
					THIS SYSTEM
				</text>
			</g>
		</svg>
	);
}
