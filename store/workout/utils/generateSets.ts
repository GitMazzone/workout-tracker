import { WorkoutSet } from '../workout.types';

export const generateWorkoutSets = (
	exerciseId: string,
	weekIndex: number,
	totalWeeks: number
): WorkoutSet[] => {
	const isDeloadWeek = weekIndex === totalWeeks - 1;
	const sets = isDeloadWeek ? 2 : weekIndex < 2 ? 3 : 4;
	const reps = weekIndex % 2 === 0 ? 8 : 10;

	return Array(isDeloadWeek ? 2 : sets)
		.fill(null)
		.map(
			(): WorkoutSet => ({
				exerciseId,
				weight: 0,
				targetReps: isDeloadWeek ? 8 : reps,
				completed: false,
				isDeload: isDeloadWeek,
			})
		);
};
