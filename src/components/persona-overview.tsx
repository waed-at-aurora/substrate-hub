'use client';

import Link from 'next/link';
import { animate } from 'motion';
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from 'react';
import { ExtArrow } from '@/components/marks';
import { storybookHref } from '@/config/site';
import styles from './persona-overview.module.css';

type PersonaAction = {
	label: string;
	href: string;
	external?: boolean;
};

type Persona = {
	id: string;
	name: string;
	promise: string;
	headline: string;
	summary: string;
	path: readonly string[];
	outcomes: ReadonlyArray<{
		title: string;
		body: string;
	}>;
	actions: readonly PersonaAction[];
};

const PERSONAS: readonly Persona[] = [
	{
		id: 'developers',
		name: 'Dev teams',
		promise: 'Build sooner',
		headline: 'Go from setup to a working product flow, fast.',
		summary:
			'Install once, find the right component, and plug proven interactions into the workflows your team already uses.',
		path: ['Install', 'Discover', 'Compose', 'Ship'],
		outcomes: [
			{
				title: 'Start without friction',
				body: 'A guided setup gets the package into the right environment and points to the first useful import.',
			},
			{
				title: 'Build with confidence',
				body: 'Live examples expose real states, behavior, and usage before implementation begins.',
			},
			{
				title: 'Stay in your workflow',
				body: 'Reusable imports, Storybook, and local guidance keep answers close to the code.',
			},
		],
		actions: [
			{ label: 'Get started', href: '/get-started' },
			{ label: 'Browse components', href: '/components' },
			{ label: 'Open Storybook', href: storybookHref(null), external: true },
		],
	},
	{
		id: 'product',
		name: 'Product teams',
		promise: 'Prototype earlier',
		headline: 'Make the possibility tangible before the roadmap hardens.',
		summary:
			'Explore patterns and ready-made components, combine them into early concepts, and check platform guidance before committing delivery effort.',
		path: ['Explore', 'Combine', 'Prototype', 'Align'],
		outcomes: [
			{
				title: 'See what is possible',
				body: 'Working components and patterns reveal credible solution shapes at the start of discovery.',
			},
			{
				title: 'Prototype with real parts',
				body: 'Use established interactions to test an idea instead of drawing around unknown behavior.',
			},
			{
				title: 'Design with context',
				body: 'Platform guidance shows what is shared, what is flexible, and where a product should differ.',
			},
		],
		actions: [
			{ label: 'Explore patterns', href: '/patterns' },
			{ label: 'Try the live component', href: '#live' },
			{ label: 'Browse components', href: '/components' },
		],
	},
	{
		id: 'stakeholders',
		name: 'Senior stakeholders',
		promise: 'Deliver more value',
		headline: 'Repeat fewer decisions. Deliver more client value.',
		summary:
			'See how a shared system removes duplicate work, keeps experiences consistent, and concentrates investment on what makes each product valuable.',
		path: ['Standardize', 'Reuse', 'Accelerate', 'Differentiate'],
		outcomes: [
			{
				title: 'Move faster',
				body: 'Established foundations shorten the distance between an approved idea and working software.',
			},
			{
				title: 'Reduce duplicate effort',
				body: 'Recurring decisions are made once and improved centrally instead of repeated by every team.',
			},
			{
				title: 'Focus on differentiation',
				body: 'Teams spend more of their time on the workflows and outcomes clients actually notice.',
			},
		],
		actions: [
			{ label: 'See system leverage', href: '#fits' },
			{ label: 'Review coverage', href: '#coverage' },
			{ label: 'Review the roadmap', href: '/roadmap' },
		],
	},
	{
		id: 'commercial',
		name: 'Commercial',
		promise: 'Strengthen the story',
		headline: 'Turn platform progress into a stronger client story.',
		summary:
			'See what is polished today, what is coming next, and which capabilities can strengthen demos, pitches, and expansion conversations.',
		path: ['Discover', 'Demonstrate', 'Position', 'Grow'],
		outcomes: [
			{
				title: 'Show what is ready',
				body: 'Use working examples to demonstrate credible capability rather than relying on static promises.',
			},
			{
				title: 'Preview the direction',
				body: 'Roadmap and release visibility make upcoming platform investments easier to position honestly.',
			},
			{
				title: 'Connect capability to value',
				body: 'Patterns turn platform features into clearer stories for new opportunities and existing clients.',
			},
		],
		actions: [
			{ label: 'Open the live showcase', href: '#live' },
			{ label: 'See latest releases', href: '/releases' },
			{ label: 'Explore the roadmap', href: '/roadmap' },
		],
	},
];

