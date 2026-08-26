import type { CatalogStatus } from '@/lib/data';

/**
 * Status is a physical mark, not a badge tint: solid = stable,
 * dotted = proposed, half-filled = experimental, hollow = planned,
 * hatched = deprecated (rows also strike through).
 */
export function StatusMark({ status }: { status: CatalogStatus }) {
	const box = { width: 9, height: 9, viewBox: '0 0 10 10', 'aria-hidden': true } as const;
	switch (status) {
		case 'stable':
			return (
				<svg {...box}>
					<rect x="1.5" y="1.5" width="7" height="7" fill="currentColor" />
				</svg>
			);
		case 'proposed':
			return (
				<svg {...box}>
					<rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.6 1.4" />
				</svg>
			);
		case 'experimental':
			return (
				<svg {...box}>
					<rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
					<path d="M1.5 8.5 L8.5 1.5 L8.5 8.5 Z" fill="currentColor" />
				</svg>
			);
		case 'planned':
			return (
				<svg {...box}>
					<rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
				</svg>
			);
		case 'deprecated':
			return (
				<svg {...box}>
					<rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
					<path d="M1.5 1.5 L8.5 8.5 M1.5 8.5 L8.5 1.5" stroke="currentColor" strokeWidth="1" />
				</svg>
			);
	}
}

export function Status({ status }: { status: CatalogStatus }) {
	return (
		<span className="status status-cell">
			<StatusMark status={status} />
			{status}
		</span>
	);
}

/** Drawn external-link arrow — one stroke weight across the icon set. */
export function ExtArrow() {
	return (
		<svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
			<path d="M2 8 L8 2 M3.5 2 H8 V6.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
		</svg>
	);
}
