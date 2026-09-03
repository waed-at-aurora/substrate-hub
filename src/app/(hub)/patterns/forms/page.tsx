import type { Metadata } from 'next';
import Link from 'next/link';
import { Exhibit } from '@/components/exhibit';
import { FormsPatternShowcase } from '@/components/islands';
import { ExtArrow } from '@/components/marks';
import { storybookHref } from '@/config/site';
import { data } from '@/lib/data';

export const metadata: Metadata = { title: 'Forms pattern' };


export default function FormsPattern() {
	return (
		<>
			<div className="cover forms-cover">
				<p className="cover-issue">
					<span>
						04 · Patterns · <Link href="/patterns">back to index</Link>
					</span>
					<span>
						{data.forms.chapters.length} chapters · {data.forms.examples.length} examples
					</span>
				</p>
				<h1>Forms</h1>
				<p className="cover-standfirst">
					How EOS products collect input: a shared structure for fields, guidance, validation,
					submission, and sensitive actions. Recognize the pattern here; use Storybook for the
					complete guidance and tested states.
				</p>
			</div>

			<Exhibit label="Live pattern · package render" meta="@aurora-ui/substrate" id="pattern">
				<h2 className="statement">One pattern from first input to final action.</h2>
				<div className="forms-intro">
					<p className="lede">
						Use it whenever someone enters or edits data — scenario setup, model inputs, settings,
						or any submission flow. Do not assemble ad-hoc field stacks.
					</p>
					<p className="note">
						These representative moments are live package components. Labels, values, errors, and
						confirmation copy can grow without changing the reading order.
					</p>
				</div>
				<FormsPatternShowcase />
			</Exhibit>

			<Exhibit label="Full guidance" meta="maintained in storybook-substrate" id="storybook">
				<div className="forms-storybook-handoff">
					<div>
						<h2>Take the full pattern into Storybook.</h2>
						<p className="lede">
							Go deeper on structure, field anatomy, long guidance, responsive reflow,
							validation and recovery, submission, sensitive flows, accessibility, and testing.
							Storybook holds all {data.forms.chapters.length} chapters and{' '}
							{data.forms.examples.length} worked examples so this page can stay a clear map.
						</p>
					</div>
					<a
						className="action action-primary ext"
						href={storybookHref(data.forms.storybook)}
						target="_blank"
						rel="noreferrer"
					>
						Open full pattern in Storybook
						<ExtArrow />
					</a>
				</div>


			</Exhibit>
		</>
	);
}
