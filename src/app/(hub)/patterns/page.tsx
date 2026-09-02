import type { Metadata } from 'next';
import { Exhibit } from '@/components/exhibit';
import { FormPatternExample } from '@/components/islands';
import { ExtArrow } from '@/components/marks';
import { storybookHref } from '@/config/site';
import { data } from '@/lib/data';

export const metadata: Metadata = { title: 'Patterns' };

export default function Patterns() {
	return (
		<>
			<div className="cover patterns-cover">
				<p className="cover-issue">
					<span>04 · Patterns</span>
					<span>
						1 established pattern · {data.forms.examples.length} tested examples
					</span>
				</p>
				<h1>Forms, from first field to final action.</h1>
				<p className="cover-standfirst">
					Substrate currently documents one interaction pattern: Forms. The live package example below
					mirrors Storybook’s structure-and-grouping example; Storybook remains the source for complete
					guidance, edge cases, accessibility, and tested states.
				</p>
			</div>

			<Exhibit label="Established pattern · live package render" meta="@aurora-ui/substrate" id="forms">
				<div className="forms-intro">
					<h2 className="statement">One task. One reading order.</h2>
					<p className="lede">
						Keep context visible, group related fields, and place the action after the information
						required to take it.
					</p>
				</div>

				<div className="forms-index-example">
					<FormPatternExample />
				</div>

				<div className="forms-storybook-handoff forms-index-handoff">
					<div>
						<h2>Continue with the complete pattern.</h2>
						<p className="lede">
							Storybook maintains all {data.forms.chapters.length} chapters and{' '}
							{data.forms.examples.length} worked examples, including validation, recovery,
							submission, sensitive actions, responsive behavior, accessibility, and testing.
						</p>
					</div>
					<a
						className="action action-primary ext"
						href={storybookHref(data.forms.storybook)}
						target="_blank"
						rel="noreferrer"
					>
						Open Forms in Storybook
						<ExtArrow />
					</a>
				</div>
			</Exhibit>
		</>
	);
}
