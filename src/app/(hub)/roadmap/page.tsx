import type { Metadata } from 'next';
import { RoadmapComingSoon } from '@/components/roadmap-coming-soon';

export const metadata: Metadata = {
	title: 'Roadmap — coming soon',
	description: 'The Substrate roadmap is being prepared for release.',
};

export default function Roadmap() {
	return <RoadmapComingSoon />;
}
