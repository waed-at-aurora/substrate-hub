/** @type {import('next').NextConfig} */
const nextConfig = {
	outputFileTracingRoot: process.cwd(),
	webpack: (config) => {
		// The DS is a file:-linked package; resolve its peer deps (react, etc.)
		// from this app's node_modules instead of the link's realpath.
		config.resolve.symlinks = false;
		return config;
	},
};

export default nextConfig;
