import { WorkoutState } from '../workout.types';

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

export const setCurrentWorkout = (setState: any) => (workoutId: string) => {
	setState((state: WorkoutState) => ({
		...state,
		currentWorkoutId: workoutId,
	}));
};

export const navigateWorkout =
	(setState: any) => (direction: 'next' | 'prev') => {
		setState((state: WorkoutState) => {
			const meso = state.mesocycles.find((m) => m.id === state.activeMesocycle);
			if (!meso || !state.currentWorkoutId) return state;

			const currentIndex = meso.workouts.findIndex(
				(w) => w.id === state.currentWorkoutId
			);
			if (currentIndex === -1) return state;

			const newIndex =
				direction === 'next'
					? Math.min(currentIndex + 1, meso.workouts.length - 1)
					: Math.max(currentIndex - 1, 0);

			return {
				...state,
				currentWorkoutId: meso.workouts[newIndex].id,
			};
		});
	};

export const skipWorkout = (setState: any) => (workoutId: string) => {
	setState((state: WorkoutState) => ({
		...state,
		mesocycles: state.mesocycles.map((meso) => ({
			...meso,
			workouts: meso.workouts.map((workout) => {
				if (workout.id !== workoutId) return workout;
				return {
					...workout,
					sets: workout.sets.map((set) =>
						set.completed
							? set
							: {
									// Keep completed sets as-is
									...set,
									completed: true,
									skipped: true,
							  }
					),
				};
			}),
		})),
	}));
};

export const replaceExercise =
	(setState: any) =>
	(workoutId: string, oldExerciseId: string, newExerciseId: string) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;
					return {
						...workout,
						sets: workout.sets.map((set) =>
							set.exerciseId === oldExerciseId
								? {
										...set,
										exerciseId: newExerciseId,
										weight: 0,
										completedWeight: undefined,
										completedReps: undefined,
										completed: false,
								  }
								: set
						),
					};
				}),
			})),
		}));
	};
