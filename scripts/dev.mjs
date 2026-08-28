#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';

const DEFAULT_PORT = 4400;
const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

function parsePort(value, source) {
	const port = Number(value);
	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error(`${source} must be an integer between 1 and 65535; received ${JSON.stringify(value)}`);
	}
	return port;
}

function readArguments(args) {
	let requestedPort = process.env.PORT ? parsePort(process.env.PORT, 'PORT') : DEFAULT_PORT;
	const forwarded = [];

	for (let index = 0; index < args.length; index += 1) {
		const argument = args[index];
		if (argument === '-p' || argument === '--port') {
			if (index + 1 >= args.length) throw new Error(`${argument} requires a port number`);
			requestedPort = parsePort(args[index + 1], argument);
			index += 1;
			continue;
		}
		if (argument.startsWith('--port=')) {
			requestedPort = parsePort(argument.slice('--port='.length), '--port');
			continue;
		}
		forwarded.push(argument);
	}

	return { requestedPort, forwarded };
}

function isPortAvailable(port) {
	return new Promise((resolve, reject) => {
		const reservation = createServer();
		reservation.unref();
		reservation.once('error', (error) => {
			if (error.code === 'EADDRINUSE' || error.code === 'EACCES') {
				resolve(false);
				return;
			}
			reject(error);
		});
		reservation.listen({ port, exclusive: true }, () => {
			reservation.close((error) => {
				if (error) reject(error);
				else resolve(true);
			});
		});
	});
}

async function findAvailablePort(startPort) {
	for (let port = startPort; port <= 65535; port += 1) {
		if (await isPortAvailable(port)) return port;
	}
	throw new Error(`No available port found at or above ${startPort}`);
}

try {
	const { requestedPort, forwarded } = readArguments(process.argv.slice(2));
	const port = await findAvailablePort(requestedPort);
	if (port !== requestedPort) console.warn(`Port ${requestedPort} is busy; using ${port}.`);

	const child = spawn(process.execPath, [nextBin, 'dev', ...forwarded, '--port', String(port)], {
		stdio: 'inherit',
		env: { ...process.env, PORT: String(port) },
	});

	for (const signal of ['SIGINT', 'SIGTERM']) {
		process.once(signal, () => child.kill(signal));
	}

	child.once('error', (error) => {
		console.error(`Could not start Next.js: ${error.message}`);
		process.exitCode = 1;
	});
	child.once('exit', (code, signal) => {
		if (signal) process.kill(process.pid, signal);
		else process.exitCode = code ?? 1;
	});
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}
