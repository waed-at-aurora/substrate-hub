import type { ReactNode } from 'react';

/**
 * A ruled report exhibit: one hairline rule system carries the page.
 * `label` is the figure/table designation; `meta` sits flush right.
 */
export function Exhibit({
	label,
	meta,
	id,
	live = false,
	children,
}: {
	label: string;
	meta?: ReactNode;
	id?: string;
	live?: boolean;
	children: ReactNode;
}) {
	return (
		<section className="exhibit" id={id}>
			{children}
		</section>
	);
}
