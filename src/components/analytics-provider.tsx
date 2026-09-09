'use client';

import { PostHogProvider } from 'posthog-js/react';
import type { ReactNode } from 'react';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const shouldEnable = Boolean(projectToken && host);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
	if (!shouldEnable) {
		return <>{children}</>;
	}

	return (
		<PostHogProvider
			apiKey={projectToken!}
			options={{
				api_host: host!,
				defaults: '2026-01-30',
				capture_performance: {
					web_vitals: false,
				},
				capture_exceptions: {
					capture_unhandled_errors: true,
					capture_unhandled_rejections: true,
					capture_console_errors: false,
				},
				debug: process.env.NODE_ENV === 'development',
			}}
		>
			{children}
		</PostHogProvider>
	);
}
