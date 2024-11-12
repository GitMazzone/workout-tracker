import { MuscleGroup } from '@/store/types';

export interface WorkoutTemplate {
	id: string;
	name: string;
	description: string;
	defaultDays: number;
	muscleGroups: {
		[key: number]: MuscleGroup[]; // day of week -> muscle groups
	};
	isCustom?: boolean;
}

export const TEMPLATES: WorkoutTemplate[] = [
	{
		id: 'custom',
		name: 'Custom Program',
		description: 'Build your own program from scratch',
		defaultDays: 3,
		muscleGroups: {
			// Empty template, will be populated based on user selection
		},
		isCustom: true,
	},
	{
		id: 'upper-lower',
		name: 'Upper/Lower Split',
		description:
			'4-6 workouts per week, alternating upper and lower body focus',
		defaultDays: 4,
		muscleGroups: {
			0: ['chest', 'shoulders', 'triceps', 'biceps', 'back'], // Upper
			1: ['legs', 'calves', 'core'], // Lower
			2: ['chest', 'shoulders', 'triceps', 'biceps', 'back'], // Upper
			3: ['legs', 'calves', 'core'], // Lower
			4: ['chest', 'shoulders', 'triceps', 'biceps', 'back'], // Optional Upper
			5: ['legs', 'calves', 'core'], // Optional Lower
		},
	},
	{
		id: 'push-pull-legs',
		name: 'Push/Pull/Legs',
		description:
			'3-6 workouts per week, rotating push, pull, and leg exercises',
		defaultDays: 6,
		muscleGroups: {
			0: ['chest', 'shoulders', 'triceps'], // Push
			1: ['back', 'biceps'], // Pull
			2: ['legs', 'calves', 'core'], // Legs
			3: ['chest', 'shoulders', 'triceps'], // Push
			4: ['back', 'biceps'], // Pull
			5: ['legs', 'calves', 'core'], // Legs
		},
	},
	{
		id: 'full-body',
		name: 'Full Body',
		description: '3-4 full body workouts per week with balanced muscle focus',
		defaultDays: 3,
		muscleGroups: {
			0: ['chest', 'back', 'shoulders', 'legs', 'core'],
			1: ['chest', 'back', 'shoulders', 'legs', 'core'],
			2: ['chest', 'back', 'shoulders', 'legs', 'core'],
			3: ['chest', 'back', 'shoulders', 'legs', 'core'], // Optional
		},
	},
];
