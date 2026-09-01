import type { Metadata } from 'next';
import Link from 'next/link';
import { Troubleshooting } from '@/components/islands';
import { CopyBlock } from '@/components/copy-block';
import { Exhibit } from '@/components/exhibit';
import { ExtArrow } from '@/components/marks';
import { site, storybookHref } from '@/config/site';
import { data, latestReleaseVersion } from '@/lib/data';

export const metadata: Metadata = { title: 'Get started' };

export default function GetStarted() {
	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>02 · Get started</span>
					<span>{data.source.package} v{latestReleaseVersion}</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>From zero to a rendered component.</h1>
				<p className="cover-standfirst">
					Start with your coding agent, then use the remaining steps to understand or complete the
					same setup yourself: check the environment, install the package, wire styles and theme,
					render a component, and verify. Component-level detail stays in Storybook.
				</p>
			</div>

			<Exhibit label="Setup — six steps" id="steps">
				<ol className="steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
					<li className="step step-agent">
						<div>
							<h3>Ask your agent to set up Substrate</h3>
							<p className="agent-lede">
								Paste this into Claude Code or opencode. Your agent will inspect the project first,
								then follow the guided CLI path detailed below.
							</p>
							<CopyBlock
								label="Prompt for your coding agent"
								copyLabel="copy prompt"
								prompt
								code={`Set up Substrate in this project. Inspect the stack and existing theme first. Run \`npx --yes github:AuroraEnergyResearch/substrate-cli-v2 doctor\`, then preview the install with \`npx --yes github:AuroraEnergyResearch/substrate-cli-v2 install --dry-run\`. If the checks pass, run \`npx --yes github:AuroraEnergyResearch/substrate-cli-v2 install --yes\`, import \`@aurora-ui/substrate/style.css\` at the app root, preserve the existing light or dark theme, render a basic \`Button\`, and verify it visually. Do not hand-edit registry credentials; report any failed check with its recovery command.`}
							/>
							<p className="note agent-skill-note">
								For repeat use, install the CLI&rsquo;s agent skill once. Claude-compatible agents
								then discover Substrate automatically in any project.
							</p>
							<CopyBlock
								label="Install the Substrate agent skill"
								code={`npx --yes github:AuroraEnergyResearch/substrate-cli-v2 skill install`}
							/>
							<p className="note" style={{ marginTop: '0.7rem' }}>
								The private CLI repository requires <code>gh auth login</code>. Prefer to drive the
								tool yourself? Continue with the prerequisites and guided install below;
								documentation and feedback workflows are in <Link href="/tools">Tools &amp; resources → 07</Link>.
							</p>
						</div>
					</li>
					<li className="step">
						<div>
							<h3>Prerequisites and supported environments</h3>
							<p>
								React 18 or 19 with <code>react-dom</code>, and <code>react-i18next</code> as peer
								dependencies. Inside the aurora-ui monorepo you consume the workspace package;
								outside it you need access to Aurora&rsquo;s private CodeArtifact registry. For the
								guided CLI path: Node ≥ 20 and an authenticated GitHub CLI (<code>gh auth login</code>);
								AWS CLI v2 only for a real (non-dry-run) install. Windows is supported natively.
							</p>
						</div>
					</li>
					<li className="step">
						<div>
							<h3>Install the Substrate package</h3>
							<p>
								Guided path: the{' '}
								<a href={site.cliUrl} target="_blank" rel="noreferrer">
									Substrate CLI
								</a>{' '}
								(prototype) inspects your environment and runs the real AWS and npm steps, each gated
								by a confirmation (or <code>--yes</code>). It never prompts without a TTY, so agents
								can drive it too.
							</p>
							<CopyBlock
								label="Guided — check, preview, then install"
								code={`npx --yes github:AuroraEnergyResearch/substrate-cli-v2 doctor\nnpx --yes github:AuroraEnergyResearch/substrate-cli-v2 install --dry-run\nnpx --yes github:AuroraEnergyResearch/substrate-cli-v2 install`}
							/>
							<CopyBlock
								label="Manual — inside the monorepo, package.json"
								code={`"dependencies": {\n\t"@aurora-ui/substrate": "workspace:packages/substrate"\n}`}
							/>
							<p className="note" style={{ marginTop: '0.7rem' }}>
								Outside the monorepo, use the guided CLI install — it handles the private-registry
								authentication for you. <code>npx</code> against the private CLI repo needs{' '}
								<code>gh auth login</code>.
							</p>
						</div>
					</li>
					<li className="step">
						<div>
							<h3>Import styles, theme, and tokens</h3>
							<p>
								One stylesheet carries tokens, base styles, and component styles, all inside CSS
								cascade layers so your app&rsquo;s own CSS keeps precedence. Theme is a class on the
								root element: <code>.dark</code> (what this hub runs) or <code>.light</code> (the package default).
							</p>
							<CopyBlock
								label="Root of your app"
								code={`import '@aurora-ui/substrate/style.css';\n\n<html className="dark"> … </html>`}
							/>
						</div>
					</li>
					<li className="step">
						<div>
							<h3>Render a first component</h3>
							<CopyBlock
								label="Anywhere in your tree"
								code={`import { Button } from '@aurora-ui/substrate';\n\n<Button variant="eos">Run scenario</Button>`}
							/>
							<p className="note" style={{ marginTop: '0.7rem' }}>
								Steer it live in <Link href="/#live">Fig. 2 on the overview</Link> — every option
								change re-renders the real package.
							</p>
						</div>
					</li>
					<li className="step">
						<div>
							<h3>Verify</h3>
							<p>
								The button renders in EOS yellow, form fields pick up zinc borders, and no custom CSS
								was needed. If something looks unstyled, work through the checks below.
							</p>
						</div>
					</li>
				</ol>
			</Exhibit>

			<Exhibit label="Troubleshooting" id="troubleshooting">
				<Troubleshooting />
			</Exhibit>

			<Exhibit label="Upgrades & migration" id="upgrades">
				<p className="lede" style={{ maxWidth: '58ch' }}>
					Substrate is pre-1.0: minor versions may move fast. Before upgrading, read{' '}
					<Link href="/releases">releases → 05</Link> for breaking changes and migration actions, and
					validate against the{' '}
					<a className="ext" href={storybookHref(null)} target="_blank" rel="noreferrer">
						canonical Storybook
						<ExtArrow />
					</a>
					. For contribution and cross-repo validation workflows (source-link, snapshots), follow{' '}
					<a href={`${site.repoUrl}/blob/main/${site.contributionDocPath}`} target="_blank" rel="noreferrer">
						DesignSystemConsumerWorkflows
					</a>
					.
				</p>
			</Exhibit>
		</>
	);
}
