'use client';

import { useMemo, useState } from 'react';
import { Input } from '@aurora-ui/components-v2/components';
import type { CatalogEntry } from '@/lib/data';
import { Status, ExtArrow } from '@/components/marks';
import { storybookHref } from '@/config/site';

const LAYERS = ['all', 'composite', 'primitive'] as const;

export function Catalog({ entries }: { entries: CatalogEntry[] }) {
	const [q, setQ] = useState('');
	const [layer, setLayer] = useState<(typeof LAYERS)[number]>('all');

	const rows = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return entries.filter(
			(e) =>
				(layer === 'all' || e.layer === layer) &&
				(!needle ||
					e.name.toLowerCase().includes(needle) ||
					e.importName.toLowerCase().includes(needle) ||
					(e.storyTitle ?? '').toLowerCase().includes(needle))
		);
	}, [entries, q, layer]);

	return (
		<>
			<div className="catalog-bar">
				<Input
					type="search"
					placeholder="Search name or import…"
					aria-label="Search components"
					value={q}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
					style={{ minWidth: '16rem', width: 'auto' }}
				/>
				<div className="filter-group" role="group" aria-label="Filter by layer">
					{LAYERS.map((l) => (
						<button key={l} type="button" aria-pressed={layer === l} onClick={() => setLayer(l)}>
							{l}
						</button>
					))}
				</div>
				<span className="catalog-count" aria-live="polite">
					{rows.length} / {entries.length} entries
				</span>
			</div>

			<div className="table-scroll">
<table>
				<thead>
					<tr>
						<th>Component</th>
						<th>Layer</th>
						<th>Status</th>
						<th>Import</th>
						<th>Documentation</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((e) => (
						<tr key={e.source} className={e.status === 'deprecated' ? 'is-deprecated' : undefined}>
							<td>
								<strong>{e.name}</strong>
							</td>
							<td className="dim">{e.layer}</td>
							<td className="status-cell">
								<Status status={e.status} />
							</td>
							<td>
								<code className="mono">{e.importName}</code>
							</td>
							<td>
								{e.storybook ? (
									<a className="ext" href={storybookHref(e.storybook)} target="_blank" rel="noreferrer">
										Storybook
										<ExtArrow />
									</a>
								) : (
									<span className="dim">source only</span>
								)}
							</td>
						</tr>
					))}
					{rows.length === 0 ? (
						<tr>
							<td colSpan={5} className="dim">
								No entries match “{q}”. Clear the search or switch layer filters.
							</td>
						</tr>
					) : null}
				</tbody>
			</table>
</div>
		</>
	);
}
