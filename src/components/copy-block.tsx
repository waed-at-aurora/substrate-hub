'use client';

import { useState, useRef } from 'react';

export function CopyBlock({
	label,
	code,
	prompt = false,
	preview,
	copyLabel = 'copy',
}: {
	label?: string;
	code: string;
	prompt?: boolean;
	preview?: string;
	copyLabel?: string;
}) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => setCopied(false), 1600);
		} catch {
			/* clipboard unavailable: leave the text selectable */
		}
	};

	return (
		<div className={`codeblock${prompt ? ' codeblock--prompt' : ''}${preview ? ' codeblock--compact' : ''}`}>
			{label ? <span className="codeblock-label">{label}</span> : null}
			<pre>
				<code>{preview ?? code}</code>
			</pre>
			<button
				type="button"
				className="copy-btn"
				data-copied={copied}
				onClick={copy}
				aria-live="polite"
			>
				{copied ? 'copied' : copyLabel}
			</button>
		</div>
	);
}
