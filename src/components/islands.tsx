'use client';

/**
 * The DS bundle registers Highcharts modules at import time, which cannot run
 * during SSR — so every island that imports it mounts client-only, with a
 * ruled placeholder holding its space.
 */
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const Loading = ({ minHeight, label }: { minHeight: string; label: string }) => (
	<div
		aria-busy="true"
		className="mono dim"
		style={{
			minHeight,
			border: '1px solid var(--rule-soft)',
			borderRadius: 3,
			display: 'grid',
			placeItems: 'center',
			fontSize: '0.7rem',
			letterSpacing: '0.1em',
			textTransform: 'uppercase',
		}}
	>
		{label}
	</div>
);

const PlaygroundContent = dynamic(() => import('./playground').then((m) => m.Playground), {
	ssr: false,
	loading: () => <Loading minHeight="21rem" label="loading live figure…" />,
});

export function Playground() {
	const boundaryRef = useRef<HTMLDivElement | null>(null);
	const [shouldLoad, setShouldLoad] = useState(false);

	useEffect(() => {
		const boundary = boundaryRef.current;
		if (!boundary) return;
		if (!('IntersectionObserver' in window)) {
			setShouldLoad(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				setShouldLoad(true);
				observer.disconnect();
			},
			{ rootMargin: '800px 0px', threshold: 0.01 },
		);
		observer.observe(boundary);
		return () => observer.disconnect();
	}, []);

	if (shouldLoad) return <PlaygroundContent />;
	return (
		<div ref={boundaryRef}>
			<Loading minHeight="21rem" label="loading live figure…" />
		</div>
	);
}

export const Catalog = dynamic(() => import('./catalog').then((m) => m.Catalog), {
	ssr: false,
	loading: () => <Loading minHeight="32rem" label="loading component gallery…" />,
});

export const FormPatternExample = dynamic(
	() => import('./forms-pattern-showcase').then((m) => m.FormPatternExample),
	{
		ssr: false,
		loading: () => <Loading minHeight="36rem" label="loading form example…" />,
	}
);

export const FormsPatternShowcase = dynamic(
	() => import('./forms-pattern-showcase').then((m) => m.FormsPatternShowcase),
	{
		ssr: false,
		loading: () => <Loading minHeight="48rem" label="loading form specimens…" />,
	}
);

export const Troubleshooting = dynamic(() => import('./troubleshooting').then((m) => m.Troubleshooting), {
	ssr: false,
	loading: () => <Loading minHeight="10rem" label="loading checks…" />,
});
