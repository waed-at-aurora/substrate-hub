import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { Exhibit } from '@/components/exhibit';
import { ExtArrow } from '@/components/marks';
import { fmtDate, latestReleaseVersion, releasesData } from '@/lib/data';
export const metadata: Metadata = { title: 'Releases' };

const releaseSummaryComponents = {
	h3: () => null,
	ol: () => null,
	ul: () => null,
};

export default function Releases() {
	const releases = releasesData.releases;
	const latestRelease = releases[0];
	const previousRelease = releases[1];

	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>05 · Releases</span>
					<span>current: v{latestReleaseVersion}</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>
					v{latestReleaseVersion}{' '}
					<span className="new-signal" style={{ verticalAlign: 'middle' }}>
						current
					</span>
				</h1>
				<p className="cover-standfirst">
					{latestRelease
						? `Published ${fmtDate(latestRelease.publishedAt)}. Release notes are imported automatically after the design-system release succeeds.`
						: 'No versioned Substrate release is published yet. Release notes will appear after the first automated release.'}
				</p>
				<div className="cover-actions">
					<a
						className="action action-primary ext"
						href="https://eos.auroraer.com/dragonfly/release-notes/substrate?locale=en"
						target="_blank"
						rel="noreferrer"
					>
						Open EOS release notes
						<ExtArrow />
					</a>
				</div>
			</div>

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
							<ReactMarkdown components={releaseSummaryComponents}>{latestRelease.body}</ReactMarkdown>
						</article>
					) : (
						<p className="lede">
							v{latestRelease.version} was published without additional change details. The
							version and source tag remain available in the GitHub release.
						</p>
					)
				) : (
					<p className="lede">
						Release notes will appear here after the first automated Substrate release is published.
					</p>
				)}
			</Exhibit>

			<Exhibit
				label={previousRelease ? `Previous release — v${previousRelease.version}` : 'Previous release'}
				meta={
					previousRelease ? (
						<a href={previousRelease.url} target="_blank" rel="noreferrer">
							GitHub release
						</a>
					) : null
				}
				id="previous"
			>
				{previousRelease ? (
					previousRelease.body.trim() ? (
						<article className="release-notes">
							<ReactMarkdown components={releaseSummaryComponents}>{previousRelease.body}</ReactMarkdown>
						</article>
					) : (
						<p className="lede">
							v{previousRelease.version} was published without additional change details. The
							version and source tag remain available in the GitHub release.
						</p>
					)
				) : (
					<p className="lede">No previous Substrate release is published.</p>
				)}
			</Exhibit>
		</>
	);
}
