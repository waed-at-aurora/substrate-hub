'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Alert,
	AlertDescription,
	AlertTitle,
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	Badge,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
	Input,
	InvestmentCaseSelectionCard,
	Label,
	Progress,
	ProgressLabel,
	ProgressValue,
	RadioGroup,
	RadioGroupItem,
	Slider,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	ToggleGroup,
	ToggleGroupItem,
} from '@aurora-ui/components-v2/components';
import type { CatalogEntry } from '@/lib/data';
import { ExtArrow } from '@/components/marks';
import { storybookHref } from '@/config/site';

const LAYERS = ['all', 'composite', 'primitive'] as const;
const FEATURED = [
	{ name: 'InvestmentCaseSelectionCard', size: 'hero' },
	{ name: 'Button', size: 'wide' },
	{ name: 'Input', size: 'standard' },
	{ name: 'Tabs', size: 'wide' },
	{ name: 'Alert', size: 'standard' },
	{ name: 'Card', size: 'standard' },
	{ name: 'Checkbox', size: 'standard' },
	{ name: 'RadioGroup', size: 'standard' },
	{ name: 'Switch', size: 'standard' },
	{ name: 'Slider', size: 'wide' },
	{ name: 'Progress', size: 'standard' },
	{ name: 'Avatar', size: 'standard' },
	{ name: 'Accordion', size: 'wide' },
	{ name: 'Textarea', size: 'standard' },
	{ name: 'ToggleGroup', size: 'standard' },
] as const;

function CaseMark() {
	return (
		<svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
			<rect x="1" y="3.5" width="8.8" height="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
			<path d="M11 5.4v2.4M3.4 5.4v2.2M5.7 5.4v2.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
		</svg>
	);
}

function GalleryTabPanel({
	context,
	value,
	detail,
}: {
	context: string;
	value: string;
	detail: string;
}) {
	return (
		<div className="gallery-tab-summary">
			<span className="gallery-tab-context">{context}</span>
			<div className="gallery-tab-value">
				<strong>{value}</strong>
				<span>{detail}</span>
			</div>
		</div>
	);
}

function SliderPreview() {
	const [confidence, setConfidence] = useState(72);

	return (
		<div className="gallery-range">
			<div>
				<span>Confidence</span>
				<strong aria-live="polite">{confidence}%</strong>
			</div>
			<Slider
				value={[confidence]}
				max={100}
				step={1}
				aria-label="Confidence"
				aria-valuetext={`${confidence}% confidence`}
				onValueChange={(nextValue: number[]) => {
					const nextConfidence = nextValue[0];
					if (typeof nextConfidence === 'number') setConfidence(nextConfidence);
				}}
			/>
			<div className="gallery-range-scale">
				<span>Conservative</span>
				<span>Aggressive</span>
			</div>
		</div>
	);
}

