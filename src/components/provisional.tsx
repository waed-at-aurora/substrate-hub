/**
 * Visible mark for a value awaiting its real replacement.
 * Every render of this component corresponds to a TODO in site.ts
 * or an entry on the replacement list in README.md.
 */
export function Provisional({ what }: { what: string }) {
	return <span className="provisional">provisional · {what}</span>;
}
