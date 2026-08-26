/**
 * Site identifiers. Everything marked TODO is a placeholder awaiting the
 * real value — the UI renders these with a visible PROVISIONAL mark.
 */
export const site = {
	name: 'Substrate',
	hubName: 'Substrate Hub',
	org: 'Aurora Energy Research',
	family: 'EOS',
	package: '@aurora-ui/components-v2',
	registry:
		'https://aer-shared-services-730335338013.d.codeartifact.eu-west-2.amazonaws.com/npm/aer-software-development-managed-repository/',
	repoUrl: 'https://github.com/AuroraEnergyResearch/aurora-ui',
	cliUrl: 'https://github.com/AuroraEnergyResearch/substrate-cli-v2',
	atlasUrl: 'https://github.com/AuroraEnergyResearch/atlas',
	contributionDocPath: 'docs/DesignSystemConsumerWorkflows.md',
	/** Local canonical Storybook (storybook-v2, `storybook dev -p 6007`). */
	storybookLocalUrl: 'http://localhost:6007',
	/** Production Storybook (storybook-v2). */
	storybookUrl: { value: 'https://laughing-adventure-e2q2em3.pages.github.io/v2', provisional: false },
	/** TODO: real support channel — replace and remove `provisional`. */
	supportChannel: { value: '#design-system', provisional: true },
	/** TODO: authoritative planning source (board/epic) — replace and remove `provisional`. */
	planningUrl: { value: '', provisional: true },
} as const;

export const storybookHref = (path: string | null) =>
	path ? `${site.storybookUrl.value}${path}` : site.storybookUrl.value;
