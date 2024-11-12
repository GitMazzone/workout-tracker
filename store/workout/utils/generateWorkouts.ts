import { addDays, format } from 'date-fns';
import { TEMPLATES } from '@/constants/templates';
import { MesocycleTemplate, WorkoutDay, WorkoutSet } from '../types';
import { generateWorkoutSets } from './generateSets';
import { MuscleGroup } from '@/store/types';

export const generateWorkouts = (template: MesocycleTemplate): WorkoutDay[] => {
	const workouts: WorkoutDay[] = [];
	const startDate = new Date();

	// Get muscle groups by day from exercises object for custom templates
	const getMuscleGroupsByDay = (day: number): MuscleGroup[] => {
		const templateInfo = TEMPLATES.find((t) => t.name === template.name);

		if (templateInfo && !templateInfo.isCustom) {
			return templateInfo.muscleGroups[day] || [];
		}

		// For custom templates, extract unique muscle groups from the template.exercises
		return [
			...new Set(
				Object.entries(template.exercises)
					.filter(([key]) => key.startsWith(`${day}-`))
					.map(([key]) => key.split('-')[1] as MuscleGroup)
			),
		];
	};

	for (let week = 0; week < template.weeks; week++) {
		for (let day = 0; day < template.days; day++) {
			const muscleGroups = getMuscleGroupsByDay(day);
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
