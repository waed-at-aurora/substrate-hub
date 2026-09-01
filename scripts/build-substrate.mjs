#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const aurora = process.env.AURORA_UI_WORKTREE ?? join(here, '..', '..', 'aurora-ui');
const result = spawnSync(
	'corepack',
	['yarn', 'workspace', '@aurora-ui/substrate', 'run', 'build'],
	{
		cwd: aurora,
		stdio: 'inherit',
		shell: process.platform === 'win32',
	},
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
