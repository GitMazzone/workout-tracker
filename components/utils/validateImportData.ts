import { DATA_VERSION } from '@/config/app';
import type { WorkoutSet, WorkoutDay, Mesocycle } from '@/store/workout/types';

interface ImportData {
	version: string;
	timestamp: string;
	data: Mesocycle[];
}

// Type guard for WorkoutSet
const isValidWorkoutSet = (set: unknown): set is WorkoutSet => {
	return (
		typeof set === 'object' &&
		set !== null &&
		'exerciseId' in set &&
		'weight' in set &&
		'targetReps' in set &&
		'completed' in set
	);
};

// Type guard for WorkoutDay
const isValidWorkoutDay = (workout: unknown): workout is WorkoutDay => {
	return (
		typeof workout === 'object' &&
		workout !== null &&
		'id' in workout &&
		'date' in workout &&
		'sets' in workout &&
		Array.isArray((workout as WorkoutDay).sets)
	);
};

// Type guard for Mesocycle template
const isValidTemplate = (
	template: unknown
): template is Mesocycle['template'] => {
	if (typeof template !== 'object' || template === null) return false;

	return Object.entries(template as Record<string, unknown>).every(
		([key, value]) => {
			const dayIndex = parseInt(key);
			if (isNaN(dayIndex)) return false;

			return (
				typeof value === 'object' &&
				value !== null &&
				'muscleGroups' in value &&
				'exercises' in value
			);
		}
	);
};

// Type guard for Mesocycle
const isValidMesocycle = (meso: unknown): meso is Mesocycle => {
	return (
		typeof meso === 'object' &&
		meso !== null &&
		'id' in meso &&
		'name' in meso &&
		'weeks' in meso &&
		'startDate' in meso &&
		'template' in meso &&
		'workouts' in meso
	);
};

export const validateImportData = (data: unknown): Mesocycle[] | null => {
	try {
		if (
			typeof data !== 'object' ||
			data === null ||
			!('version' in data) ||
			!('timestamp' in data) ||
			!('data' in data) ||
			!Array.isArray(data.data)
		) {
			console.error('Invalid import data structure');
			return null;
		}

		if (data.version !== DATA_VERSION) {
			console.error('Unsupported data version');
			return null;
		}

		if (!data.data.every(isValidMesocycle)) {
			console.error('Invalid mesocycle data');
			return null;
		}

		return data.data;
	} catch (error) {
		console.error('Validation error:', error);
		return null;
	}
};
