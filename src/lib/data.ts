import substrate from '@/data/substrate.json';

export type CatalogStatus = 'stable' | 'proposed' | 'experimental' | 'planned' | 'deprecated';

export interface CatalogEntry {
	name: string;
	layer: 'primitive' | 'composite';
	source: string;
	importName: string;
	status: CatalogStatus;
	storybook: string | null;
	storyTitle: string | null;
}

export interface HistoryEntry {
	hash: string;
	date: string;
	subject: string;
	type: string | null;
	scope: string | null;
	breaking: boolean;
	summary: string;
}

export const data = substrate as unknown as {
	syncedAt: string;
	source: { repo: string; package: string; version: string; registry: string | null };
	primitives: CatalogEntry[];
	composites: CatalogEntry[];
	experimental: { name: string; track: string; source: string }[];
	forms: {
		chapters: string[];
		examples: string[];
		tags: string[];
		storyTitle: string | null;
		storybook: string | null;
	};
	history: HistoryEntry[];
	counts: { primitives: number; composites: number; experimental: number; stable: number; proposed: number };
};

export const catalog: CatalogEntry[] = [...data.composites, ...data.primitives];

export const fmtDate = (iso: string) =>
	new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });

/** Spaced title from a PascalCase or camelCase identifier. */
export const unCamel = (s: string) => s.replace(/([a-z])([A-Z])/g, '$1 $2');
