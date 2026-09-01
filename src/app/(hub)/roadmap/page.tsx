import type { Metadata } from 'next';
import Link from 'next/link';
import { Exhibit } from '@/components/exhibit';
import { StatusMark } from '@/components/marks';
import { Provisional } from '@/components/provisional';
import { site } from '@/config/site';
import { data } from '@/lib/data';

export const metadata: Metadata = { title: 'Roadmap' };

/**
 * NOW is derived from observable work in source history; NEXT and LATER are
 * provisional until confirmed against the authoritative planning source.
 */
const roadmap = {
	now: [
		{
			title: 'CSS cascade-layer contract',
			note: 'Guarantee consumer apps keep precedence over system styles (DS-59, in progress in source).',
			kind: 'commitment' as const,
		},
		{
			title: 'Forms pattern rollout',
			note: 'Documented chapters and worked examples shipping through the proposed channel (DS-48).',
			kind: 'commitment' as const,
		},
	],
	next: [
		{
			title: 'Guidance for emerging pattern areas',
			note: 'Filtering & toolbars, model & time inputs, output visualisation, case management.',
			kind: 'exploration' as const,
		},
	],
	later: [
		{
			title: 'Graduating ux-intent experiments',
			note: `${data.counts.experimental} explorations on the alpha channel today; promotion criteria to be set.`,
			kind: 'exploration' as const,
		},
	],
};

const Kind = ({ kind }: { kind: 'commitment' | 'exploration' }) => (
	<span className="status" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
		<StatusMark status={kind === 'commitment' ? 'stable' : 'planned'} />
		{kind}
	</span>
);

export default function Roadmap() {
	return (
		<>
			<div className="cover" style={{ paddingBottom: '1.6rem' }}>
				<p className="cover-issue">
					<span>06 · Roadmap</span>
					<span>
						<Provisional what="confirm against planning source" />
					</span>
				</p>
				<h1 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)' }}>Now, next, later.</h1>
				<p className="cover-standfirst">
					Commitments (■) are being worked on and observable in source; explorations (□) are
					directions under consideration, not promises. “Now” is derived from real activity in{' '}
					<a href={site.repoUrl} target="_blank" rel="noreferrer">
						aurora-ui
					</a>
					; the rest awaits confirmation against the authoritative planning source
					{site.planningUrl.value ? (
						<>
							{' '}
							(<a href={site.planningUrl.value}>planning board</a>)
						</>
					) : null}
					.
				</p>
			</div>

			<Exhibit label="Table 1 — priorities" id="board">
				<div className="roadmap">
					{(['now', 'next', 'later'] as const).map((col) => (
						<div className="roadmap-col" key={col}>
							<span className="mono">{col}</span>
							{roadmap[col].map((item) => (
								<div className="roadmap-item" key={item.title}>
									<h3>{item.title}</h3>
									<p>{item.note}</p>
									<Kind kind={item.kind} />
								</div>
							))}
						</div>
					))}
				</div>
				<p className="note" style={{ marginTop: '1.4rem' }}>
					What shipped most recently is on <Link href="/releases">releases → 05</Link>.
				</p>
			</Exhibit>
		</>
	);
}
