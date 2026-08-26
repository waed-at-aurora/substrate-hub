#!/usr/bin/env node
/**
 * Syncs Substrate Hub's data from the design system source of truth.
 * Reads ../aurora-ui (override with AURORA_UI_WORKTREE) and writes
 * src/data/substrate.json. Never invents entries: everything here is
 * derived from files and git history in the aurora-ui repo.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const AURORA = process.env.AURORA_UI_WORKTREE ?? join(here, '..', '..', 'aurora-ui');
const DS = join(AURORA, 'packages', 'components-v2');
const SB = join(AURORA, 'storybook-v2', 'src');

if (!existsSync(DS)) {
	console.error(`aurora-ui not found at ${AURORA}; set AURORA_UI_WORKTREE`);
	process.exit(1);
}

const pascal = (s) => {
	const base = s.replace(/\.tsx?$/, '');
	if (base === 'cms') return 'CMS';
	return base.split(/[-_]/).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
};

/* ---- Storybook index: title + tags per story file ---- */
const stories = [];
function walk(dir) {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		if (statSync(p).isDirectory()) walk(p);
		else if (/\.stories\.tsx?$/.test(entry)) {
			const src = readFileSync(p, 'utf8');
			const title = src.match(/title:\s*['"]([^'"]+)['"]/)?.[1] ?? null;
			const tagsRaw = src.match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? '';
			const tags = [...tagsRaw.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
			stories.push({ file: p.slice(AURORA.length + 1), name: entry.replace(/\.(experimental|proposed)?\.?stories\.tsx?$/, ''), title, tags });
		}
	}
}
walk(SB);

const storyByName = new Map();
for (const s of stories) storyByName.set(s.name.toLowerCase(), s);

/** Storybook docs URL path for a title, e.g. Primitives/Feedback/Alert -> /docs/primitives-feedback-alert--docs */
const storyDocsPath = (title) =>
	title ? `/?path=/docs/${title.toLowerCase().replace(/[^a-z0-9/]+/g, '-').replace(/\//g, '-')}--docs` : null;

/** Status derived from storybook tags: 'proposed'/'experimental' tags win; default stable. */
const statusFromTags = (tags = []) => {
	if (tags.includes('experimental')) return 'experimental';
	if (tags.includes('proposed')) return 'proposed';
	return 'stable';
};

/* ---- Primitives: src/ui/*.tsx ---- */
const primitives = readdirSync(join(DS, 'src', 'ui'))
	.filter((f) => f.endsWith('.tsx'))
	.map((f) => {
		const name = pascal(f);
		const story = storyByName.get(name.toLowerCase()) ?? storyByName.get(f.replace('.tsx', '').replace(/-/g, '').toLowerCase());
		return {
			name,
			layer: 'primitive',
			source: `packages/components-v2/src/ui/${f}`,
			importName: name,
			status: story ? statusFromTags(story.tags) : 'stable',
			storybook: story ? storyDocsPath(story.title) : null,
			storyTitle: story?.title ?? null,
		};
	});

/* ---- Composites: src/components/* ---- */
const composites = readdirSync(join(DS, 'src', 'components'))
	.filter((f) => !f.startsWith('.'))
	.map((f) => {
		const isDir = statSync(join(DS, 'src', 'components', f)).isDirectory();
		const name = pascal(f);
		const story = storyByName.get(name.toLowerCase());
		return {
			name,
			layer: 'composite',
			source: `packages/components-v2/src/components/${f}`,
			importName: f === 'cms' ? 'CMSContentBlocks' : name,
			status: story ? statusFromTags(story.tags) : 'stable',
			storybook: story ? storyDocsPath(story.title) : null,
			storyTitle: story?.title ?? null,
			dir: isDir,
		};
	});

/* ---- Experimental track ---- */
let experimental = [];
const expDir = join(DS, 'src', 'experimental');
if (existsSync(expDir)) {
	const sub = readdirSync(expDir).filter((f) => statSync(join(expDir, f)).isDirectory());
	experimental = sub.flatMap((d) =>
		readdirSync(join(expDir, d))
			.filter((f) => f.endsWith('.tsx') || statSync(join(expDir, d, f)).isDirectory())
			.map((f) => ({ name: pascal(f.replace('.tsx', '')), track: d, source: `packages/components-v2/src/experimental/${d}/${f}` }))
	);
}

/* ---- Forms pattern docs (the established pattern) ---- */
const formsDir = join(SB, 'patterns', 'forms');
const formsChapters = existsSync(formsDir)
	? readdirSync(formsDir).filter((f) => f.endsWith('.mdx')).map((f) => basename(f, '.mdx'))
	: [];
const formsExamplesSrc = existsSync(join(formsDir, 'FormPatternExamples.tsx'))
	? readFileSync(join(formsDir, 'FormPatternExamples.tsx'), 'utf8')
	: '';
const formsExamples = [...new Set([...formsExamplesSrc.matchAll(/^(?:export )?function (\w+Example)\(/gm)].map((m) => m[1]))];
const formsStory = stories.find((s) => s.file.includes('patterns/forms/'));
/** Canonical entry point: the Overview docs chapter, falling back to the examples story. */
const formsDocsPath = formsChapters.includes('Overview')
	? '/?path=/docs/patterns-forms-overview--docs'
	: formsStory
		? storyDocsPath(formsStory.title)
		: null;

/* ---- Releases / history from git ---- */
const git = (args) => execFileSync('git', args, { cwd: AURORA, encoding: 'utf8' }).trim();
const logRaw = git(['log', '-60', '--date=iso-strict', '--pretty=%h%x09%ad%x09%s', '--', 'packages/components-v2', 'storybook-v2']);
const history = logRaw.split('\n').filter(Boolean).map((line) => {
	const [hash, date, ...rest] = line.split('\t');
	const subject = rest.join('\t');
	const m = subject.match(/^(feat|fix|style|docs|refactor|chore|perf|test)(\(([^)]*)\))?(!)?:\s*(.*)$/i);
	return {
		hash,
		date,
		subject,
		type: m ? m[1].toLowerCase() : null,
		scope: m?.[3] ?? null,
		breaking: Boolean(m?.[4]) || /BREAKING/.test(subject),
		summary: m ? m[5] : subject,
	};
});

const pkg = JSON.parse(readFileSync(join(DS, 'package.json'), 'utf8'));

const data = {
	syncedAt: new Date().toISOString(),
	source: { repo: 'https://github.com/AuroraEnergyResearch/aurora-ui', package: pkg.name, version: pkg.version, registry: pkg.publishConfig?.registry ?? null },
	primitives,
	composites,
	experimental,
	forms: { chapters: formsChapters, examples: formsExamples, tags: formsStory?.tags ?? [], storyTitle: formsStory?.title ?? null, storybook: formsDocsPath },
	history,
	counts: {
		primitives: primitives.length,
		composites: composites.length,
		experimental: experimental.length,
		stable: [...primitives, ...composites].filter((c) => c.status === 'stable').length,
		proposed: [...primitives, ...composites].filter((c) => c.status === 'proposed').length,
	},
};

mkdirSync(join(here, '..', 'src', 'data'), { recursive: true });
writeFileSync(join(here, '..', 'src', 'data', 'substrate.json'), JSON.stringify(data, null, '\t'));
console.log(`synced: ${primitives.length} primitives, ${composites.length} composites, ${experimental.length} experimental, ${history.length} history entries`);
