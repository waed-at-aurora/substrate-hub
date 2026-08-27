import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { Exhibit } from '@/components/exhibit';
import { site } from '@/config/site';
import { data, fmtDate, releasesData } from '@/lib/data';
export const metadata: Metadata = { title: 'Releases' };

export default function Releases() {
	const releases = releasesData.releases;
	const latestRelease = releases[0];
	const previousReleases = releases.slice(1);
	const breakingReleases = releases.filter((release) => release.breaking);
	const currentVersion = latestRelease?.version ?? data.source.version;
	const latestChange = data.history[0];

	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>05 · Releases</span>
					<span>current: v{currentVersion}</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>
					v{currentVersion}{' '}
					<span className="new-signal" style={{ verticalAlign: 'middle' }}>
						current
					</span>
				</h1>
				<p className="cover-standfirst">
					{latestRelease
						? `Published ${fmtDate(latestRelease.publishedAt)}. Release notes are imported automatically after the design-system release succeeds.`
						: `No versioned release is published yet. Recent package changes remain available from source history${latestChange ? ` through ${fmtDate(latestChange.date)}` : ''}.`}
				</p>
			</div>

			<Exhibit label="Breaking changes & migration" id="breaking">
				{breakingReleases.length === 0 ? (
					<p className="lede">
						No published release notes flag a breaking change. Substrate is pre-1.0: pin your
						version and read the notes before upgrading.
					</p>
				) : (
					<ul className="feed">
						{breakingReleases.map((release) => (
							<li key={release.tag}>
								<span className="mono dim">{fmtDate(release.publishedAt)}</span>
								<span className="type">breaking</span>
								<span>v{release.version}</span>
								<a className="mono dim hash" href={release.url} target="_blank" rel="noreferrer">
									notes
								</a>
							</li>
						))}
					</ul>
				)}
			</Exhibit>

			<Exhibit
				label={latestRelease ? `Latest release — v${latestRelease.version}` : 'Latest release'}
				meta={
					latestRelease ? (
						<a href={latestRelease.url} target="_blank" rel="noreferrer">
							GitHub release
						</a>
					) : null
				}
				id="latest"
			>
				{latestRelease ? (
					latestRelease.body.trim() ? (
						<article className="release-notes">
							<ReactMarkdown>{latestRelease.body}</ReactMarkdown>
						</article>
					) : (
						<p className="lede">
							v{latestRelease.version} was published without additional change details. The
							version and source tag remain available in the GitHub release.
						</p>
					)
				) : (
					<p className="lede">
						Release notes will appear here after the first automated components-v2 release is
						published.
					</p>
				)}
			</Exhibit>

			<Exhibit
				label={`Previous releases (${previousReleases.length})`}
				meta={
					<a href={releasesData.source} target="_blank" rel="noreferrer">
						all GitHub releases
					</a>
				}
				id="previous"
			>
				{previousReleases.length === 0 ? (
					<p className="lede">No previous components-v2 releases are published.</p>
				) : (
					<ul className="feed">
						{previousReleases.map((release) => (
							<li key={release.tag}>
								<span className="mono dim">{fmtDate(release.publishedAt)}</span>
								<span className="type">release</span>
								<span>
									v{release.version}
									{release.prerelease ? <span className="dim mono"> · prerelease</span> : null}
								</span>
								<a className="mono dim hash" href={release.url} target="_blank" rel="noreferrer">
									notes
								</a>
							</li>
						))}
					</ul>
				)}
			</Exhibit>

			<Exhibit
				label={`Recent source history (${data.history.length} changes)`}
				meta={
					<a
						href={`${site.repoUrl}/commits/release/packages/components-v2`}
						target="_blank"
						rel="noreferrer"
					>
						source history
					</a>
				}
				id="history"
			>
				<ul className="feed">
					{data.history.map((entry, index) => (
						<li key={entry.hash}>
							<span className="mono dim">{fmtDate(entry.date)}</span>
							<span className="type" data-t={entry.type ?? undefined}>
								{entry.type ?? 'change'}
							</span>
							<span>
								{index === 0 ? <span className="new-signal">new</span> : null} {entry.summary}
								{entry.scope ? <span className="dim mono"> · {entry.scope}</span> : null}
							</span>
							<a
								className="mono dim hash"
								href={`${site.repoUrl}/commit/${entry.hash}`}
								target="_blank"
								rel="noreferrer"
							>
								{entry.hash}
							</a>
						</li>
					))}
				</ul>
			</Exhibit>
		</>
	);
}
