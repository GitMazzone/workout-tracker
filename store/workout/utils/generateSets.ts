import { WorkoutSet } from '../types';

export const generateWorkoutSets = (
	exerciseId: string,
	weekIndex: number
): WorkoutSet[] => {
	const sets = weekIndex < 2 ? 3 : 4;
	const reps = weekIndex % 2 === 0 ? 8 : 10;

	return Array(sets)
		.fill(null)
		.map(
			(): WorkoutSet => ({
				exerciseId,
				weight: 0,
				targetReps: reps,
				completed: false,
			})
		);
};
