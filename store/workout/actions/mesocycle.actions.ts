import { WorkoutState } from '../types';
import { Mesocycle, MesocycleTemplate } from '../types';
import { MuscleGroup } from '../../types';
import { format } from 'date-fns';
import { generateWorkouts } from '../utils/generateWorkouts';

export const createMesocycle =
	(setState: any) => (template: MesocycleTemplate) => {
		setState((state: WorkoutState) => {
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
	};

export const setActiveMesocycle = (setState: any) => (id: string) => {
	setState((state: WorkoutState) => ({ ...state, activeMesocycle: id }));
};
