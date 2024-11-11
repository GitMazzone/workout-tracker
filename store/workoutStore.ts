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
		setIndex: number,
		weight: number,
		reps: number
	) => void;
	skipSet: (workoutId: string, setIndex: number) => void;
}

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
			const originalTemplate = TEMPLATES.find((t) => t.name === template.name);
			if (!originalTemplate) continue;

			const muscleGroups = originalTemplate.muscleGroups[day] || [];
			const sets: WorkoutSet[] = [];

			muscleGroups.forEach((muscleGroup) => {
				const exerciseId = template.exercises[`${day}-${muscleGroup}`];
				if (exerciseId) {
					sets.push(...generateWorkoutSets(exerciseId, week));
				}
			});

			workouts.push({
				id: `${week}-${day}-${Date.now()}`,
				date: format(addDays(startDate, week * 7 + day), 'yyyy-MM-dd'),
				sets,
			});
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

					const newSets = [...workout.sets];
					newSets[setIndex] = {
						...newSets[setIndex],
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
}));
