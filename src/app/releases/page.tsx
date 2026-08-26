import type { Metadata } from 'next';
import { Exhibit } from '@/components/exhibit';
import { Provisional } from '@/components/provisional';
import { site } from '@/config/site';
import { data, fmtDate } from '@/lib/data';

export const metadata: Metadata = { title: 'Releases' };

export default function Releases() {
	const latest = data.history[0];
	const breaking = data.history.filter((h) => h.breaking);

	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>05 · Releases</span>
					<span>current: v{data.source.version}</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>
					v{data.source.version} <span className="new-signal" style={{ verticalAlign: 'middle' }}>current</span>
				</h1>
				<p className="cover-standfirst">
					Substrate is pre-1.0 and publishes to Aurora&rsquo;s private registry. A versioned changelog
					is not published yet, so this page reports directly from source history — the honest record
					until release notes land. Last change {fmtDate(latest.date)}.
				</p>
			</div>

			<Exhibit label="Breaking changes & migration" id="breaking">
				{breaking.length === 0 ? (
					<p className="lede">
						No breaking changes flagged in the last {data.history.length} changes to the package. No
						migration actions are currently required. Pre-1.0 caveat: pin your version and read this
						page before upgrading.
					</p>
				) : (
					<ul className="feed">
						{breaking.map((h) => (
							<li key={h.hash}>
								<span className="mono dim">{fmtDate(h.date)}</span>
								<span className="type">breaking</span>
								<span>{h.summary}</span>
								<a className="mono dim hash" href={`${site.repoUrl}/commit/${h.hash}`} target="_blank" rel="noreferrer">
									{h.hash}
								</a>
							</li>
						))}
					</ul>
				)}
			</Exhibit>

			<Exhibit
				label={`Log — source history (${data.history.length} changes)`}
				meta={
					<a href={`${site.repoUrl}/commits/main/packages/components-v2`} target="_blank" rel="noreferrer">
						source release notes
					</a>
				}
				id="history"
			>
				<ul className="feed">
					{data.history.map((h, i) => (
						<li key={h.hash}>
							<span className="mono dim">{fmtDate(h.date)}</span>
							<span className="type" data-t={h.type ?? undefined}>
								{h.type ?? 'change'}
							</span>
							<span>
								{i === 0 ? <span className="new-signal">new</span> : null} {h.summary}
								{h.scope ? <span className="dim mono"> · {h.scope}</span> : null}
							</span>
							<a className="mono dim hash" href={`${site.repoUrl}/commit/${h.hash}`} target="_blank" rel="noreferrer">
								{h.hash}
							</a>
						</li>
					))}
				</ul>
			</Exhibit>

			<Exhibit label="Previous releases" id="previous">
				<p className="lede">
					None published yet — v{data.source.version} is the first packaged version. When
					semantic-release starts cutting versions, they will list here with dates, changelogs, and
					migration actions. <Provisional what="wire changelog source when published" />
				</p>
			</Exhibit>
		</>
	);
}