function ComponentPreview({ name }: { name: string }) {
	switch (name) {
		case 'InvestmentCaseSelectionCard':
			return (
				<div className="gallery-case-preview">
					<InvestmentCaseSelectionCard.Root selectionState="active">
						<InvestmentCaseSelectionCard.Header>
							<InvestmentCaseSelectionCard.Leading>
								<CaseMark />
								<span>2028</span>
							</InvestmentCaseSelectionCard.Leading>
							<InvestmentCaseSelectionCard.Badges>
								<Badge variant="outline">1cy</Badge>
								<Badge variant="outline">2h</Badge>
							</InvestmentCaseSelectionCard.Badges>
						</InvestmentCaseSelectionCard.Header>
						<InvestmentCaseSelectionCard.Content>
							<InvestmentCaseSelectionCard.Subtitle>
								Central · New South Wales · Colocated
							</InvestmentCaseSelectionCard.Subtitle>
							<InvestmentCaseSelectionCard.Title>Case 27 — Solar DC</InvestmentCaseSelectionCard.Title>
						</InvestmentCaseSelectionCard.Content>
					</InvestmentCaseSelectionCard.Root>
				</div>
			);
		case 'Button':
			return (
				<div className="gallery-inline gallery-inline-wrap">
					<Button variant="eos">Run analysis</Button>
					<Button variant="eos-outlined">Compare</Button>
					<Button variant="ghost">Cancel</Button>
					<Button variant="eos" disabled>
						Disabled
					</Button>
				</div>
			);
		case 'Input':
			return (
				<div className="gallery-field">
					<Label htmlFor="gallery-scenario">Scenario name</Label>
					<Input id="gallery-scenario" defaultValue="Solar DC 2028" />
					<span className="gallery-field-note">Visible across the workspace</span>
				</div>
			);
		case 'Tabs':
			return (
				<Tabs defaultValue="forecast" className="gallery-tabs">
					<TabsList variant="line" className="gallery-tabs-list">
						<TabsTrigger value="forecast" className="gallery-tab-trigger">Forecast</TabsTrigger>
						<TabsTrigger value="capacity" className="gallery-tab-trigger">Capacity</TabsTrigger>
						<TabsTrigger value="prices" className="gallery-tab-trigger">Prices</TabsTrigger>
					</TabsList>
					<TabsContent value="forecast" className="gallery-tab-panel">
						<GalleryTabPanel context="Central case · annual profile" value="68.4 TWh" detail="+4.2% from 2027" />
					</TabsContent>
					<TabsContent value="capacity" className="gallery-tab-panel">
						<GalleryTabPanel context="Installed capacity · GB" value="42.8 GW" detail="+6.1 GW committed" />
					</TabsContent>
					<TabsContent value="prices" className="gallery-tab-panel">
						<GalleryTabPanel context="Capture price · baseload" value="£62/MWh" detail="2030 real terms" />
					</TabsContent>
				</Tabs>
			);
		case 'Alert':
			return (
				<Alert variant="eos">
					<AlertTitle>Forecast refreshed</AlertTitle>
					<AlertDescription>All dependent charts now use the 28 Aug assumptions.</AlertDescription>
				</Alert>
			);
		case 'Card':
			return (
				<Card size="sm" className="gallery-live-card">
					<CardHeader>
						<CardTitle>North Sea wind</CardTitle>
						<CardDescription>Capacity outlook</CardDescription>
						<CardAction>
							<Badge variant="secondary">2030</Badge>
						</CardAction>
					</CardHeader>
					<CardContent>
						<strong className="gallery-metric">31.6 GW</strong>
					</CardContent>
				</Card>
			);
		case 'Checkbox':
			return (
				<div className="gallery-choice-stack">
					<label><Checkbox defaultChecked /> Solar</label>
					<label><Checkbox defaultChecked /> Offshore wind</label>
					<label><Checkbox /> Hydrogen</label>
				</div>
			);
		case 'RadioGroup':
			return (
				<RadioGroup defaultValue="central" className="gallery-choice-stack">
					<label><RadioGroupItem value="low" /> Low</label>
					<label><RadioGroupItem value="central" /> Central</label>
					<label><RadioGroupItem value="high" /> High</label>
				</RadioGroup>
			);
		case 'Switch':
			return (
				<div className="gallery-choice-stack">
					<label><span>Show uncertainty</span><Switch defaultChecked /></label>
					<label><span>Compare scenarios</span><Switch /></label>
				</div>
			);
		case 'Slider':
			return <SliderPreview />;
		case 'Progress':
			return (
				<Progress value={68}>
					<ProgressLabel>Scenario build</ProgressLabel>
					<ProgressValue />
				</Progress>
			);
		case 'Avatar':
			return (
				<div className="gallery-avatar-row">
					<AvatarGroup>
						<Avatar size="lg"><AvatarFallback>AM</AvatarFallback></Avatar>
						<Avatar size="lg"><AvatarFallback>WK</AvatarFallback></Avatar>
						<Avatar size="lg"><AvatarFallback>SL</AvatarFallback></Avatar>
						<AvatarGroupCount>+4</AvatarGroupCount>
					</AvatarGroup>
					<span>Analysis team</span>
				</div>
			);
		case 'Accordion':
			return (
				<Accordion defaultValue={['method']}>
					<AccordionItem value="method">
						<AccordionTrigger>Methodology</AccordionTrigger>
						<AccordionContent>Inputs are normalized before the hourly dispatch run.</AccordionContent>
					</AccordionItem>
					<AccordionItem value="sources">
						<AccordionTrigger>Source data</AccordionTrigger>
						<AccordionContent>Package assumptions and model outputs.</AccordionContent>
					</AccordionItem>
				</Accordion>
			);
		case 'Textarea':
			return (
				<div className="gallery-field">
					<Label htmlFor="gallery-note">Analyst note</Label>
					<Textarea id="gallery-note" defaultValue="Higher capture rates persist through the shoulder months." />
				</div>
			);
		case 'ToggleGroup':
			return (
				<ToggleGroup defaultValue={['annual']}>
					<ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
					<ToggleGroupItem value="quarterly">Quarterly</ToggleGroupItem>
					<ToggleGroupItem value="annual">Annual</ToggleGroupItem>
				</ToggleGroup>
			);
		default:
			return null;
	}
}

