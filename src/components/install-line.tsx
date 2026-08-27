'use client';

import { useEffect, useRef, useState } from 'react';

/** Compact one-line install command with copy — the stage's quiet workhorse. */
export function InstallLine({ command }: { command: string }) {
	const [status, setStatus] = useState<'idle' | 'copied' | 'selected'>('idle');
	const code = useRef<HTMLElement | null>(null);
	const timer = useRef<number | undefined>(undefined);
	const shortcut =
		typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘C' : 'Ctrl+C';

	useEffect(() => {
		return () => {
			clearTimeout(timer.current);
		};
	}, []);

	const copy = async () => {
		clearTimeout(timer.current);
		let resetDelay = 1600;

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
				resetDelay = 5000;
			}
		}

		timer.current = window.setTimeout(() => setStatus('idle'), resetDelay);
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
				aria-label={
					status === 'copied'
						? 'Install command copied'
						: status === 'selected'
							? `Command selected — press ${shortcut} to copy`
							: 'Copy install command'
				}
				aria-live="polite"
				onClick={copy}
			>
				{status === 'copied' ? 'copied' : status === 'selected' ? `press ${shortcut}` : 'copy'}
			</button>
		</div>
	);
}
