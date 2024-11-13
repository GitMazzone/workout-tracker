import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = 'telemetry_queue';
const MAX_QUEUE_SIZE = 1000;
const BACKEND_URL = 'your-endpoint'; // Update this

export interface TelemetryEvent {
	type: 'crash' | 'analytics';
	timestamp: number;
	data: any;
}

export const logEvent = async (event: TelemetryEvent) => {
	try {
		const queue = JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) || '[]');

		if (queue.length >= MAX_QUEUE_SIZE) {
			queue.shift();
		}

		queue.push(event);
		await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

		const { isConnected } = await NetInfo.fetch();
		if (isConnected) {
			await flushEvents();
		}
	} catch (error) {
		// Fail silently
	}
};

export const logAnalytics = async (
	eventName: string,
	properties?: Record<string, any>
) => {
	await logEvent({
		type: 'analytics',
		timestamp: Date.now(),
		data: {
			name: eventName,
			properties,
		},
	});
};

const flushEvents = async () => {
	try {
		const queue = JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) || '[]');
		if (queue.length === 0) return;

		const response = await fetch(BACKEND_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(queue),
		});

		if (response.ok) {
			await AsyncStorage.setItem(QUEUE_KEY, '[]');
		}
	} catch (error) {
		// Keep events in queue if send fails
	}
};

export const initTelemetry = () => {
	NetInfo.addEventListener((state) => {
		if (state.isConnected) {
			flushEvents();
		}
	});
};

// Usage example:
// logAnalytics('workout_completed', { exerciseCount: 5, duration: 3600 });
