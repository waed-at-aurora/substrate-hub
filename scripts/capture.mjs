#!/usr/bin/env node
/** Capture full-page screenshots of hub routes for the finish review. */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4400';
const OUT = '.impeccable/review';
mkdirSync(OUT, { recursive: true });

const routes = JSON.parse(process.env.ROUTES ?? '["/"]');
const viewports = JSON.parse(
	process.env.VIEWPORTS ?? '[{"name":"desktop","width":1440,"height":900},{"name":"mobile","width":390,"height":844}]'
);

const browser = await chromium.launch({
	executablePath: `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell`,
	args: ['--no-sandbox', '--force-color-profile=srgb'],
	env: { ...process.env, LD_LIBRARY_PATH: process.env.EXTRA_LIBS ?? '' },
});

for (const vp of viewports) {
	const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
	for (const route of routes) {
		await page.goto(BASE + route, { waitUntil: 'networkidle' });
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.waitForTimeout(400);
		const slug = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
		const file = `${OUT}/${vp.name}${routes.length > 1 ? `-${slug}` : ''}.png`;
		await page.screenshot({ path: file, fullPage: process.env.FULLPAGE !== '0' });
		console.log(file);
	}
	await page.close();
}
await browser.close();
