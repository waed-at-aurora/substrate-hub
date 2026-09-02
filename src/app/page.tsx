import { LandingStage } from '@/components/landing-stage';
import { FoundationBuild } from '@/components/foundation-build';
import { data, fmtDate } from '@/lib/data';

/** The Night Portal followed by a scroll-built view of the system underneath it. */
export default function Landing() {
	return (
		<main className="landing-home">
			<LandingStage
				pkg={data.source.package}
				version={data.source.version}
				lastChange={fmtDate(data.history[0].date)}
				composites={data.counts.composites}
				primitives={data.counts.primitives}
			/>
			<FoundationBuild composites={data.counts.composites} primitives={data.counts.primitives} />
		</main>
	);
}
