'use client';

import { useEffect, useRef, useState } from 'react';
import {
	Badge,
	Checkbox,
	Field,
	FieldLabel,
	Input,
	InvestmentCaseSelectionCard,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@aurora-ui/substrate/components';
import type { InvestmentCaseSelectionCardState } from '@aurora-ui/substrate/components';

/** Real option surface of packages/substrate/src/components/investment-case-selection-card.tsx. */
const STATES: readonly InvestmentCaseSelectionCardState[] = ['active', 'selected', 'default'];
const DURATIONS = ['1h', '2h', '4h'] as const;

type Duration = (typeof DURATIONS)[number];

/** The card renders no icons itself; consumers supply them (drawn, per the hub's mark discipline). */
function CaseMark() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
			<rect x="1" y="3.2" width="8.2" height="5.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
			<path d="M10.4 5 v2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
			<path d="M3.2 5 v2 M5.3 5 v2" stroke="currentColor" strokeWidth="1.2" />
		</svg>
	);
}

function PlaygroundControls({
	state,
	setState,
	duration,
	setDuration,
	year,
	setYear,
	title,
	setTitle,
	disabled,
	setDisabled,
	snippet,
}: {
	state: InvestmentCaseSelectionCardState;
	setState: (v: InvestmentCaseSelectionCardState) => void;
	duration: Duration;
	setDuration: (v: Duration) => void;
	year: string;
	setYear: (v: string) => void;
	title: string;
	setTitle: (v: string) => void;
	disabled: boolean;
	setDisabled: (v: boolean) => void;
	snippet: string;
}) {
	return (
		<div className="playground-controls">
			<div className="control-row">
				<Field>
					<FieldLabel htmlFor="pg-state">Selection state</FieldLabel>
					<Select value={state} onValueChange={(v: string) => setState(v as InvestmentCaseSelectionCardState)}>
						<SelectTrigger id="pg-state" style={{ width: '100%' }}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{STATES.map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field>
					<FieldLabel htmlFor="pg-duration">Duration badge</FieldLabel>
					<Select value={duration} onValueChange={(v: string) => setDuration(v as Duration)}>
						<SelectTrigger id="pg-duration" style={{ width: '100%' }}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{DURATIONS.map((d) => (
								<SelectItem key={d} value={d}>
									{d}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			</div>

			<div className="control-row">
				<Field>
					<FieldLabel htmlFor="pg-year">Entry year</FieldLabel>
					<Input
						id="pg-year"
						value={year}
						maxLength={4}
						inputMode="numeric"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYear(e.target.value)}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="pg-title">Case title</FieldLabel>
					<Input
						id="pg-title"
						value={title}
						maxLength={40}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
					/>
				</Field>
			</div>

			<label className="control-check" htmlFor="pg-disabled">
				<Checkbox id="pg-disabled" checked={disabled} onCheckedChange={(c: boolean) => setDisabled(c === true)} />
				disabled
			</label>

			<div className="playground-code">
				<span className="control-legend" style={{ marginTop: '0.6rem' }}>
					Import
				</span>
				<pre>
					<code>{snippet}</code>
				</pre>
			</div>
		</div>
	);
}

export function Playground() {
	const [state, setState] = useState<InvestmentCaseSelectionCardState>('active');
	const [duration, setDuration] = useState<Duration>('2h');
	const [year, setYear] = useState('2027');
	const [title, setTitle] = useState('Case 27 - Solar DC');
	const [disabled, setDisabled] = useState(false);
	const [tick, setTick] = useState<string | null>(null);
	const [flash, setFlash] = useState(false);
	const first = useRef(true);

	// The recalc tick: every option change re-renders the live figure and
	// stamps the readout like a chart refresh.
	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		const now = new Date();
		setTick(
			`${now.toLocaleTimeString('en-GB', { hour12: false })}.${String(now.getMilliseconds()).padStart(3, '0')}`
		);
		setFlash(true);
		const t = setTimeout(() => setFlash(false), 700);
		return () => clearTimeout(t);
	}, [state, duration, year, title, disabled]);

	const rootProps = [state !== 'default' && `selectionState="${state}"`, disabled && 'disabled']
		.filter(Boolean)
		.join(' ');

	const snippet = `import { InvestmentCaseSelectionCard, Badge } from '@aurora-ui/substrate';

<InvestmentCaseSelectionCard.Root${rootProps ? ' ' + rootProps : ''}>
\t<InvestmentCaseSelectionCard.Header>
\t\t<InvestmentCaseSelectionCard.Leading>${year || '2027'}</InvestmentCaseSelectionCard.Leading>
\t\t<InvestmentCaseSelectionCard.Badges>
\t\t\t<Badge variant="outline">1cy</Badge>
\t\t\t<Badge variant="outline">${duration}</Badge>
\t\t</InvestmentCaseSelectionCard.Badges>
\t</InvestmentCaseSelectionCard.Header>
\t<InvestmentCaseSelectionCard.Content>
\t\t<InvestmentCaseSelectionCard.Subtitle>Central · New South Wales · Colocated</InvestmentCaseSelectionCard.Subtitle>
\t\t<InvestmentCaseSelectionCard.Title>${title || 'Case 27 - Solar DC'}</InvestmentCaseSelectionCard.Title>
\t</InvestmentCaseSelectionCard.Content>
</InvestmentCaseSelectionCard.Root>`;

	return (
		<div className="playground">
			<div className="playground-stage">
				<div className="playground-render">
					<div style={{ width: 'min(320px, 100%)' }}>
						<InvestmentCaseSelectionCard.Root selectionState={state} disabled={disabled}>
							<InvestmentCaseSelectionCard.Header>
								<InvestmentCaseSelectionCard.Leading>
									<CaseMark />
									<span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{year || '2027'}</span>
								</InvestmentCaseSelectionCard.Leading>
								<InvestmentCaseSelectionCard.Badges>
									<Badge variant="outline">1cy</Badge>
									<Badge variant="outline">{duration}</Badge>
								</InvestmentCaseSelectionCard.Badges>
							</InvestmentCaseSelectionCard.Header>
							<InvestmentCaseSelectionCard.Content>
								<InvestmentCaseSelectionCard.Subtitle>
									Central · New South Wales · Colocated
								</InvestmentCaseSelectionCard.Subtitle>
								<InvestmentCaseSelectionCard.Title>
									{title || 'Case 27 - Solar DC'}
								</InvestmentCaseSelectionCard.Title>
							</InvestmentCaseSelectionCard.Content>
						</InvestmentCaseSelectionCard.Root>
					</div>
				</div>
				<div className="playground-readout">
					<span>rendered from @aurora-ui/substrate · dist</span>
					<span className="tick" data-flash={flash}>
						{tick ? `recalc ${tick}` : 'awaiting input'}
					</span>
				</div>
			</div>

			<PlaygroundControls
				state={state}
				setState={setState}
				duration={duration}
				setDuration={setDuration}
				year={year}
				setYear={setYear}
				title={title}
				setTitle={setTitle}
				disabled={disabled}
				setDisabled={setDisabled}
				snippet={snippet}
			/>
		</div>
	);
}
