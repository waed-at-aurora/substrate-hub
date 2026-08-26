'use client';

import { useRef, useState } from 'react';

/** Compact one-line install command with copy — the stage's quiet workhorse. */
export function InstallLine({ command }: { command: string }) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => setCopied(false), 1600);
		} catch {
			/* clipboard unavailable: text stays selectable */
		}
	};

	return (
		<div className="install-line">
			<span className="prompt" aria-hidden="true">
				$
			</span>
			<code>{command}</code>
			<button type="button" className="copy-btn copy-btn--inline" data-copied={copied} onClick={copy}>
				{copied ? 'copied' : 'copy'}
			</button>
		</div>
	);
}
