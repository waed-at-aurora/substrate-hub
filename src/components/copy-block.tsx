'use client';

import { useState, useRef } from 'react';

export function CopyBlock({ label, code }: { label?: string; code: string }) {
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
		<div className="codeblock">
			{label ? <span className="codeblock-label">{label}</span> : null}
			<pre>
				<code>{code}</code>
			</pre>
			<button type="button" className="copy-btn" data-copied={copied} onClick={copy}>
				{copied ? 'copied' : 'copy'}
			</button>
		</div>
	);
}
