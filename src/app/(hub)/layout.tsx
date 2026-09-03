import Link from 'next/link';
import { ContentsRail } from '@/components/contents-rail';
import { site } from '@/config/site';
import { data, fmtDate, latestReleaseVersion } from '@/lib/data';

/** Shared masthead and contents rail around every numbered section. */
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
						{data.source.package} v{latestReleaseVersion} · synced {fmtDate(data.syncedAt)}
					</span>
				</div>
			</header>
			<div className="frame">
				<ContentsRail />
				<main className="page">{children}</main>
			</div>

		</>
	);
}
