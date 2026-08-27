'use client';

import { useEffect, useRef, useState } from 'react';

/** Compact one-line install command with copy — the stage's quiet workhorse. */
export function InstallLine({ command }: { command: string }) {
	const [status, setStatus] = useState<'idle' | 'copied' | 'selected'>('idle');
	const code = useRef<HTMLElement | null>(null);
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => {
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	const copy = async () => {
		clearTimeout(timer.current);

		try {
			await navigator.clipboard.writeText(command);
			setStatus('copied');
		} catch {
			const selection = window.getSelection();
			if (code.current && selection) {
				const range = document.createRange();
				range.selectNodeContents(code.current);
				selection.removeAllRanges();
				selection.addRange(range);
				setStatus('selected');
			}
		}

		timer.current = window.setTimeout(() => setStatus('idle'), 1600);
	};

	return (
		<div className="install-line">
			<span className="prompt" aria-hidden="true">
				$
			</span>
			<code ref={code}>{command}</code>
			<button
				type="button"
				className="copy-btn copy-btn--inline"
				data-copied={status === 'copied'}
				aria-live="polite"
				onClick={copy}
			>
				{status === 'copied' ? 'copied' : status === 'selected' ? 'selected' : 'copy'}
			</button>
		</div>
	);
}
