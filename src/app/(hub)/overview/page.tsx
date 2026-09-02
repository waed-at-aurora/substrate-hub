import Link from 'next/link';
import { CopyBlock } from '@/components/copy-block';
import { Exhibit } from '@/components/exhibit';
import { InstallLine } from '@/components/install-line';
import { ExtArrow } from '@/components/marks';
import { Playground } from '@/components/islands';
import { OverviewMotion } from '@/components/overview-motion';
import { PyramidFigure } from '@/components/pyramid-figure';
import { PersonaOverview } from '@/components/persona-overview';
import { site, storybookHref } from '@/config/site';
import { data, fmtDate, latestReleaseVersion } from '@/lib/data';

export const metadata = { title: 'Overview' };

export default function Home() {
	return (
		<>
			<OverviewMotion />
			{/* 1+2 — the stage: positioning, wordmark, actions, install */}
			<section className="stage" aria-label="Substrate" data-overview-stage>
				<p className="stage-dateline">
					<span>Substrate Hub · internal edition</span>
					<span>
						{data.source.package} v{latestReleaseVersion} · last change {fmtDate(data.history[0].date)}
					</span>
				</p>
				<span className="stage-ghost" aria-hidden="true">
					Substrate
				</span>


				<h1 className="stage-word">Substrate</h1>


				<div className="stage-body">
					<p className="stage-position">The foundational medium from which experiences emerge.</p>
					<p className="stage-copy">An agent-first, modern design system.</p>
					<div className="stage-actions">
						<Link className="action action-primary" href="/get-started">
							Install Substrate
						</Link>
						<a className="action ext" href={storybookHref(null)} target="_blank" rel="noreferrer">
							Open Storybook
							<ExtArrow />
						</a>
						<Link className="action" href="/patterns">
							Explore patterns
						</Link>
					</div>
					<InstallLine command="npx --yes github:AuroraEnergyResearch/substrate-cli-v2 install" />
				</div>
			</section>

			{/* context before implementation */}
			<Exhibit
				label="What Substrate is"
				meta="shared interaction layer · product-owned experiences"
				id="what"
			>
				<div className="overview-definition">
					<div className="overview-definition-lead">
						<h2 className="statement">A common way to solve recurring product interactions.</h2>
						<p className="lede">
							Substrate sits between low-level UI foundations and complete EOS experiences. It
							packages shared decisions into reusable composite components and documented patterns,
							so teams start from established behavior instead of recreating the same interaction.
						</p>
					</div>
					<dl className="overview-boundary" aria-label="Substrate ownership boundary">
						<div>
							<dt>Shared through Substrate</dt>
							<dd>Interaction behavior, UI foundations, reusable components, and recurring patterns.</dd>
						</div>
						<div>
							<dt>Owned by each product</dt>
							<dd>
								Domain workflows, data, content, and the decisions that make an experience distinct.
							</dd>
						</div>
					</dl>
				</div>
			</Exhibit>

			<Exhibit label="Choose your view" meta="four roles · one shared system" id="why">
				<PersonaOverview primitives={data.counts.primitives} composites={data.counts.composites} />
			</Exhibit>

			{/* 3 — how Substrate fits */}
			<Exhibit label="Fig. 1 — where Substrate creates leverage" meta="foundation included · UX core prioritized" id="fits">
				<PyramidFigure composites={data.counts.composites} primitives={data.counts.primitives} />
			</Exhibit>

			{/* 4 — quick start */}
			<Exhibit label="Quick start" meta={<Link href="/get-started">full setup → 02</Link>} id="quick-start">
				<h2 className="statement">Install once, import everywhere.</h2>
				<CopyBlock
					label="Guided — the Substrate CLI checks your environment, then runs the real install"
					code={`npx --yes github:AuroraEnergyResearch/substrate-cli-v2 doctor\nnpx --yes github:AuroraEnergyResearch/substrate-cli-v2 install`}
				/>
				<CopyBlock
					label="Manual, inside the aurora-ui monorepo — package.json"
					code={`"dependencies": {\n\t"@aurora-ui/substrate": "workspace:packages/substrate"\n}`}
				/>
				<CopyBlock
					label="First import"
					code={`import { Button } from '@aurora-ui/substrate';\nimport '@aurora-ui/substrate/style.css';`}
				/>
				<p className="note" style={{ marginTop: '0.9rem' }}>
					The <a href={site.cliUrl} target="_blank" rel="noreferrer">Substrate CLI</a> (prototype) also
					checks environments, files feedback issues, and reads component docs offline — full setup in{' '}
					<Link href="/get-started">get started → 02</Link>.
				</p>
			</Exhibit>

			{/* the live figure — configure the real component before you build with it */}
			<Exhibit
				label="Fig. 2 — configure a live component · Investment Case Selection Card"
				meta="rendered by the installed package, not a screenshot"
				id="live"
			>
				<h2>See how a component adapts before you build.</h2>
				<p className="lede live-demo-copy">
					Change the state and content to see how this composite flexes for your product. Reusable
					components make it quicker to scaffold consistent solutions without starting from scratch.
				</p>
				<Playground />
			</Exhibit>

			{/* 5 — coverage */}
			<Exhibit label="Table 1 — coverage" meta={<Link href="/components">full index → 03</Link>} id="coverage">
				<table style={{ maxWidth: '46rem' }}>
					<thead>
						<tr>
							<th>Layer</th>
							<th className="num">Entries</th>
							<th>Channel</th>
							<th>Documentation</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Composite components &amp; patterns</td>
							<td className="num">{data.counts.composites}</td>
							<td className="dim">stable</td>
							<td rowSpan={3}>
								<a className="ext" href={storybookHref(null)} target="_blank" rel="noreferrer">
									Storybook
									<ExtArrow />
								</a>
							</td>
						</tr>
						<tr>
							<td>UI primitives</td>
							<td className="num">{data.counts.primitives}</td>
							<td className="dim">stable</td>
						</tr>
						<tr>
							<td>Experimental (ux-intent track)</td>
							<td className="num">{data.counts.experimental}</td>
							<td className="dim">alpha</td>
						</tr>
					</tbody>
				</table>
				<p className="note" style={{ marginTop: '0.8rem' }}>
					One documented interaction pattern — <Link href="/patterns/forms">Forms</Link> — with{' '}
					{data.forms.examples.length} worked examples across {data.forms.chapters.length} chapters.
				</p>
			</Exhibit>


		</>
	);
}
