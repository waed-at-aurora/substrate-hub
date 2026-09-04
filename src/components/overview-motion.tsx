'use client';

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
		let cancelled = false;
		let setupStarted = false;
		let setupGeneration = 0;
		let idleSetupHandle: number | null = null;
		let setupTimer: number | null = null;
		let disposeAnimations = () => {};

		const setupAnimations = async () => {
			const generation = ++setupGeneration;
			disposeAnimations();
			if (motionPreference.matches) return;

			const [anime, motion] = await Promise.all([import('animejs'), import('motion')]);
			if (cancelled || motionPreference.matches || generation !== setupGeneration) return;

			const cleanups: Array<() => void> = [];
			const word = stage.querySelector<HTMLElement>('.stage-word');
			const body = stage.querySelector<HTMLElement>('.stage-body');

			if (word) {
				word.style.willChange = 'transform, opacity, filter';
				const animation = motion.animate(
					word,
					{
						transform: ['translate3d(0, 0, 0) scale(1)', 'translate3d(5vw, -1.5rem, 0) scale(0.94)'],
						opacity: [1, 0.24],
						filter: ['blur(0px)', 'blur(3px)'],
					},
					{ ease: 'linear' },
				);
				cleanups.push(motion.scroll(animation, { target: stage, offset: ['start start', 'end start'] }));
				cleanups.push(() => {
					animation.cancel();
					word.style.removeProperty('will-change');
				});
			}

			if (body) {
				body.style.willChange = 'transform, opacity';
				const animation = motion.animate(
					body,
					{ transform: ['translate3d(0, 0, 0)', 'translate3d(0, -1.25rem, 0)'], opacity: [1, 0.4] },
					{ ease: 'linear' },
				);
				cleanups.push(motion.scroll(animation, { target: stage, offset: ['start start', 'end start'] }));
				cleanups.push(() => {
					animation.cancel();
					body.style.removeProperty('will-change');
				});
			}

			page.querySelectorAll<HTMLElement>('.exhibit-caption').forEach((caption) => {
				const exhibit = caption.closest<HTMLElement>('.exhibit');
				const parts = Array.from(caption.children);
				if (!exhibit || parts.length === 0) return;

				const animation = anime.animate(parts, {
					opacity: { from: 0.35 },
					x: { from: '-0.7rem' },
					letterSpacing: { from: '0.18em' },
					delay: anime.stagger(55),
					duration: 620,
					ease: 'outExpo',
					autoplay: anime.onScroll({ target: exhibit, enter: 'bottom top', repeat: false }),
				});
				cleanups.push(() => animation.revert());
			});

			const listGroups = [
				'#what .overview-boundary > div',
				'#why [data-persona-trigger]',
				'#fits .pyramid-note',
				'#quick-start .codeblock',
				'#coverage tbody tr',
			];

			for (const selector of listGroups) {
				const items = Array.from(page.querySelectorAll<HTMLElement>(selector));
				const target = items[0]?.parentElement;
				if (!target || items.length === 0) continue;

				const animation = anime.animate(items, {
					opacity: { from: 0.5 },
					y: { from: '0.65rem' },
					delay: anime.stagger(45),
					duration: 560,
					ease: 'outExpo',
					autoplay: anime.onScroll({ target, enter: 'bottom top', repeat: false }),
				});
				cleanups.push(() => animation.revert());
			}

			disposeAnimations = () => {
				for (const cleanup of cleanups.reverse()) cleanup();
				disposeAnimations = () => {};
			};
		};

		const removeSetupTriggers = () => {
			window.removeEventListener('scroll', startSetup);
			window.removeEventListener('pointerdown', startSetup);
			window.removeEventListener('keydown', startSetup);
		};
		const startSetup = () => {
			if (cancelled || setupStarted) return;
			setupStarted = true;
			if (idleSetupHandle !== null) {
				window.cancelIdleCallback(idleSetupHandle);
				idleSetupHandle = null;
			}
			if (setupTimer !== null) {
				window.clearTimeout(setupTimer);
				setupTimer = null;
			}
			removeSetupTriggers();
			void setupAnimations();
		};
		const onPreferenceChange = () => {
			setupGeneration += 1;
			disposeAnimations();
			if (!motionPreference.matches) void setupAnimations();
		};

		window.addEventListener('scroll', startSetup, { passive: true, once: true });
		window.addEventListener('pointerdown', startSetup, { passive: true, once: true });
		window.addEventListener('keydown', startSetup, { once: true });
		const requestIdleSetup = window.requestIdleCallback?.bind(window);
		if (requestIdleSetup) {
			idleSetupHandle = requestIdleSetup(startSetup, { timeout: 500 });
		} else {
			setupTimer = window.setTimeout(startSetup, 100);
		}
		motionPreference.addEventListener('change', onPreferenceChange);

		return () => {
			cancelled = true;
			setupGeneration += 1;
			removeSetupTriggers();
			if (idleSetupHandle !== null) window.cancelIdleCallback(idleSetupHandle);
			if (setupTimer !== null) window.clearTimeout(setupTimer);
			motionPreference.removeEventListener('change', onPreferenceChange);
			disposeAnimations();
		};
	}, []);

	return null;
}