function ForwardArrow() {
	return (
		<svg width="13" height="12" viewBox="0 0 13 12" fill="none" aria-hidden="true">
			<path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeLinecap="square" />
		</svg>
	);
}

function PersonaLink({ action }: { action: PersonaAction }) {
	const content = (
		<>
			<span>{action.label}</span>
			{action.external ? <ExtArrow /> : <ForwardArrow />}
		</>
	);

	if (action.external) {
		return (
			<a className={styles.action} href={action.href} target="_blank" rel="noreferrer">
				{content}
			</a>
		);
	}

	if (action.href.startsWith('#')) {
		return (
			<a className={styles.action} href={action.href}>
				{content}
			</a>
		);
	}

	return (
		<Link className={styles.action} href={action.href}>
			{content}
		</Link>
	);
}

export function PersonaOverview({ primitives, composites }: { primitives: number; composites: number }) {
	const [activeId, setActiveId] = useState(PERSONAS[0].id);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const activeIndex = Math.max(
		0,
		PERSONAS.findIndex((persona) => persona.id === activeId),
	);
	const activePersona = PERSONAS[activeIndex];

	useEffect(() => {
		const panel = panelRef.current;
		if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const animation = animate(
			panel,
			{
				clipPath: ['inset(0 0 7% 0)', 'inset(0)'],
				filter: ['blur(3px)', 'blur(0px)'],
				opacity: [0.72, 1],
				transform: ['translate3d(0, 0.75rem, 0)', 'translate3d(0, 0, 0)'],
			},
			{ duration: 0.42, ease: [0.16, 1, 0.3, 1] },
		);

		return () => animation.cancel();
	}, [activeId]);

	const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
		let nextIndex: number | null = null;
		if (event.key === 'ArrowRight') nextIndex = (index + 1) % PERSONAS.length;
		if (event.key === 'ArrowLeft') nextIndex = (index - 1 + PERSONAS.length) % PERSONAS.length;
		if (event.key === 'Home') nextIndex = 0;
		if (event.key === 'End') nextIndex = PERSONAS.length - 1;
		if (nextIndex === null) return;

		event.preventDefault();
		setActiveId(PERSONAS[nextIndex].id);
		tabRefs.current[nextIndex]?.focus();
	};

	return (
		<div className={styles.root}>
			<div className={styles.intro}>
				<h2>One system. Four reasons to care.</h2>
				<p>
					Choose the outcome you are responsible for. Substrate stays the same; the value becomes specific.
					Across every view, {primitives} shared building blocks and {composites} ready-made components turn
					repeated decisions into reusable progress.
				</p>
			</div>

			<div className={styles.tabs}>
				<div className={styles.tabList} role="tablist" aria-label="Choose your role">
					{PERSONAS.map((persona, index) => {
						const isActive = persona.id === activePersona.id;
						return (
							<button
								key={persona.id}
								ref={(element) => {
									tabRefs.current[index] = element;
								}}
								type="button"
								role="tab"
								id={`persona-tab-${persona.id}`}
								aria-controls={`persona-panel-${persona.id}`}
								aria-selected={isActive}
								tabIndex={isActive ? 0 : -1}
								className={styles.trigger}
								data-persona-trigger
								onClick={() => setActiveId(persona.id)}
								onKeyDown={(event) => handleTabKeyDown(event, index)}
							>
								<span>{persona.name}</span>
								<small>{persona.promise}</small>
							</button>
						);
					})}
				</div>



				<div
					key={activePersona.id}
					ref={panelRef}
					id={`persona-panel-${activePersona.id}`}
					className={styles.panelSlot}
					role="tabpanel"
					aria-labelledby={`persona-tab-${activePersona.id}`}
					tabIndex={0}
				>
					<section className={styles.panel} data-persona-panel>
						<div className={styles.panelLead}>
							<h3>{activePersona.headline}</h3>
							<p>{activePersona.summary}</p>
						</div>

						<div className={styles.panelBody}>
							<div className={styles.pathBlock}>
								<p className={styles.pathLabel}>How value moves</p>
								<ol className={styles.path} aria-label={`${activePersona.name} value path`}>
									{activePersona.path.map((step) => (
										<li key={step}>{step}</li>
									))}
								</ol>
							</div>

							<dl className={styles.outcomes}>
								{activePersona.outcomes.map((outcome) => (
									<div key={outcome.title}>
										<dt>{outcome.title}</dt>
										<dd>{outcome.body}</dd>
									</div>
								))}
							</dl>

							<nav className={styles.actions} aria-label={`${activePersona.name} next steps`}>
								{activePersona.actions.map((action) => (
									<PersonaLink key={action.label} action={action} />
								))}
							</nav>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
