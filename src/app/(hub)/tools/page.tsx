import type { Metadata } from 'next';
import { Exhibit } from '@/components/exhibit';
import { ExtArrow } from '@/components/marks';
import { Provisional } from '@/components/provisional';
import { site, storybookHref } from '@/config/site';

export const metadata: Metadata = { title: 'Tools & resources' };

export default function Tools() {
	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>07 · Tools &amp; resources</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>Everything around the system.</h1>
				<p className="cover-standfirst">
					The tooling, documentation, and channels that surround Substrate — where to look things up,
					how to contribute, and where to ask.
				</p>
			</div>

			<Exhibit label="Table 1 — tools" id="tools">
				<div className="table-scroll">
<table>
					<thead>
						<tr>
							<th>Tool</th>
							<th>What it is</th>
							<th>Where</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<strong>substrate CLI</strong>
							</td>
							<td className="dim">
								Prototype CLI for Substrate: guided <code className="mono">install</code> of the
								design system, environment <code className="mono">doctor</code>, feedback as GitHub
								issues, and offline <code className="mono">docs</code> (component usage + real prop
								tables). Run via <code className="mono">npx --yes github:AuroraEnergyResearch/substrate-cli-v2</code>.
							</td>
							<td>
								<a className="ext" href={site.cliUrl} target="_blank" rel="noreferrer">
									repository
									<ExtArrow />
								</a>
							</td>
						</tr>
						<tr>
							<td>
								<strong>AI skills</strong>
							</td>
							<td className="dim">
								Run <code className="mono">substrate skill install</code> once and Claude-compatible
								agents (Claude Code, opencode) auto-discover the CLI skill in any project — ask the
								agent to raise Substrate feedback and it drives the CLI non-interactively. For a
								one-off session, point an agent at the repo&rsquo;s{' '}
								<code className="mono">SKILL.md</code> directly. Aurora&rsquo;s atlas CLI materializes
								the wider skill/context set into repos (aurora-ui carries{' '}
								<code className="mono">atlas.config.json</code>).
							</td>
							<td>
								<a
									className="ext"
									href={`${site.cliUrl}/blob/main/SKILL.md`}
									target="_blank"
									rel="noreferrer"
								>
									SKILL.md
									<ExtArrow />
								</a>
							</td>
						</tr>
						<tr>
							<td>
								<strong>Storybook</strong>
							</td>
							<td className="dim">
								storybook-v2 is the canonical component documentation; run locally with{' '}
								<code className="mono">yarn workspace @aurora-ui/storybook-v2 run storybook</code> (port
								6007).
							</td>
							<td>
								<a className="ext" href={storybookHref(null)} target="_blank" rel="noreferrer">
									open
									<ExtArrow />
								</a>
							</td>
						</tr>
						<tr>
							<td>
								<strong>Repositories</strong>
							</td>
							<td className="dim">
								<code className="mono">aurora-ui/packages/components-v2</code> is the design system
								source of truth; <code className="mono">storybook-v2</code> its documentation.
							</td>
							<td>
								<a className="ext" href={site.repoUrl} target="_blank" rel="noreferrer">
									aurora-ui
									<ExtArrow />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
</div>
			</Exhibit>

			<Exhibit label="Contribution" id="contribute">
				<p className="lede">
					Reusable primitives, composites, patterns, styling, and shared documentation belong in{' '}
					<code className="mono">packages/components-v2</code>; product screens, data adapters, and
					routes stay in the consuming app. For DS contribution and validation there are two opt-in
					workflows — source-link mode (bundler resolves the package to live DS source) and
					snapshot/package mode (pinned dist artifacts with a shared snapshot ID) — documented in{' '}
					<a href={`${site.repoUrl}/blob/main/${site.contributionDocPath}`} target="_blank" rel="noreferrer">
						DesignSystemConsumerWorkflows
					</a>
					.
				</p>
			</Exhibit>

			<Exhibit label="Support & events" id="support">
				<ul className="resources">
					<li>
						<span className="mono">Support</span>
						<p>
							{site.supportChannel.value} <Provisional what="confirm channel" />
						</p>
					</li>
					<li>
						<span className="mono">Events &amp; recordings</span>
						<p>
							No sessions recorded here yet. <Provisional what="events feed owner" />
						</p>
					</li>
				</ul>
			</Exhibit>
		</>
	);
}
