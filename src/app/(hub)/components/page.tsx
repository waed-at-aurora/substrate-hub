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
				</p>
				<h1>Find the right component for the job.</h1>
				<p className="cover-standfirst">
					Explore the available components, see how they work in different states, 
					and open Storybook for full details. The Forms pattern shows how to combine 
					them to build a form.
				</p>
				<div className="cover-actions">
					<a className="action action-primary" href="#live-gallery">
						Explore live components
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
						<h2 id="live-gallery-title">Components ready to be used</h2>
						<p>
							Start with the selection card, then explore the basic elements that support it. Search or filter the 
							working examples. Open Storybook to explore the full component library.
						</p>
					</div>
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
