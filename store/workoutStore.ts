import { create } from 'zustand';
import { Mesocycle, MesocycleTemplate, MuscleGroup, WorkoutSet } from './types';
import { TEMPLATES } from '@/constants/templates';
import { addDays, format } from 'date-fns';

interface WorkoutState {
	mesocycles: Mesocycle[];
	activeMesocycle: string | null;
	createMesocycle: (template: MesocycleTemplate) => void;
	setActiveMesocycle: (id: string) => void;
	completeSet: (
		workoutId: string,
		exercideId: string,
		setIndex: number,
		weight: number,
		reps: number
	) => void;
	skipSet: (workoutId: string, setIndex: number) => void;
	deleteSet: (workoutId: string, exerciseId: string, setIndex: number) => void;
	addSet: (workoutId: string, exerciseId: string) => void;
	undoSetCompletion: (
		workoutId: string,
		exercideId: string,
		setIndex: number
	) => void;
	updateSetWeight: (
		workoutId: string,
		setIndex: number,
		weight: number
	) => void;
	updateSetReps: (workoutId: string, setIndex: number, reps: number) => void;
}

// store/workoutStore.ts
// ... (keep existing imports)

const generateWorkoutSets = (
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

const generateWorkouts = (
	template: MesocycleTemplate
): Mesocycle['workouts'] => {
	const workouts: Mesocycle['workouts'] = [];
	const startDate = new Date();

	for (let week = 0; week < template.weeks; week++) {
		for (let day = 0; day < template.days; day++) {
			const templateInfo = TEMPLATES.find((t) => t.name === template.name);

			if (!templateInfo) {
				continue;
			}

			const muscleGroups = templateInfo.muscleGroups[day] || [];
			const sets: WorkoutSet[] = [];

			muscleGroups.forEach((muscleGroup) => {
				const exerciseId = template.exercises[`${day}-${muscleGroup}`];
				if (exerciseId) {
					sets.push(...generateWorkoutSets(exerciseId, week));
				}
			});

			if (sets.length > 0) {
				workouts.push({
					id: `${week}-${day}-${Date.now()}`,
					date: format(addDays(startDate, week * 7 + day), 'yyyy-MM-dd'),
					sets,
				});
			}
		}
	}

	return workouts;
};

export const useWorkoutStore = create<WorkoutState>()((setState) => ({
	mesocycles: [],
	activeMesocycle: null,
	createMesocycle: (template: MesocycleTemplate) => {
		setState((state) => {
			const newMeso: Mesocycle = {
				id: Date.now().toString(),
				name: template.name,
				weeks: template.weeks,
				startDate: format(new Date(), 'yyyy-MM-dd'),
				template: {
					...Object.entries(template.exercises).reduce(
						(acc, [key, exerciseId]) => {
							const [day, muscleGroup] = key.split('-');
							if (!acc[Number(day)]) {
								acc[Number(day)] = { muscleGroups: [], exercises: [] };
							}
							acc[Number(day)].muscleGroups.push(muscleGroup as MuscleGroup);
							acc[Number(day)].exercises.push(exerciseId);
							return acc;
						},
						{} as Mesocycle['template']
					),
				},
				workouts: generateWorkouts(template),
			};

			return {
				mesocycles: [...state.mesocycles, newMeso],
				activeMesocycle: newMeso.id,
			};
		});
	},
	setActiveMesocycle: (id: string) => {
		setState((state) => ({ ...state, activeMesocycle: id }));
	},
	completeSet: (
		workoutId: string,
		exerciseId: string,
		setIndex: number,
		weight: number,
		reps: number
	) => {
		setState((state) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					// Find the global index for this set within the exercise
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
					};

					return { ...workout, sets: newSets };
				}),
			})),
		}));
	},
	skipSet: (workoutId: string, setIndex: number) => {
		setState((state) => ({
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
	},
	deleteSet: (workoutId: string, exerciseId: string, setIndex: number) => {
		setState((state) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					// Find the global index for this set within the exercise
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
	},
	addSet: (workoutId, exerciseId) => {
		setState((state) => ({
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
	},
	undoSetCompletion: (
		workoutId: string,
		exerciseId: string,
		setIndex: number
	) => {
		setState((state) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) => ({
				...meso,
				workouts: meso.workouts.map((workout) => {
					if (workout.id !== workoutId) return workout;

					// Find the global index
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
	},
	updateSetWeight: (workoutId, setIndex, weight) => {
		setState((state) => ({
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
	},
	updateSetReps: (workoutId, setIndex, reps) => {
		setState((state) => ({
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
	},
}));
