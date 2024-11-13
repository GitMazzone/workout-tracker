import { Platform } from 'react-native';
import * as StackTrace from 'stacktrace-js';
import { logEvent } from './telemetry';

interface CrashReport {
	error: string;
	stackTrace: string;
	componentStack?: string;
	metadata: {
		timestamp: number;
		deviceInfo: {
			platform: string;
			version: number | string;
			appVersion: string;
		};
		lastAction?: string;
	};
}

const initGlobalHandler = () => {
	const originalHandler = ErrorUtils.getGlobalHandler();

	ErrorUtils.setGlobalHandler(async (error, isFatal) => {
		await logCrash(error);
		originalHandler(error, isFatal);
	});
};

export const logCrash = async (
	error: Error,
	componentStack?: React.ErrorInfo
) => {
	try {
		const stackTrace = await StackTrace.fromError(error);

		const crash: CrashReport = {
			error: error.message,
			stackTrace: stackTrace.toString(),
			componentStack: componentStack?.componentStack ?? undefined,
			metadata: {
				timestamp: Date.now(),
				deviceInfo: {
					platform: Platform.OS,
					version: Platform.Version,
					appVersion: '1.0.0',
				},
			},
		};

		await logEvent({
			type: 'crash',
			timestamp: Date.now(),
			data: crash,
		});
	} catch (e) {
		// Never throw from error handler
	}
};

export const initCrashReporting = () => {
	initGlobalHandler();
};
