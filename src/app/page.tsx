import { LandingStage } from '@/components/landing-stage';
import { FoundationBuild } from '@/components/foundation-build';
import { data, fmtDate, latestReleaseVersion } from '@/lib/data';

/** The Night Portal followed by a scroll-built view of the system underneath it. */
export default function Landing() {
	return (
		<main>
			<LandingStage
				pkg={data.source.package}
				version={latestReleaseVersion}
				lastChange={fmtDate(data.history[0].date)}
				composites={data.counts.composites}
				primitives={data.counts.primitives}
			/>
			<FoundationBuild composites={data.counts.composites} primitives={data.counts.primitives} />
		</main>
	);
}
