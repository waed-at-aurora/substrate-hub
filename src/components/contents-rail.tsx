'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const sections = [
	{ num: '01', title: 'Overview', href: '/overview' },
	{ num: '02', title: 'Get started', href: '/get-started' },
	{ num: '03', title: 'Components', href: '/components' },
	{ num: '04', title: 'Patterns', href: '/patterns' },
	{ num: '05', title: 'Releases', href: '/releases' },
	{ num: '06', title: 'Roadmap', href: '/roadmap' },
	{ num: '07', title: 'Tools & resources', href: '/tools' },
] as const;

export function ContentsRail() {
	const pathname = usePathname();
	const router = useRouter();

	// Direct address: keys 1–7 jump to the numbered section.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			const t = e.target as HTMLElement;
			if (t.closest('input, textarea, select, [contenteditable]')) return;
			const i = Number(e.key) - 1;
			if (i >= 0 && i < sections.length) router.push(sections[i].href);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [router]);

	const isActive = (href: string) => pathname.startsWith(href);

	return (
		<nav className="rail" aria-label="Contents">
			<span className="rail-label">Contents</span>
			<ol className="rail-list">
				{sections.map((s) => (
					<li className="rail-item" key={s.href}>
						<Link href={s.href} aria-current={isActive(s.href) ? 'page' : undefined}>
							<span className="rail-num">{s.num}</span>
							<span>{s.title}</span>
						</Link>
					</li>
				))}
			</ol>
			<p className="rail-hint">
				Direct address: press <kbd>1</kbd>–<kbd>7</kbd> to jump to a section.
			</p>
		</nav>
	);
}
