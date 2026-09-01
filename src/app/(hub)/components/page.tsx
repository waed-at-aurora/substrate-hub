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
						{data.counts.composites} stable composites · {data.counts.primitives} supporting primitives
					</span>
				</p>
				<h1>Start with the task, not the atom.</h1>
				<p className="cover-standfirst">
					Browse the live package to choose a component, inspect its real states and interactions, and
					continue into Storybook for complete API documentation. Substrate’s documented Forms pattern
					shows how those components come together for data-entry work.
				</p>
				<div className="cover-actions">
					<a className="action action-primary" href="#live-gallery">
						Explore live specimens
					</a>
					<Link className="action" href="/patterns">
						View Forms pattern
					</Link>
					<a className="action" href={site.storybookUrl.value} target="_blank" rel="noreferrer">
						Open Storybook
					</a>
				</div>
			</div>


			<section className="component-gallery-section" id="live-gallery" aria-labelledby="live-gallery-title">
				<header className="component-gallery-header">
					<div>
						<h2 id="live-gallery-title">Representative live specimens.</h2>
						<p>
							The composite selection card leads; supporting primitives follow. Search or filter this
							working cross-section, then continue to Storybook for the complete package.
						</p>
					</div>
					<span>{catalog.length} components in the package</span>
				</header>
				<Catalog entries={catalog} />
				<p className="note component-gallery-note">
					This wall is deliberately representative. Storybook remains the complete source for every component,
					state, and accessibility contract.
				</p>
			</section>
		</>
	);
}
