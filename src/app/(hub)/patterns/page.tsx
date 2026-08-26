import type { Metadata } from 'next';
import Link from 'next/link';
import { Exhibit } from '@/components/exhibit';
import { ExtArrow, Status } from '@/components/marks';
import { storybookHref } from '@/config/site';
import { data } from '@/lib/data';

export const metadata: Metadata = { title: 'Patterns' };

/** Emerging pattern areas grouped from real composite components. */
const areas = [
	{
		task: 'Filtering & toolbars',
		components: ['SurfaceToolbar', 'ChartToolbar', 'ModeActivatorToggleGroup'],
		note: 'Consistent control strips over data surfaces: filters, modes, and chart controls.',
	},
	{
		task: 'Model & time inputs',
		components: ['TimeRangeSelector', 'TimelineScrubber', 'Calendar'],
		note: 'Steering scenarios and horizons: ranges, scrubbing, and date entry.',
	},
	{
		task: 'Output visualisation',
		components: ['DataTable', 'SurfacePanel', 'ChartLoadingSkeleton'],
		note: 'Presenting model output: tabular results, panels, and chart scaffolding.',
	},
	{
		task: 'Case & project management',
		components: ['InvestmentCaseSelectionCard'],
		note: 'Selecting and comparing investment cases and projects.',
	},
];

export default function Patterns() {
	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>04 · Patterns</span>
					<span>1 documented · {areas.length} emerging areas</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>
					Task-oriented guidance, not isolated controls.
				</h1>
				<p className="cover-standfirst">
					A pattern tells you how to assemble components for a job: when to use it, what it is made
					of, and how it behaves. Substrate has one fully documented pattern today, and four emerging
					areas where the components exist ahead of the written guidance.
				</p>
			</div>

			<Exhibit label="The established pattern" id="forms">
				<h2>Forms</h2>
				<p className="lede">
					Structure, field composition, help and validation, data entry, submission, and sensitive
					flows — documented across {data.forms.chapters.length} chapters with{' '}
					{data.forms.examples.length} worked, tested examples.
				</p>
				<div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1.2rem', flexWrap: 'wrap' }}>
					<Link className="action" href="/patterns/forms">
						Read the pattern
					</Link>
					<a className="action ext" href={storybookHref(data.forms.storybook)} target="_blank" rel="noreferrer">
						Pattern docs in Storybook
						<ExtArrow />
					</a>
					<Status status="proposed" />
				</div>
			</Exhibit>

			<Exhibit
				label="Table 1 — emerging pattern areas"
				meta="components exist; guidance not yet written"
				id="emerging"
			>
				<div className="table-scroll">
<table>
					<thead>
						<tr>
							<th>Task</th>
							<th>Components involved</th>
							<th>Scope</th>
						</tr>
					</thead>
					<tbody>
						{areas.map((a) => (
							<tr key={a.task}>
								<td>
									<strong>{a.task}</strong>
								</td>
								<td>
									<code className="mono">{a.components.join(' · ')}</code>
								</td>
								<td className="dim">{a.note}</td>
							</tr>
						))}
					</tbody>
				</table>
</div>
				<p className="note" style={{ marginTop: '1rem' }}>
					These groupings are drawn from the composite layer as it stands; they become documented
					patterns as guidance lands. Componentry for each is in the{' '}
					<Link href="/components">index → 03</Link>.
				</p>
			</Exhibit>
		</>
	);
}
