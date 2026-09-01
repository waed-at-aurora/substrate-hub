import Link from 'next/link';
import { ContentsRail } from '@/components/contents-rail';
import { site } from '@/config/site';
import { data, fmtDate } from '@/lib/data';

/** The hub chrome: masthead, contents rail, and colophon around every numbered section. */
export default function HubLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<header className="masthead">
				<div className="masthead-inner">
					<Link href="/" className="masthead-title">
						Substrate
					</Link>
					<span className="masthead-sub">
						Design system · {site.family} · {site.org}
					</span>
					<span className="masthead-spacer" />
					<span className="masthead-meta">
						{data.source.package} v{data.source.version} · synced {fmtDate(data.syncedAt)}
					</span>
				</div>
			</header>
			<div className="frame">
				<ContentsRail />
				<main className="page">{children}</main>
			</div>
			<footer className="frame">
				<div />
				<div className="colophon">
					<span>
						Substrate Hub — internal · source of truth:{' '}
						<a href={site.repoUrl} target="_blank" rel="noreferrer">
							aurora-ui
						</a>
						/packages/substrate
					</span>
					<span>catalog synced {fmtDate(data.syncedAt)} · regenerate with `npm run sync`</span>
				</div>
			</footer>
		</>
	);
}
