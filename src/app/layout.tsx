import type { Metadata } from 'next';
import { Archivo, Bricolage_Grotesque, Spline_Sans_Mono } from 'next/font/google';
import '@aurora-ui/components-v2/style.css';
import './globals.css';

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
STORY: a visitor lands inside the full-viewport Night Portal stage — the light follows them, the wordmark answers their pointer — then enters the hub and works the numbered sections mid-task.
FIRST VIEWPORT: the landing at / is the stage grown to the whole viewport: cursor-following lamp on the drafting grid, monumental SUBSTRATE responding per letter, dateline band above, positioning + three actions (yellow Enter the hub leading) + install line below. The in-depth hub lives at /overview.
FORM: user-pinned direction (dark editorial-experimental portal); no roll — a brief-pinned direction beats the roll.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`dark ${archivo.variable} ${display.variable} ${mono.variable}`}>
			<body>
				<div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<!--${CONTRACT}-->` }} />
				{children}
			{/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=45651f9d-9b23-4cf3-97f5-5b29db6bf89f"></script>
{/* impeccable-live-end */}
</body>
		</html>
	);
}
