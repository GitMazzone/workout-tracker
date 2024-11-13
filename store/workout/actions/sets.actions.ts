import { WorkoutState } from '../types';

export const completeSet =
	(setState: any) =>
	(
		workoutId: string,
		exerciseId: string,
		setIndex: number,
		weight: number,
		reps: number
	) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					let globalIndex = -1;
					let currentExerciseSetCount = 0;

					for (let i = 0; i < workout.sets.length; i++) {
						if (workout.sets[i].exerciseId === exerciseId) {
							if (currentExerciseSetCount === setIndex) {
								globalIndex = i;
								break;
							}
							currentExerciseSetCount++;
						}
					}

					if (globalIndex === -1) return workout;

					const newSets = [...workout.sets];
					newSets[globalIndex] = {
						...newSets[globalIndex],
						completed: true,
						completedWeight: weight,
						completedReps: reps,
						skipped: weight === 0 && reps === 0,
					};

					return { ...workout, sets: newSets };
				}),
			})),
		}));
	};

export const skipSet =
	(setState: any) => (workoutId: string, setIndex: number) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					const newSets = [...workout.sets];
					newSets[setIndex] = {
						...newSets[setIndex],
						completed: true,
						skipped: true,
					};

					return { ...workout, sets: newSets };
				}),
			})),
		}));
	};

export const deleteSet =
	(setState: any) =>
	(workoutId: string, exerciseId: string, setIndex: number) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					let globalIndex = -1;
					let currentExerciseSetCount = 0;

					for (let i = 0; i < workout.sets.length; i++) {
						if (workout.sets[i].exerciseId === exerciseId) {
							if (currentExerciseSetCount === setIndex) {
								globalIndex = i;
								break;
							}
							currentExerciseSetCount++;
						}
					}

					if (globalIndex === -1) return workout;

					return {
						...workout,
						sets: workout.sets.filter((_, idx) => idx !== globalIndex),
					};
				}),
			})),
		}));
	};

export const addSet =
	(setState: any) => (workoutId: string, exerciseId: string) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;
					return {
						...workout,
						sets: [
							...workout.sets,
							{
								exerciseId,
								weight: 0,
								targetReps:
									workout.sets.find((s) => s.exerciseId === exerciseId)
										?.targetReps || 8,
								completed: false,
							},
						],
					};
				}),
			})),
		}));
	};

export const undoSetCompletion =
	(setState: any) =>
	(workoutId: string, exerciseId: string, setIndex: number) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					let globalIndex = -1;
					let currentExerciseSetCount = 0;

					for (let i = 0; i < workout.sets.length; i++) {
						if (workout.sets[i].exerciseId === exerciseId) {
							if (currentExerciseSetCount === setIndex) {
								globalIndex = i;
								break;
							}
							currentExerciseSetCount++;
						}
					}

					if (globalIndex === -1) return workout;

					const newSets = [...workout.sets];
					newSets[globalIndex] = {
						...newSets[globalIndex],
						completed: false,
						completedWeight: undefined,
						completedReps: undefined,
					};

					return { ...workout, sets: newSets };
				}),
			})),
		}));
	};
