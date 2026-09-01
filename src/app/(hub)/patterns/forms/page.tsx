import type { Metadata } from 'next';
import Link from 'next/link';
import { Exhibit } from '@/components/exhibit';
import { ExtArrow, Status } from '@/components/marks';
import { site, storybookHref } from '@/config/site';
import { data, unCamel } from '@/lib/data';

export const metadata: Metadata = { title: 'Forms pattern' };

const chapterOrder = [
	'Overview',
	'StructureAndLayout',
	'FieldsHelpAndValidation',
	'DataEntry',
	'SubmissionAndSensitiveFlows',
	'AccessibilityAndTesting',
	'SourcesDecisionsAndGaps',
	'FutureDirection',
];

const componentsInvolved = [
	'Field',
	'FieldSet',
	'FieldLabel',
	'FieldError',
	'Input',
	'InputGroup',
	'Textarea',
	'Select',
	'Combobox',
	'Checkbox',
	'RadioGroup',
	'Switch',
	'Button',
	'Alert',
];

export default function FormsPattern() {
	const chapters = chapterOrder.filter((c) => data.forms.chapters.includes(c));

	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>
						04 · Patterns · <Link href="/patterns">back to index</Link>
					</span>
					<span>
						{chapters.length} chapters · {data.forms.examples.length} examples
					</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>Forms</h1>
				<p className="cover-standfirst">
					How EOS products collect input: structure and grouping, field composition, help and
					validation, data entry, submission, and sensitive flows. This page is the map; the full
					chapters and living examples are in Storybook.
				</p>
				<div className="cover-actions">
					<a
						className="action action-primary ext"
						href={storybookHref(data.forms.storybook)}
						target="_blank"
						rel="noreferrer"
					>
						Open in Storybook
						<ExtArrow />
					</a>
					<span className="status" style={{ alignSelf: 'center' }}>
						<Status status="proposed" />
					</span>
				</div>
			</div>

			<Exhibit label="When to use it" id="when">
				<p className="lede">
					Reach for the pattern whenever a user enters or edits data — scenario setup, model inputs,
					settings, or any submission flow. It exists so every EOS form shares one structure, one
					validation voice, and one accessibility bar; do not assemble ad-hoc field stacks.
				</p>
			</Exhibit>

			<Exhibit label="Table 1 — chapters" meta="documented in storybook-substrate" id="chapters">
				<div className="table-scroll">
<table style={{ maxWidth: '46rem' }}>
					<thead>
						<tr>
							<th className="num">No.</th>
							<th>Chapter</th>
						</tr>
					</thead>
					<tbody>
						{chapters.map((c, i) => (
							<tr key={c}>
								<td className="num mono dim">{String(i + 1).padStart(2, '0')}</td>
								<td>{unCamel(c)}</td>
							</tr>
						))}
					</tbody>
				</table>
</div>
			</Exhibit>

			<Exhibit label="Components involved" id="components">
				<p className="lede" style={{ marginBottom: '0.8rem' }}>
					The pattern composes the form primitives; each links to its API docs from the{' '}
					<Link href="/components">component index</Link>.
				</p>
				<p className="mono" style={{ maxWidth: '60ch', lineHeight: 2 }}>
					{componentsInvolved.join(' · ')}
				</p>
			</Exhibit>

			<Exhibit label="Accessibility & interaction" id="a11y">
				<p className="lede">
					Every worked example runs in Storybook with accessibility checks enforced at error level
					and interaction tests exercising real entry, validation, and submission flows. Error
					summaries, focus order, and long-guidance anatomy each have a dedicated example.
				</p>
			</Exhibit>

			<Exhibit label={`Table 2 — worked examples (${data.forms.examples.length})`} id="examples">
				<div className="table-scroll">
<table>
					<thead>
						<tr>
							<th>Example</th>
							<th>Exercise</th>
						</tr>
					</thead>
					<tbody>
						{data.forms.examples.map((e) => (
							<tr key={e}>
								<td>
									<code className="mono">{e}</code>
								</td>
								<td className="dim">{unCamel(e.replace(/Example$/, ''))}</td>
							</tr>
						))}
					</tbody>
				</table>
</div>
				<p className="note" style={{ marginTop: '1rem' }}>
					Product variants belong above the shared pattern: keep the structure and validation voice,
					differentiate presentation at the product layer. Source:{' '}
					<a
						href={`${site.repoUrl}/tree/main/storybook-substrate/src/patterns/forms`}
						target="_blank"
						rel="noreferrer"
					>
						storybook-substrate/src/patterns/forms
					</a>
					.
				</p>
			</Exhibit>
		</>
	);
}
