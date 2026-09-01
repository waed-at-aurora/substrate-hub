'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@aurora-ui/substrate/components';

const items = [
	{
		id: 'unstyled',
		q: 'Components render unstyled',
		a: (
			<>
				The stylesheet import is missing or loads after an aggressive reset. Import{' '}
				<code>@aurora-ui/substrate/style.css</code> once at the app root. Its rules live in
				cascade layers, so unlayered app CSS intentionally wins ties — check you are not overriding
				tokens by accident.
			</>
		),
	},
	{
		id: 'peer',
		q: 'Module not found: react / react-i18next',
		a: (
			<>
				The package declares React and react-i18next as peers — install them in the consuming app.
				In linked or file: setups, point your bundler at the app&rsquo;s node_modules (webpack:{' '}
				<code>resolve.symlinks = false</code>).
			</>
		),
	},
	{
		id: 'registry',
		q: '401 from the registry',
		a: (
			<>
				Your CodeArtifact token expired. Re-run your team&rsquo;s AWS CodeArtifact npm login, then
				reinstall.
			</>
		),
	},
	{
		id: 'theme',
		q: 'Dark mode does not apply',
		a: (
			<>
				Theme is a root class, not a media query: toggle <code>.dark</code> on the html element.
				Semantic tokens re-alias automatically.
			</>
		),
	},
];

export function Troubleshooting() {
	return (
		<div style={{ maxWidth: '46rem' }}>
			<Accordion>
				{items.map((i) => (
					<AccordionItem key={i.id} value={i.id}>
						<AccordionTrigger>{i.q}</AccordionTrigger>
						<AccordionContent>{i.a}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
