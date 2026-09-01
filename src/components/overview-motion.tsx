'use client';

import { animate as animeAnimate, onScroll, stagger } from 'animejs';
import { animate as motionAnimate, scroll } from 'motion';
import { useEffect } from 'react';

/**
 * Overview-only motion choreography. Motion links the opening stage to scroll;
 * Anime.js typesets the report captions and assembles actual list structures.
 */
export function OverviewMotion() {
	useEffect(() => {
		const stage = document.querySelector<HTMLElement>('[data-overview-stage]');
		const page = stage?.closest<HTMLElement>('.page');
		if (!stage || !page) return;

		const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
		let disposeAnimations = () => {};

		const setupAnimations = () => {
			disposeAnimations();
			if (motionPreference.matches) return;

			const cleanups: Array<() => void> = [];
			const word = stage.querySelector<HTMLElement>('.stage-word');
			const body = stage.querySelector<HTMLElement>('.stage-body');

			if (word) {
				word.style.willChange = 'transform, opacity, filter';
				const animation = motionAnimate(
					word,
					{
						transform: ['translate3d(0, 0, 0) scale(1)', 'translate3d(5vw, -1.5rem, 0) scale(0.94)'],
						opacity: [1, 0.24],
						filter: ['blur(0px)', 'blur(3px)'],
					},
					{ ease: 'linear' },
				);
				cleanups.push(scroll(animation, { target: stage, offset: ['start start', 'end start'] }));
				cleanups.push(() => {
					animation.cancel();
					word.style.removeProperty('will-change');
				});
			}

			if (body) {
				body.style.willChange = 'transform, opacity';
				const animation = motionAnimate(
					body,
					{ transform: ['translate3d(0, 0, 0)', 'translate3d(0, -1.25rem, 0)'], opacity: [1, 0.4] },
					{ ease: 'linear' },
				);
				cleanups.push(scroll(animation, { target: stage, offset: ['start start', 'end start'] }));
				cleanups.push(() => {
					animation.cancel();
					body.style.removeProperty('will-change');
				});
			}

			page.querySelectorAll<HTMLElement>('.exhibit-caption').forEach((caption) => {
				const exhibit = caption.closest<HTMLElement>('.exhibit');
				const parts = Array.from(caption.children);
				if (!exhibit || parts.length === 0) return;

				const animation = animeAnimate(parts, {
					opacity: { from: 0.35 },
					x: { from: '-0.7rem' },
					letterSpacing: { from: '0.18em' },
					delay: stagger(55),
					duration: 620,
					ease: 'outExpo',
					autoplay: onScroll({ target: exhibit, enter: 'bottom top', repeat: false }),
				});
				cleanups.push(() => animation.revert());
			});

			const listGroups = [
				'#quick-start .codeblock',
				'#fits .pyramid-note',
				'#coverage tbody tr',
			];

			for (const selector of listGroups) {
				const items = Array.from(page.querySelectorAll<HTMLElement>(selector));
				const target = items[0]?.parentElement;
				if (!target || items.length === 0) continue;

				const animation = animeAnimate(items, {
					opacity: { from: 0.5 },
					y: { from: '0.65rem' },
					delay: stagger(45),
					duration: 560,
					ease: 'outExpo',
					autoplay: onScroll({ target, enter: 'bottom top', repeat: false }),
				});
				cleanups.push(() => animation.revert());
			}

			disposeAnimations = () => {
				for (const cleanup of cleanups.reverse()) cleanup();
				disposeAnimations = () => {};
			};
		};

		setupAnimations();
		motionPreference.addEventListener('change', setupAnimations);

		return () => {
			motionPreference.removeEventListener('change', setupAnimations);
			disposeAnimations();
		};
	}, []);

	return null;
}
