import type { Metadata } from 'next';
import { Exhibit } from '@/components/exhibit';
import { site } from '@/config/site';
import { data, fmtDate, type HistoryEntry } from '@/lib/data';

export const metadata: Metadata = { title: 'Updates' };

const monthKey = (iso: string) =>
	new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });

export default function Updates() {
	const byMonth = new Map<string, HistoryEntry[]>();
	for (const h of data.history) {
		const k = monthKey(h.date);
		if (!byMonth.has(k)) byMonth.set(k, []);
		byMonth.get(k)!.push(h);
	}

	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>08 · Updates</span>
					<span>{data.history.length} recent changes</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>The running record.</h1>
				<p className="cover-standfirst">
					A lightweight feed of what is moving in the system, straight from source history — design
					system changes and their documentation, newest first. It becomes an edited blog only if a
					publishing owner and cadence exist; until then, the record stays honest and automatic.
				</p>
			</div>

			{[...byMonth.entries()].map(([month, entries], mi) => (
				<Exhibit key={month} label={month} meta={`${entries.length} changes`}>
					<ul className="feed">
						{entries.map((h, i) => (
							<li key={h.hash}>
								<span className="mono dim">{fmtDate(h.date)}</span>
								<span className="type" data-t={h.type ?? undefined}>
									{h.type ?? 'change'}
								</span>
								<span>
									{mi === 0 && i === 0 ? <span className="new-signal">new</span> : null} {h.summary}
									{h.scope ? <span className="dim mono"> · {h.scope}</span> : null}
								</span>
								<a
									className="mono dim hash"
									href={`${site.repoUrl}/commit/${h.hash}`}
									target="_blank"
									rel="noreferrer"
								>
									{h.hash}
								</a>
							</li>
						))}
					</ul>
				</Exhibit>
			))}
		</>
	);
}
