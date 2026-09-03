/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
	output: isGitHubPages ? 'export' : undefined,
	basePath: isGitHubPages ? '/substrate-hub' : undefined,
	trailingSlash: isGitHubPages,
	outputFileTracingRoot: process.cwd(),
	env: {
		NEXT_PUBLIC_BASE_PATH: isGitHubPages ? '/substrate-hub' : '',
	},
	webpack: (config) => {
		// The DS is a file:-linked package; resolve its peer deps (react, etc.)
		// from this app's node_modules instead of the link's realpath.
		config.resolve.symlinks = false;
		return config;
	},
};

export default nextConfig;
