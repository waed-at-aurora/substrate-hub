'use client';

import { useMemo, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import posthog from 'posthog-js';
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
	ChartToolbar,
	Checkbox,
	DataTable,
	DataTableColumnHeader,
	Input,
	InvestmentCaseSelectionCard,
	Label,
	ModeActivatorToggleGroup,
	ModeActivatorToggleGroupItem,
	Progress,
	ProgressLabel,
	ProgressValue,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Slider,
	SurfacePanel,
	SurfaceToolbar,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	TimeRangeSelector,
	TimelineScrubber,
	ToggleGroup,
	ToggleGroupItem,
} from '@aurora-ui/substrate/components';
import type { ColumnDef, Row } from '@aurora-ui/substrate/components';
import { ChartHC } from '@aurora-ui/substrate/charts';
import type { Highcharts } from '@aurora-ui/substrate/charts';
import type { CatalogEntry } from '@/lib/data';
import { ExtArrow } from '@/components/marks';
import { storybookHref } from '@/config/site';

const LAYERS = ['all', 'composite', 'primitive'] as const;
const FEATURED = [
	{ name: 'InvestmentCaseSelectionCard', size: 'hero' },
	{ name: 'TimelineScrubber', size: 'wide' },
	{ name: 'ChartHC', size: 'wide' },
	{ name: 'DataTable', size: 'wide' },
	{ name: 'ChartToolbar', size: 'wide' },
	{ name: 'TimeRangeSelector', size: 'standard' },
	{ name: 'SurfaceToolbar', size: 'standard' },
	{ name: 'SurfacePanel', size: 'standard' },
	{ name: 'ModeActivatorToggleGroup', size: 'standard' },
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

	const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
		const bounds = event.currentTarget.getBoundingClientRect();
		const percentage = ((event.clientX - bounds.left) / bounds.width) * 100;
		setConfidence(Math.round(Math.min(100, Math.max(0, percentage))));
	};

	return (
		<div className="gallery-range">
			<div>
				<span>Confidence</span>
				<strong aria-live="polite">{confidence}%</strong>
			</div>
			<div
				className="gallery-range-control"
				onPointerDown={(event) => {
					event.currentTarget.setPointerCapture(event.pointerId);
					updateFromPointer(event);
				}}
				onPointerMove={(event) => {
					if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event);
				}}
				onPointerUp={(event) => {
					updateFromPointer(event);
					if (event.currentTarget.hasPointerCapture(event.pointerId)) {
						event.currentTarget.releasePointerCapture(event.pointerId);
					}
				}}
			>
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
			</div>
			<div className="gallery-range-scale">
				<span>Conservative</span>
				<span>Aggressive</span>
			</div>
		</div>
	);
}

type GalleryAsset = {
	id: string;
	name: string;
	technology: string;
	market: string;
	capacityMw: number;
};

/** Trimmed from the real Storybook DataTable fixture (primitives/data-display/DataTable.stories.tsx). */
const GALLERY_ASSETS: GalleryAsset[] = [
	{ id: 'GB-SOL-0421', name: 'Cleve Hill Solar Park', technology: 'Solar PV', market: 'GB', capacityMw: 373 },
	{ id: 'GB-OFW-0118', name: 'Dogger Bank A', technology: 'Offshore Wind', market: 'GB', capacityMw: 1200 },
	{ id: 'DE-BAT-2207', name: 'Bollingstedt Battery', technology: 'Battery Storage', market: 'DE', capacityMw: 50 },
	{ id: 'GB-NUC-0003', name: 'Hinkley Point C', technology: 'Nuclear', market: 'GB', capacityMw: 3260 },
];

const GALLERY_ASSET_COLUMNS: ColumnDef<GalleryAsset>[] = [
	{ accessorKey: 'name', header: 'Asset' },
	{
		accessorKey: 'technology',
		header: 'Technology',
		cell: ({ row }: { row: Row<GalleryAsset> }) => <Badge variant="outline">{row.getValue('technology')}</Badge>,
	},
	{ accessorKey: 'market', header: 'Market' },
	{
		accessorKey: 'capacityMw',
		header: () => <div className="gallery-table-num">Capacity</div>,
		cell: ({ row }: { row: Row<GalleryAsset> }) => (
			<div className="gallery-table-num">
				{new Intl.NumberFormat('en-GB').format(row.getValue<number>('capacityMw'))} MW
			</div>
		),
	},
];

function DataTablePreview() {
	return (
		<div className="gallery-table">
			<DataTable columns={GALLERY_ASSET_COLUMNS} data={GALLERY_ASSETS} showViewOptions={false} showPagination={false} />
		</div>
	);
}

/** Mirrors STACKED_GENERATION_CHART_OPTIONS from the real Storybook ChartHC fixture (data-visualization/chart-examples.ts). */
const GENERATION_CHART_OPTIONS = {
	chart: { type: 'column' },
	title: { text: 'Energy Generation by Source' },
	subtitle: { text: 'Annual output (GWh)' },
	xAxis: { categories: ['2021', '2022', '2023', '2024', '2025'] },
	yAxis: { title: { text: 'Generation (GWh)' } },
	plotOptions: { column: { stacking: 'normal' } },
	series: [
		{ type: 'column', name: 'Solar', data: [1200, 1400, 1600, 1800, 2000] },
		{ type: 'column', name: 'Wind', data: [2000, 2200, 2400, 2600, 2800] },
		{ type: 'column', name: 'Gas', data: [3000, 2800, 2600, 2400, 2200] },
	],
} satisfies Highcharts;

function ChartPreview() {
	return (
		<div className="gallery-chart">
			<ChartHC options={GENERATION_CHART_OPTIONS} minHeight={220} />
		</div>
	);
}

