import type { Metadata } from 'next';
import Link from 'next/link';
import { Catalog } from '@/components/islands';
import { Exhibit } from '@/components/exhibit';
import { StatusMark } from '@/components/marks';
import { catalog, data } from '@/lib/data';

export const metadata: Metadata = { title: 'Components' };

export default function Components() {
	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>03 · Components</span>
					<span>
						{data.counts.composites} composites · {data.counts.primitives} primitives
					</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>Find it, import it, move on.</h1>
				<p className="cover-standfirst">
					The full index of what Substrate ships, straight from the package source. Detailed API
					documentation stays in Storybook — each row links to the exact page. Composites are the
					layer Substrate exists for; related patterns live in{' '}
					<Link href="/patterns">patterns → 04</Link>.
				</p>
			</div>

			<Exhibit
				label={`Table 1 — component index · synced from source`}
				meta={
					<span style={{ display: 'inline-flex', gap: '1.1rem' }}>
						<span className="status">
							<StatusMark status="stable" /> stable
						</span>
						<span className="status">
							<StatusMark status="proposed" /> proposed
						</span>
						<span className="status">
							<StatusMark status="experimental" /> experimental
						</span>
					</span>
				}
				id="index"
			>
				<Catalog entries={catalog} />
				<p className="note" style={{ marginTop: '1rem' }}>
					All entries import from <code className="mono">@aurora-ui/components-v2</code>. The{' '}
					{data.counts.experimental} experimental ux-intent explorations are excluded from this index
					until they graduate; they ship only on the alpha channel.
				</p>
			</Exhibit>
		</>
	);
}
