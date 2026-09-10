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
				<h1>UI patterns. Forms are first.</h1>
				<p className="cover-standfirst">
					A pattern is a recommended way to build a feature. For example, the Forms pattern 
					shows how to organise fields, reveal fields based on previous answers, 
					handle validation and guide people through the final action.
				</p>
			</div>

			<Exhibit label="Established pattern · live package render" meta="@aurora-ui/substrate" id="forms">
				<div className="forms-intro">
					<h2 className="statement">A clear path from start to submit.</h2>
					<p className="lede">
						Keep the information people need close by, group similar fields together, and make the next action clear.
					</p>
				</div>

				<div className="forms-index-example">
					<FormPatternExample />
				</div>

				<div className="forms-storybook-handoff forms-index-handoff">
					<div>
						<h2>Continue with the complete pattern.</h2>
						<p className="lede">
							Storybook will continue to host more patterns and examples. Visit Storybook to explore 
							the latest guidance, including worked examples, validation, recovery,
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
