'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
	Input,
	RadioGroup,
	RadioGroupItem,
} from '@aurora-ui/substrate/components';

function validateRelease(value: string) {
	if (!/^\d{4}\sQ[1-4]$/.test(value.trim())) {
		return 'Enter a market release in the format 2026 Q3.';
	}
	return undefined;
}

export function FormPatternExample() {
	return (
		<article className="forms-specimen forms-specimen-lead">
			<div className="forms-specimen-stage">
				<form
					className="forms-demo forms-demo-lead"
					aria-labelledby="forms-structure-title"
					onSubmit={(event) => event.preventDefault()}
				>
					<header className="forms-demo-header">
						<strong>Create market scenario</strong>
						<span>Set the identity and demand pathway used for the forecast run.</span>
					</header>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="pattern-scenario-name">Scenario name</FieldLabel>
							<Input
								id="pattern-scenario-name"
								name="scenarioName"
								autoComplete="off"
								required
								aria-describedby="pattern-scenario-name-help"
							/>
							<FieldDescription id="pattern-scenario-name-help">
								Use a name analysts can distinguish in My Markets.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="pattern-scenario-note">Analyst note (optional)</FieldLabel>
							<Input id="pattern-scenario-note" name="scenarioNote" autoComplete="off" />
						</Field>
						<FieldSet>
							<FieldLegend>Demand pathway</FieldLegend>
							<FieldDescription id="pattern-pathway-help">
								Choose the assumption set this scenario starts from.
							</FieldDescription>
							<RadioGroup name="pathway" defaultValue="central" aria-describedby="pattern-pathway-help">
								<Field orientation="horizontal">
									<RadioGroupItem value="central" aria-labelledby="pattern-pathway-central" />
									<FieldTitle id="pattern-pathway-central">Central demand</FieldTitle>
								</Field>
								<Field orientation="horizontal">
									<RadioGroupItem value="high" aria-labelledby="pattern-pathway-high" />
									<FieldTitle id="pattern-pathway-high">High demand</FieldTitle>
								</Field>
							</RadioGroup>
						</FieldSet>
						<div className="forms-demo-actions">
							<Button type="submit">Create draft scenario</Button>
							<Button type="button" variant="outline">Cancel</Button>
						</div>
					</FieldGroup>
				</form>
			</div>
			<footer className="forms-specimen-caption">
				<div>
					<span>Structure & grouping</span>
					<h3 id="forms-structure-title">Keep one task in one reading order.</h3>
				</div>
				<p>Context first, related fields together, then a clear action area.</p>
			</footer>
		</article>
	);
}

function ValidationSpecimen() {
	const [release, setRelease] = useState('2026 Autumn');
	const [error, setError] = useState(() => validateRelease('2026 Autumn'));

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(validateRelease(release));
	};

	return (
		<article className="forms-specimen">
			<div className="forms-specimen-stage">
				<form className="forms-demo" aria-labelledby="forms-validation-title" onSubmit={handleSubmit} noValidate>
					<Alert variant="eos-destructive">
						<AlertTitle>Check the market release</AlertTitle>
						<AlertDescription>Correct the field below before continuing.</AlertDescription>
					</Alert>
					<Field data-invalid={error ? 'true' : undefined}>
						<FieldLabel htmlFor="pattern-market-release">Market release</FieldLabel>
						<Input
							id="pattern-market-release"
							value={release}
							onChange={(event: ChangeEvent<HTMLInputElement>) => {
								const nextRelease = event.currentTarget.value;
								setRelease(nextRelease);
								if (error) setError(validateRelease(nextRelease));
							}}
							onBlur={() => setError(validateRelease(release))}
							aria-invalid={error ? 'true' : undefined}
							aria-describedby="pattern-market-release-help pattern-market-release-error"
						/>
						<FieldDescription id="pattern-market-release-help">Use the published year and quarter.</FieldDescription>
						<FieldError id="pattern-market-release-error">{error}</FieldError>
					</Field>
					<Button type="submit">Use market release</Button>
				</form>
			</div>
			<footer className="forms-specimen-caption">
				<div>
					<span>Validation & recovery</span>
					<h3 id="forms-validation-title">The next action stays obvious.</h3>
				</div>
				<p>Summarize the problem, identify the field, explain the repair.</p>
			</footer>
		</article>
	);
}

function SensitiveSpecimen() {
	const [deleted, setDeleted] = useState(false);

	return (
		<article className="forms-specimen">
			<div className="forms-specimen-stage">
				<section className="forms-demo" aria-labelledby="forms-sensitive-title">
					{deleted ? (
						<>
							<Alert role="status" variant="eos">
								<AlertTitle>Scenario deleted</AlertTitle>
								<AlertDescription>The saved inputs and run history were removed.</AlertDescription>
							</Alert>
							<Button type="button" variant="outline" onClick={() => setDeleted(false)}>Restore demo</Button>
						</>
					) : (
						<>
							<Alert variant="eos-destructive">
								<AlertTitle>Delete GB high-demand scenario?</AlertTitle>
								<AlertDescription>
									This permanently removes its saved inputs, run history, and comparison views.
								</AlertDescription>
							</Alert>
							<div className="forms-demo-actions">
								<Button type="button" variant="destructive" onClick={() => setDeleted(true)}>Delete scenario</Button>
								<Button type="button" variant="outline">Keep scenario</Button>
							</div>
						</>
					)}
				</section>
			</div>
			<footer className="forms-specimen-caption">
				<div>
					<span>Sensitive action</span>
					<h3 id="forms-sensitive-title">Consequence comes before confirmation.</h3>
				</div>
				<p>Reserve interruption for actions that are difficult to undo.</p>
			</footer>
		</article>
	);
}

export function FormsPatternShowcase() {
	return (
		<div className="forms-showcase">
			<FormPatternExample />
			<div className="forms-supporting-specimens">
				<ValidationSpecimen />
				<SensitiveSpecimen />
			</div>
		</div>
	);
}
