import type { ReactNode } from 'react';

export type CodeLang = 'bash' | 'json' | 'tsx';

/**
 * Editor-style syntax highlighting for the hub's real code samples (install
 * commands, package.json fragments, import/JSX snippets). Code is content,
 * not chrome — exempt from the hub's law-bound accent colors the same way
 * a live `@aurora-ui/substrate` render is exempt — so tokens use the
 * conventional editor palette (--syn-*) instead of the hub's zinc/yellow/cyan
 * chrome tokens. Regex lexers are deliberately narrow: they cover exactly
 * the bash/json/tsx snippets this hub renders, not arbitrary source.
 */
function tok(text: string, cls: string, key: string): ReactNode {
	return (
		<span className={`tok-${cls}`} key={key}>
			{text}
		</span>
	);
}

const BASH_ARG_RE = /(--?[A-Za-z][\w-]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g;

function highlightBash(code: string): ReactNode[] {
	const nodes: ReactNode[] = [];

	code.split('\n').forEach((line, i) => {
		if (i > 0) nodes.push('\n');
		const lead = line.match(/^(\s*)(\S+)/);
		if (!lead) {
			nodes.push(line);
			return;
		}
		if (lead[1]) nodes.push(lead[1]);
		nodes.push(tok(lead[2], 'fn', `${i}-cmd`));

		const rest = line.slice(lead[0].length);
		let last = 0;
		let n = 0;
		let m: RegExpExecArray | null;
		BASH_ARG_RE.lastIndex = 0;
		while ((m = BASH_ARG_RE.exec(rest))) {
			if (m.index > last) nodes.push(rest.slice(last, m.index));
			nodes.push(tok(m[0], m[1] ? 'kw' : 'str', `${i}-${n++}`));
			last = BASH_ARG_RE.lastIndex;
		}
		if (last < rest.length) nodes.push(rest.slice(last));
	});

	return nodes;
}

const JSON_TOKEN_RE = /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|([{}\[\],:])/g;

function highlightJson(code: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	let last = 0;
	let n = 0;
	let m: RegExpExecArray | null;
	JSON_TOKEN_RE.lastIndex = 0;
	while ((m = JSON_TOKEN_RE.exec(code))) {
		if (m.index > last) nodes.push(code.slice(last, m.index));
		if (m[1] !== undefined) {
			nodes.push(tok(m[1], 'attr', `${n++}`));
			nodes.push(tok(m[2], 'punc', `${n++}`));
		} else if (m[3] !== undefined) {
			nodes.push(tok(m[3], 'str', `${n++}`));
		} else if (m[4] !== undefined) {
			nodes.push(tok(m[4], 'punc', `${n++}`));
		}
		last = JSON_TOKEN_RE.lastIndex;
	}
	if (last < code.length) nodes.push(code.slice(last));
	return nodes;
}

const TSX_TOKEN_RE =
	/(<\/)([A-Za-z][\w.]*)(>)|(<)([A-Za-z][\w.]*)|(\/>)|(>)|\b(import|from|export|default)\b|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|([A-Za-z_][\w-]*)(?=\s*=)|([{}()\[\];,=])/g;

function highlightTsx(code: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	let last = 0;
	let n = 0;
	let m: RegExpExecArray | null;
	TSX_TOKEN_RE.lastIndex = 0;
	while ((m = TSX_TOKEN_RE.exec(code))) {
		if (m.index > last) nodes.push(code.slice(last, m.index));
		if (m[1] !== undefined) {
			nodes.push(tok(m[1], 'punc', `${n++}`));
			nodes.push(tok(m[2], 'type', `${n++}`));
			nodes.push(tok(m[3], 'punc', `${n++}`));
		} else if (m[4] !== undefined) {
			nodes.push(tok(m[4], 'punc', `${n++}`));
			nodes.push(tok(m[5], 'type', `${n++}`));
		} else if (m[6] !== undefined) {
			nodes.push(tok(m[6], 'punc', `${n++}`));
		} else if (m[7] !== undefined) {
			nodes.push(tok(m[7], 'punc', `${n++}`));
		} else if (m[8] !== undefined) {
			nodes.push(tok(m[8], 'kw', `${n++}`));
		} else if (m[9] !== undefined) {
			nodes.push(tok(m[9], 'str', `${n++}`));
		} else if (m[10] !== undefined) {
			nodes.push(tok(m[10], 'attr', `${n++}`));
		} else if (m[11] !== undefined) {
			nodes.push(tok(m[11], 'punc', `${n++}`));
		}
		last = TSX_TOKEN_RE.lastIndex;
	}
	if (last < code.length) nodes.push(code.slice(last));
	return nodes;
}

function tokenize(code: string, lang: CodeLang): ReactNode[] {
	if (lang === 'bash') return highlightBash(code);
	if (lang === 'json') return highlightJson(code);
	return highlightTsx(code);
}

/** Regroup a flat token stream into per-line arrays for a line-number gutter. Only plain-text gap nodes ever carry embedded newlines: every regex above matches within one source line. */
function linesFromTokens(tokens: ReactNode[]): ReactNode[][] {
	const lines: ReactNode[][] = [[]];
	for (const node of tokens) {
		if (typeof node === 'string' && node.includes('\n')) {
			const parts = node.split('\n');
			parts.forEach((part, i) => {
				if (i > 0) lines.push([]);
				if (part) lines[lines.length - 1].push(part);
			});
		} else {
			lines[lines.length - 1].push(node);
		}
	}
	return lines;
}

/** Tokenize a full code sample as one flat, colored stream (no line breakup) — used for single-line displays like InstallLine. */
export function highlightCode(code: string, lang?: CodeLang): ReactNode {
	return lang ? tokenize(code, lang) : code;
}

/** Tokenize and split into per-line token arrays, one entry per source line, for rendering with a line-number gutter. */
export function highlightLines(code: string, lang: CodeLang): ReactNode[][] {
	return linesFromTokens(tokenize(code, lang));
}
