export const SETUP_SUBSTRATE_PROMPT =
	'Set up Substrate in this project. Inspect the stack and existing theme first. Run `npx --yes github:AuroraEnergyResearch/substrate-cli-v2 doctor`, then preview the install with `npx --yes github:AuroraEnergyResearch/substrate-cli-v2 install --dry-run`. If the checks pass, run `npx --yes github:AuroraEnergyResearch/substrate-cli-v2 install --yes`, import `@aurora-ui/substrate/style.css` at the app root, preserve the existing light or dark theme, render a basic `Button`, and verify it visually. Do not hand-edit registry credentials; report any failed check with its recovery command.';

export const SETUP_SUBSTRATE_PROMPT_PREVIEW =
	'Set up Substrate in this project. Inspect the stack and existing theme first…';
