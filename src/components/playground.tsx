'use client';

import { useEffect, useRef, useState } from 'react';
import {
	Button,
	Checkbox,
	Field,
	FieldLabel,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@aurora-ui/components-v2/components';

/** Real option surface of packages/components-v2/src/ui/button.tsx. */
const VARIANTS = [
	'eos',
	'eos-outlined',
	'eos-muted',
	'eos-destructive',
	'default',
	'outline',
	'secondary',
	'ghost',
	'destructive',
	'link',
	'trigger',
] as const;

/** Text-label sizes; the icon-* sizes are for icon-only buttons — see Storybook. */
const SIZES = ['default', 'xs', 'sm', 'lg'] as const;

type Variant = (typeof VARIANTS)[number];
type Size = (typeof SIZES)[number];

export function Playground() {
	const [variant, setVariant] = useState<Variant>('eos');
	const [size, setSize] = useState<Size>('default');
	const [disabled, setDisabled] = useState(false);
	const [label, setLabel] = useState('Run scenario');
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
	}, [variant, size, disabled, label]);

	const props = [
		variant !== 'default' && `variant="${variant}"`,
		size !== 'default' && `size="${size}"`,
		disabled && 'disabled',
	]
		.filter(Boolean)
		.join(' ');

	const snippet = `import { Button } from '@aurora-ui/components-v2';

<Button${props ? ' ' + props : ''}>
\t${label || 'Run scenario'}
</Button>`;

	return (
		<div className="playground">
			<div className="playground-stage">
				<div className="playground-render">
					<Button variant={variant} size={size} disabled={disabled}>
						{label || 'Run scenario'}
					</Button>
				</div>
				<div className="playground-readout">
					<span>rendered from @aurora-ui/components-v2 · dist</span>
					<span className="tick" data-flash={flash}>
						{tick ? `recalc ${tick}` : 'awaiting input'}
					</span>
				</div>
			</div>

			<div className="playground-controls">
				<div className="control-row">
					<Field>
						<FieldLabel htmlFor="pg-variant">Variant</FieldLabel>
						<Select value={variant} onValueChange={(v: string) => setVariant(v as Variant)}>
							<SelectTrigger id="pg-variant" style={{ width: '100%' }}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{VARIANTS.map((v) => (
									<SelectItem key={v} value={v}>
										{v}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<FieldLabel htmlFor="pg-size">Size</FieldLabel>
						<Select value={size} onValueChange={(v: string) => setSize(v as Size)}>
							<SelectTrigger id="pg-size" style={{ width: '100%' }}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{SIZES.map((s) => (
									<SelectItem key={s} value={s}>
										{s}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</div>

				<Field>
					<FieldLabel htmlFor="pg-label">Label</FieldLabel>
					<Input
						id="pg-label"
						value={label}
						maxLength={40}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
					/>
				</Field>

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
		</div>
	);
}
