#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repository = process.env.AURORA_UI_REPOSITORY ?? 'AuroraEnergyResearch/aurora-ui';
const requiredTag = process.env.SUBSTRATE_RELEASE_TAG ?? null;
const token = process.env.AURORA_UI_TOKEN ?? process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
const tagPrefixes = ['packages/substrate/', 'packages/components-v2/'];

if (!token) {
	console.error('GitHub access token not found; set AURORA_UI_TOKEN, GH_TOKEN, or GITHUB_TOKEN');
	process.exit(1);
}

const releases = [];
for (let page = 1; ; page += 1) {
	const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`, {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'substrate-hub-release-sync',
		},
	});

	if (!response.ok) {
		const detail = await response.text();
		console.error(`Could not read ${repository} releases: GitHub returned ${response.status} ${detail}`);
		process.exit(1);
	}

	const pageReleases = await response.json();
	releases.push(...pageReleases);
	if (pageReleases.length < 100) break;
}

const substrateReleases = releases
	.filter((release) => !release.draft)
	.map((release) => {
		const tagPrefix = tagPrefixes.find((prefix) => release.tag_name.startsWith(prefix));
		if (!tagPrefix) return null;

		const version = release.tag_name.slice(tagPrefix.length);
		return {
			version,
			tag: release.tag_name,
			name: release.name || `v${version}`,
			url: release.html_url,
			publishedAt: release.published_at ?? release.created_at,
			body: release.body ?? '',
			prerelease: release.prerelease,
			breaking: /(^|\n)#{1,3}\s+breaking changes?\b/i.test(release.body ?? ''),
		};
	})
	.filter(Boolean)
	.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

if (requiredTag && !substrateReleases.some((release) => release.tag === requiredTag)) {
	console.error(`Published release ${requiredTag} was not returned by the GitHub Releases API`);
	process.exit(1);
}

const output = {
	syncedAt: new Date().toISOString(),
	source: `https://github.com/${repository}/releases`,
	releases: substrateReleases,
};
const outputPath = join(here, '..', 'src', 'data', 'releases.json');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(output, null, '\t')}\n`);
console.log(`synced: ${substrateReleases.length} Substrate releases`);
