import type { Metadata } from 'next';
import Link from 'next/link';
import { Catalog } from '@/components/islands';
import { site } from '@/config/site';
import { catalog, data } from '@/lib/data';

export const metadata: Metadata = { title: 'Components' };

export default function Components() {
	return (
		<>
			<div className="cover components-cover">
				<p className="cover-issue">
					<span>03 · Components</span>
					<span>
						{data.counts.composites} composites · {data.counts.primitives} primitives
					</span>
				</p>
				<h1>See the system at work.</h1>
				<p className="cover-standfirst">
					Browse live components instead of reading an inventory. Every specimen below renders from the
					package, keeps its real states and interactions, and opens directly into Storybook when you need
					the full API. For guidance on combining them, continue to{' '}
					<Link href="/patterns">patterns → 04</Link>.
				</p>
				<div className="cover-actions">
					<a className="action action-primary" href={site.storybookUrl.value} target="_blank" rel="noreferrer">
						Open Storybook
					</a>
				</div>
			</div>

			<section className="component-gallery-section" aria-label="Live component gallery">
				<Catalog entries={catalog} />
				<p className="note component-gallery-note">
					This working gallery presents a representative cross-section of Substrate. Storybook remains the
					complete source for every component, state, and accessibility contract.
				</p>
			</section>
		</>
	);
}
