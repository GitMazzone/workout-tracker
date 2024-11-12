import { WorkoutState } from '../types';

export const updateSetWeight =
	(setState: any) => (workoutId: string, setIndex: number, weight: number) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					const newSets = [...workout.sets];
					newSets[setIndex] = {
						...newSets[setIndex],
						completedWeight: weight,
					};

					return { ...workout, sets: newSets };
				}),
			})),
		}));
	};

export const updateSetReps =
	(setState: any) => (workoutId: string, setIndex: number, reps: number) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					const newSets = [...workout.sets];
					newSets[setIndex] = {
						...newSets[setIndex],
						completedReps: reps,
					};

					return { ...workout, sets: newSets };
				}),
			})),
		}));
	};