function GalleryItem({ entry, size }: { entry: CatalogEntry; size: string }) {
	let documentation: ReactNode = <span className="dim">source only</span>;
	if (entry.storybook) {
		documentation = (
			<a className="ext" href={storybookHref(entry.storybook)} target="_blank" rel="noreferrer">
				Storybook <ExtArrow />
			</a>
		);
	}

	return (
		<article className="component-specimen" data-size={size}>
			<div className="component-specimen-stage">
				<ComponentPreview name={entry.name} />
			</div>
			<footer className="component-specimen-caption">
				<div>
					<h2>{entry.name}</h2>
					<span>{entry.layer}</span>
				</div>
				{documentation}
			</footer>
		</article>
	);
}

export function Catalog({ entries }: { entries: CatalogEntry[] }) {
	const [q, setQ] = useState('');
	const [layer, setLayer] = useState<(typeof LAYERS)[number]>('all');

	const galleryEntries = useMemo(
		() =>
			FEATURED.flatMap((feature) => {
				const entry = entries.find((candidate) => candidate.name === feature.name);
				return entry ? [{ entry, size: feature.size }] : [];
			}),
		[entries]
	);

	const visibleEntries = useMemo(() => {
		const needle = q.trim().toLowerCase();
		return galleryEntries.filter(
			({ entry }) =>
				(layer === 'all' || entry.layer === layer) &&
				(!needle || entry.name.toLowerCase().includes(needle))
		);
	}, [galleryEntries, layer, q]);

	return (
		<div className="component-catalog">
			<div className="catalog-bar">
				<Input
					type="search"
					placeholder="Find a component…"
					aria-label="Search component gallery"
					value={q}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQ(event.target.value)}
				/>
				<div className="filter-group" role="group" aria-label="Filter by layer">
					{LAYERS.map((option) => (
						<button key={option} type="button" aria-pressed={layer === option} onClick={() => setLayer(option)}>
							{option === 'all' ? 'All' : `${option}s`}
						</button>
					))}
				</div>
				<span className="catalog-count" aria-live="polite">
					{visibleEntries.length} live specimens
				</span>
			</div>

			{visibleEntries.length ? (
				<div className="component-gallery">
					{visibleEntries.map(({ entry, size }) => (
						<GalleryItem key={entry.source} entry={entry} size={size} />
					))}
				</div>
			) : (
				<div className="component-gallery-empty">
					<p>No live specimens match “{q}”.</p>
					<button type="button" onClick={() => { setQ(''); setLayer('all'); }}>
						Reset gallery
					</button>
				</div>
			)}
		</div>
	);
}
