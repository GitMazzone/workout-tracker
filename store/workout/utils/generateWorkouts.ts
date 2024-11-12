import { addDays, format } from 'date-fns';
import { TEMPLATES } from '@/constants/templates';
import { MesocycleTemplate, WorkoutDay, WorkoutSet } from '../types';
import { generateWorkoutSets } from './generateSets';

export const generateWorkouts = (template: MesocycleTemplate): WorkoutDay[] => {
	const workouts: WorkoutDay[] = [];
	const startDate = new Date();

	for (let week = 0; week < template.weeks; week++) {
		for (let day = 0; day < template.days; day++) {
			const templateInfo = TEMPLATES.find((t) => t.name === template.name);

			if (!templateInfo) continue;

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
