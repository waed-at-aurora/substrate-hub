import type { Metadata } from 'next';
import Link from 'next/link';
import { Archivo, Bricolage_Grotesque, Spline_Sans_Mono } from 'next/font/google';
import '@aurora-ui/components-v2/style.css';
import './globals.css';
import { ContentsRail } from '@/components/contents-rail';
import { site } from '@/config/site';
import { data, fmtDate } from '@/lib/data';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' });
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const mono = Spline_Sans_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
	title: { default: 'Substrate — the EOS design system', template: '%s · Substrate' },
	description:
		'The shared layer behind consistent EOS experiences: install Substrate, find a component or pattern, and see what is changing.',
};

const CONTRACT = `
impeccable direction contract — brief-pinned replacement world (2026-08-26), supersedes seed 564a1789's Market Report rendition
THESIS: a night-edition design-system portal with Astryx-like energy — dark-first, minimalist, editorial, slightly experimental; it refuses both the light docs-site default and the previous light report rendition.
OWN-WORLD: DS dark canvas #09090B, near-white ink #F4F4F5, hairline zinc rules with mono captions (FIG./TABLE) carried over from the report grammar; Aurora yellow #FFCC00 law-bound to primary action and new-signal, electric on night; cyan marks live figures; Bricolage Grotesque display (variable wght/opsz) over restrained Archivo UI and Spline Sans Mono; physical status marks.
STORY: a visitor lands on a monumental SUBSTRATE stage, reads "The shared layer behind consistent EOS experiences," installs from the stage, then works the numbered sections mid-task.
FIRST VIEWPORT: masthead; hero stage framed by rules — SUBSTRATE at viewport-cropping scale with a drifting outline ghost and a one-time variable-weight settle (disabled under prefers-reduced-motion), positioning line, supporting copy, three actions (yellow Install leading), compact copyable install command.
FORM: user-pinned direction (dark editorial-experimental portal); no roll — a brief-pinned direction beats the roll.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`dark ${archivo.variable} ${display.variable} ${mono.variable}`}>
			<body>
				<div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<!--${CONTRACT}-->` }} />
				<header className="masthead">
					<div className="masthead-inner">
						<Link href="/" className="masthead-title">
							Substrate
						</Link>
						<span className="masthead-sub">
							Design system · {site.family} · {site.org}
						</span>
						<span className="masthead-spacer" />
						<span className="masthead-meta">
							{data.source.package} v{data.source.version} · synced {fmtDate(data.syncedAt)}
						</span>
					</div>
				</header>
				<div className="frame">
					<ContentsRail />
					<main className="page">{children}</main>
				</div>
				<footer className="frame">
					<div />
					<div className="colophon">
						<span>
							Substrate Hub — internal · source of truth:{' '}
							<a href={site.repoUrl} target="_blank" rel="noreferrer">
								aurora-ui
							</a>
							/packages/components-v2
						</span>
						<span>catalog synced {fmtDate(data.syncedAt)} · regenerate with `npm run sync`</span>
					</div>
				</footer>
			</body>
		</html>
	);
}