const TIME_DOMAIN_MIN = new Date(Date.UTC(2024, 0, 1));
const TIME_DOMAIN_MAX = new Date(Date.UTC(2026, 11, 31));

function TimeRangeSelectorPreview() {
	return (
		<div className="gallery-time-range">
			<TimeRangeSelector min={TIME_DOMAIN_MIN} max={TIME_DOMAIN_MAX} />
		</div>
	);
}

function TimelineScrubberPreview() {
	return (
		<div className="gallery-timeline">
			<TimelineScrubber min={TIME_DOMAIN_MIN} max={TIME_DOMAIN_MAX} defaultValue={{ granularity: 'month' }} />
		</div>
	);
}

function ChartToolbarPreview() {
	const [granularity, setGranularity] = useState('annual');
	const [series, setSeries] = useState(['generation']);
	const [valueMode, setValueMode] = useState(['delta']);

	return (
		<ChartToolbar.Root className="gallery-toolbar">
			<ChartToolbar.Group>
				<Select value={granularity} onValueChange={(value: string) => value && setGranularity(value)}>
					<SelectTrigger aria-label="Granularity" style={{ minWidth: '7rem' }}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="annual">Annual</SelectItem>
						<SelectItem value="monthly">Monthly</SelectItem>
					</SelectContent>
				</Select>
				<ToggleGroup
					value={series}
					onValueChange={(value: string[]) => value.length > 0 && setSeries(value)}
					aria-label="Chart series"
				>
					<ToggleGroupItem value="generation">Generation</ToggleGroupItem>
					<ToggleGroupItem value="capacity">Capacity</ToggleGroupItem>
				</ToggleGroup>
			</ChartToolbar.Group>
			<ChartToolbar.Trailing>
				<ToggleGroup
					value={valueMode}
					onValueChange={(value: string[]) => value.length > 0 && setValueMode(value)}
					aria-label="Value mode"
				>
					<ToggleGroupItem value="actual">Actual</ToggleGroupItem>
					<ToggleGroupItem value="delta">Delta</ToggleGroupItem>
				</ToggleGroup>
			</ChartToolbar.Trailing>
		</ChartToolbar.Root>
	);
}

function SurfaceToolbarPreview() {
	const [view, setView] = useState(['bar']);

	return (
		<SurfaceToolbar.Root className="gallery-toolbar">
			<SurfaceToolbar.Section>
				<SurfaceToolbar.Fields>
					<SurfaceToolbar.Field>
						<SurfaceToolbar.FieldLabel>Benchmark</SurfaceToolbar.FieldLabel>
						<Select defaultValue="2hr">
							<SelectTrigger aria-label="Benchmark duration" style={{ minWidth: '6rem' }}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1hr">1hr</SelectItem>
								<SelectItem value="2hr">2hr</SelectItem>
								<SelectItem value="4hr">4hr</SelectItem>
							</SelectContent>
						</Select>
					</SurfaceToolbar.Field>
					<SurfaceToolbar.Field>
						<SurfaceToolbar.FieldLabel>View</SurfaceToolbar.FieldLabel>
						<ToggleGroup
							value={view}
							onValueChange={(value: string[]) => value.length > 0 && setView(value)}
							aria-label="Chart view"
						>
							<ToggleGroupItem value="bar">Bar</ToggleGroupItem>
							<ToggleGroupItem value="line">Line</ToggleGroupItem>
						</ToggleGroup>
					</SurfaceToolbar.Field>
				</SurfaceToolbar.Fields>
			</SurfaceToolbar.Section>
		</SurfaceToolbar.Root>
	);
}

function SurfacePanelPreview() {
	return (
		<SurfacePanel variant="elevated" className="gallery-panel">
			<CardHeader>
				<CardTitle>Portfolio exposure</CardTitle>
				<CardDescription>Weighted by installed capacity</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="gallery-panel-stats">
					<div className="gallery-panel-stat">
						<span>Renewables</span>
						<strong>64%</strong>
					</div>
					<div className="gallery-panel-stat">
						<span>Thermal</span>
						<strong>36%</strong>
					</div>
				</div>
			</CardContent>
		</SurfacePanel>
	);
}

function ModeActivatorPreview() {
	const [mode, setMode] = useState<string | null>('investment-case');

	return (
		<div className="gallery-mode-switch">
			<ModeActivatorToggleGroup ariaLabel="Comparison mode" onValueChange={setMode} value={mode}>
				<ModeActivatorToggleGroupItem value="investment-case">Investment case</ModeActivatorToggleGroupItem>
				<ModeActivatorToggleGroupItem value="prev-cycle">Previous cycle</ModeActivatorToggleGroupItem>
			</ModeActivatorToggleGroup>
			<span className="gallery-field-note">Active: {mode ?? 'none'}</span>
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
		case 'TimelineScrubber':
			return <TimelineScrubberPreview />;
		case 'ChartHC':
			return <ChartPreview />;
		case 'DataTable':
			return <DataTablePreview />;
		case 'ChartToolbar':
			return <ChartToolbarPreview />;
		case 'TimeRangeSelector':
			return <TimeRangeSelectorPreview />;
		case 'SurfaceToolbar':
			return <SurfaceToolbarPreview />;
		case 'SurfacePanel':
			return <SurfacePanelPreview />;
		case 'ModeActivatorToggleGroup':
			return <ModeActivatorPreview />;
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

	const selectLayer = (nextLayer: (typeof LAYERS)[number]) => {
		if (nextLayer === layer) return;
		posthog.capture('component_catalog_filter_selected', { layer: nextLayer });
		setLayer(nextLayer);
	};

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
						<button key={option} type="button" aria-pressed={layer === option} onClick={() => selectLayer(option)}>
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
