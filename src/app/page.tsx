import { LandingStage } from '@/components/landing-stage';
import { data, fmtDate } from '@/lib/data';

/**
 * The front door: the Night Portal stage grown to the full viewport.
 * The in-depth hub (pyramid, quick start, live figure, coverage, feed,
 * resources) lives at /overview and every numbered section beyond it.
 */
export default function Landing() {
	return (
		<LandingStage
			pkg={data.source.package}
			version={data.source.version}
			lastChange={fmtDate(data.history[0].date)}
			composites={data.counts.composites}
			primitives={data.counts.primitives}
		/>
	);
}
