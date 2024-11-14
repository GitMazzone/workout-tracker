import { Mesocycle, MesocycleTemplate, WorkoutState } from '../workout.types';
import { MuscleGroup } from '../../types';
import { format } from 'date-fns';
import { generateWorkouts } from '../utils/generateWorkouts';

export const createMesocycle =
	(setState: any) => (template: MesocycleTemplate) => {
		setState((state: WorkoutState) => {
			const workouts = generateWorkouts(template);
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
				workouts,
			};

			return {
				mesocycles: [...state.mesocycles, newMeso],
				activeMesocycle: newMeso.id,
				currentWorkoutId: workouts[0]?.id || null, // Set first workout as current
			};
		});
	};

export const setActiveMesocycle = (setState: any) => (id: string) => {
	setState((state: WorkoutState) => ({ ...state, activeMesocycle: id }));
};

export const deleteMesocycle = (setState: any) => (id: string) => {
	setState((state: WorkoutState) => ({
		...state,
		mesocycles: state.mesocycles.filter((meso) => meso.id !== id),
		activeMesocycle:
			state.activeMesocycle === id ? null : state.activeMesocycle,
		currentWorkoutId:
			state.activeMesocycle === id ? null : state.currentWorkoutId,
	}));
};

export const updateMesocycleName =
	(setState: any) => (id: string, name: string) => {
		setState((state: WorkoutState) => ({
			...state,
			mesocycles: state.mesocycles.map((meso) =>
				meso.id === id ? { ...meso, name } : meso
			),
		}));
	};
