import Link from 'next/link';
import { CopyBlock } from '@/components/copy-block';
import { Exhibit } from '@/components/exhibit';
import { InstallLine } from '@/components/install-line';
import { ExtArrow } from '@/components/marks';
import { Playground } from '@/components/islands';
import { Provisional } from '@/components/provisional';
import { Pyramid } from '@/components/pyramid';
import { site, storybookHref } from '@/config/site';
import { data, fmtDate } from '@/lib/data';

export default function Home() {
	const latest = data.history.slice(0, 3);

	return (
		<>
			{/* 1+2 — the stage: positioning, wordmark, actions, install */}
			<section className="stage" aria-label="Substrate">
				<p className="stage-dateline">
					<span>Substrate Hub · internal edition</span>
					<span>
						{data.source.package} v{data.source.version} · last change {fmtDate(data.history[0].date)}
					</span>
				</p>
				<span className="stage-ghost" aria-hidden="true">
					Substrate
				</span>
				<h1 className="stage-word">Substrate</h1>
				<div className="stage-body">
					<p className="stage-position">The shared layer behind consistent EOS experiences.</p>
					<p className="stage-copy">
						Substrate provides the reusable composite components and interaction patterns EOS
						products are built from — consistent, high quality, faster to ship, with room for
						product-level differentiation above the shared system.
					</p>
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

			{/* 3 — how Substrate fits */}
			<Exhibit label="Fig. 1 — the system pyramid" meta="where Substrate sits" id="fits">
				<div className="pyramid-wrap">
					<Pyramid />
					<div className="pyramid-notes">
						<div className="pyramid-note">
							<span className="mono">Foundation</span>
							<p>
								Primitives and tokens are the base: base-ui behaviors and the EOS color, type, and
								spacing ramps. Substrate consumes them; products rarely touch them directly.
							</p>
						</div>
						<div className="pyramid-note">
							<span className="mono">The shared layer</span>
							<p>
								Substrate&rsquo;s responsibility is the middle: composite components and interaction
								patterns every EOS product shares — {data.counts.composites} composites and{' '}
								{data.counts.primitives} primitives today.
							</p>
						</div>
						<div className="pyramid-note">
							<span className="mono">Room above</span>
							<p>
								Product variants remain possible above the shared system. Differentiate at the
								product layer; never fork the shared one.
							</p>
						</div>
					</div>
				</div>
			</Exhibit>

			{/* 4 — quick start */}
			<Exhibit label="Quick start" meta={<Link href="/get-started">full setup → 02</Link>} id="quick-start">
				<h2>Install once, import everywhere.</h2>
				<CopyBlock
					label="Guided — the Substrate CLI checks your environment, then runs the real install"
					code={`npx --yes github:AuroraEnergyResearch/substrate-cli-v2 doctor\nnpx --yes github:AuroraEnergyResearch/substrate-cli-v2 install`}
				/>
				<CopyBlock
					label="Manual, inside the aurora-ui monorepo — package.json"
					code={`"dependencies": {\n\t"@aurora-ui/components-v2": "workspace:packages/components-v2"\n}`}
				/>
				<CopyBlock
					label="First import"
					code={`import { Button } from '@aurora-ui/components-v2';\nimport '@aurora-ui/components-v2/style.css';`}
				/>
				<p className="note" style={{ marginTop: '0.9rem' }}>
					The <a href={site.cliUrl} target="_blank" rel="noreferrer">Substrate CLI</a> (prototype) also
					checks environments, files feedback issues, and reads component docs offline — full setup in{' '}
					<Link href="/get-started">get started → 02</Link>.
				</p>
			</Exhibit>

			{/* the live figure — real components, recalculating as you steer them */}
			<Exhibit
				label="Fig. 2 — live render · Button"
				meta="rendered by the installed package, not a screenshot"
				live
				id="live"
			>
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

			{/* 6 — what's happening */}
			<Exhibit label="What's happening" meta={<Link href="/updates">full feed → 08</Link>} id="happening">
				<ul className="feed">
					{latest.map((h, i) => (
						<li key={h.hash}>
							<span className="mono dim">{fmtDate(h.date)}</span>
							<span className="type" data-t={h.type ?? undefined}>
								{h.type ?? 'change'}
							</span>
							<span>
								{i === 0 ? <span className="new-signal">new</span> : null} {h.summary}
							</span>
							<a
								className="mono dim hash"
								href={`${site.repoUrl}/commit/${h.hash}`}
								target="_blank"
								rel="noreferrer"
							>
								{h.hash}
							</a>
						</li>
					))}
				</ul>
				<div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
					<p className="note">
						Current priorities: cascade-layer contract hardening and the forms pattern rollout —
						detail in <Link href="/roadmap">roadmap → 06</Link>. <Provisional what="confirm against planning source" />
					</p>
					<p className="note">
						Upcoming session: none scheduled here yet. <Provisional what="events feed" />
					</p>
				</div>
			</Exhibit>

			{/* 7 — resources */}
			<Exhibit label="Resources" meta={<Link href="/tools">all tools → 07</Link>} id="resources">
				<ul className="resources">
					<li>
						<span className="mono">Repository</span>
						<p>
							<a href={site.repoUrl} target="_blank" rel="noreferrer">
								AuroraEnergyResearch/aurora-ui
							</a>{' '}
							— packages/components-v2 is the source of truth.
						</p>
					</li>
					<li>
						<span className="mono">Storybook</span>
						<p>
							The canonical component documentation.{' '}
							<a className="ext" href={storybookHref(null)} target="_blank" rel="noreferrer">
								storybook-v2
								<ExtArrow />
							</a>
						</p>
					</li>
					<li>
						<span className="mono">CLI &amp; AI skills</span>
						<p>
							<a href={site.cliUrl} target="_blank" rel="noreferrer">
								substrate-cli
							</a>{' '}
							installs the system, files feedback, and reads docs offline;{' '}
							<a href={site.atlasUrl} target="_blank" rel="noreferrer">
								atlas
							</a>{' '}
							materializes Aurora&rsquo;s agent skills into consuming repos.
						</p>
					</li>
					<li>
						<span className="mono">Contribution</span>
						<p>
							Source-link and snapshot workflows:{' '}
							<a
								href={`${site.repoUrl}/blob/main/${site.contributionDocPath}`}
								target="_blank"
								rel="noreferrer"
							>
								DesignSystemConsumerWorkflows
							</a>
							.
						</p>
					</li>
					<li>
						<span className="mono">Support</span>
						<p>
							{site.supportChannel.value} <Provisional what="confirm channel" />
						</p>
					</li>
				</ul>
			</Exhibit>
		</>
	);
}
